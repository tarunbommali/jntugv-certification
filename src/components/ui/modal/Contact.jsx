import { FcCustomerSupport } from "react-icons/fc";


const Contact = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Transparent backdrop with blur (no background color) */}
      <div
        className="absolute inset-0 bg-blue-500 opacity-55 "
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative text-[#42526e] bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">

        <FcCustomerSupport className="text-4xl mb-4 " />
        <h2 className="text-xl text-[#192f60]  font-bold mb-4">Contact  24x7</h2>

        <p className="mb-2">
          JNTUGV Certification course counsellors and learner support agents are available 24x7 to help with your learning needs.
        </p>

        <div className="mb-2 rounded-2xl p-4 border border-[#d4d7de]">
          <strong>For New Course Enquiry</strong><br />
          India: +91 7780351078
        </div>

        <div className="mb-4 rounded-2xl p-4 border border-[#d4d7de]">
          <strong>For Support (Already enrolled learners only)</strong><br />
          India: +91  7780351078
        </div>

        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};


export default Contact