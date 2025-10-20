import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import FormField from '../ui/FormField';
import { Alert, AlertDescription, AlertIcon } from '../ui/Alert';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    },
    {
      firstName: [validationRules.required('First name is required')],
      lastName: [validationRules.required('Last name is required')],
      email: [
        validationRules.required('Email is required'),
        validationRules.email('Please enter a valid email address')
      ],
      subject: [validationRules.required('Please select a subject')],
      message: [
        validationRules.required('Message is required'),
        validationRules.minLength(10, 'Message must be at least 10 characters')
      ]
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      resetForm();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 7780351078',
      description: 'Mon-Fri 9AM-6PM IST'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'support@jntugv.edu.in',
      description: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'JNTU-GV, Vizianagaram',
      description: 'Andhra Pradesh, India'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: '9:00 AM - 6:00 PM',
      description: 'Monday to Friday'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-blue-500/5">
      <PageContainer>
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Contact Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have questions about our courses or need help getting started? 
            Our support team is here to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <info.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{info.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-foreground mb-1">{info.details}</p>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitStatus === 'success' && (
                <Alert variant="success" className="mb-4">
                  <AlertIcon variant="success" />
                  <AlertDescription>
                    Thank you for your message! We'll get back to you within 24 hours.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === 'error' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertIcon variant="destructive" />
                  <AlertDescription>
                    Sorry, there was an error sending your message. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    type="text"
                    placeholder="Enter your first name"
                    required
                    value={values.firstName}
                    onChange={(value) => handleChange('firstName', value)}
                    onBlur={() => handleBlur('firstName')}
                    error={errors.firstName}
                  />
                  <FormField
                    label="Last Name"
                    type="text"
                    placeholder="Enter your last name"
                    required
                    value={values.lastName}
                    onChange={(value) => handleChange('lastName', value)}
                    onBlur={() => handleBlur('lastName')}
                    error={errors.lastName}
                  />
                </div>
                
                <FormField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={values.email}
                  onChange={(value) => handleChange('email', value)}
                  onBlur={() => handleBlur('email')}
                  error={errors.email}
                />
                
                <FormField
                  label="Subject"
                  type="select"
                  required
                  value={values.subject}
                  onChange={(value) => handleChange('subject', value)}
                  onBlur={() => handleBlur('subject')}
                  error={errors.subject}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="course">Course Information</option>
                  <option value="support">Technical Support</option>
                  <option value="career">Career Guidance</option>
                  <option value="other">Other</option>
                </FormField>
                
                <FormField
                  label="Message"
                  type="textarea"
                  placeholder="Tell us how we can help you..."
                  required
                  rows={4}
                  value={values.message}
                  onChange={(value) => handleChange('message', value)}
                  onBlur={() => handleBlur('message')}
                  error={errors.message}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    How long does it take to complete a course?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Most courses are self-paced and can be completed in 3-6 months depending on your schedule.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Are the certificates recognized by employers?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, our certificates are industry-recognized and accepted by top companies worldwide.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Do you provide job placement assistance?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We offer career guidance, resume building, and connect students with our industry partners.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    What if I need help during the course?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Our support team is available 24/7, and you can also get help from the community forum.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </section>
  );
};

export default ContactSection;