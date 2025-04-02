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

export default function Home() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mclId, setMclId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Facebook Comments Fetcher</h1>
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
          <h2>Comments ({comments.length})</h2>
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
  );
}
