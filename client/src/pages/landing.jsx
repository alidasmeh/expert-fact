import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-brain text-white text-sm"></i>
          </div>
          <span className="font-semibold text-lg">ExpertVoice</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
          <i className="fas fa-users text-primary text-2xl"></i>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-neutral-900">
          Get Expert Feedback on Your Social Posts
        </h1>
        
        <p className="text-neutral-600 mb-8 leading-relaxed">
          Share your Instagram and X.com posts to receive valuable insights from verified professionals in your field.
        </p>

        {/* Features */}
        <div className="space-y-4 mb-8 w-full">
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-green-600 text-sm"></i>
            </div>
            <span className="text-sm text-neutral-700">Connect with industry experts</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-share text-blue-600 text-sm"></i>
            </div>
            <span className="text-sm text-neutral-700">Share posts from Instagram & X.com</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-comments text-purple-600 text-sm"></i>
            </div>
            <span className="text-sm text-neutral-700">Get personalized feedback</span>
          </div>
        </div>

        {/* CTA */}
        <Button 
          size="lg" 
          className="w-full font-medium"
          onClick={() => window.location.href = '/api/login'}
        >
          Get Started
        </Button>
        
        <p className="text-xs text-neutral-500 mt-4">
          Join thousands of creators getting expert insights
        </p>
      </div>
    </div>
  );
}