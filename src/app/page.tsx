"use client";

import { useState } from "react";

interface Author {
  name: string;
  id: string;
}

interface Comment {
  id: string;
  message: string;
  from?: {
    name: string;
    id: string;
  };
}

interface CommentsResponse {
  data: Comment[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

interface Post {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
}

interface PostsResponse {
  data: Post[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

export default function Home() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mclId, setMclId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for posts feature
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageId, setPageId] = useState<string>("");
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!mclId) {
      alert("Please enter a valid MCL ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/facebook-comments?mclId=${mclId}`);
      const data: CommentsResponse = await response.json();

      if (response.ok) {
        setComments(data.data || []);
      } else {
        setError(data.error || "Failed to fetch comments");
        alert(data.error || "Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // New function to fetch posts
  const fetchPosts = async () => {
    if (!pageId) {
      alert("Please enter a valid Page ID");
      return;
    }

    setIsLoadingPosts(true);
    setPostsError(null);

    try {
      const response = await fetch(`/api/facebook-posts?pageId=${pageId}`);
      const data: PostsResponse = await response.json();

      if (response.ok) {
        setPosts(data.data || []);
      } else {
        setPostsError(data.error || "Failed to fetch posts");
        alert(data.error || "Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPostsError("An unexpected error occurred");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Facebook Comments Fetcher</h1>

      {/* Comments Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Fetch Comments</h2>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter MCL ID"
            value={mclId}
            onChange={(e) => setMclId(e.target.value)}
            style={{ padding: "8px", marginRight: "10px", width: "300px" }}
          />
          <button
            onClick={fetchComments}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1877F2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Loading..." : "Fetch Comments"}
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {comments.length > 0 && (
          <div>
            <h3>Comments ({comments.length})</h3>
            <div style={{ marginTop: "20px" }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    marginBottom: "15px",
                    padding: "15px",
                    backgroundColor: "#f0f2f5",
                    borderRadius: "8px",
                    color: "black",
                  }}
                >
                  {comment.from && (
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {comment.from.name}
                    </div>
                  )}
                  <div>{comment.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Posts Section - New Feature */}
      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #ddd",
          paddingTop: "20px",
        }}
      >
        <h2>Fetch Posts</h2>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter Page ID"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            style={{ padding: "8px", marginRight: "10px", width: "300px" }}
          />
          <button
            onClick={fetchPosts}
            disabled={isLoadingPosts}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4267B2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoadingPosts ? "not-allowed" : "pointer",
            }}
          >
            {isLoadingPosts ? "Loading..." : "Fetch Posts"}
          </button>
        </div>

        {postsError && <p style={{ color: "red" }}>{postsError}</p>}

        {posts.length > 0 && (
          <div>
            <h3>Posts ({posts.length})</h3>
            <div style={{ marginTop: "20px" }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    marginBottom: "15px",
                    padding: "15px",
                    backgroundColor: "#e7f3ff",
                    borderRadius: "8px",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    Post ID: {post.id}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    {new Date(post.created_time).toLocaleString()}
                  </div>
                  <div style={{ fontSize: "16px" }}>
                    {post.message || post.story || "No content"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
