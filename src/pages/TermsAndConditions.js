import React from "react";

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

        <div className="space-y-6 text-gray-300">
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using Screenology, you accept and agree to be
              bound by the terms and conditions outlined here.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Use License
            </h2>
            <p>
              This is a free service provided for personal, non-commercial use.
              You may not modify, copy, distribute, transmit, display, perform,
              reproduce, publish, license, create derivative works from,
              transfer, or sell any information obtained from Screenology.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Disclaimer
            </h2>
            <p>
              The materials on Screenology are provided on an 'as is' basis. We
              make no warranties, expressed or implied, and hereby disclaim and
              negate all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Limitations
            </h2>
            <p>
              In no event shall Screenology or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Screenology.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
