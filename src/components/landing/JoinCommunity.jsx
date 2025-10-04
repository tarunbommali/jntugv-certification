import React from 'react';
import PageContainer from '../layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Users, MessageCircle, Calendar, Award } from 'lucide-react';

const JoinCommunity = () => {
  const communityFeatures = [
    {
      icon: Users,
      title: '10,000+ Active Learners',
      description: 'Join a vibrant community of students and professionals'
    },
    {
      icon: MessageCircle,
      title: '24/7 Support',
      description: 'Get help from peers and instructors anytime'
    },
    {
      icon: Calendar,
      title: 'Live Sessions',
      description: 'Attend interactive workshops and Q&A sessions'
    },
    {
      icon: Award,
      title: 'Peer Recognition',
      description: 'Showcase your projects and get feedback'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-blue-500/5">
      <PageContainer>
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Community
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join Our Learning Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Connect with like-minded learners, share your journey, and grow together 
            in our supportive and inclusive learning environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityFeatures.map((feature, index) => (
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

        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
            <p className="text-muted-foreground">
              Join thousands of students who are already transforming their careers
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/courses">Browse Courses</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/auth/signup">Join Community</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </section>
  );
};

export default JoinCommunity;