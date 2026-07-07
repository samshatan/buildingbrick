import nodemailer from 'nodemailer';

let transporter;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} else {
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
}

export const sendEmail = async (mailOptions) => {
  return transporter.sendMail(mailOptions);
};
