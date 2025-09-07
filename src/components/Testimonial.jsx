import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../utils/constants";

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const { name, image, text } = testimonials[currentIndex];

  return (
    <section className="max-w-7xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-6 text-[#004080]">
        What Our Students Say
      </h2>

      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 p-6 rounded-lg ">
        
        {/* Testimonial Content */}
        <div className="flex items-center space-x-6">

          {/* Previous Icon */}
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-[#004080] text-white hover:bg-[#003366]"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Testimonial */}
          <div className="flex flex-col items-center max-w-xl text-center">
            <img
              src={image}
              alt={name}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <p className="italic text-gray-700 mb-2">"{text}"</p>
            <h3 className="font-semibold text-lg text-[#183b56]">{name}</h3>
          </div>

          {/* Next Icon */}
          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-[#004080] text-white hover:bg-[#003366]"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
