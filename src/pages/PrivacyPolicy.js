import React from "react";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300">
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Information We Collect
            </h2>
            <p>
              We do not collect any personal information from our users. Our
              service is designed to provide movie and TV show information
              without requiring user registration or data collection.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Third-Party Services
            </h2>
            <p>
              We use The Movie Database (TMDB) API to provide movie and TV show
              information. Please refer to TMDB's privacy policy for information
              about their data practices.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Cookies</h2>
            <p>
              We do not use cookies or any other tracking technologies on our
              website.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify users of any changes by posting the new privacy policy on
              this page.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at [your contact email].
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
