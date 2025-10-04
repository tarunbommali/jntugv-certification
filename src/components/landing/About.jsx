import React from 'react';
import PageContainer from '../layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import { GraduationCap, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: GraduationCap,
      title: 'Industry-Recognized Certificates',
      description: 'Get certified by JNTU-GV with credentials recognized by top companies worldwide.'
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience.'
    },
    {
      icon: Award,
      title: 'Hands-On Projects',
      description: 'Build real projects and portfolios that showcase your skills to employers.'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Join thousands of learners from around the world in our supportive community.'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <PageContainer>
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            About Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Empowering the Next Generation of Tech Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            JNTU-GV Certification Platform is designed to bridge the gap between academic learning 
            and industry requirements, providing students with practical skills and recognized credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To democratize access to high-quality technical education and certification, 
                enabling students from all backgrounds to acquire industry-relevant skills 
                and advance their careers in the rapidly evolving technology landscape.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </section>
  );
};

export default About;