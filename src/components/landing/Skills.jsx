import React from 'react';
import PageContainer from '../layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import { 
  Brain, 
  Shield, 
  Network, 
  Database, 
  Smartphone, 
  Cloud,
  Code,
  Zap
} from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Artificial Intelligence & Machine Learning',
      icon: Brain,
      skills: ['Deep Learning', 'Neural Networks', 'Computer Vision', 'Natural Language Processing'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Cybersecurity',
      icon: Shield,
      skills: ['Ethical Hacking', 'Network Security', 'Cryptography', 'Risk Assessment'],
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Web Development',
      icon: Code,
      skills: ['React.js', 'Node.js', 'Full-Stack Development', 'API Design'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Cloud Computing',
      icon: Cloud,
      skills: ['AWS', 'Azure', 'DevOps', 'Containerization'],
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Data Science',
      icon: Database,
      skills: ['Data Analysis', 'Big Data', 'Statistics', 'Visualization'],
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Mobile Development',
      icon: Smartphone,
      skills: ['React Native', 'Flutter', 'iOS Development', 'Android Development'],
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Internet of Things',
      icon: Network,
      skills: ['IoT Architecture', 'Embedded Systems', 'Sensor Networks', 'Edge Computing'],
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Emerging Technologies',
      icon: Zap,
      skills: ['Blockchain', 'Quantum Computing', 'AR/VR', '5G Technology'],
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <section className="py-16">
      <PageContainer>
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Skills You'll Master
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cutting-Edge Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Master the most in-demand skills in today's technology landscape with our 
            comprehensive curriculum designed by industry experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className={`mx-auto w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <CardTitle className="text-lg text-center">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-blue-500/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Industry-Ready Skills
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our curriculum is constantly updated to reflect the latest industry trends and requirements. 
                You'll learn not just theoretical concepts, but practical skills that employers are actively seeking.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Job Placement Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Industry Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">Students Certified</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </section>
  );
};

export default Skills;