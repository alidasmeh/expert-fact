import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";

const EXPERTISE_OPTIONS = [
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

export default function Experts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");

  const { data: experts = [], isLoading } = useQuery({
    queryKey: ["/api/experts"],
  });

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = !searchQuery || 
      expert.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.expertise?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExpertise = selectedExpertise === "All" || 
      expert.expertise === selectedExpertise;
    
    return matchesSearch && matchesExpertise;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopBar />
      
      <div className="pt-20 pb-24 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Find Experts</h1>
          <p className="text-neutral-600">Connect with verified professionals in your field</p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Input
              placeholder="Search experts..."
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
            {EXPERTISE_OPTIONS.map((expertise) => (
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

        {/* Experts Grid */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading state
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredExperts.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-friends text-neutral-400 text-xl"></i>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {searchQuery || selectedExpertise !== "All" ? "No experts found" : "No experts yet"}
              </h3>
              <p className="text-neutral-600">
                {searchQuery || selectedExpertise !== "All" 
                  ? "Try adjusting your search or filters" 
                  : "Experts will appear here as they join the platform"}
              </p>
            </div>
          ) : (
            // Experts list
            filteredExperts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                    {expert.profileImageUrl ? (
                      <img 
                        src={expert.profileImageUrl} 
                        alt={`${expert.firstName} ${expert.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="fas fa-user text-neutral-400"></i>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">
                      {expert.firstName} {expert.lastName}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {expert.expertise}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span className="flex items-center space-x-1">
                      <i className="fas fa-comment text-xs"></i>
                      <span>{expert.commentCount || 0} comments</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="fas fa-thumbs-up text-xs"></i>
                      <span>{expert.likeCount || 0} likes</span>
                    </span>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav activeTab="experts" />
    </div>
  );
}