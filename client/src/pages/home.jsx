import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { PostCard } from "@/components/post-card";
import { PostModal } from "@/components/post-modal";
import { apiRequest } from "@/lib/queryClient";

const EXPERTISE_OPTIONS = [
  "Marketing & Branding",
  "Content Creation",
  "Business Strategy", 
  "Design & UX",
  "Technology & Development",
  "Social Media",
  "Photography",
  "Writing & Copywriting",
  "Finance & Investment",
  "Health & Wellness"
];

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPostModal, setShowPostModal] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData) => {
      return apiRequest("/api/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setShowPostModal(false);
      toast({
        title: "Success",
        description: "Your post has been shared!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <TopBar />
        <div className="pt-20 pb-24 p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/4 mt-1"></div>
                  </div>
                </div>
                <div className="h-20 bg-neutral-200 rounded mb-3"></div>
                <div className="h-3 bg-neutral-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav activeTab="home" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopBar />
      
      <div className="pt-20 pb-24 p-4 max-w-md mx-auto">
        {/* Create Post Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowPostModal(true)}
            className="w-full flex items-center justify-center space-x-2 h-12"
          >
            <i className="fas fa-plus"></i>
            <span>Share a post for expert feedback</span>
          </Button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-image text-neutral-400 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No posts yet</h3>
              <p className="text-neutral-600 mb-4">Be the first to share a post and get expert feedback!</p>
              <Button onClick={() => setShowPostModal(true)}>
                Create Your First Post
              </Button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>

      <BottomNav activeTab="home" />

      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          onSubmit={(data) => createPostMutation.mutate(data)}
          isLoading={createPostMutation.isPending}
          expertiseOptions={EXPERTISE_OPTIONS}
        />
      )}
    </div>
  );
}