import { NextResponse } from "next/server";

const PAGE_ACCESS_TOKEN =
  "EAAViWwHTZB0QBO23MoWiiqklOyTZBSKbjgMEqUCmoQqUvFRUvkQ7OGYzymY3Got98BioUApxCoCOsyhJxNa8EnhWR89GWwSYHiS3uqLS0j81UzOYJuzWDZCh6Wee9ZC9Tkg6wXYUsxESEdCP8xeEdCZAmo1cw6V9PVWwYSi8PyS6Oa5DCSgTX66bZCHH4AI0ZAVP5RNsB4ZAdCYPnnNwSAM5rte4FlgIhn9t";

const ACCESS_TOKEN =
  "EAAViWwHTZB0QBOZCq8ZA8UtItnJAklCKPVQ1FZBW8Ef15IXZAr7xFj18Vn7ftsptTTdIKKK3WXCGUBSWhjcqP2EUGkaLa6THptJbZAU3ImR65iP4wiZA8BqHQvMzKPw6gqZCY28ZBNYk5fcoSy5YGeWtsq70fEpFHoLqazeto6pvZCobSZB1puuvDuP8XBVCEGCoKZA4zY8wsUDzW0nRUjVXdrsyUbt8aQZDZD";

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

async function fetchPageProfilePicture(pageId: string) {
  const url = `https://graph.facebook.com/v22.0/${pageId}/picture?redirect=0&width=200&height=200&access_token=${PAGE_ACCESS_TOKEN}`;
  console.log("Fetching profile picture from:", url);

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch profile picture for page ${pageId}`);
    throw new Error(`Failed to fetch profile picture for page ${pageId}`);
  }

  const data = await response.json();
  console.log("Fetched profile picture data:", data);
  return data;
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

async function fetchPageTags(pageId: string) {
  const url = `https://graph.facebook.com/v22.0/${pageId}/tagged?access_token=${PAGE_ACCESS_TOKEN}`;
  console.log("Fetching page tags from:", url);

  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    console.error(`Failed to fetch tags for page ${pageId}`);
    throw new Error(`Failed to fetch tags for page ${pageId}`);
  }

  const data = await response.json();
  console.log("Fetched page tags data:", data);
  return data;
}

// Main route handler
export async function GET(request: Request) {
  console.log("Received GET request...");
  try {
    const profileInfo = await fetchProfileInfo();
    const firstPageId = profileInfo.data?.[0]?.id;

    if (!firstPageId) {
      throw new Error("No page ID found in profile information");
    }

    const pageFeed = await fetchPageFeed(firstPageId);
    const pageProfilePic = await fetchPageProfilePicture(firstPageId);
    const pageTags = await fetchPageTags(firstPageId); // Fetch page tags

    const posts = pageFeed.data || [];
    const postComments: Record<string, any[]> = {};

    for (const post of posts) {
      const fullPostId = post.id;
      const comments = await fetchAllComments(fullPostId);
      postComments[fullPostId] = comments;
    }

    return NextResponse.json({
      profileInfo,
      pageFeed,
      commentsByPost: postComments,
      pageProfilePicture: pageProfilePic.data?.url || null,
      pageTags,
    });
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
