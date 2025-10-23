/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PageContainer from "../layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import FormField from "../ui/FormField";
import { Alert, AlertDescription, AlertIcon } from "../ui/Alert";
import {
  useFormValidation,
  validationRules,
} from "../../hooks/useFormValidation";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } =
    useFormValidation(
      {
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      },
      {
        firstName: [validationRules.required("First name is required")],
        lastName: [validationRules.required("Last name is required")],
        email: [
          validationRules.required("Email is required"),
          validationRules.email("Please enter a valid email address"),
        ],
        subject: [validationRules.required("Please select a subject")],
        message: [
          validationRules.required("Message is required"),
          validationRules.minLength(
            10,
            "Message must be at least 10 characters"
          ),
        ],
      }
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitStatus("success");
      resetForm();
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 7780351078",
      description: "Mon-Fri 9AM-6PM IST",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@jntugv.edu.in",
      description: "We respond within 24 hours",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      title: "Address",
      details: "JNTU-GV, Vizianagaram",
      description: "Andhra Pradesh, India",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "9:00 AM - 6:00 PM",
      description: "Monday to Friday",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const faqItems = [
    {
      question: "How long does it take to complete a course?",
      answer:
        "Most courses are self-paced and can be completed in 3-6 months depending on your schedule and commitment level.",
    },
    {
      question: "Are the certificates recognized by employers?",
      answer:
        "Yes, our certificates are industry-recognized and accepted by top companies worldwide including Google, Microsoft, and Amazon.",
    },
    {
      question: "Do you provide job placement assistance?",
      answer:
        "We offer comprehensive career guidance, resume building workshops, and direct connections with our industry partners for placement opportunities.",
    },
    {
      question: "What if I need help during the course?",
      answer:
        "Our support team is available 24/7, and you can also get help from instructors and the community forum for quick assistance.",
    },
  ];

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

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity },
        }}
        className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity },
        }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />

      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Get in Touch</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text  mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our courses or need help getting started? Our
            support team is here to help you succeed in your learning journey.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="group relative"
            >
              {/* Gradient Border Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${info.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300`}
              />

              <Card className="relative bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full text-center group-hover:border-primary/30">
                <CardHeader className="p-0 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`mx-auto w-16 h-16 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}
                  >
                    <info.icon className="h-6 w-6" />
                  </motion.div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {info.details}
                  </p>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="group relative h-full bg-gradient-to-br from-background to-muted/50 border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-2xl">
              {/* Animated Border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

              <div className="relative bg-background rounded-2xl p-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Send className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text ">
                      Send us a Message
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Alert variant="success" className="mb-6">
                        <AlertIcon variant="success" />
                        <AlertDescription>
                          Thank you for your message! We'll get back to you
                          within 24 hours.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Alert variant="destructive" className="mb-6">
                        <AlertIcon variant="destructive" />
                        <AlertDescription>
                          Sorry, there was an error sending your message. Please
                          try again.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <FormField
                          label="First Name"
                          type="text"
                          placeholder="Enter your first name"
                          required
                          value={values.firstName}
                          onChange={(value) => handleChange("firstName", value)}
                          onBlur={() => handleBlur("firstName")}
                          error={errors.firstName}
                          className="bg-background border-border/50 focus:border-primary transition-colors duration-300"
                        />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <FormField
                          label="Last Name"
                          type="text"
                          placeholder="Enter your last name"
                          required
                          value={values.lastName}
                          onChange={(value) => handleChange("lastName", value)}
                          onBlur={() => handleBlur("lastName")}
                          error={errors.lastName}
                          className="bg-background border-border/50 focus:border-primary transition-colors duration-300"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <FormField
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={values.email}
                        onChange={(value) => handleChange("email", value)}
                        onBlur={() => handleBlur("email")}
                        error={errors.email}
                        className="bg-background border-border/50 focus:border-primary transition-colors duration-300"
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <FormField
                        label="Subject"
                        type="select"
                        required
                        value={values.subject}
                        onChange={(value) => handleChange("subject", value)}
                        onBlur={() => handleBlur("subject")}
                        error={errors.subject}
                        className="bg-background border-border/50 focus:border-primary transition-colors duration-300"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="course">Course Information</option>
                        <option value="support">Technical Support</option>
                        <option value="career">Career Guidance</option>
                        <option value="other">Other</option>
                      </FormField>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <FormField
                        label="Message"
                        type="textarea"
                        placeholder="Tell us how we can help you achieve your learning goals..."
                        required
                        rows={5}
                        value={values.message}
                        onChange={(value) => handleChange("message", value)}
                        onBlur={() => handleBlur("message")}
                        error={errors.message}
                        className="bg-background border-border/50 focus:border-primary transition-colors duration-300 resize-none"
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Sending Message...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            <span>Send Message</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="group relative h-full bg-gradient-to-br from-background to-muted/50 border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-2xl">
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
                  <div className="space-y-6">
                    {faqItems.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 8 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                      >
                        <h4 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          {faq.question}
                        </h4>
                        <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    ))}
                  </div>

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
                      Our support team is always ready to help you with any
                      questions.
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
        </div>
      </PageContainer>
    </section>
  );
};

export default ContactSection;
