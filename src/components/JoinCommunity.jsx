import React from "react";
import { DISCORD_SERVER_URL } from "../utils/constants";
import { FaDiscord } from "react-icons/fa";

const JoinCommunity = () => {
  return (
    <div className="lg:min-h-[90vh] bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center">
      <section className="flex flex-col  items-center justify-between max-w-6xl mx-auto p-8 space-y-10 md:space-y-0 md:space-x-12">
        <FaDiscord className="text-[6rem] text-indigo-600 mb-6" />

        <div className="flex flex-col">
          <h2 className="text-3xl font- text-center font-semibold italic text-indigo-800 mb-5">
            Join the Community
          </h2>
          <p className="text-gray-700 text-lg text-center mb-6">
            Become part of our vibrant developer community on Discord! Connect
            with like-minded learners, get real-time support, share knowledge,
            and collaborate on projects with students and professionals around
            the world.
          </p>
        </div>

        <a
          href={DISCORD_SERVER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg px-8 py-4 rounded-4xl shadow-xl transition-transform transform hover:scale-105"
        >
          Join Discord
        </a>
      </section>
    </div>
  );
};

export default JoinCommunity;
