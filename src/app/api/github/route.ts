import { NextResponse } from "next/server";

export async function GET() {
  const username = "Tiyas04";
  const token = process.env.GITHUB_TOKEN;

  const authHeaders: Record<string, string> = {
    "User-Agent": "PortfolioApp",
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    // 1. Authenticated GitHub GraphQL API: fetch all-time statistics
    if (token) {
      try {
        const mainQuery = `
          query($login: String!) {
            user(login: $login) {
              followers {
                totalCount
              }
              repositories(first: 100, ownerAffiliations: [OWNER, COLLABORATOR]) {
                totalCount
                nodes {
                  primaryLanguage {
                    name
                  }
                }
              }
              contributionsCollection {
                contributionYears
              }
            }
          }
        `;

        const mainRes = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "PortfolioApp",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: mainQuery, variables: { login: username } }),
          next: { revalidate: 3600 },
        });

        if (mainRes.ok) {
          const mainData = await mainRes.json();
          const user = mainData.data?.user;

          if (user) {
            const followers = user.followers?.totalCount ?? 0;
            const public_repos = user.repositories?.totalCount ?? 34;

            // Count number of repositories per language (primary language of each repository)
            const langCounts: Record<string, number> = {};
            if (user.repositories?.nodes) {
              user.repositories.nodes.forEach((repo: any) => {
                const langName = repo.primaryLanguage?.name;
                if (langName) {
                  langCounts[langName] = (langCounts[langName] || 0) + 1;
                }
              });
            }

            const languages = Object.entries(langCounts)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5);

            // Fetch ALL contribution years for all-time totals
            const years: number[] = user.contributionsCollection?.contributionYears || [];
            let totalContributions = 0;
            let activeDays = 0;

            const yearPromises = years.map(async (year) => {
              const from = `${year}-01-01T00:00:00Z`;
              const to = `${year}-12-31T23:59:59Z`;

              const yearQuery = `
                query($login: String!, $from: DateTime!, $to: DateTime!) {
                  user(login: $login) {
                    contributionsCollection(from: $from, to: $to) {
                      contributionCalendar {
                        totalContributions
                        weeks {
                          contributionDays {
                            contributionCount
                            date
                          }
                        }
                      }
                    }
                  }
                }
              `;

              const yRes = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "User-Agent": "PortfolioApp",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: yearQuery, variables: { login: username, from, to } }),
                next: { revalidate: 3600 },
              });

              if (yRes.ok) {
                const yData = await yRes.json();
                return yData.data?.user?.contributionsCollection?.contributionCalendar;
              }
              return null;
            });

            const calendars = await Promise.all(yearPromises);
            calendars.forEach((cal) => {
              if (cal) {
                totalContributions += cal.totalContributions || 0;
                cal.weeks?.forEach((week: any) => {
                  week.contributionDays?.forEach((day: any) => {
                    if (day.contributionCount > 0) activeDays++;
                  });
                });
              }
            });

            return NextResponse.json({
              success: true,
              data: {
                followers,
                public_repos,
                languages: languages.length > 0 ? languages : [{ name: "TypeScript", value: 1 }],
                totalContributions,
                activeDays,
              },
            });
          }
        }
      } catch (gqlErr) {
        console.warn("GitHub GraphQL all-time fetch failed, falling back to REST:", gqlErr);
      }
    }

    // 2. Fallback to REST API
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: authHeaders,
      next: { revalidate: 3600 },
    });

    if (!userRes.ok) {
      throw new Error(`GitHub user API responded with ${userRes.status}`);
    }

    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: authHeaders,
      next: { revalidate: 3600 },
    });

    let languages = [{ name: "TypeScript", value: 1 }];
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      const langCounts: Record<string, number> = {};
      if (Array.isArray(reposData)) {
        reposData.forEach((repo: any) => {
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          }
        });
      }
      const sortedLangs = Object.entries(langCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      if (sortedLangs.length > 0) {
        languages = sortedLangs;
      }
    }

    let totalContributions = 524;
    let activeDays = 131;
    try {
      const contribRes = await fetch(`https://github-contributions-api.deno.dev/${username}.json`, {
        next: { revalidate: 3600 },
      });
      if (contribRes.ok) {
        const contribData = await contribRes.json();
        if (contribData.totalContributions) {
          totalContributions = contribData.totalContributions;
        }
      }
    } catch {
      // fallback
    }

    return NextResponse.json({
      success: true,
      data: {
        followers: userData.followers || 0,
        public_repos: userData.public_repos || 34,
        languages,
        totalContributions,
        activeDays,
      },
    });
  } catch (error: any) {
    console.error("Error fetching all-time GitHub stats:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch GitHub stats" },
      { status: 500 }
    );
  }
}
