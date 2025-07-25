import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

export function PostCard({ post }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const isLiked = post.likes?.some(like => like.userId === user?.id);

  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/posts/${post.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update like",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content) => {
      return apiRequest(`/api/posts/${post.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment.trim());
  };

  const extractSocialUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    return urls?.[0];
  };

  const socialUrl = extractSocialUrl(post.content || "");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
            {post.user?.profileImageUrl ? (
              <img 
                src={post.user.profileImageUrl} 
                alt={`${post.user.firstName} ${post.user.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <i className="fas fa-user text-neutral-400"></i>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-neutral-900">
              {post.user?.firstName} {post.user?.lastName}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              <span>
                {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                Seeking: {post.seekingExpertise}
              </Badge>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-neutral-700 mb-3 leading-relaxed">{post.content}</p>

        {/* Social Media Link Preview */}
        {socialUrl && (
          <div className="border border-neutral-200 rounded-lg p-3 mb-3 bg-neutral-50">
            <div className="flex items-center space-x-2 mb-2">
              <i className={`fab fa-${
                socialUrl.includes('instagram') ? 'instagram' : 
                socialUrl.includes('x.com') || socialUrl.includes('twitter') ? 'twitter' : 
                'link'
              } text-sm`}></i>
              <span className="text-sm font-medium text-neutral-700">
                {socialUrl.includes('instagram') ? 'Instagram Post' : 
                 socialUrl.includes('x.com') || socialUrl.includes('twitter') ? 'X.com Post' : 
                 'Social Media Post'}
              </span>
            </div>
            <a 
              href={socialUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline break-all"
            >
              {socialUrl}
            </a>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className={`flex items-center space-x-1 text-sm transition-colors touch-manipulation ${
                isLiked 
                  ? "text-red-500" 
                  : "text-neutral-500 hover:text-red-500"
              }`}
            >
              <i className={`fas fa-heart ${isLiked ? 'text-red-500' : ''}`}></i>
              <span>{post.likeCount || 0}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-sm text-neutral-500 hover:text-primary transition-colors touch-manipulation"
            >
              <i className="fas fa-comment"></i>
              <span>{post.commentCount || 0}</span>
            </button>
          </div>
          
          <button className="text-sm text-neutral-500 hover:text-primary transition-colors touch-manipulation">
            <i className="fas fa-share"></i>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-neutral-100">
          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 && (
            <div className="px-4 py-3 space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    {comment.user?.profileImageUrl ? (
                      <img 
                        src={comment.user.profileImageUrl} 
                        alt={`${comment.user.firstName} ${comment.user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="fas fa-user text-neutral-400 text-xs"></i>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="bg-neutral-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-neutral-900">
                          {comment.user?.firstName} {comment.user?.lastName}
                        </span>
                        {comment.user?.expertise && (
                          <Badge variant="secondary" className="text-xs">
                            {comment.user.expertise}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-neutral-500">
                      <span>
                        {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                      <button className="hover:text-primary">Like</button>
                      <button className="hover:text-primary">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="px-4 py-3 border-t border-neutral-100">
            <form onSubmit={handleAddComment} className="flex space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center flex-shrink-0">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-neutral-400 text-xs"></i>
                )}
              </div>
              
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || commentMutation.isPending}
                  className="rounded-full px-4"
                >
                  {commentMutation.isPending ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <i className="fas fa-paper-plane text-xs"></i>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}