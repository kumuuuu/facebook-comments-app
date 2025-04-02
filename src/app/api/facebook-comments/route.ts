import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mclId = searchParams.get("mclId");
  const accessToken =
    "EAAViWwHTZB0QBO4sIE3ZBdIm8n7Jjz2pUZCEFYMAWg0mliP6z0N4G5xkCKIlDgyCq4zSlmYBVK7kStZAVZAK1fsjxDb0NWAcVKP5vG9ZBoA7RJN2Q3BiLiR1U2IuPUfC6sIzBRHzsbEYaWs8VrGzW5aFDpekxLZAjQZCE4bzQHwkvbOjWW4oKJSTvVI9rxDCUexEJboelNyYogEr6GBa3LqcjOaA2pMTKJk6";
  console.log("Access Token:", accessToken);

  if (!mclId) {
    return NextResponse.json({ error: "MCL ID is required" }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is missing" },
      { status: 401 }
    );
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
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error making API request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
