import { Download, Users } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCarousel from './ui/CourseCarousel'

const Hero = () => {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-background to-secondary/30"
    >
      <div className="max-w-full mx-auto">
       
        <CourseCarousel/>
        
      </div>
    </section>
  );
};

export default Hero;
