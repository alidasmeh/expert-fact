import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EXPERTISE_CATEGORIES, type PostWithDetails } from "@shared/schema";

export default function Explore() {
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts", { expertise: selectedExpertise }],
  });

  const { data: allCategories } = useQuery<string[]>({
    queryKey: ["/api/expertise"],
  });

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      <TopBar />
      
      <main className="pb-20">
        {/* Expertise Filter */}
        <div className="p-4 border-b border-neutral-100">
          <h2 className="font-medium text-neutral-900 mb-3">Explore by Expertise</h2>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedExpertise === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedExpertise(null)}
            >
              All Posts
            </Badge>
            {EXPERTISE_CATEGORIES.map((category) => (
              <Badge 
                key={category}
                variant={selectedExpertise === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedExpertise(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-0">
          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-search text-neutral-400 text-xl"></i>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">
                {selectedExpertise ? `No ${selectedExpertise} posts` : "No posts found"}
              </h3>
              <p className="text-neutral-600 text-sm">
                {selectedExpertise 
                  ? `Try selecting a different expertise or check back later.`
                  : "Be the first to share a post in this category!"
                }
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav activeTab="explore" />
    </div>
  );
}
