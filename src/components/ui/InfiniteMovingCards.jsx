"use client";

import { useRef, useState, useEffect } from "react";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
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

    while (scrollerRef.current.children.length > items.length) {
      scrollerRef.current.removeChild(scrollerRef.current.lastChild);
    }

    const scrollerContent = Array.from(scrollerRef.current.children);
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
        "scroller relative z-20 max-w-7xl overflow-hidden",
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
        {items.map((course) => {
          const IconComponent = course.icon;
          return (
            <li
              key={course.id}
              className="relative w-[300px] md:w-[350px] max-w-full shrink-0 rounded-2xl border bg-white text-black shadow-md px-6 py-4 transition duration-300 hover:shadow-lg"
              style={{ borderColor: "#e0e7ff" }}
            >
              <div
                className="flex items-center justify-center w-16 h-16 rounded-lg mb-4"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <IconComponent className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-neutral-600 mb-2">
                {course.subtitle}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{course.duration}</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {course.mode}
                </span>
              </div>

              <button className="w-full bg-primary text-white text-sm py-2 rounded hover:bg-primary/90">
                View Course
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};


export default InfiniteMovingCards