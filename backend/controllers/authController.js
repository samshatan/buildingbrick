import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import Otp from '../models/Otp.js';
import twilio from 'twilio';

let transporter;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  // Use real email provided in .env
  transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('Nodemailer initialized in REAL mode.');
} else {
  // Use a mock transporter if no real credentials are set to avoid Ethereal API 502 errors on production
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('\n=== MOCK EMAIL ===');
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Text: ${mailOptions.text}`);
      console.log('==================\n');
      return { messageId: 'mock-id-123' };
    }
  };
  console.log('Nodemailer initialized in MOCK mode (No SMTP credentials found).');
}
// Initialize Twilio client lazily
let twilioClientInstance = null;
const getTwilioClient = () => {
  if (!twilioClientInstance && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClientInstance = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClientInstance;
};

// Helper to generate JWT Token
export const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper to map accountType casing to frontend expectations
export const mapUserResponse = (user, workerProfile = null) => {
  return {
    id: user._id.toString(),
    email: user.email,
    phone: user.phone,
    fullName: user.name,
    userType: user.accountType.toUpperCase(), // converts 'worker' -> 'WORKER', 'hirer' -> 'HIRER'
    avatarUrl: user.avatarUrl || "https://picsum.photos/seed/default-avatar/200/200",
    coverImageUrl: user.coverImageUrl || "",
    preferences: user.preferences || { pushNotifications: true, darkMode: false, biometricLogin: false },
    workerRole: workerProfile ? workerProfile.workerRole : undefined,
    registrationFeePaid: workerProfile ? workerProfile.registrationFeePaid : undefined,
    subscriptionStatus: workerProfile ? workerProfile.subscriptionStatus : undefined,
  };
};

// Map selected worker type to their correct categoryId
export const getCategoryId = (type) => {
  if (!type) return 'construction';

  // If multiple types are provided separated by comma, use the first one to determine category
  const firstType = type.split(',')[0].toLowerCase().trim();

  const domesticTypes = ['house helps', 'cooks', 'maids', 'cleaners'];
  const agricultureTypes = ['small marginal farmers', 'agriculture workers', 'sharecroppers', 'daily livestock workers'];
  const utilitiesTypes = ['electrician', 'plumber', 'water proofing specialist'];
  const interiorTypes = ['carpenter', 'flooring mason (tile setter)', 'marble polisher / kharai wale', 'pottiyand pop artisan', 'painter', 'welder (fabrication)'];

  if (domesticTypes.includes(firstType)) return 'domestic';
  if (agricultureTypes.includes(firstType)) return 'agriculture';
  if (utilitiesTypes.includes(firstType)) return 'utilities';
  if (interiorTypes.includes(firstType)) return 'interior';
  return 'construction'; // Default fallback
};

const isEmail = (identifier) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

// @desc    Generate and send OTP
// @route   POST /api/v1/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
  try {
    const { identifier, type = 'signup' } = req.body;
    if (!identifier) return res.status(400).json({ message: 'Email or Mobile Number is required.' });

    // Check if user already exists
    const query = isEmail(identifier) ? { email: identifier } : { phone: identifier };
    const userExists = await User.findOne(query);
    
    if (type === 'signup' && userExists) {
      return res.status(400).json({ message: 'User already exists with this contact.' });
    }
    
    if (type === 'forgot-password' && !userExists) {
      return res.status(404).json({ message: 'No account found with this contact.' });
    }

    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // Save/Update OTP
    await Otp.findOneAndUpdate(
      { identifier: identifier.toLowerCase().trim() },
      { otp: otpCode, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    if (isEmail(identifier)) {
      const info = await transporter.sendMail({
        from: `"BrickOurHouse" <admin@brickourhouse.com>`,
        to: identifier,
        subject: 'Your Verification Code',
        text: `Your OTP for BrickOurHouse is ${otpCode}. It is valid for 5 minutes.`,
      });

      if (!process.env.SMTP_USER) {
        console.log('OTP Email Sent! (Mock Mode - Check server console for OTP)');
      } else {
        console.log(`Real OTP Email sent to ${identifier}`);
      }

      res.status(200).json({ message: 'OTP sent to email successfully.' });
    } else {
      // Send SMS via Twilio
      const twilioClient = getTwilioClient();
      if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
        // Ensure the number is in E.164 format. Assuming India (+91) as default if not provided
        let formattedNumber = identifier;
        if (!formattedNumber.startsWith('+')) {
          formattedNumber = `+91${formattedNumber}`; // Modify default country code if necessary
        }

        await twilioClient.messages.create({
          body: `Your OTP for BrickOurHouse is ${otpCode}. It is valid for 5 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: formattedNumber
        });
        console.log(`Real SMS sent to ${formattedNumber}`);
      } else {
        // Fallback to Simulation if Twilio is not configured
        console.log(`[SMS Simulation] To: ${identifier} | OTP: ${otpCode}`);
        console.log('Twilio is not configured in .env. Showing simulated SMS only.');
      }
      res.status(200).json({ message: 'OTP sent to mobile successfully.' });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error generating OTP.' });
  }
};

