import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import PageContainer from "../layout/PageContainer";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-3xl p-10 md:p-16 text-center overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Start Learning Today
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Explore practical courses, complete assessments, and earn recognized certificates.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto px-8 text-white shadow-lg shadow-primary/25" asChild>
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-primary text-primary hover:bg-primary/5" asChild>
                <Link to="/certificates">Browse Certifications</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
};

export default CTASection;
