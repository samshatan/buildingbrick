import React, { useEffect } from 'react';
import Title from '../components/Title';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 mt-16 text-gray-800">
      <div className="text-center mb-10">
        <Title text1="REFUND &" text2="CANCELLATION POLICY" />
        <p className="text-gray-500 mt-2 font-medium">Effective Date: June 11, 2026</p>
      </div>

      <div className="space-y-8 text-base md:text-lg leading-relaxed">
        <p className="text-gray-600">
          Thank you for being a part of brickourhouse.com. Please read our policy regarding subscriptions, cancellations, and refunds carefully.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Subscription Cancellation</h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-600">
            <li>
              <strong>Cancel Anytime:</strong> You have full control over your account and can cancel your active subscription at any time through your dashboard settings.
            </li>
            <li>
              <strong>Access After Cancellation:</strong> Following cancellation, you will continue to have access to your profile and premium features until the end of your current billing cycle, at which point your subscription will automatically terminate and will not renew.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Strict No-Refund Policy</h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-600">
            <li>
              <strong>Profile & Data Maintenance Costs:</strong> The fees collected for your subscription are immediately allocated toward hosting your data, securing your information, and maintaining your active profile online. Because these backend infrastructure and operational costs are incurred continuously to keep your digital space live, <em>we do not process or entertain any refunds</em> under any circumstances.
            </li>
            <li>
              <strong>All Sales Are Final:</strong> Once a payment is processed for a billing cycle (whether monthly or annually), that amount is non-refundable. We do not provide prorated refunds or credits for partial subscription periods or unused time.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about how to manage or cancel your subscription, please reach out to us at <strong>support@brickourhouse.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
