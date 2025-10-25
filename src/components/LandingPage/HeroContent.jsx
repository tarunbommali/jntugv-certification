/* eslint-disable no-unused-vars */
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
} from "recharts";
import {
  heroStats,
  containerVariants,
  itemVariants,
  floatVariants,
} from "./LandingPageConstants";
import { CheckCircle, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

const heroIconMap = {
  TrendingUp,
  Zap,
  CheckCircle,
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
        {stats.map((stat, index) => {
          const IconComponent =
            typeof stat.icon === "string" ? heroIconMap[stat.icon] : stat.icon;
          const ResolvedIcon = IconComponent ?? CheckCircle;

          return (
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
                  <ResolvedIcon className="h-5 w-5" />
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
          );
        })}
      </motion.div>
    </div>
  );
};


export default HeroContent;