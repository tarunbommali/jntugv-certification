import React from 'react';
import PageContainer from '../layout/PageContainer';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { Star, Quote } from 'lucide-react';

const Testimonial = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at Google',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'The AI/ML certification from JNTU-GV completely transformed my career. The hands-on projects and industry mentorship helped me land my dream job at Google.',
      rating: 5,
      course: 'AI & Machine Learning'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Cybersecurity Analyst at Microsoft',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'The cybersecurity program was incredibly comprehensive. I learned practical skills that I use every day in my role. The instructors were industry experts who really knew their stuff.',
      rating: 5,
      course: 'Cybersecurity'
    },
    {
      name: 'Anita Patel',
      role: 'Full-Stack Developer at Amazon',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'The web development course gave me the confidence to switch careers. The curriculum was up-to-date with the latest technologies and the community support was amazing.',
      rating: 5,
      course: 'Full-Stack Development'
    },
    {
      name: 'Vikram Singh',
      role: 'Data Scientist at Netflix',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'The data science program exceeded my expectations. The real-world projects and industry connections helped me understand how to apply concepts in actual business scenarios.',
      rating: 5,
      course: 'Data Science'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <PageContainer>
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hear from our successful graduates who have transformed their careers 
            and achieved their professional goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Quote className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <Badge variant="secondary" className="mt-2">
                        {testimonial.course}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-blue-500/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Join Our Success Stories
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Be the next success story. Start your journey today and transform your career 
                with industry-recognized certifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/courses">Start Learning</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/auth/signup">Join Now</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </section>
  );
};

export default Testimonial;