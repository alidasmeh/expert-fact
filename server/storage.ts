import {
  users,
  posts,
  comments,
  likes,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type PostWithDetails,
  type CommentWithAuthor,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, isNull } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Post operations
  createPost(authorId: string, post: InsertPost): Promise<Post>;
  getPosts(limit?: number, offset?: number): Promise<PostWithDetails[]>;
  getPost(id: string, userId?: string): Promise<PostWithDetails | undefined>;
  getPostsByExpertise(expertise: string, limit?: number, offset?: number): Promise<PostWithDetails[]>;
  getPostsByUser(userId: string, limit?: number, offset?: number): Promise<PostWithDetails[]>;
  
  // Comment operations
  createComment(authorId: string, comment: InsertComment): Promise<Comment>;
  getCommentsByPost(postId: string, userId?: string): Promise<CommentWithAuthor[]>;
  
  // Like operations
  toggleLike(userId: string, postId?: string, commentId?: string): Promise<boolean>;
  
  // Update user expertise (for onboarding)
  updateUserExpertise(userId: string, expertise: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createPost(authorId: string, postData: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values({
        ...postData,
        authorId,
      })
      .returning();
    return post;
  }

  async getPosts(limit: number = 20, offset: number = 0): Promise<PostWithDetails[]> {
    const results = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postsWithDetails: PostWithDetails[] = [];
    
    for (const result of results) {
      if (!result.post || !result.author) continue;
      
      const postComments = await this.getCommentsByPost(result.post.id);
      const expertCommentsCount = postComments.filter(
        comment => comment.author.expertise === result.post.seekingExpertise
      ).length;
      
      postsWithDetails.push({
        ...result.post,
        author: result.author,
        comments: postComments.slice(0, 2), // Only first 2 comments for feed
        isLiked: false, // Will be updated if userId is provided
        expertCommentsCount,
      });
    }
    
    return postsWithDetails;
  }

  async getPost(id: string, userId?: string): Promise<PostWithDetails | undefined> {
    const [result] = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id));

    if (!result.post || !result.author) return undefined;

    const postComments = await this.getCommentsByPost(id, userId);
    const expertCommentsCount = postComments.filter(
      comment => comment.author.expertise === result.post.seekingExpertise
    ).length;

    let isLiked = false;
    if (userId) {
      const [like] = await db
        .select()
        .from(likes)
        .where(and(eq(likes.userId, userId), eq(likes.postId, id)));
      isLiked = !!like;
    }

    return {
      ...result.post,
      author: result.author,
      comments: postComments,
      isLiked,
      expertCommentsCount,
    };
  }

  async getPostsByExpertise(expertise: string, limit: number = 20, offset: number = 0): Promise<PostWithDetails[]> {
    const results = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.seekingExpertise, expertise))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postsWithDetails: PostWithDetails[] = [];
    
    for (const result of results) {
      if (!result.post || !result.author) continue;
      
      const postComments = await this.getCommentsByPost(result.post.id);
      const expertCommentsCount = postComments.filter(
        comment => comment.author.expertise === result.post.seekingExpertise
      ).length;
      
      postsWithDetails.push({
        ...result.post,
        author: result.author,
        comments: postComments.slice(0, 2),
        isLiked: false,
        expertCommentsCount,
      });
    }
    
    return postsWithDetails;
  }

  async getPostsByUser(userId: string, limit: number = 20, offset: number = 0): Promise<PostWithDetails[]> {
    const results = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.authorId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postsWithDetails: PostWithDetails[] = [];
    
    for (const result of results) {
      if (!result.post || !result.author) continue;
      
      const postComments = await this.getCommentsByPost(result.post.id, userId);
      const expertCommentsCount = postComments.filter(
        comment => comment.author.expertise === result.post.seekingExpertise
      ).length;
      
      postsWithDetails.push({
        ...result.post,
        author: result.author,
        comments: postComments.slice(0, 2),
        isLiked: false,
        expertCommentsCount,
      });
    }
    
    return postsWithDetails;
  }

  async createComment(authorId: string, commentData: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values({
        ...commentData,
        authorId,
      })
      .returning();

    // Update comments count
    await db
      .update(posts)
      .set({
        commentsCount: sql`${posts.commentsCount} + 1`,
      })
      .where(eq(posts.id, commentData.postId));

    return comment;
  }

  async getCommentsByPost(postId: string, userId?: string): Promise<CommentWithAuthor[]> {
    const results = await db
      .select({
        comment: comments,
        author: users,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    const commentsWithDetails: CommentWithAuthor[] = [];
    
    for (const result of results) {
      if (!result.comment || !result.author) continue;
      
      let isLiked = false;
      if (userId) {
        const [like] = await db
          .select()
          .from(likes)
          .where(and(eq(likes.userId, userId), eq(likes.commentId, result.comment.id)));
        isLiked = !!like;
      }
      
      commentsWithDetails.push({
        ...result.comment,
        author: result.author,
        isLiked,
      });
    }
    
    return commentsWithDetails;
  }

  async toggleLike(userId: string, postId?: string, commentId?: string): Promise<boolean> {
    if (!postId && !commentId) {
      throw new Error("Either postId or commentId must be provided");
    }

    const whereClause = postId
      ? and(eq(likes.userId, userId), eq(likes.postId, postId), isNull(likes.commentId))
      : and(eq(likes.userId, userId), eq(likes.commentId, commentId!), isNull(likes.postId));

    const [existingLike] = await db
      .select()
      .from(likes)
      .where(whereClause);

    if (existingLike) {
      // Remove like
      await db.delete(likes).where(eq(likes.id, existingLike.id));
      
      // Update count
      if (postId) {
        await db
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} - 1` })
          .where(eq(posts.id, postId));
      } else if (commentId) {
        await db
          .update(comments)
          .set({ likesCount: sql`${comments.likesCount} - 1` })
          .where(eq(comments.id, commentId));
      }
      
      return false;
    } else {
      // Add like
      await db.insert(likes).values({
        userId,
        postId,
        commentId,
      });
      
      // Update count
      if (postId) {
        await db
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} + 1` })
          .where(eq(posts.id, postId));
      } else if (commentId) {
        await db
          .update(comments)
          .set({ likesCount: sql`${comments.likesCount} + 1` })
          .where(eq(comments.id, commentId));
      }
      
      return true;
    }
  }

  async updateUserExpertise(userId: string, expertise: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ expertise, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
