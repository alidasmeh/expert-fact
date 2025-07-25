import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { EXPERTISE_CATEGORIES, type ExpertiseCategory } from "@shared/schema";

interface PostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function PostModal({ onClose, onSuccess }: PostModalProps) {
  const { toast } = useToast();
  const [socialMediaUrl, setSocialMediaUrl] = useState("");
  const [content, setContent] = useState("");
  const [seekingExpertise, setSeekingExpertise] = useState<string>("");

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const urlPattern = /(instagram\.com|x\.com|twitter\.com)/i;
      if (!urlPattern.test(socialMediaUrl)) {
        throw new Error("Please enter a valid Instagram or X.com URL");
      }

      let platform = "other";
      if (socialMediaUrl.includes("instagram.com")) {
        platform = "instagram";
      } else if (socialMediaUrl.includes("x.com") || socialMediaUrl.includes("twitter.com")) {
        platform = "twitter";
      }

      await apiRequest("POST", "/api/posts", {
        content,
        socialMediaUrl,
        socialMediaPlatform: platform,
        seekingExpertise,
        socialMediaPreview: {
          description: content,
          platform,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your post has been shared!",
      });
      onSuccess();
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const isFormValid = socialMediaUrl.trim() && content.trim() && seekingExpertise;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white rounded-t-xl">
        <Card className="rounded-t-xl rounded-b-none border-0">
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Share a Post</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <i className="fas fa-times"></i>
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="socialUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                Social Media Link
              </Label>
              <Input
                id="socialUrl"
                type="url" 
                placeholder="Paste Instagram or X.com link here..." 
                value={socialMediaUrl}
                onChange={(e) => setSocialMediaUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Supported platforms: Instagram, X.com (Twitter)
              </p>
            </div>
            
            <div>
              <Label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
                Your Comment
              </Label>
              <Textarea 
                id="content"
                placeholder="What would you like experts to comment on?" 
                rows={3} 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full resize-none"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-2">
                Seeking Expertise
              </Label>
              <Select value={seekingExpertise} onValueChange={setSeekingExpertise}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select expertise needed..." />
                </SelectTrigger>
                <SelectContent>
                  {EXPERTISE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-3 pt-2 safe-area-bottom">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={onClose}
                disabled={createPostMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-white" 
                onClick={() => createPostMutation.mutate()}
                disabled={!isFormValid || createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Sharing..." : "Share Post"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
