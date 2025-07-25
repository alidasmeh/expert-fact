import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPostSchema, insertCommentSchema, EXPERTISE_CATEGORIES } from "@shared/schema";
import { z } from "zod";

const updateExpertiseSchema = z.object({
  expertise: z.enum(EXPERTISE_CATEGORIES),
});

const toggleLikeSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes
  app.patch('/api/users/expertise', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { expertise } = updateExpertiseSchema.parse(req.body);
      
      const user = await storage.updateUserExpertise(userId, expertise);
      res.json(user);
    } catch (error) {
      console.error("Error updating user expertise:", error);
      res.status(500).json({ message: "Failed to update expertise" });
    }
  });

  // Posts routes
  app.get('/api/posts', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
      const offset = parseInt(req.query.offset as string) || 0;
      const expertise = req.query.expertise as string;
      
      let posts;
      if (expertise) {
        posts = await storage.getPostsByExpertise(expertise, limit, offset);
      } else {
        posts = await storage.getPosts(limit, offset);
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = (req as any).user?.claims?.sub;
      
      const post = await storage.getPost(postId, userId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse(req.body);
      
      const post = await storage.createPost(userId, postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/users/:userId/posts', async (req, res) => {
    try {
      const userId = req.params.userId;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
      const offset = parseInt(req.query.offset as string) || 0;
      
      const posts = await storage.getPostsByUser(userId, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  // Comments routes
  app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = (req as any).user?.claims?.sub;
      
      const comments = await storage.getCommentsByPost(postId, userId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const commentData = insertCommentSchema.parse(req.body);
      
      const comment = await storage.createComment(userId, commentData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Likes routes
  app.post('/api/likes/toggle', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId, commentId } = toggleLikeSchema.parse(req.body);
      
      const isLiked = await storage.toggleLike(userId, postId, commentId);
      res.json({ isLiked });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Expertise categories
  app.get('/api/expertise', (req, res) => {
    res.json(EXPERTISE_CATEGORIES);
  });

  const httpServer = createServer(app);
  return httpServer;
}
