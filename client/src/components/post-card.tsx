import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { PostWithDetails } from "@shared/schema";

interface PostCardProps {
  post: PostWithDetails;
}

export function PostCard({ post }: PostCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAllComments, setShowAllComments] = useState(false);

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/likes/toggle", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
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
        description: "Failed to toggle like",
        variant: "destructive",
      });
    },
  });

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return postDate.toLocaleDateString();
  };

  const getSocialPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'fab fa-instagram';
      case 'twitter':
      case 'x':
        return 'fab fa-x-twitter';
      default:
        return 'fas fa-link';
    }
  };

  const getSocialPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      case 'twitter':
      case 'x':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <article className="bg-white border-b border-neutral-100 post-card">
      {/* Post Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img 
              src={post.author.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.firstName + ' ' + post.author.lastName || 'User')}&background=6366f1&color=ffffff`}
              alt="Post author" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-sm text-neutral-900">
                {post.author.firstName && post.author.lastName 
                  ? `${post.author.firstName} ${post.author.lastName}` 
                  : post.author.email?.split('@')[0] || 'User'}
              </h3>
              <p className="text-xs text-neutral-500">{formatTimeAgo(post.createdAt!)}</p>
            </div>
          </div>
          <button className="text-neutral-400">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>
        
        {/* Seeking expertise badge */}
        <div className="mb-3">
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            <i className="fas fa-search mr-1"></i>
            Seeking expertise: <span className="font-medium ml-1">{post.seekingExpertise}</span>
          </Badge>
        </div>
        
        {/* Post content */}
        <p className="text-neutral-700 text-sm mb-3">{post.content}</p>
      </div>
      
      {/* Social Media Preview */}
      <div className="px-4 pb-2">
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
          <div className={`aspect-video bg-gradient-to-br ${getSocialPlatformColor(post.socialMediaPlatform)} relative`}>
            {post.socialMediaPreview?.image ? (
              <img 
                src={post.socialMediaPreview.image as string}
                alt="Social media preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className={`${getSocialPlatformIcon(post.socialMediaPlatform)} text-white text-4xl`}></i>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              <i className={`${getSocialPlatformIcon(post.socialMediaPlatform)} mr-1`}></i>
              {post.socialMediaPlatform.charAt(0).toUpperCase() + post.socialMediaPlatform.slice(1)}
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm text-neutral-700 line-clamp-2">
              {post.socialMediaPreview?.description || "Check out this post for expert feedback"}
            </p>
            <p className="text-xs text-neutral-500 mt-1 truncate">{post.socialMediaUrl}</p>
          </div>
        </div>
      </div>
      
      {/* Engagement Actions */}
      <div className="px-4 py-2 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className={`flex items-center space-x-1 touch-manipulation hover-effect ${
                post.isLiked ? 'text-red-500' : 'text-neutral-600'
              }`}
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <i className={post.isLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
              <span className="text-sm">{post.likesCount}</span>
            </button>
            <button 
              className="flex items-center space-x-1 text-neutral-600 touch-manipulation hover-effect"
              onClick={() => setShowAllComments(!showAllComments)}
            >
              <i className="far fa-comment"></i>
              <span className="text-sm">{post.commentsCount}</span>
            </button>
            <button className="flex items-center space-x-1 text-neutral-600 touch-manipulation hover-effect">
              <i className="far fa-share"></i>
            </button>
          </div>
          <div className="text-xs text-neutral-500">
            <span>{post.expertCommentsCount}</span> expert replies
          </div>
        </div>
      </div>
      
      {/* Expert Comments Preview */}
      {post.comments && post.comments.length > 0 && (
        <div className="px-4 pb-4">
          {(showAllComments ? post.comments : post.comments.slice(0, 2)).map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3 mt-3">
              <img 
                src={comment.author.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.firstName + ' ' + comment.author.lastName || 'User')}&background=6366f1&color=ffffff&size=32`}
                alt="Expert commenter" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-neutral-900">
                    {comment.author.firstName && comment.author.lastName 
                      ? `${comment.author.firstName} ${comment.author.lastName}` 
                      : comment.author.email?.split('@')[0] || 'User'}
                  </span>
                  {comment.author.expertise && (
                    <Badge className="expertise-badge text-white text-xs px-2 py-0.5 rounded-full">
                      {comment.author.expertise}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-neutral-700">{comment.content}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <button className="text-xs text-neutral-500 touch-manipulation">Like</button>
                  <button className="text-xs text-neutral-500 touch-manipulation">Reply</button>
                  <span className="text-xs text-neutral-400">{formatTimeAgo(comment.createdAt!)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {post.comments.length > 2 && !showAllComments && (
            <button 
              className="text-sm text-primary mt-2 touch-manipulation"
              onClick={() => setShowAllComments(true)}
            >
              View all comments
            </button>
          )}
        </div>
      )}
    </article>
  );
}
