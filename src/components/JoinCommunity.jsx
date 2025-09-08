import React from "react";
import { DISCORD_SERVER_URL } from '../utils/constants'
import { FaDiscord } from "react-icons/fa";

const JoinCommunity = () => {
  return (
    <div className="min-h-[80vh] bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center">
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto p-8 space-y-10 md:space-y-0 md:space-x-12">

        {/* Left Side: Why Join */}
        <div className="md:w-1/2 text-left">
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-5">
            Why Join Our Developer Community?
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Join an engaging space where developers, learners, and tech enthusiasts connect, collaborate, and grow together.
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-800 text-base">
            <li><span className="font-medium">Peer-to-peer doubt solving</span></li>
            <li><span className="font-medium">Meet like-minded developers</span></li>
            <li><span className="font-medium">Access to expert mentorship</span></li>
            <li><span className="font-medium">Collaborate on real-world projects</span></li>
          </ul>
        </div>

        {/* Right Side: Discord Icon + Join Button */}
        <div className="md:w-1/2 flex flex-col items-center text-center">
          <FaDiscord className="text-[6rem] text-indigo-600 mb-6" />
          <a
            href={DISCORD_SERVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-xl transition-transform transform hover:scale-105"
          >
             Join Our Discord
          </a>
        </div>
      </section>
    </div>
  );
};

export default JoinCommunity;
