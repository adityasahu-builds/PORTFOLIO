/**
 * Analytics Integration Test Script
 * Tests all analytics API endpoints and tracking functionality
 */

const BASE = "http://localhost:5000/api/v1";

interface TestResult {
  test: string;
  status: "PASS" | "FAIL" | "SKIP";
  detail?: string;
}

const results: TestResult[] = [];

function pass(test: string, detail?: string) {
  results.push({ test, status: "PASS", detail });
  console.log(`  ✓ ${test}${detail ? ` — ${detail}` : ""}`);
}

function fail(test: string, detail?: string) {
  results.push({ test, status: "FAIL", detail });
  console.log(`  ✗ ${test}${detail ? ` — ${detail}` : ""}`);
}

async function runTests() {
  console.log("\n╔════════════════════════════════════════════════════╗");
  console.log("║        Analytics Integration Tests                 ║");
  console.log("╚════════════════════════════════════════════════════╝\n");

  // 1. Public Track Endpoint
  console.log("🔷 [1] Visitor Tracking (Public POST)");
  try {
    const trackRes = await fetch(`${BASE}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: `test-session-${Date.now()}`,
        eventName: "pageView",
        pagePath: "/",
        screenSize: "1920x1080",
        referralSource: "Direct",
        landingPage: "/",
        country: "India",
        city: "Bhopal",
        details: {},
      }),
    });
    const trackData = await trackRes.json();
    if (trackRes.ok && trackData.success) {
      pass("POST /analytics/track — pageView event", `session: ${trackData.data?.session?.sessionId?.slice(0, 20)}...`);
    } else {
      fail("POST /analytics/track", JSON.stringify(trackData));
    }
  } catch (e: any) {
    fail("POST /analytics/track", e.message);
  }

  // Track project view
  try {
    const sessionId = `test-project-${Date.now()}`;
    const r = await fetch(`${BASE}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventName: "projectView",
        pagePath: "/projects/test-project",
        details: { projectSlug: "test-project", projectTitle: "Test Project" },
      }),
    });
    const d = await r.json();
    if (r.ok && d.success) {
      pass("POST /analytics/track — projectView event");
    } else {
      fail("POST /analytics/track — projectView", JSON.stringify(d));
    }
  } catch (e: any) {
    fail("POST /analytics/track — projectView", e.message);
  }

  // Track resume download
  try {
    const r = await fetch(`${BASE}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: `test-resume-${Date.now()}`,
        eventName: "resumeDownload",
        pagePath: "/",
        details: {},
      }),
    });
    const d = await r.json();
    if (r.ok && d.success) {
      pass("POST /analytics/track — resumeDownload event");
    } else {
      fail("POST /analytics/track — resumeDownload", JSON.stringify(d));
    }
  } catch (e: any) {
    fail("POST /analytics/track — resumeDownload", e.message);
  }

  // 2. JWT Protection Test
  console.log("\n🔷 [2] JWT Protection (Protected GET endpoints)");
  const protectedEndpoints = [
    "/analytics/dashboard",
    "/analytics/visitors",
    "/analytics/traffic",
    "/analytics/content",
    "/analytics/messages",
  ];

  for (const ep of protectedEndpoints) {
    try {
      const r = await fetch(`${BASE}${ep}`, { method: "GET" });
      if (r.status === 401) {
        pass(`GET ${ep} — requires auth (401)`, "JWT protected ✓");
      } else {
        fail(`GET ${ep} — expected 401, got ${r.status}`);
      }
    } catch (e: any) {
      fail(`GET ${ep}`, e.message);
    }
  }

  // 3. Summary
  console.log("\n╔════════════════════════════════════════════════════╗");
  console.log("║                   Test Summary                     ║");
  console.log("╚════════════════════════════════════════════════════╝");

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log(`\n  Total: ${results.length}`);
  console.log(`  ✓ Passed: ${passed}`);
  console.log(`  ✗ Failed: ${failed}`);

  if (failed === 0) {
    console.log("\n  🎉 All tests passed!\n");
  } else {
    console.log("\n  ⚠️  Some tests failed. Review above.\n");
    process.exit(1);
  }
}

runTests().catch(console.error);
