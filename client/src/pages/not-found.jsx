import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
          <i className="fas fa-question text-neutral-400 text-3xl"></i>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
          <p className="text-neutral-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}