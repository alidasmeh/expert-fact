import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { PostCard } from "@/components/post-card";

const EXPERTISE_FILTERS = [
  "All",
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

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/posts", "explore"],
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.seekingExpertise?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExpertise = selectedExpertise === "All" || 
      post.seekingExpertise === selectedExpertise;
    
    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopBar />
      
      <div className="pt-20 pb-24 p-4 max-w-md mx-auto">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm"></i>
          </div>
        </div>

        {/* Expertise Filters */}
        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
            {EXPERTISE_FILTERS.map((expertise) => (
              <Button
                key={expertise}
                variant={selectedExpertise === expertise ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedExpertise(expertise)}
              >
                {expertise}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading state
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
          ) : filteredPosts.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-neutral-400 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {searchQuery || selectedExpertise !== "All" ? "No posts found" : "No posts yet"}
              </h3>
              <p className="text-neutral-600">
                {searchQuery || selectedExpertise !== "All" 
                  ? "Try adjusting your search or filters" 
                  : "Posts from the community will appear here"}
              </p>
            </div>
          ) : (
            // Posts list
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>

      <BottomNav activeTab="explore" />
    </div>
  );
}