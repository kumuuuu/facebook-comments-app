import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Facebook API parameters
    const pageId = "542216298975857";
    const apiVersion = "v22.0";

    // Ideally, store this in an environment variable
    const accessToken =
      "EAAViWwHTZB0QBOxAhuzkfSPmXxRHzShS6QeEEa2ILIhZCAH3HPa2YVicxeLPNAV7O3yin7Rp19v57cuq374Svon3D8uOL8OQedsZCMhsMINrrlWbbGuvbB37gUsLhnFI6GO1mX1ESqvu2xpHVhrVk2EZC1vSfichbvO1RlKLpnntoxP5kRvcS1JSMoJQ2vprdfsEaCvDftjBiJqxlhJYlpZCKkyUZD";

    // Construct the API URL
    const apiUrl = `https://graph.facebook.com/${apiVersion}/${pageId}/feed?access_token=${accessToken}`;

    // Fetch data from Facebook Graph API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Facebook API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Return the Facebook data
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Facebook post:", error);
    return NextResponse.json(
      { error: "Failed to fetch Facebook data" },
      { status: 500 }
    );
  }
}
