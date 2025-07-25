import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { PostCard } from "@/components/post-card";
import { PostModal } from "@/components/post-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { PostWithDetails, User } from "@shared/schema";

export default function Home() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showPostModal, setShowPostModal] = useState(false);
  const [offset, setOffset] = useState(0);
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

  const { data: posts, isLoading: postsLoading, error } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts", { limit: 20, offset }],
    enabled: isAuthenticated,
  });

  const loadMoreMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts?limit=20&offset=${offset + 20}`);
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
    onSuccess: (newPosts) => {
      if (newPosts.length > 0) {
        queryClient.setQueryData(["/api/posts", { limit: 20, offset }], (oldData: PostWithDetails[] | undefined) => {
          return oldData ? [...oldData, ...newPosts] : newPosts;
        });
        setOffset(prev => prev + 20);
      }
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
        description: "Failed to load more posts",
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

  // Check if user needs to set expertise
  if (user && !user.expertise) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center p-4">
        <Card className="w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <i className="fas fa-user-graduate text-primary text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Welcome to ExpertVoice!</h2>
              <p className="text-neutral-600 mt-2">
                To get started, please visit your profile to set your area of expertise.
              </p>
            </div>
            <Button 
              className="w-full"
              onClick={() => window.location.href = '/profile'}
            >
              Set Up Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      <TopBar />
      
      <main className="pb-20">
        {/* User Profile Section */}
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-center space-x-3">
            <img 
              src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName + ' ' + user?.lastName || 'User')}&background=6366f1&color=ffffff`}
              alt="User profile" 
              className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200"
            />
            <div className="flex-1">
              <h2 className="font-medium text-neutral-900">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email?.split('@')[0] || 'Expert User'}
              </h2>
              {user?.expertise && (
                <div className="expertise-badge text-white text-xs px-2 py-1 rounded-full inline-block mt-1">
                  <i className="fas fa-code mr-1"></i>
                  <span>{user.expertise}</span>
                </div>
              )}
            </div>
            <button 
              className="text-neutral-400"
              onClick={() => window.location.href = '/profile'}
            >
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-0">
          {postsLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-neutral-600">Failed to load posts. Please try again.</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              
              <div className="p-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => loadMoreMutation.mutate()}
                  disabled={loadMoreMutation.isPending}
                >
                  {loadMoreMutation.isPending ? "Loading..." : "Load more posts"}
                </Button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-comments text-neutral-400 text-xl"></i>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">No posts yet</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Be the first to share a post and get expert feedback!
              </p>
              <Button onClick={() => setShowPostModal(true)}>
                Share Your First Post
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg floating-action flex items-center justify-center z-40"
        onClick={() => setShowPostModal(true)}
      >
        <i className="fas fa-plus text-lg"></i>
      </button>

      <BottNav activeTab="home" />
      
      {showPostModal && (
        <PostModal 
          onClose={() => setShowPostModal(false)}
          onSuccess={() => {
            setShowPostModal(false);
            queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
          }}
        />
      )}
    </div>
  );
}
