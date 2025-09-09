import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Circle, CircleDot } from "lucide-react";

const carouselList = [
  {
    link: "https://jntugv.edu.in/",
    img: "https://emergingtechnologiesbyjntugv.netlify.app/static/media/hero_bg.243926b330917406d70a.png",
    title: "JNTU-GV University",
    description: "Explore our academic programs and campus facilities"
  },
  {
    link: "https://jntugv.edu.in/other-page",
    img: "https://miro.medium.com/v2/resize:fit:1400/1*KuGlXZjyTw7q38uzY_aZRA.png",
    title: "Emerging Technologies",
    description: "Discover cutting-edge research and innovation"
  },
];

const CourseCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const prevSlide = () => {
    const index = currentIndex === 0 ? carouselList.length - 1 : currentIndex - 1;
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    const index = currentIndex === carouselList.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(index);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="relative max-w-full mx-auto overflow-hidden  shadow-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slide Container */}
      <div className="relative aspect-video w-full h-90">
        <a 
          href={carouselList[currentIndex].link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block h-full w-full"
        >
          <img
            src={carouselList[currentIndex].img}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{carouselList[currentIndex].title}</h3>
            <p className="text-lg opacity-90">{carouselList[currentIndex].description}</p>
          </div>
        </a>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="text-white hover:scale-110 transition-transform duration-200"
              aria-label={`Go to slide ${idx + 1}`}
            >
              {currentIndex === idx ? (
                <CircleDot size={20} fill="white" />
              ) : (
                <Circle size={20} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;