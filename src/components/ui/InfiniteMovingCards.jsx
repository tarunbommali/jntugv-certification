"use client";

import { useRef, useState, useEffect } from "react";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const InfiniteMovingCards = ({
  items = [],            // Accept array of project objects
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  const getAnimationDuration = () => {
    switch (speed) {
      case "fast":
        return "20s";
      case "normal":
        return "40s";
      case "slow":
        return "80s";
      default:
        return "40s";
    }
  };

  const addAnimation = () => {
    if (!containerRef.current || !scrollerRef.current) return;

    // Prevent unnecessary duplicates
    while (scrollerRef.current.children.length > items.length) {
      scrollerRef.current.removeChild(scrollerRef.current.lastChild);
    }

    const scrollerContent = Array.from(scrollerRef.current.children);

    // Duplicate content to enable infinite scroll effect
    scrollerContent.forEach((item) => {
      const clone = item.cloneNode(true);
      scrollerRef.current.appendChild(clone);
    });

    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
    containerRef.current.style.setProperty(
      "--animation-duration",
      getAnimationDuration()
    );

    setStart(true);
  };

  useEffect(() => {
    addAnimation();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((project) => (
          <li
            key={project.id}
            className="relative w-[300px] md:w-[350px] max-w-full shrink-0 rounded-2xl border bg-white text-black shadow-md px-6 py-4 transition duration-300 hover:shadow-lg"
            style={{ borderColor: "#e0e7ff" }}
          >
            {/* Image */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            {/* Project Details */}
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{project.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{project.duration}</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {project.mode}
              </span>
            </div>

            <button className="w-full bg-primary text-white text-sm py-2 rounded hover:bg-primary/90">
              View Project
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfiniteMovingCards;