// @desc    Register a new user
// @desc    Verify OTP and Register user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, identifier, otp, password, accountType, category, optionalEmail, workerRole } = req.body;
    const avatarUrl = req.file ? req.file.path : req.body.avatarUrl;

    if (!name || !identifier || !otp || !password || !accountType) {
      return res.status(400).json({ message: 'Please provide all required fields including OTP.' });
    }

    // Verify OTP
    const validOtp = await Otp.findOne({ identifier: identifier.toLowerCase().trim(), otp });
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const isIdentEmail = isEmail(identifier);
    const query = isIdentEmail ? { email: identifier } : { phone: identifier };
    const userExists = await User.findOne(query);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this contact.' });
    }

    if (optionalEmail) {
      const emailExists = await User.findOne({ email: optionalEmail.toLowerCase().trim() });
      if (emailExists) {
        return res.status(400).json({ message: 'The provided email address is already registered.' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Map verified identifier to either email or phone. Also save optionalEmail if provided.
    let userEmail = isIdentEmail ? identifier : (optionalEmail || undefined);
    let userPhone = !isIdentEmail ? identifier : undefined;

    // Create User
    const user = await User.create({
      name,
      ...(userEmail && { email: userEmail }),
      ...(userPhone && { phone: userPhone }),
      password: hashedPassword,
      accountType: accountType.toLowerCase(), // 'worker' or 'hirer'
      avatarUrl: avatarUrl || "",
    });

    // Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    // If registering as a worker, create corresponding WorkerProfile
    let profile = null;
    if (accountType.toLowerCase() === 'worker') {
      const categoryId = getCategoryId(category);
      
      let wRole = workerRole || 'LABOUR';
      let regPaid = false;
      let regAmount = 19;
      let subStatus = 'NONE';
      
      if (wRole === 'LABOUR') {
        regPaid = false;
        regAmount = 19;
        subStatus = 'FREE_UNTIL_HIRED';
      } else if (wRole === 'CONTRACTOR') {
        regPaid = false;
        regAmount = 499;
      } else if (wRole === 'SELLER') {
        regPaid = true; // Free for now
        regAmount = 0;
      }

      profile = await WorkerProfile.create({
        userId: user._id,
        displayName: name,
        categoryId: categoryId,
        workerType: category || 'Other',
        workerRole: wRole,
        registrationFeePaid: regPaid,
        registrationFeeAmount: regAmount,
        subscriptionStatus: subStatus,
        dailyRate: 0,
        experienceYears: 0,
        bio: '',
        skills: category || '',
      });
    }

    res.status(201).json({
      token: generateToken(user._id),
      user: mapUserResponse(user, profile),
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error. Failed to create account.', error: error.message, stack: error.stack });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide both contact identifier and password.' });
    }

    const query = isEmail(identifier) ? { email: identifier } : { phone: identifier };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    let profile = null;
    if (user.accountType === 'worker') {
      profile = await WorkerProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: mapUserResponse(user, profile),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Failed to authenticate.' });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Authenticate with Google
// @route   POST /api/v1/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'No Google token provided.' });
    }

    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      return res.status(400).json({ message: 'Invalid Google token.' });
    }

    const payload = await response.json();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Per instructions, Google Login is ONLY for Hirers. Block if worker.
      if (user.accountType === 'worker') {
        return res.status(403).json({ message: 'Google Login is not available for worker accounts.' });
      }
    } else {
      // Create new user as a Hirer (since Google login is for hirers only)
      // We still need a password for the model (can generate a random one since they login via Google)
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        accountType: 'hirer',
        avatarUrl: picture || "",
      });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: mapUserResponse(user),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Server error during Google authentication.' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let profile = null;
    if (user.accountType === 'worker') {
      profile = await WorkerProfile.findOne({ userId: user._id });
    }
    
    res.json(mapUserResponse(user, profile));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide identifier, OTP, and new password.' });
    }

    // Verify OTP
    const validOtp = await Otp.findOne({ identifier: identifier.toLowerCase().trim(), otp });
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Find User
    const query = isEmail(identifier) ? { email: identifier.toLowerCase().trim() } : { phone: identifier.trim() };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    res.status(200).json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset Password error:', error);
    res.status(500).json({ message: 'Server error during password reset.' });
  }
};
