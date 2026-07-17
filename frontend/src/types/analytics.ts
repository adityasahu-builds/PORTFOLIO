// ============================================================
// ANALYTICS — TypeScript Interfaces
// ============================================================

// ─── Dashboard Overview ──────────────────────────────────────
export interface DashboardStats {
  visitorsToday: number;
  visitorsThisWeek: number;
  visitorsThisMonth: number;
  totalViews: number;
  uniqueVisitors: number;
  projects: number;
  skills: number;
  experience: number;
  education: number;
  certificates: number;
  messages: number;
}

// ─── Visitor Session ─────────────────────────────────────────
export interface VisitorSession {
  _id: string;
  sessionId: string;
  ipHash: string;
  country: string;
  city: string;
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  browser: string;
  os: string;
  screenSize: string;
  referralSource: string;
  landingPage: string;
  visitTime: string;
  lastActiveTime: string;
  sessionDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface VisitorsData {
  visitors: VisitorSession[];
  pagination: VisitorPagination;
}

// ─── Traffic Trends ──────────────────────────────────────────
export interface DailyTrend {
  date: string;
  visitors: number;
}

export interface DistributionItem {
  name: string;
  count: number;
}

export interface TrafficData {
  trends: DailyTrend[];
  browsers: DistributionItem[];
  devices: DistributionItem[];
  countries: DistributionItem[];
  referrals: DistributionItem[];
}

// ─── Content Stats ───────────────────────────────────────────
export interface PageViewItem {
  path: string;
  views: number;
}

export interface ProjectViewItem {
  slug: string;
  title: string;
  views: number;
}

export interface SocialClickItem {
  platform: string;
  clicks: number;
}

export interface CtaClickItem {
  label: string;
  clicks: number;
}

export interface ContentStats {
  topPages: PageViewItem[];
  projectViews: ProjectViewItem[];
  socialClicks: SocialClickItem[];
  ctaClicks: CtaClickItem[];
  resumeDownloads: number;
}

// ─── Message Stats ───────────────────────────────────────────
export interface MessageTrend {
  date: string;
  count: number;
}

export interface RecentMessage {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ActiveDay {
  day: string;
  visitors: number;
}

export interface MessageStats {
  trends: MessageTrend[];
  recent: RecentMessage[];
  activeDays: ActiveDay[];
}

// ─── API Response Wrappers ───────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ─── Date Range Filter ───────────────────────────────────────
export type DateRange = "today" | "7d" | "30d" | "90d" | "custom";

export interface DateFilter {
  range: DateRange;
  startDate?: string;
  endDate?: string;
}
