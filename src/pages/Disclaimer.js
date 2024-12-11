import React from "react";

function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>

        <div className="space-y-6 text-gray-300">
          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Information Accuracy
            </h2>
            <p>
              While we strive to provide accurate and up-to-date information, we
              make no representations or warranties of any kind, express or
              implied, about the completeness, accuracy, reliability,
              suitability or availability of the information, products,
              services, or related graphics contained on Screenology.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              External Links
            </h2>
            <p>
              Through Screenology, you can link to other websites which are not
              under our control. We have no control over the nature, content,
              and availability of those sites. The inclusion of any links does
              not necessarily imply a recommendation or endorse the views
              expressed within them.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Copyright Notice
            </h2>
            <p>
              Movie and TV show information is provided by The Movie Database
              (TMDB). All movie-related data, images, and content are the
              property of their respective owners and are protected by copyright
              laws.
            </p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Use of Service
            </h2>
            <p>
              Every effort is made to keep Screenology running smoothly.
              However, we take no responsibility for, and will not be liable
              for, the service being temporarily unavailable due to technical
              issues beyond our control.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Disclaimer;
