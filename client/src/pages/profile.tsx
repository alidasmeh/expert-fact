import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { PostWithDetails, User, ExpertiseCategory } from "@shared/schema";
import { EXPERTISE_CATEGORIES } from "@shared/schema";

export default function Profile() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedExpertise, setSelectedExpertise] = useState<string>("");
  const [showExpertiseSelector, setShowExpertiseSelector] = useState(false);
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: userPosts, isLoading: postsLoading } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/users", user?.id, "posts"],
    enabled: !!user?.id,
  });

  const updateExpertiseMutation = useMutation({
    mutationFn: async (expertise: ExpertiseCategory) => {
      await apiRequest("PATCH", "/api/users/expertise", { expertise });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setShowExpertiseSelector(false);
      toast({
        title: "Success",
        description: "Your expertise has been updated!",
      });
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
        description: "Failed to update expertise",
        variant: "destructive",
      });
    },
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-4 space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  const handleExpertiseSubmit = () => {
    if (selectedExpertise && EXPERTISE_CATEGORIES.includes(selectedExpertise as ExpertiseCategory)) {
      updateExpertiseMutation.mutate(selectedExpertise as ExpertiseCategory);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      <TopBar />
      
      <main className="pb-20">
        {/* Profile Header */}
        <div className="p-6 border-b border-neutral-100">
          <div className="text-center space-y-4">
            <img 
              src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName + ' ' + user?.lastName || 'User')}&background=6366f1&color=ffffff&size=80`}
              alt="Profile" 
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-neutral-200"
            />
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email?.split('@')[0] || 'Expert User'}
              </h2>
              <p className="text-neutral-600 text-sm">{user?.email}</p>
            </div>
            
            {/* Expertise Section */}
            <div className="space-y-3">
              {user?.expertise ? (
                <div className="space-y-2">
                  <Badge className="expertise-badge text-white px-3 py-1">
                    <i className="fas fa-award mr-2"></i>
                    {user.expertise}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowExpertiseSelector(true)}
                  >
                    Change Expertise
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-neutral-600">Set your area of expertise to start participating</p>
                  <Button onClick={() => setShowExpertiseSelector(true)}>
                    Set Expertise
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expertise Selector Modal */}
        {showExpertiseSelector && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
            <Card className="w-full max-w-md mx-auto rounded-t-xl rounded-b-none">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Select Your Expertise</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowExpertiseSelector(false)}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
                
                <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your area of expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERTISE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowExpertiseSelector(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleExpertiseSubmit}
                    disabled={!selectedExpertise || updateExpertiseMutation.isPending}
                  >
                    {updateExpertiseMutation.isPending ? "Updating..." : "Update"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Stats */}
        <div className="p-4 border-b border-neutral-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-neutral-900">{userPosts?.length || 0}</div>
              <div className="text-sm text-neutral-600">Posts</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-neutral-900">
                {userPosts?.reduce((sum, post) => sum + post.commentsCount, 0) || 0}
              </div>
              <div className="text-sm text-neutral-600">Comments</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-neutral-900">
                {userPosts?.reduce((sum, post) => sum + post.likesCount, 0) || 0}
              </div>
              <div className="text-sm text-neutral-600">Likes</div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div>
          {postsLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : userPosts && userPosts.length > 0 ? (
            <div className="space-y-0">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-plus text-neutral-400 text-xl"></i>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">No posts yet</h3>
              <p className="text-neutral-600 text-sm">
                Share your first post to get expert feedback!
              </p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="p-4 space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/api/logout'}
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Sign Out
          </Button>
        </div>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
}
