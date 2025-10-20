/* eslint-disable no-unused-vars */
import React from "react";
import {
  CheckCircle,
  BarChart as BarChartIcon,
  TrendingUp,
  Zap,
  Rocket,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import PageContainer from "../layout/PageContainer";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Framer Motion Variants
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const floatVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Custom Tooltip Components
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-sm p-3 border border-border rounded-xl shadow-2xl text-sm">
        <p className="font-semibold text-primary">{data.name}</p>
        <p>{`${data.value}%`}</p>
      </div>
    );
  }
  return null;
};

const JobsTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-background/95 backdrop-blur-sm p-3 border border-border rounded-xl shadow-2xl text-sm">
        <p className="font-semibold text-primary">Projected Jobs</p>
        <p>{`${(value * 100000).toLocaleString()} New Jobs`}</p>
      </div>
    );
  }
  return null;
};
const HeroContent = ({ stats, pieData }) => {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 relative z-10">
      {/* LEFT SECTION: VALUE PROPOSITION & TECH LIST */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full lg:w-1/2 space-y-8"
      >
        <motion.div variants={itemVariants}>
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-6">
            Transform Your Career with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Industry-Relevant Skills
            </span>
          </h3>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            Earn industry-recognized certification from JNTU-GV by completing
            intensive, real-world projects. Boost your practical skills and job
            readiness in the most demanded emerging tech domains.
          </motion.p>
        </motion.div>

        {/* Tech List Grid */}
        <motion.ul
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
        >
          {[
            "Artificial Intelligence (AI)",
            "Machine Learning (ML)",
            "Cybersecurity",
            "Internet of Things (IoT)",
            "Blockchain Technology",
            "Quantum Computing",
          ].map((tech, idx) => (
            <motion.li
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 8 }}
              className="flex items-center gap-3 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border border-primary/20 text-foreground font-medium px-4 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="h-5 w-5 text-primary min-w-5" />
              </motion.div>
              <span className="text-sm md:text-base group-hover:text-primary transition-colors">
                {tech}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* RIGHT SECTION: MARKET INSIGHTS & STATS */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full lg:w-1/2 grid gap-6"
      >
        <motion.h3
          variants={floatVariants}
          animate="float"
          className="text-lg md:text-xl font-bold text-foreground mb-6"
        >
          Why Certify Now? Market Insights
        </motion.h3>

        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden group`}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full blur-xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-white/90 text-sm leading-tight">
                  {stat.text}
                </p>
              </div>

              {index === 0 && (
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart
                    layout="vertical"
                    data={[
                      {
                        name: "Jobs (in Lakhs)",
                        value: stat.value / 100000,
                      },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <Tooltip content={<JobsTooltip />} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="transparent"
                    />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `${v} Lakhs`}
                      stroke="rgba(255,255,255,0.7)"
                    />
                    <Bar
                      dataKey="value"
                      fill="rgba(255,255,255,0.9)"
                      radius={[4, 4, 0, 0]}
                      animationBegin={1000}
                      animationDuration={2000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {index === 1 && (
                <div className="flex items-center justify-between">
                  <ResponsiveContainer width="60%" height={120}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={45}
                        fill="var(--color-primary)"
                        paddingAngle={2}
                        dataKey="value"
                        animationBegin={1000}
                        animationDuration={2000}
                      >
                        {pieData.map((_, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={
                              idx === 0
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(255,255,255,0.3)"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stat.value}%</div>
                    <div className="text-white/70 text-sm">Adoption Rate</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const Hero = () => {
  const stats = [
    {
      text: "Projected 2.5 Million+ new jobs globally in AI & Emerging Tech by 2027",
      value: 2500000,
      icon: TrendingUp,
      color: "from-red-500 to-orange-500",
    },
    {
      text: "80% of enterprises expected to adopt AI-driven solutions by 2026",
      value: 80,
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const pieData = [
    { name: "AI Adoption", value: 80 },
    { name: "Not Adopted", value: 20 },
  ];

  const barData = [
    { name: "Gap", value: 53, fill: "var(--color-primary)" },
    { name: "Skilled", value: 47, fill: "var(--color-primaryHover)" },
  ];

  const PIE_COLORS = ["var(--color-primary)", "var(--color-textLow)"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm p-3 border border-border rounded-xl shadow-2xl text-sm">
          <p className="font-semibold text-primary">{data.name}</p>
          <p>{`${data.value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const JobsTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-background/95 backdrop-blur-sm p-3 border border-border rounded-xl shadow-2xl text-sm">
          <p className="font-semibold text-primary">Projected Jobs</p>
          <p>{`${(value * 100000).toLocaleString()} New Jobs`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="pt-20 pb-16  relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity },
        }}
        className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity },
        }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />

      <PageContainer>
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Rocket className="h-4 w-4" />
            <span className="text-sm font-medium">Future-Ready Education</span>
          </motion.div>

          <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">
              Jawaharlal Nehru Technological University-Gurajada, Vizianagaram
            </span>

            <br />
            <span className="text-xl md:text-2xl bg-gradient-to-r from-[var(--gradient-accent-from)] to-[var(--gradient-accent-to)] bg-clip-text text-transparent">
              State University Certification in Advanced Technologies
            </span>
          </h1>
        </motion.div>

        <HeroContent stats={stats} pieData={pieData} />
      </PageContainer>
    </section>
  );
};

export default Hero;
