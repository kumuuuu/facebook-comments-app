"use client";

import { useState } from "react";

export default function Home() {
  const [profileData, setProfileData] = useState<
    { name: string; id: string }[] | null
  >(null);
  const [pageFeed, setPageFeed] = useState<
    | { created_time: string; story?: string; message?: string; id: string }[]
    | null
  >(null);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, any[]>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const fetchProfileInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/facebook-comments");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch profile information");
        return;
      }

      setProfileData(data.profileInfo?.data || []);
      setPageFeed(data.pageFeed?.data || []);
      setCommentsByPost(data.commentsByPost || {});
      setError(null);
    } catch (error) {
      console.error("Error fetching profile information:", error);
      setError("An error occurred while fetching profile information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Facebook Page Feed & Comments Viewer
      </h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={fetchProfileInfo}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          {loading ? "Loading..." : "Fetch Profile Info"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      )}

      {profileData && (
        <section className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2 border-b pb-1 text-black">
            Profile Info
          </h2>
          <ul>
            {profileData.map((profile) => (
              <li key={profile.id} className="py-2 border-b text-black">
                <strong>Name:</strong> {profile.name} <br />
                <strong>ID:</strong> {profile.id}
              </li>
            ))}
          </ul>
        </section>
      )}

      {pageFeed && (
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-1">
            Page Feed
          </h2>
          <div className="grid gap-6">
            {pageFeed.map((feed) => (
              <div
                key={feed.id}
                className="bg-white shadow-sm p-4 rounded-lg border text-black"
              >
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Created:</strong>{" "}
                  {new Date(feed.created_time).toLocaleString()}
                </p>
                {feed.story && (
                  <p>
                    <strong>Story:</strong> {feed.story}
                  </p>
                )}
                {feed.message && (
                  <p>
                    <strong>Message:</strong> {feed.message}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  <strong>Post ID:</strong> {feed.id}
                </p>

                <button
                  onClick={() => toggleComments(feed.id)}
                  className="text-sm text-blue-600 mt-4 underline"
                >
                  {expandedComments[feed.id]
                    ? "Hide Comments"
                    : "Show Comments"}
                </button>

                {expandedComments[feed.id] && (
                  <div className="mt-3 border-t pt-2">
                    <h4 className="text-md font-semibold mb-2 text-gray-600">
                      Comments:
                    </h4>
                    {commentsByPost[feed.id] &&
                    commentsByPost[feed.id].length > 0 ? (
                      <ul>
                        {commentsByPost[feed.id].map((comment) => (
                          <li
                            key={comment.id}
                            className="border-b py-2 text-sm"
                          >
                            <p>
                              <strong>From:</strong>{" "}
                              {comment.from?.name || "Unknown"}
                            </p>
                            <p>
                              <strong>Message:</strong> {comment.message}
                            </p>
                            <p>
                              <strong>Time:</strong>{" "}
                              {new Date(comment.created_time).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="italic text-gray-500">No comments</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
