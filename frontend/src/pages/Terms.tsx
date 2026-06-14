import React, { useEffect } from 'react';
import Title from '../components/Title';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 mt-16 text-gray-800">
      <div className="text-center mb-10">
        <Title text1="TERMS &" text2="CONDITIONS" />
        <p className="text-gray-500 mt-2 font-medium">Effective Date: June 11, 2026</p>
      </div>

      <div className="space-y-8 text-base md:text-lg leading-relaxed">
        <p className="text-gray-600">
          Welcome to brickourhouse.com (the "Website"). By accessing or using our Website, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree to these terms, please do not use this Website.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Use of the Site</h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-600">
            <li>
              <strong>Eligibility:</strong> You must be at least 18 years old or have the consent of a parent or guardian to use this site.
            </li>
            <li>
              <strong>Permitted Use:</strong> You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Website.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property</h2>
          <p className="text-gray-600">
            All content on brickourhouse.com—including text, graphics, logos, images, digital downloads, and code—is the property of brickourhouse.com or its content creators and is protected by international copyright laws. You may not reproduce, duplicate, copy, or resell any part of our site without express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Limitation of Liability</h2>
          <p className="text-gray-600">
            The material on this Website is provided on an "as is" basis. brickourhouse.com makes no warranties, expressed or implied, and hereby disclaims all other warranties. In no event shall brickourhouse.com or its suppliers be liable for any damages arising out of the use or inability to use the materials on the Website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to review and amend these terms at any time. Your continued use of the site implies acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
