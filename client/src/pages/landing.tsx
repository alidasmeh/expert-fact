import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center">
            <i className="fas fa-brain text-white text-2xl"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">ExpertVoice</h1>
            <p className="text-neutral-600 mt-2">Share posts, get expert insights</p>
          </div>
        </div>

        {/* Features */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-share text-primary text-sm"></i>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Share Social Posts</h3>
                  <p className="text-xs text-neutral-600">Share Instagram and X.com posts for expert feedback</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-secondary text-sm"></i>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Expert Insights</h3>
                  <p className="text-xs text-neutral-600">Get valuable feedback from verified experts</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-award text-accent text-sm"></i>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Build Your Expertise</h3>
                  <p className="text-xs text-neutral-600">Share your knowledge and help others grow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
          <p className="text-xs text-neutral-500 text-center">
            Join thousands of experts sharing their knowledge
          </p>
        </div>
      </div>
    </div>
  );
}
