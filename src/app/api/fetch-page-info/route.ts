import { NextResponse } from "next/server";

export async function GET() {
  const accessToken =
    "EAAViWwHTZB0QBO2xmSZAACEfPwnNs04VrLnX0We1QZCpDq1SP6tWQVi2MWqwDMwNQtCIhuR2g2FrYcSRAuZAeNZCvTup1rlej4HsU3c9H7oOWLpeZChZCiv5H9XYkcFZAGNoY1ziXGdhwTvNFLvyq55ZByFzTfaFP3fQMp4o1jIHAjsCet6in19w7EDzygmxifcunRbtZAdgoZA759hk6sOS0QbxYPCzwZDZD";
  const url = `https://graph.facebook.com/v22.0/me?access_token=${accessToken}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch profile information" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching profile information" },
      { status: 500 }
    );
  }
}
