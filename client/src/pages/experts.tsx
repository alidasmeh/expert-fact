import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EXPERTISE_CATEGORIES } from "@shared/schema";

export default function Experts() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      <TopBar />
      
      <main className="pb-20 p-4">
        <h2 className="font-semibold text-xl text-neutral-900 mb-6">Expert Community</h2>
        
        {/* Expertise Categories */}
        <div className="space-y-4">
          <h3 className="font-medium text-neutral-700">Browse by Expertise</h3>
          <div className="grid grid-cols-2 gap-3">
            {EXPERTISE_CATEGORIES.map((category) => (
              <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <i className={`fas ${getCategoryIcon(category)} text-primary`}></i>
                    </div>
                    <h4 className="font-medium text-sm text-neutral-900">{category}</h4>
                    <p className="text-xs text-neutral-600">Find experts</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-neutral-700">How ExpertVoice Works</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium text-sm">Share Social Posts</h4>
                <p className="text-xs text-neutral-600">Post Instagram or X.com links and specify what expertise you need</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium text-sm">Get Expert Feedback</h4>
                <p className="text-xs text-neutral-600">Experts in your requested field will provide valuable insights</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium text-sm">Build Your Network</h4>
                <p className="text-xs text-neutral-600">Connect with experts and grow your professional community</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activeTab="experts" />
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'Software Engineering': 'fa-code',
    'UX Design': 'fa-palette',
    'Marketing Strategy': 'fa-bullhorn',
    'Data Science': 'fa-chart-bar',
    'Business Strategy': 'fa-briefcase',
    'Product Management': 'fa-rocket',
    'Graphic Design': 'fa-paint-brush',
    'Content Creation': 'fa-pen-fancy',
    'Sales': 'fa-handshake',
    'Finance': 'fa-dollar-sign',
    'Legal': 'fa-gavel',
    'HR': 'fa-users',
  };
  return iconMap[category] || 'fa-user';
}
