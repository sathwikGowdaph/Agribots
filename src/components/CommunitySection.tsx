import React from 'react';
import { Users, MessageCircle, HelpCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface CommunitySectionProps {
  translations: any;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ translations }) => {
  const recentDiscussions = [
    {
      id: 1,
      title: "Early blight symptoms on tomato leaves",
      author: "Ravi Kumar",
      replies: 12,
      category: "Disease",
      timeAgo: "2 hours ago",
      isAnswered: true,
    },
    {
      id: 2,
      title: "Best organic fertilizer for wheat crops",
      author: "Priya Sharma",
      replies: 8,
      category: "Nutrition",
      timeAgo: "5 hours ago",
      isAnswered: false,
    },
    {
      id: 3,
      title: "Pest control for rice paddy",
      author: "Manoj Singh",
      replies: 15,
      category: "Pest Control",
      timeAgo: "1 day ago",
      isAnswered: true,
    },
  ];

  return (
    <section id="community" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-4">
              {translations.community.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {translations.community.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Community Stats */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Farmers</span>
                    <span className="font-semibold text-primary">12,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Questions Answered</span>
                    <span className="font-semibold text-success">8,392</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expert Contributors</span>
                    <span className="font-semibold text-accent">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success Stories</span>
                    <span className="font-semibold text-warning">2,134</span>
                  </div>
                </CardContent>
              </Card>

              <Button variant="farmer" size="lg" className="w-full">
                <HelpCircle className="h-5 w-5 mr-2" />
                {translations.community.askQuestion}
              </Button>
            </div>

            {/* Recent Discussions */}
            <div className="lg:col-span-2">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    {translations.community.recentDiscussions}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentDiscussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="border border-border rounded-lg p-4 hover:shadow-soft transition-smooth cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-foreground hover:text-primary transition-fast">
                          {discussion.title}
                        </h3>
                        {discussion.isAnswered && (
                          <Badge variant="default" className="ml-2">
                            Answered
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {discussion.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{discussion.author}</span>
                        </div>
                        
                        <Badge variant="secondary" className="text-xs">
                          {discussion.category}
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        
                        <span className="ml-auto">{discussion.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center pt-4">
                    <Button variant="outline" size="lg">
                      View All Discussions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center shadow-soft">
              <CardContent className="pt-6">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Expert Network</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with agricultural experts and experienced farmers
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-soft">
              <CardContent className="pt-6">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Success Stories</h3>
                <p className="text-sm text-muted-foreground">
                  Learn from real farmer experiences and success cases
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-soft">
              <CardContent className="pt-6">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help anytime from our active farming community
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;