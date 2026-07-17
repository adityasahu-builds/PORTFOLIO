"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  Eye,
  UserCheck,
  BarChart3,
  Briefcase,
  Wrench,
  GraduationCap,
  Award,
  Mail,
  Download,
  Globe,
  Smartphone,
  Monitor,
  TrendingUp,
  RefreshCw,
  Activity,
  Map,
  Clock,
  Layers,
} from "lucide-react";

import StatCard from "@/components/ui/analytics/StatCard";
import FilterBar from "@/components/ui/analytics/FilterBar";
import AreaChartComponent from "@/components/ui/analytics/AreaChart";
import BarChartComponent from "@/components/ui/analytics/BarChartComponent";
import PieChartComponent from "@/components/ui/analytics/PieChartComponent";
import VisitorsTable from "@/components/ui/analytics/VisitorsTable";
import MessagesTable from "@/components/ui/analytics/MessagesTable";

import {
  fetchDashboard,
  fetchVisitors,
  fetchTraffic,
  fetchContent,
  fetchMessages,
} from "@/lib/analyticsApi";
import type { DateFilter, DateRange } from "@/types/analytics";

// ─── Chart Card Wrapper ───────────────────────────────────────
function ChartCard({
  title,
  icon: Icon,
  iconColor,
  children,
  className = "",
}: {
  title: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-500" />
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AnalyticsDashboardPage() {
  const [filter, setFilter] = useState<DateFilter>({ range: "30d" as DateRange });
  const [visitorsPage, setVisitorsPage] = useState(1);

  // Reset visitors page when filter changes
  const handleFilterChange = (newFilter: DateFilter) => {
    setFilter(newFilter);
    setVisitorsPage(1);
  };

  const queryOptions = {
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 2,
  };

  // ─── Data Queries ─────────────────────────────────────────
  const dashboardQuery = useQuery({
    queryKey: ["analytics-dashboard", filter.range, filter.startDate, filter.endDate],
    queryFn: () => fetchDashboard(filter.range, filter.startDate, filter.endDate),
    ...queryOptions,
  });

  const visitorsQuery = useQuery({
    queryKey: [
      "analytics-visitors",
      filter.range,
      filter.startDate,
      filter.endDate,
      visitorsPage,
    ],
    queryFn: () =>
      fetchVisitors(filter.range, visitorsPage, 10, filter.startDate, filter.endDate),
    ...queryOptions,
  });

  const trafficQuery = useQuery({
    queryKey: ["analytics-traffic", filter.range, filter.startDate, filter.endDate],
    queryFn: () => fetchTraffic(filter.range, filter.startDate, filter.endDate),
    ...queryOptions,
  });

  const contentQuery = useQuery({
    queryKey: ["analytics-content", filter.range, filter.startDate, filter.endDate],
    queryFn: () => fetchContent(filter.range, filter.startDate, filter.endDate),
    ...queryOptions,
  });

  const messagesQuery = useQuery({
    queryKey: ["analytics-messages", filter.range, filter.startDate, filter.endDate],
    queryFn: () => fetchMessages(filter.range, filter.startDate, filter.endDate),
    ...queryOptions,
  });

  const isAnyLoading =
    dashboardQuery.isLoading ||
    trafficQuery.isLoading ||
    contentQuery.isLoading ||
    messagesQuery.isLoading;

  const stats = dashboardQuery.data;
  const traffic = trafficQuery.data;
  const content = contentQuery.data;
  const msgs = messagesQuery.data;

  // ─── Overview stat cards config ───────────────────────────
  const overviewCards = [
    {
      label: "Visitors Today",
      value: stats?.visitorsToday ?? 0,
      icon: Users,
      color: "text-[#00d2ff]",
      bg: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20",
      glow: "shadow-cyan-500/10",
    },
    {
      label: "This Week",
      value: stats?.visitorsThisWeek ?? 0,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
      glow: "shadow-blue-500/10",
    },
    {
      label: "This Month",
      value: stats?.visitorsThisMonth ?? 0,
      icon: Activity,
      color: "text-violet-400",
      bg: "from-violet-500/10 to-violet-600/5 border-violet-500/20",
      glow: "shadow-violet-500/10",
    },
    {
      label: "Total Views",
      value: stats?.totalViews ?? 0,
      icon: Eye,
      color: "text-emerald-400",
      bg: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
      glow: "shadow-emerald-500/10",
    },
    {
      label: "Unique Visitors",
      value: stats?.uniqueVisitors ?? 0,
      icon: UserCheck,
      color: "text-teal-400",
      bg: "from-teal-500/10 to-teal-600/5 border-teal-500/20",
      glow: "shadow-teal-500/10",
    },
    {
      label: "Resume Downloads",
      value: content?.resumeDownloads ?? 0,
      icon: Download,
      color: "text-amber-400",
      bg: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
      glow: "shadow-amber-500/10",
    },
  ];

  const contentCards = [
    {
      label: "Projects",
      value: stats?.projects ?? 0,
      icon: Briefcase,
      color: "text-blue-400",
      bg: "from-blue-500/8 to-blue-600/3 border-blue-500/15",
      glow: "shadow-blue-500/5",
    },
    {
      label: "Skills",
      value: stats?.skills ?? 0,
      icon: Wrench,
      color: "text-cyan-400",
      bg: "from-cyan-500/8 to-cyan-600/3 border-cyan-500/15",
      glow: "shadow-cyan-500/5",
    },
    {
      label: "Experience",
      value: stats?.experience ?? 0,
      icon: TrendingUp,
      color: "text-violet-400",
      bg: "from-violet-500/8 to-violet-600/3 border-violet-500/15",
      glow: "shadow-violet-500/5",
    },
    {
      label: "Education",
      value: stats?.education ?? 0,
      icon: GraduationCap,
      color: "text-emerald-400",
      bg: "from-emerald-500/8 to-emerald-600/3 border-emerald-500/15",
      glow: "shadow-emerald-500/5",
    },
    {
      label: "Certificates",
      value: stats?.certificates ?? 0,
      icon: Award,
      color: "text-amber-400",
      bg: "from-amber-500/8 to-amber-600/3 border-amber-500/15",
      glow: "shadow-amber-500/5",
    },
    {
      label: "Messages",
      value: stats?.messages ?? 0,
      icon: Mail,
      color: "text-rose-400",
      bg: "from-rose-500/8 to-rose-600/3 border-rose-500/15",
      glow: "shadow-rose-500/5",
    },
  ];

  // ─── Transform data for charts ────────────────────────────
  const trendData =
    traffic?.trends.map((t) => ({ date: t.date, visitors: t.visitors })) ?? [];

  const messageTrendData =
    msgs?.trends.map((t) => ({ date: t.date, count: t.count })) ?? [];

  const topPagesData =
    content?.topPages
      .slice(0, 8)
      .map((p) => ({ name: p.path, value: p.views })) ?? [];

  const topProjectsData =
    content?.projectViews
      .slice(0, 8)
      .map((p) => ({ name: p.title || p.slug, value: p.views })) ?? [];

  const referralsData =
    traffic?.referrals
      .slice(0, 8)
      .map((r) => ({ name: r.name || "Direct", value: r.count })) ?? [];

  const activeDaysData =
    msgs?.activeDays
      .map((d) => ({ name: d.day, value: d.visitors })) ?? [];

  return (
    <div className="space-y-8" id="analytics-dashboard">
      {/* ── Page Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#00d2ff]" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time visitor insights and portfolio engagement metrics.
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {isAnyLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00d2ff]" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
          <span>{isAnyLoading ? "Loading…" : "Live · auto-refreshes every 30s"}</span>
        </div>
      </motion.div>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <FilterBar filter={filter} onChange={handleFilterChange} />
      </motion.div>

      {/* ── Visitor Overview Cards ────────────────────────────── */}
      <div>
        <div className="mb-4">
          <SectionHeader icon={Users} label="Visitor Overview" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {overviewCards.map((card, i) => (
            <StatCard
              key={card.label}
              {...card}
              isLoading={dashboardQuery.isLoading || (card.label === "Resume Downloads" && contentQuery.isLoading)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* ── Content Summary Cards ─────────────────────────────── */}
      <div>
        <div className="mb-4">
          <SectionHeader icon={Layers} label="Content Summary" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {contentCards.map((card, i) => (
            <StatCard
              key={card.label}
              {...card}
              isLoading={dashboardQuery.isLoading}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* ── Visitor Trend Chart ───────────────────────────────── */}
      <ChartCard
        title="Daily Visitors Trend"
        icon={TrendingUp}
        iconColor="text-[#00d2ff]"
      >
        <AreaChartComponent
          data={trendData}
          dataKey="visitors"
          color="#00d2ff"
          isLoading={trafficQuery.isLoading}
          height={220}
        />
      </ChartCard>

      {/* ── Device + Browser Distribution ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard
          title="Device Distribution"
          icon={Monitor}
          iconColor="text-blue-400"
        >
          <PieChartComponent
            data={traffic?.devices ?? []}
            isLoading={trafficQuery.isLoading}
            height={220}
          />
        </ChartCard>

        <ChartCard
          title="Browser Distribution"
          icon={Globe}
          iconColor="text-violet-400"
        >
          <PieChartComponent
            data={traffic?.browsers ?? []}
            isLoading={trafficQuery.isLoading}
            height={220}
          />
        </ChartCard>

        <ChartCard
          title="Country Distribution"
          icon={Map}
          iconColor="text-emerald-400"
        >
          <PieChartComponent
            data={traffic?.countries.slice(0, 8) ?? []}
            isLoading={trafficQuery.isLoading}
            height={220}
          />
        </ChartCard>
      </div>

      {/* ── Top Pages + Traffic Sources ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top Pages by Views"
          icon={Eye}
          iconColor="text-cyan-400"
        >
          <BarChartComponent
            data={topPagesData}
            isLoading={contentQuery.isLoading}
            height={220}
          />
        </ChartCard>

        <ChartCard
          title="Traffic Sources"
          icon={Activity}
          iconColor="text-amber-400"
        >
          <BarChartComponent
            data={referralsData}
            isLoading={trafficQuery.isLoading}
            height={220}
          />
        </ChartCard>
      </div>

      {/* ── Most Viewed Projects + Most Active Days ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Most Viewed Projects"
          icon={Briefcase}
          iconColor="text-blue-400"
        >
          {topProjectsData.length > 0 ? (
            <BarChartComponent
              data={topProjectsData}
              isLoading={contentQuery.isLoading}
              height={220}
            />
          ) : (
            <div className="py-8 text-center">
              <Briefcase className="w-7 h-7 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-600 text-xs">No project views in this period</p>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Most Active Days"
          icon={Clock}
          iconColor="text-rose-400"
        >
          <BarChartComponent
            data={activeDaysData}
            isLoading={messagesQuery.isLoading}
            height={220}
          />
        </ChartCard>
      </div>

      {/* ── Contact Messages Trend ────────────────────────────── */}
      <ChartCard
        title="Contact Messages Trend"
        icon={Mail}
        iconColor="text-rose-400"
      >
        <AreaChartComponent
          data={messageTrendData}
          dataKey="count"
          color="#f87171"
          isLoading={messagesQuery.isLoading}
          height={180}
        />
      </ChartCard>

      {/* ── Recent Visitors + Recent Messages Tables ───────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Visitors Table — wide */}
        <div className="xl:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-[#00d2ff]" />
            <h3 className="text-sm font-semibold text-white">Recent Visitors</h3>
            {visitorsQuery.data?.pagination && (
              <span className="ml-auto text-[10px] text-slate-600">
                {visitorsQuery.data.pagination.total} total
              </span>
            )}
          </div>
          <VisitorsTable
            data={visitorsQuery.data}
            isLoading={visitorsQuery.isLoading}
            page={visitorsPage}
            onPageChange={setVisitorsPage}
          />
        </div>

        {/* Messages Table */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">Recent Messages</h3>
          </div>
          <MessagesTable
            messages={msgs?.recent}
            trends={msgs?.trends}
            isLoading={messagesQuery.isLoading}
          />
        </div>
      </div>

      {/* ── Top Projects Table + Social Clicks ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects Table */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Top Projects</h3>
          </div>
          {contentQuery.isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-8 rounded-lg bg-white/[0.03]" />
              ))}
            </div>
          ) : content?.projectViews.length === 0 ? (
            <div className="py-8 text-center">
              <Briefcase className="w-7 h-7 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-600 text-xs">No project views tracked yet</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left text-[10px] uppercase tracking-widest text-slate-600 pb-2 font-semibold">
                    Project
                  </th>
                  <th className="text-right text-[10px] uppercase tracking-widest text-slate-600 pb-2 font-semibold">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {content?.projectViews.slice(0, 8).map((p, i) => (
                  <tr key={p.slug} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-700 w-4 text-right">
                          {i + 1}
                        </span>
                        <span className="text-slate-300 font-medium truncate max-w-[180px]">
                          {p.title || p.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold">
                        {p.views}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Social + CTA Clicks */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Latest Activity</h3>
          </div>

          {/* Social clicks */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-2 font-semibold">
              Social Clicks
            </p>
            {contentQuery.isLoading ? (
              <div className="space-y-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse h-7 rounded-lg bg-white/[0.03]" />
                ))}
              </div>
            ) : content?.socialClicks.length === 0 ? (
              <p className="text-slate-700 text-xs">No social clicks tracked</p>
            ) : (
              <div className="space-y-1">
                {content?.socialClicks.slice(0, 5).map((sc) => (
                  <div
                    key={sc.platform}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-slate-400 text-xs capitalize">
                      {sc.platform || "Unknown"}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {sc.clicks} clicks
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA clicks */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-2 font-semibold">
              CTA Button Clicks
            </p>
            {contentQuery.isLoading ? (
              <div className="space-y-1.5">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse h-7 rounded-lg bg-white/[0.03]" />
                ))}
              </div>
            ) : content?.ctaClicks.length === 0 ? (
              <p className="text-slate-700 text-xs">No CTA clicks tracked</p>
            ) : (
              <div className="space-y-1">
                {content?.ctaClicks.slice(0, 5).map((cc) => (
                  <div
                    key={cc.label}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-slate-400 text-xs">{cc.label || "Unknown"}</span>
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {cc.clicks} clicks
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
