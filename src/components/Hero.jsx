import { Download, Users } from "lucide-react";
import { global_classnames } from "../utils/classnames.js";
import Card from "./Card";
import { cardList } from "../utils/constants";
import {Link} from 'react-router-dom'



const Hero = () => {
  return (
    <section
      id="home"
      className="relative px-4 py-8 min-h-[92vh] bg-gradient-to-br from-background to-secondary/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h1
          style={{ color: global_classnames.heading.primary }}
          className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-center sm:text-left"
        >
          CERTIFICATION IN EMERGING TECHNOLOGIES
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-8">
          {/* Text Content */}
          <div className="space-y-6">
            <p
              style={{ color: global_classnames.description_text }}
              className="text-lg sm:text-xl text-center sm:text-left"
            >
              Artificial Intelgence, Machine Learning, Internet of Things,
              Cybersecurity, Quantum
            </p>

            <p
              style={{ color: global_classnames.text.primary }}
              className="text-base sm:text-lg leading-relaxed text-center sm:text-left"
            >
              Advance your career with cutting-edge skills in the most
              sought-after technologies. This comprehensive certification
              program offers hands-on experience with practical applications and
              industry-relevant projects.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link to="/course-registration"
                style={{
                  backgroundColor: global_classnames.button.primary.bg,
                  borderColor: global_classnames.button.primary.border,
                  color: global_classnames.button.primary.text,
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 hover:opacity-90"
              >
                <Users className="mr-2 h-5 w-5" />
                Register Now
              </Link>

              <button
                style={{
                  backgroundColor: global_classnames.button.secondary.bg,
                  borderColor: global_classnames.button.secondary.border,
                  color: global_classnames.button.secondary.text,
                }}
                download="JNTU-GV_Brochure.pdf"
                href="/brochure.pdf"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 border hover:bg-primary/10"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Brochure
              </button>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pt-6">
              {cardList.map((highlight, idx) => (
                <Card
                  key={idx}
                  title={highlight.title}
                  subtitle={highlight.subtitle}
                  Icon={highlight.icon}
                />
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://res.cloudinary.com/drdgj0pch/image/upload/v1745514802/RESPONSIVE_IMAGE_xn4alt.jpg"
                alt="Emerging Technologies Certification"
                className="w-full max-w-md sm:max-w-lg object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
