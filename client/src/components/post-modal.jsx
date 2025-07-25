import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PostModal({ onClose, onSubmit, isLoading, expertiseOptions }) {
  const [formData, setFormData] = useState({
    content: "",
    seekingExpertise: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.seekingExpertise) return;
    onSubmit(formData);
  };

  const isValidSocialUrl = (url) => {
    return url.includes('instagram.com') || 
           url.includes('x.com') || 
           url.includes('twitter.com');
  };

  const extractedUrl = formData.content.match(/(https?:\/\/[^\s]+)/)?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-md mx-4 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Share Post</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center touch-manipulation"
          >
            <i className="fas fa-times text-neutral-600"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Post Content */}
            <div>
              <Label htmlFor="content" className="text-sm font-medium text-neutral-900">
                Post Content & Social Media URL
              </Label>
              <Textarea
                id="content"
                placeholder="Paste your Instagram or X.com link and describe what kind of feedback you're looking for..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="mt-1 min-h-[100px] resize-none"
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                Include your Instagram or X.com post URL and explain what feedback you want
              </p>
            </div>

            {/* URL Preview */}
            {extractedUrl && (
              <div className={`p-3 rounded-lg border ${
                isValidSocialUrl(extractedUrl) 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <i className={`fab fa-${
                    extractedUrl.includes('instagram') ? 'instagram text-pink-500' : 
                    extractedUrl.includes('x.com') || extractedUrl.includes('twitter') ? 'twitter text-blue-500' : 
                    'link text-neutral-500'
                  } text-sm`}></i>
                  <span className="text-sm font-medium">
                    {isValidSocialUrl(extractedUrl) ? 'Social Media Link Detected' : 'URL Detected'}
                  </span>
                  {isValidSocialUrl(extractedUrl) && (
                    <i className="fas fa-check-circle text-green-500 text-sm"></i>
                  )}
                </div>
                <p className="text-xs text-neutral-600 break-all">{extractedUrl}</p>
                {!isValidSocialUrl(extractedUrl) && (
                  <p className="text-xs text-amber-600 mt-1">
                    For best results, use Instagram or X.com links
                  </p>
                )}
              </div>
            )}

            {/* Seeking Expertise */}
            <div>
              <Label htmlFor="expertise" className="text-sm font-medium text-neutral-900">
                What type of expert feedback are you seeking?
              </Label>
              <Select
                value={formData.seekingExpertise}
                onValueChange={(value) => setFormData(prev => ({ ...prev, seekingExpertise: value }))}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose expertise type..." />
                </SelectTrigger>
                <SelectContent>
                  {expertiseOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500 mt-1">
                This helps us show your post to the right experts
              </p>
            </div>

            {/* Submit */}
            <div className="flex space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.content.trim() || !formData.seekingExpertise || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sharing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-share mr-2"></i>
                    Share Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}