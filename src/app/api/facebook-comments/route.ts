import { NextResponse } from "next/server";

const PAGE_ACCESS_TOKEN =
  "EAAViWwHTZB0QBOwpRt7cFYAm0saZAvPn1BclyaYOshj6kHcrxpN1LkU6ervZCcPvifZBX5BE0GOBf1QB8VvGCR4riMlKXmyy6lx6F8HotCyeH2ZB6wI8Aku1FP753EgyZCZCeiIZAa0ZA9hiaCsy2a1XmyMuDACECOxRUUrop3ztBBK9Tlat0lfHAEZCjWGiMhZA5dCdGt8W1oit7Vihkkme6bFtds3bqkDuIJO";

const ACCESS_TOKEN =
  "EAAViWwHTZB0QBOx1XS3xraVRumEtinTikOjOWa945lnZB4eeGzIUZACTJT89kWArO3KxwgywS7LMNoWZAJ6JpcskJXw2uVA2NV68ZCFUj9leLtP8mZAjbLfJVl5FdEuVRyY5F9ogTNEftSQVZAbOR8dq14PI2XUJhZAuTKZANXrprSXTPK6MX1rStlmaaGAOnIZBEYCin76PV9UolkdACA1r9lzvnOc4y1JqIUh04ZD";

// Fetch profile information
async function fetchProfileInfo() {
  console.log("Starting fetchProfileInfo...");
  const apiUrl = `https://graph.facebook.com/v22.0/me/accounts?fields=name&type=page&access_token=${ACCESS_TOKEN}`;
  console.log("API URL for profile info:", apiUrl);

  const response = await fetch(apiUrl, { method: "GET" });
  console.log("Response status for profile info:", response.status);

  if (!response.ok) {
    console.error("Failed to fetch profile information");
    throw new Error("Failed to fetch profile information");
  }

  const profileData = await response.json();
  console.log("Fetched Profile Data:", profileData);

  return profileData;
}

// Fetch feed for a specific page
async function fetchPageFeed(pageId: string) {
  console.log(`Starting fetchPageFeed for page ID: ${pageId}...`);
  const apiUrl = `https://graph.facebook.com/v22.0/${pageId}/feed?access_token=${PAGE_ACCESS_TOKEN}`;
  console.log("API URL for page feed:", apiUrl);

  const response = await fetch(apiUrl, { method: "GET" });
  console.log(
    `Response status for page feed (Page ID: ${pageId}):`,
    response.status
  );

  if (!response.ok) {
    console.error(`Failed to fetch feed for page ID: ${pageId}`);
    throw new Error(`Failed to fetch feed for page ID: ${pageId}`);
  }

  const feedData = await response.json();
  console.log(`Fetched Feed Data for Page ID ${pageId}:`, feedData);

  return feedData;
}

async function fetchAllComments(postId: string) {
  let url = `https://graph.facebook.com/v22.0/${postId}/comments?access_token=${PAGE_ACCESS_TOKEN}`;
  let allComments: any[] = [];

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch comments for post ${postId}`);
      break;
    }
    const data = await res.json();
    allComments.push(...(data.data || []));
    url = data.paging?.next ?? null;
  }

  return allComments;
}

// Main route handler
export async function GET(request: Request) {
  console.log("Received GET request...");
  try {
    console.log("Fetching profile information...");
    const profileInfo = await fetchProfileInfo();
    console.log("Profile information fetched successfully:", profileInfo);

    const firstPageId = profileInfo.data?.[0]?.id;
    console.log("Extracted first page ID:", firstPageId);

    if (!firstPageId) {
      console.error("No page ID found in profile information");
      throw new Error("No page ID found in profile information");
    }

    console.log("Fetching feed for the first page...");
    const pageFeed = await fetchPageFeed(firstPageId);
    console.log("Page feed fetched successfully");

    const posts = pageFeed.data || [];
    const postComments: Record<string, any[]> = {};

    for (const post of posts) {
      const fullPostId = post.id;
      console.log(`Fetching comments for post ID: ${fullPostId}`);
      const comments = await fetchAllComments(fullPostId);
      postComments[fullPostId] = comments;
    }

    console.log("Returning combined response...");
    return NextResponse.json({
      profileInfo,
      pageFeed,
      commentsByPost: postComments,
    });
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
