import React from "react";
import { Brain, Cpu, Zap, Shield, Atom } from "lucide-react";
import { global_classnames } from "../utils/classnames";

const courses = [
  {
    id: 1,
    title: "Emerging Technologies",
    subtitle: "Comprehensive overview of AI, ML, IoT, Cybersecurity, Quantum",
    duration: "3 Months / 120 Hours",
    mode: "Hybrid Mode",
    icon: Brain,
  },
  {
    id: 2,
    title: "Artificial Intelligence & Tools",
    subtitle: "AI concepts and popular AI tools",
    duration: "1 Month / 40 Hours",
    mode: "Online",
    icon: Cpu,
  },
  {
    id: 3,
    title: "Machine Learning & Deep Learning",
    subtitle: "ML models, Deep Learning frameworks",
    duration: "1 Month / 40 Hours",
    mode: "Online",
    icon: Zap,
  },
  {
    id: 4,
    title: "Internet of Things (IoT)",
    subtitle: "IoT devices, protocols and applications",
    duration: "1 Month / 40 Hours",
    mode: "Online",
    icon: Atom,
  },
  {
    id: 5,
    title: "Cyber Security",
    subtitle: "Network security, ethical hacking fundamentals",
    duration: "1 Month / 40 Hours",
    mode: "Hybrid Mode",
    icon: Shield,
  },
  {
    id: 6,
    title: "Quantum Computing",
    subtitle: "Quantum principles and computing basics",
    duration: "1 Month / 40 Hours",
    mode: "Online",
    icon: Atom,
  },
];

export default function Courses() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-4xl font-bold md:text-center text-primary mb-10">
          Explore Our Certification Courses
        </h2>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const IconComponent = course.icon;
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start transition hover:shadow-lg"
                style={{ border: global_classnames.container.border }}
              >
                <div
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4"
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4">{course.subtitle}</p>
                <div className="flex justify-between w-full text-sm text-muted-foreground">
                  <span>{course.duration}</span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {course.mode}
                  </span>
                </div>
                <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition">
                  Learn More
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
