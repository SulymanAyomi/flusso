import React from "react";
import {
  AlertCircle,
  GitPullRequest,
  CalendarDays,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// --- Types ---
type CardVariant = "urgent" | "flow" | "planning" | "velocity";

interface StatCardProps {
  variant: CardVariant;
  label: string;
  value: string | number;
  subValue: React.ReactNode;
  footerText: string;
  onClick: () => void;
}

// --- Configuration Maps ---
// This separates styling from logic, making it easy to tweak the design system later.
const STYLES = {
  urgent: {
    bg: "bg-red-50 hover:bg-red-100",
    border: "border-red-100",
    iconColor: "text-red-600",
    textColor: "text-red-900",
    icon: AlertCircle,
  },
  flow: {
    bg: "bg-violet-50 hover:bg-violet-100",
    border: "border-violet-100",
    iconColor: "text-violet-600",
    textColor: "text-violet-900",
    icon: GitPullRequest,
  },
  planning: {
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-blue-900",
    icon: CalendarDays,
  },
  velocity: {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-100",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-900",
    icon: Zap,
  },
};

const StatCard: React.FC<StatCardProps> = ({
  variant,
  label,
  value,
  subValue,
  footerText,
  onClick,
}) => {
  const style = STYLES[variant];
  const Icon = style.icon;

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-start justify-between 
        w-full p-5 text-left rounded-xl border transition-all duration-200
        ${style.bg} ${style.border}
        hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]
        group
      `}
    >
      {/* Header: Icon & Label */}
      <div className="flex items-center gap-2 mb-3 w-full">
        <div className={`p-1.5 rounded-lg bg-white/60 ${style.iconColor}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span
          className={`text-sm font-semibold uppercase tracking-wider opacity-70 ${style.textColor}`}
        >
          {label}
        </span>
      </div>

      {/* Body: Main Metric */}
      <div className="mb-4">
        <span
          className={`text-4xl font-extrabold tracking-tight ${style.textColor}`}
        >
          {value}
        </span>
      </div>

      {/* Footer: Context & Micro-copy */}
      <div className="w-full pt-3 border-t border-black/5 flex flex-col gap-0.5">
        <div className={`text-sm font-medium ${style.textColor}`}>
          {subValue}
        </div>
        <span className={`text-xs opacity-60 ${style.textColor}`}>
          {footerText}
        </span>
      </div>

      {/* Decorative absolute element for visual interest (optional) */}
      <div
        className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity ${style.iconColor}`}
      >
        <ArrowUpRight size={16} />
      </div>
    </button>
  );
};

// --- Main Container ---
const AnalyticsSection = () => {
  // Handlers for click-through actions (filtering the list below)
  const handleFilter = (filterType: string) => {
    console.log(`Applying filter: ${filterType}`);
    // Dispatch action to filter the Task List component
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6">
      {/* Section Header */}
      <div className="mb-4 flex items-end justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500">
            Real-time snapshot of your workload.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Immediate Actions */}
        <StatCard
          variant="urgent"
          label="Immediate"
          value="5"
          subValue={
            <span className="flex items-center gap-1.5">
              <span className="font-bold">2</span> Overdue •{" "}
              <span className="font-bold">3</span> Due Today
            </span>
          }
          footerText="Requires attention"
          onClick={() => handleFilter("urgent")}
        />

        {/* Card 2: Flow State */}
        <StatCard
          variant="flow"
          label="Flow State"
          value="3"
          subValue={
            <span>
              Blocking <span className="font-bold">2 teammates</span>
            </span>
          }
          footerText="Clear dependencies to proceed"
          onClick={() => handleFilter("blocked")}
        />

        {/* Card 3: The Horizon */}
        <StatCard
          variant="planning"
          label="The Horizon"
          value="12"
          subValue={
            <span>
              <span className="font-bold">4</span> High Priority
            </span>
          }
          footerText="Heavier load on Thursday"
          onClick={() => handleFilter("upcoming")}
        />

        {/* Card 4: Weekly Velocity */}
        <StatCard
          variant="velocity"
          label="Velocity"
          value="8"
          subValue={
            <span className="flex items-center gap-1 text-emerald-700">
              <ArrowUpRight size={14} />
              <span className="font-bold">15%</span> vs. avg
            </span>
          }
          footerText="Good momentum this week"
          onClick={() => handleFilter("completed")}
        />
      </div>
    </div>
  );
};

export default AnalyticsSection;
