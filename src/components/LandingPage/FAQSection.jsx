/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import { Sparkles, Mail } from "lucide-react";
import Accordion from "../ui/accordion/Accordion.jsx";

const FAQSection = ({ faqItems }) => {
  const faqModules = faqItems.map((faq, index) => ({
    id: faq.id || index,
    title: faq.question,
    content: [faq.answer], 
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="group relative  bg-gradient-to-br from-background to-muted/50 border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-2xl">
        {/* Animated Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

        <div className="relative bg-background rounded-2xl p-1">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text ">
                Frequently Asked Questions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {/* Use your existing Accordion component */}
            <Accordion
              modules={faqItems}
              accordionType="faq"
              variant="bordered"
              className="faq-accordion"
      
              headerClassName="faq-header"
              contentClassName="faq-content"
            />

            {/* Additional CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-center"
            >
              <h4 className="font-semibold text-foreground mb-2">
                Can't find your answer?
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our support team is always ready to help you with any questions.
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                asChild
              >
                <a href="mailto:support@jntugv.edu.in">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </a>
              </Button>
            </motion.div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default FAQSection;
