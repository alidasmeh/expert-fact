import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
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

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedExpertise, setSelectedExpertise] = useState("");

  const { data: userPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts", "user"],
    enabled: !!user,
  });

  const updateExpertiseMutation = useMutation({
    mutationFn: async (expertise) => {
      return apiRequest("/api/user/expertise", {
        method: "PATCH",
        body: JSON.stringify({ expertise }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Your expertise has been updated!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update expertise",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <TopBar />
        <div className="pt-20 pb-24 p-4 max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-neutral-200 rounded-lg"></div>
            <div className="h-40 bg-neutral-200 rounded-lg"></div>
          </div>
        </div>
        <BottomNav activeTab="profile" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopBar />
      
      <div className="pt-20 pb-24 p-4 max-w-md mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-neutral-400 text-xl"></i>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-neutral-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-neutral-600 text-sm">{user?.email}</p>
              {user?.expertise && (
                <Badge variant="secondary" className="mt-1">
                  {user.expertise}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
            <span className="flex items-center space-x-1">
              <i className="fas fa-image text-xs"></i>
              <span>{userPosts.length} posts</span>
            </span>
            <span className="flex items-center space-x-1">
              <i className="fas fa-comment text-xs"></i>
              <span>{userPosts.reduce((acc, post) => acc + (post.commentCount || 0), 0)} comments received</span>
            </span>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = '/api/logout'}
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Sign Out
          </Button>
        </div>

        {/* Expertise Selection */}
        {!user?.expertise && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              Choose Your Expertise
            </h3>
            <p className="text-neutral-600 text-sm mb-4">
              Select your area of expertise to start commenting on relevant posts.
            </p>
            
            <div className="space-y-2 mb-4">
              {EXPERTISE_OPTIONS.map((expertise) => (
                <button
                  key={expertise}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedExpertise === expertise
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                  onClick={() => setSelectedExpertise(expertise)}
                >
                  {expertise}
                </button>
              ))}
            </div>

            <Button
              className="w-full"
              disabled={!selectedExpertise || updateExpertiseMutation.isPending}
              onClick={() => updateExpertiseMutation.mutate(selectedExpertise)}
            >
              {updateExpertiseMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                "Set Expertise"
              )}
            </Button>
          </div>
        )}

        {/* Your Posts */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Posts</h3>
          
          {postsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-image text-neutral-400"></i>
              </div>
              <p className="text-neutral-600 text-sm">You haven't shared any posts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userPosts.map((post) => (
                <div key={post.id} className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-700 mb-2">{post.content}</p>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="flex items-center space-x-2">
                      <span>{post.likeCount || 0} likes</span>
                      <span>{post.commentCount || 0} comments</span>
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {post.seekingExpertise}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  );
}