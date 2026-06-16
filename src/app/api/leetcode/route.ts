export async function GET() {
  const query = `
    query {
      matchedUser(username: "Tiyas04") {
        submissionCalendar  
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      "https://leetcode.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 86400 }, // cache for 1 day
      }
    );

    if (!response.ok) {
      throw new Error(`LeetCode GraphQL responded with status ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0]?.message || "GraphQL query errors returned");
    }

    const data = result.data;

    const responseData = {
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      activeDays: 0,
    };

    if (data?.matchedUser?.submitStats?.acSubmissionNum) {
      const subs = data.matchedUser.submitStats.acSubmissionNum;
      responseData.totalSolved = subs.find((s: any) => s.difficulty === "All")?.count || 0;
      responseData.easySolved = subs.find((s: any) => s.difficulty === "Easy")?.count || 0;
      responseData.mediumSolved = subs.find((s: any) => s.difficulty === "Medium")?.count || 0;
      responseData.hardSolved = subs.find((s: any) => s.difficulty === "Hard")?.count || 0;
    }

    if (data?.matchedUser?.submissionCalendar) {
      try {
        const calendar = JSON.parse(data.matchedUser.submissionCalendar);
        responseData.activeDays = Object.keys(calendar).length;
      } catch (e) {
        console.error("Failed to parse LeetCode submissionCalendar:", e);
      }
    }

    return Response.json({ success: true, data: responseData });
  } catch (error: any) {
    console.error("Error fetching LeetCode stats from GraphQL:", error);
    return Response.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}