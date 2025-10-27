/* eslint-disable no-unused-vars */
// src/pages/admin/AdminAnalytics.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import { formatINR } from "../../utils/currency.js";
import { useRealtimeAdminUsers, useRealtimeAdminEnrollments, useRealtimeAdminPayments, useRealtimeCourses } from "../../hooks/useRealtimeFirebase.js";

const items = [
  { label: "Admin", link: "/admin" },
  { label: "Analytics", link: "/admin/analytics" },
];

// Optional lightweight cache for series pre-aggregations
const seriesCache = new Map();

const Analytics = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  if (!isAdmin) return <Navigate to="/" replace />;

  // Live data streams
  const { data: users = [], loading: usersLoading } = useRealtimeAdminUsers({ enabled: true });
  const { data: enrollments = [], loading: enrollmentsLoading } = useRealtimeAdminEnrollments({ enabled: true });
  const { data: payments = [], loading: paymentsLoading } = useRealtimeAdminPayments({ enabled: true });
  const { data: courses = [], loading: coursesLoading } = useRealtimeCourses({ publishedOnly: true });

  useEffect(() => {
    if (!usersLoading && !enrollmentsLoading && !paymentsLoading && !coursesLoading) {
      setLoading(false);
    }
  }, [usersLoading, enrollmentsLoading, paymentsLoading, coursesLoading]);

  const StatCard = ({ icon: Icon, label, value, color = "blue" }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{loading ? "..." : value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  // Helpers
  const toJsDate = (ts) => {
    if (!ts) return null;
    if (typeof ts.toDate === "function") return ts.toDate();
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  };
  const dateKey = (d) => d.toISOString().slice(0, 10);

  const rangeStart = useMemo(() => {
    const now = new Date();
    const d = new Date(now);
    if (timeRange === "7d") d.setDate(now.getDate() - 6);
    else if (timeRange === "30d") d.setDate(now.getDate() - 29);
    else if (timeRange === "90d") d.setDate(now.getDate() - 89);
    else if (timeRange === "1y") d.setFullYear(now.getFullYear() - 1);
    return d;
  }, [timeRange]);

  const rangeDays = useMemo(() => {
    const days = [];
    const start = new Date(rangeStart);
    const end = new Date();
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(dateKey(new Date(d)));
    }
    return days;
  }, [rangeStart]);

  const totals = useMemo(
    () => ({
      users: users.length,
      courses: courses.filter((c) => c && (c.isPublished ?? true)).length,
      enrollments: enrollments.length,
      revenue:
        enrollments.reduce(
          (sum, e) => sum + (Number(e.paidAmount ?? e.amount ?? 0) || 0),
          0
        ) ||
        payments.reduce((sum, p) => {
          const ok = (p.status || "").toLowerCase();
          const eligible = ok.includes("captured") || ok.includes("success");
          return eligible ? sum + (Number(p.amount ?? p.paidAmount ?? 0) || 0) : sum;
        }, 0),
    }),
    [users, courses, enrollments, payments]
  );

  const series = useMemo(() => {
    // Build a coarse cache key to avoid recomputing heavy aggregations
    const cacheKey = `${timeRange}|u${users.length}|e${enrollments.length}|p${payments.length}|d${rangeDays.length}`;
    if (seriesCache.has(cacheKey)) return seriesCache.get(cacheKey);

    const enrollMap = Object.create(null);
    const revMap = Object.create(null);
    rangeDays.forEach((k) => {
      enrollMap[k] = 0;
      revMap[k] = 0;
    });

    (enrollments || []).forEach((e) => {
      const d = toJsDate(e.enrolledAt || e.createdAt) || new Date();
      const k = dateKey(d);
      if (enrollMap[k] === undefined) return;
      enrollMap[k] += 1;
      const amt = Number(e.paidAmount ?? e.amount ?? 0) || 0;
      revMap[k] += amt;
    });

    (payments || []).forEach((p) => {
      const ok = (p.status || "").toLowerCase();
      const eligible = ok.includes("captured") || ok.includes("success");
      if (!eligible) return;
      const d = toJsDate(p.capturedAt || p.createdAt) || new Date();
      const k = dateKey(d);
      if (revMap[k] === undefined) return;
      revMap[k] += Number(p.amount ?? p.paidAmount ?? 0) || 0;
    });

    const enrollSeries = rangeDays.map((k) => ({ label: k.slice(5), value: enrollMap[k] }));
    const revenueSeries = rangeDays.map((k) => ({ label: k.slice(5), value: revMap[k] }));
    const rangeRevenueTotal = revenueSeries.reduce((s, p) => s + p.value, 0);
    const rangeEnrollTotal = enrollSeries.reduce((s, p) => s + p.value, 0);
    const newUsersTotal = (users || []).filter((u) => {
      const d = toJsDate(u.createdAt);
      return d && d >= rangeStart;
    }).length;

    const result = { enrollSeries, revenueSeries, rangeRevenueTotal, rangeEnrollTotal, newUsersTotal };

    // Maintain a tiny cache footprint
    if (seriesCache.size > 30) seriesCache.clear();
    seriesCache.set(cacheKey, result);
    return result;
  }, [rangeDays, enrollments, payments, users, rangeStart]);

  const LineChart = ({
    data,
    color = "#2563eb",
    height = 200,
    strokeWidth = 2,
    xLabel = "Date",
    yLabel = "Count",
    valueFormatter = (v) => String(v),
  }) => {
    const containerRef = useRef(null);
    const [hover, setHover] = useState(null); // { index, x, y }

    const W = Math.max(320, data.length * 24 + 40);
    const H = height;
    const maxVal = Math.max(0, ...data.map((d) => d.value));
    const max = Math.max(1, maxVal);

    const xFor = (i) => 20 + (i * (W - 40)) / Math.max(1, data.length - 1);
    const yFor = (v) => H - 20 - (v / max) * (H - 40);

    const pts = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(" ");

    const yTicks = 4;
    const yValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((i * maxVal) / yTicks));
    const xStep = Math.max(1, Math.ceil(data.length / 6));

    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = e.clientX - rect.left;
      const localX = Math.max(20, Math.min(W - 20, (px / rect.width) * W));
      const ratio = (localX - 20) / Math.max(1, W - 40);
      const idx = Math.round(ratio * Math.max(1, data.length - 1));
      const x = xFor(idx);
      const y = yFor(data[idx]?.value || 0);
      setHover({ index: idx, x, y });
    };
    const onLeave = () => setHover(null);

    return (
      <div ref={containerRef} className="relative w-full h-full">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img"
             onMouseMove={onMove} onMouseLeave={onLeave}>
          {/* Axes */}
          <line x1={20} y1={H - 20} x2={W - 20} y2={H - 20} stroke="#e5e7eb" />
          <line x1={20} y1={20} x2={20} y2={H - 20} stroke="#e5e7eb" />

          {/* Y ticks and labels */}
          {yValues.map((v, i) => {
            const y = yFor(v);
            return (
              <g key={i}>
                <line x1={20} y1={y} x2={W - 20} y2={y} stroke="#f3f4f6" />
                <text x={24} y={y - 2} fontSize="10" fill="#6b7280">
                  {valueFormatter(v)}
                </text>
              </g>
            );
          })}

          {/* X labels */}
          {data.map((d, i) =>
            i % xStep === 0 ? (
              <text key={i} x={xFor(i)} y={H - 6} fontSize="10" fill="#6b7280" textAnchor="middle">
                {d.label}
              </text>
            ) : null
          )}

          {/* Line */}
          <polyline fill="none" stroke={color} strokeWidth={strokeWidth} points={pts} />
          {data.map((d, i) => (
            <circle key={i} cx={xFor(i)} cy={yFor(d.value)} r="2" fill={color} />
          ))}

          {/* Axis labels */}
          <text x={(W) / 2} y={H} fontSize="12" fill="#374151" textAnchor="middle">{xLabel}</text>
          <text x={0} y={H / 2} fontSize="12" fill="#374151" transform={`rotate(-90 0,${H / 2})`} textAnchor="middle">
            {yLabel}
          </text>
        </svg>

        {/* Tooltip */}
        {hover && data[hover.index] && (
          <div
            className="pointer-events-none absolute bg-white text-gray-800 text-xs shadow rounded px-2 py-1 border border-gray-200"
            style={{ left: `calc(${(hover.x / W) * 100}% + 8px)`, top: Math.max(0, hover.y - 30) }}
          >
            <div className="font-medium">{data[hover.index].label}</div>
            <div>{valueFormatter(data[hover.index].value)}</div>
          </div>
        )}
      </div>
    );
  };

  const BarChart = ({
    data,
    color = "#10b981",
    height = 200,
    padding = 24,
    xLabel = "Date",
    yLabel = "Value",
    valueFormatter = (v) => String(v),
  }) => {
    const containerRef = useRef(null);
    const [hover, setHover] = useState(null); // { index, x, y }

    const count = data.length;
    const W = Math.max(320, count * 24 + padding * 2);
    const H = height;
    const maxVal = Math.max(0, ...data.map((d) => d.value));
    const max = Math.max(1, maxVal);
    const band = (W - padding * 2) / Math.max(1, count);
    const barW = Math.max(6, band - 4);

    const xFor = (i) => padding + i * band + 2;
    const hFor = (v) => (v / max) * (H - 40);
    const yFor = (v) => H - 20 - hFor(v);

    const yTicks = 4;
    const yValues = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((i * maxVal) / yTicks));
    const xStep = Math.max(1, Math.ceil(count / 6));

    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = e.clientX - rect.left;
      const localX = Math.max(padding, Math.min(W - padding, (px / rect.width) * W));
      const idx = Math.min(count - 1, Math.max(0, Math.floor((localX - padding) / band)));
      const x = xFor(idx) + barW / 2;
      const y = yFor(data[idx]?.value || 0);
      setHover({ index: idx, x, y });
    };
    const onLeave = () => setHover(null);

    return (
      <div ref={containerRef} className="relative w-full h-full">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img"
             onMouseMove={onMove} onMouseLeave={onLeave}>
          {/* Axes */}
          <line x1={padding} y1={H - 20} x2={W - padding} y2={H - 20} stroke="#e5e7eb" />
          <line x1={padding} y1={20} x2={padding} y2={H - 20} stroke="#e5e7eb" />

          {/* Y ticks and labels */}
          {yValues.map((v, i) => {
            const y = yFor(v);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={W - padding} y2={y} stroke="#f3f4f6" />
                <text x={padding + 4} y={y - 2} fontSize="10" fill="#6b7280">
                  {valueFormatter(v)}
                </text>
              </g>
            );
          })}

          {/* X labels */}
          {data.map((d, i) =>
            i % xStep === 0 ? (
              <text key={i} x={xFor(i) + barW / 2} y={H - 6} fontSize="10" fill="#6b7280" textAnchor="middle">
                {d.label}
              </text>
            ) : null
          )}

          {/* Bars */}
          {data.map((d, i) => {
            const x = xFor(i);
            const h = hFor(d.value);
            const y = H - 20 - h;
            return <rect key={i} x={x} y={y} width={barW} height={h} fill={color} rx="2" />;
          })}

          {/* Axis labels */}
          <text x={(W) / 2} y={H} fontSize="12" fill="#374151" textAnchor="middle">{xLabel}</text>
          <text x={0} y={H / 2} fontSize="12" fill="#374151" transform={`rotate(-90 0,${H / 2})`} textAnchor="middle">
            {yLabel}
          </text>
        </svg>

        {/* Tooltip */}
        {hover && data[hover.index] && (
          <div
            className="pointer-events-none absolute bg-white text-gray-800 text-xs shadow rounded px-2 py-1 border border-gray-200"
            style={{ left: `calc(${(hover.x / W) * 100}% + 8px)`, top: Math.max(0, hover.y - 30) }}
          >
            <div className="font-medium">{data[hover.index].label}</div>
            <div>{valueFormatter(data[hover.index].value)}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageContainer items={items} className="min-h-screen  bg-gray-50 py-8">
      <PageTitle title="Analytics" description="Platform performance and insights" />

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {["7d", "30d", "90d", "1y"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Stats Grid (Realtime) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Total Users" value={totals.users} color="blue" />
        <StatCard icon={BookOpen} label="Active Courses" value={totals.courses} color="green" />
        <StatCard icon={TrendingUp} label="Enrollments" value={totals.enrollments} color="purple" />
        <StatCard icon={IndianRupee} label="Revenue" value={formatINR(totals.revenue || 0)} color="emerald" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
          {loading ? (
            <div className="h-64 grid place-items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 p-2">
              {series.enrollSeries.length === 0 || series.enrollSeries.every(p => (p?.value || 0) === 0) ? (
                <div className="h-full grid place-items-center text-sm text-gray-500">
                  No data for this range
                </div>
              ) : (
                <LineChart
                  data={series.enrollSeries}
                  color="#7c3aed"
                  height={240}
                  xLabel="Date"
                  yLabel="Enrollments"
                  valueFormatter={(v) => String(v)}
                />
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
          {loading ? (
            <div className="h-64 grid place-items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 p-2">
              {series.revenueSeries.length === 0 || series.revenueSeries.every(p => (p?.value || 0) === 0) ? (
                <div className="h-full grid place-items-center text-sm text-gray-500">
                  No data for this range
                </div>
              ) : (
                <BarChart
                  data={series.revenueSeries}
                  color="#059669"
                  height={240}
                  xLabel="Date"
                  yLabel="Revenue"
                  valueFormatter={(v) => formatINR(v)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Realtime Metrics (current range) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Users} label={`New Users (${timeRange})`} value={series.newUsersTotal} color="indigo" />
        <StatCard icon={TrendingUp} label={`Enrollments (${timeRange})`} value={series.rangeEnrollTotal} color="purple" />
        <StatCard icon={IndianRupee} label={`Revenue (${timeRange})`} value={formatINR(series.rangeRevenueTotal || 0)} color="orange" />
      </div>
    </PageContainer>
  );
};

export default Analytics;
