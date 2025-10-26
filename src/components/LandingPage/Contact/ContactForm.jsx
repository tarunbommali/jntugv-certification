/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import Button from "../../ui/Button";
import FormField from "../../ui/FormField";
import { Alert, AlertDescription, AlertIcon } from "../../ui/Alert";
import { Send } from "lucide-react";

const ContactForm = ({
  values,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  submitStatus,
}) => {
  return (
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
                    Thank you for your message! We'll get back to you within 24
                    hours.
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
                    Sorry, there was an error sending your message. Please try
                    again.
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
  );
};

export default ContactForm;