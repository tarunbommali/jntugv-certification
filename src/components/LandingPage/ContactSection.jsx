/* eslint-disable no-unused-vars */
import { useState } from "react";
import PageContainer from "../layout/PageContainer";
import {
  useFormValidation,
  validationRules,
} from "../../hooks/useFormValidation";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  contactInfo,
  faqItems,
  containerVariants,
} from "./LandingPageConstants";
import AnimatedSectionHeader from "./AnimatedSectionHeader.jsx";
import GradientContactCard from "./GradientContactCard.jsx";
import ContactForm from "./ContactForm.jsx"; 
import FAQSection from "./FAQSection.jsx"; 

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

  const iconComponents = {
    Mail,
    Phone,
    MapPin,
    Clock,
    MessageCircle,
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
        <AnimatedSectionHeader
          badge={{
            icon: MessageCircle,
            text: "Get in Touch",
          }}
          title="Contact Us"
          description="Have questions about our courses or need help getting started? Our support team is here to help you succeed in your learning journey."
        />

        {/* Contact Info Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10"
        >
          {contactInfo.map((info) => {
            const IconComponent = iconComponents[info.icon];
            return (
              <GradientContactCard
                key={info.title}
                info={info}
                IconComponent={IconComponent}
              />
            );
          })}
        </motion.div>

        {/* Contact Form & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Contact Form */}
          <ContactForm
            values={values}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
          />

          {/* FAQ Section */}
          <FAQSection faqItems={faqItems} />
        </div>
      </PageContainer>
    </section>
  );
};

export default ContactSection;