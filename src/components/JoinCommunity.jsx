import React from "react";

const JoinCommunity = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl min-h-[50vh] mx-auto p-6 space-y-8 md:space-y-0 md:space-x-8">
      {/* Left Side: Why Join */}
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-[#183b56]">
          Why Join Our Community?
        </h2>
        <p className="text-gray-600 mb-4">
          Be part of an amazing community of learners and professionals.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Peer-to-peer doubt solving</li>
          <li>Meet like-minded people</li>
          <li>Connect with advanced tech experts</li>
          <li>Find mentoring opportunities</li>
        </ul>
      </div>

      {/* Right Side: Discord Image + Join Button */}
      <div className="md:w-1/2 flex flex-col  items-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ10rPiqQn7hN6eGiuB-UUYyerDiN7SiHpOWQ&s"
          alt="Join our Discord"
          className="w-48 h-48 object-contain mb-4 rounded-full"
        />
        <a
          href="https://discord.com/invite/your-community-invite"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold px-6 ml-5 py-3 rounded-lg shadow-lg transition"
        >
          Join Discord
        </a>
      </div>
    </section>
  );
};

export default JoinCommunity;
