/* eslint-disable no-unused-vars */
import React from "react";
import {
  CheckCircle,
  BarChart as BarChartIcon,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { global_classnames } from "../utils/classnames.js";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis, // Added YAxis for better bar chart readability
  Tooltip,
  Legend, // Added Legend for chart context
} from "recharts";

// Framer Motion Variants for Staggered Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  const stats = [
    {
      text: "Projected 2.5 Million+ new jobs globally in AI & Emerging Tech by 2027",
      value: 2500000,
      icon: TrendingUp,
    },
    {
      text: "80% of enterprises expected to adopt AI-driven solutions by 2026",
      value: 80,
      icon: Zap,
    },
    {
      text: "53% skill gap in emerging technologies",
      value: 53,
      icon: BarChartIcon,
    },
  ];

  const pieData = [
    { name: "AI Adoption", value: 80 },
    { name: "Not Adopted", value: 20 },
  ];

  const barData = [
    { name: "Gap", value: 53, fill: "#004080" },
    { name: "Skilled", value: 47, fill: "#3b82f6" }, // Use a different blue for contrast
  ];

  const PIE_COLORS = ["#004080", "#a1a1aa"]; // Dark Blue (Primary) and Gray (Secondary)

  // Custom Recharts Tooltip for better clarity
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded-md shadow-lg text-sm">
          <p className="font-semibold text-[#004080]">{data.name}</p>
          <p>{`${data.value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Bar Chart Tooltip for Stat 1
  const JobsTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded-md shadow-lg text-sm">
          <p className="font-semibold text-[#004080]">Projected Jobs</p>
          <p>{`${(value * 100000).toLocaleString()} New Jobs`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      className="py-4 md:py-6 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden"
      // Removed background image for a cleaner, more academic look.
      // If kept, use a lighter opacity or a pattern, not a heavy image.
    >
      <div className={`${global_classnames.width.container}   mx-auto px-6`}>
        {/* Main Title: Top and Center */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-semibold  text-[#004080] mb-16 leading-tight"
        >
          JNTU-GV State University
          <span className="text-[#0056b3]"> Certification </span> in Advanced
          Technologies
        </motion.h1>

        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* LEFT SECTION: VALUE PROPOSITION & TECH LIST */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full lg:w-1/2 space-y-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 border-b-2 border-yellow-400 pb-2">
              Transform Your Career with{" "}
              <span className="text-[#0056b3]">Industry-Relevant Skills</span>
            </h2>

            <p className="text-xl text-gray-700 leading-relaxed">
              Earn industry-recognized certification from JNTU-GV by completing
              intensive, real-world projects. Boost your practical skills and
              job readiness in the most demanded emerging tech domains.
            </p>

            {/* Tech List Grid */}
            <motion.ul
              variants={containerVariants}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {[
                "Artificial Intelligence (AI)",
                "Machine Learning (ML)",
                "Cybersecurity ",
                "Internet of Things (IoT) ",
                "Blockchain Technology",
                "Quantum Computing ",
              ].map((tech, idx) => (
                <motion.li
                  key={idx}
                  variants={itemVariants}
                  className="flex items-center gap-2 bg-[#004080] text-white font-medium px-4 py-3 rounded-xl shadow-lg hover:bg-[#0056b3] transition duration-300"
                >
                  <CheckCircle className="h-5 w-5 text-yellow-400 min-w-5" />
                  <span className="text-sm md:text-base">{tech}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="pt-6">
              <button className="bg-yellow-500 text-[#004080] font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:bg-yellow-400 transform hover:scale-[1.02] transition duration-300">
                View All Courses & Enroll Now →
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT SECTION: MARKET INSIGHTS & STATS */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-1/2 grid gap-6"
          >
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
              Why Certify Now? Market Insights
            </h3>

            {/* Stat 1: Jobs Projections */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md">
              <div className="flex items-center justify-between gap-3 mb-4">
                <p className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                  {React.createElement(stats[0].icon, {
                    className: "h-6 w-6 text-red-500",
                  })}
                  {stats[0].text}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                {/* Simplified Bar Chart to just show scale, using the actual value */}
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Jobs (in Lakhs)", value: stats[0].value / 100000 },
                  ]}
                >
                  <Tooltip content={<JobsTooltip />} />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `${v} Lakhs`}
                    stroke="#6b7280"
                  />
                  <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-6">
              {/* Stat 2: AI Adoption Pie Chart */}
              <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-md text-center">
                <p className="font-semibold text-gray-800 mb-2">
                  {stats[1].text}
                </p>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Stat 3: Skill Gap Bar Chart */}
              <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-md text-center">
                <p className="font-semibold text-gray-800 mb-2">
                  {stats[2].text}
                </p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart
                    data={barData}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      isAnimationActive={false}
                      label={{ position: "right", fill: "#004080" }}
                    >
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
