import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mclId = searchParams.get("mclId");
  const accessToken =
    "EAAViWwHTZB0QBO3ikAJvS3YOOLkm4Dxkoy9ac280PuFE2Ig0vT3rBinTtvymHZBxJGCGkHGpHa6sXl83qT7o5UTO79opFYKrCjSvk5bS7nolDxOmKAGZCOSxMWP3c51zeZCFGZBojQQi6aWcZCjRn88W6Y7mgnZAkdQjkftTLizqZCqsq1acEjf08ZCZAC4NKiw41egCUc3VRT3BD5jvkUaM1FZBSS5U5C8eZCatSQZDZD";
  console.log("Access Token:", accessToken);

  if (!mclId) {
    return NextResponse.json({ error: "MCL ID is required" }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ status: 401 });
  }

  const apiUrl = `https://graph.facebook.com/v22.0/${mclId}/comments?fields=from,message`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API request failed:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("API response data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error making API request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
