import { useEffect } from 'react';
import Title from '../components/Title';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 mt-16 text-gray-800">
      <div className="text-center mb-10">
        <Title text1="PRIVACY" text2="POLICY" />
        <p className="text-gray-500 mt-2 font-medium">Effective Date: June 11, 2026</p>
      </div>

      <div className="space-y-8 text-base md:text-lg leading-relaxed">
        <p className="text-gray-600">
          At brickourhouse.com, your privacy is highly important to us. This Privacy Policy outlines the types of personal information we collect and how we use, safeguard, and protect it.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-600">
            <li>
              <strong>Voluntary Information:</strong> We collect information you provide directly to us, such as your name, email address, or contact details when you fill out a form, sign up for a newsletter, or make a purchase.
            </li>
            <li>
              <strong>Automated Information:</strong> When you browse our site, we automatically collect certain data through cookies and analytics tools, including your IP address, browser type, device info, and browsing behavior.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-3">We use the gathered information to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Operate, optimize, and maintain our Website.</li>
            <li>Respond to your direct inquiries, comments, or customer service requests.</li>
            <li>Send periodic emails regarding updates, promotions, or services (which you can opt out of at any time).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Data Sharing</h2>
          <p className="text-gray-600">
            We do not sell, trade, or rent your personal identification information to others. We may use trusted third-party service providers (like web hosting or email delivery platforms) to help us operate our business, provided they keep your information secure and confidential.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Rights</h2>
          <p className="text-gray-600">
            Depending on your location, you have the right to access, correct, or request the deletion of the personal information we hold about you. To make a request, please contact us at <strong>support@brickourhouse.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
