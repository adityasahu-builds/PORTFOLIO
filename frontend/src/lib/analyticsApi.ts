import { api } from "@/lib/api";
import type {
  DashboardStats,
  VisitorsData,
  TrafficData,
  ContentStats,
  MessageStats,
  DateRange,
} from "@/types/analytics";

// ─── Build query string from date filter ─────────────────────
function buildParams(
  range: DateRange,
  startDate?: string,
  endDate?: string
): string {
  const params = new URLSearchParams({ range });
  if (range === "custom") {
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
  }
  return params.toString();
}

// ─── GET /api/v1/analytics/dashboard ─────────────────────────
export async function fetchDashboard(
  range: DateRange = "30d",
  startDate?: string,
  endDate?: string
): Promise<DashboardStats> {
  const qs = buildParams(range, startDate, endDate);
  const res = await api.get(`/analytics/dashboard?${qs}`);
  return res.data.data as DashboardStats;
}

// ─── GET /api/v1/analytics/visitors ──────────────────────────
export async function fetchVisitors(
  range: DateRange = "30d",
  page = 1,
  limit = 20,
  startDate?: string,
  endDate?: string
): Promise<VisitorsData> {
  const qs = buildParams(range, startDate, endDate);
  const res = await api.get(
    `/analytics/visitors?${qs}&page=${page}&limit=${limit}`
  );
  return res.data.data as VisitorsData;
}

// ─── GET /api/v1/analytics/traffic ───────────────────────────
export async function fetchTraffic(
  range: DateRange = "30d",
  startDate?: string,
  endDate?: string
): Promise<TrafficData> {
  const qs = buildParams(range, startDate, endDate);
  const res = await api.get(`/analytics/traffic?${qs}`);
  return res.data.data as TrafficData;
}

// ─── GET /api/v1/analytics/content ───────────────────────────
export async function fetchContent(
  range: DateRange = "30d",
  startDate?: string,
  endDate?: string
): Promise<ContentStats> {
  const qs = buildParams(range, startDate, endDate);
  const res = await api.get(`/analytics/content?${qs}`);
  return res.data.data as ContentStats;
}

// ─── GET /api/v1/analytics/messages ──────────────────────────
export async function fetchMessages(
  range: DateRange = "30d",
  startDate?: string,
  endDate?: string
): Promise<MessageStats> {
  const qs = buildParams(range, startDate, endDate);
  const res = await api.get(`/analytics/messages?${qs}`);
  return res.data.data as MessageStats;
}
