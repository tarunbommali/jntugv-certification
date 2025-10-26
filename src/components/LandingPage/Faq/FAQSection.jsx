/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card.jsx";
import Button from "../../ui/Button.jsx";
import { Sparkles, Mail } from "lucide-react";
import Accordion from "../../ui/accordion/Accordion.jsx";
import { faqItems } from "../../../data/landingPage/faqItems.js";
import PageContainer from "../../layout/PageContainer.jsx";
import AnimatedSectionHeader from "../ui/AnimatedSectionHeader.jsx";

const FaqSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />

      <PageContainer>
        {/* Header */}
        <AnimatedSectionHeader
          badge={{
            icon: Sparkles,
            text: "FAQ",
          }}
          title="Frequently Asked Questions"
          description="Find quick answers to common questions about our courses, enrollment process, and learning platform."
        />

        {/* FAQ Content */}
        <div className=" mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative border-border/50 shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text ">
                    Common Questions
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                {/* FAQ Accordion */}
                <Accordion
                  modules={faqItems}
                  accordionType="faq"
                  variant="bordered"
                  type="single"
                  showIcons={true}
                />
                {/* Support CTA */}
                <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
                  <h4 className="font-semibold text-foreground mb-2">
                    Can't find your answer?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is here to help you.
                  </p>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                    asChild
                  >
                    <a href="mailto:support@jntugv.edu.in">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
};

export default FaqSection;
