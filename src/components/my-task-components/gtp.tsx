import {
  AlertTriangle,
  Target,
  Layers,
  CheckCircle,
  Activity,
  Zap,
} from "lucide-react";

// Dummy analytics data (user-centric)
const analytics = {
  overdue: 3,
  dueToday: 2,
  dueSoon: 5,
  focusTasks: [
    { id: 1, title: "Prepare investor pitch" },
    { id: 2, title: "Fix auth bug on login" },
  ],
  priority: {
    high: 6,
    medium: 9,
    low: 4,
  },
  weeklyProgress: {
    completed: 11,
    trend: +18,
  },
  completionHealth: {
    rate: 72,
    completed: 11,
    created: 15,
  },
  activity: {
    updates: 14,
    comments: 6,
  },
};

export default function MyTasksAnalytics() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <NeedsAttention />
      <FocusNow />
      <PriorityLoad />
      <WeeklyProgress />
      <CompletionHealth />
      <ActivityCard />
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {children}
    </div>
  );
}

function NeedsAttention() {
  return (
    <Card>
      <Header
        title="Needs Attention"
        icon={<AlertTriangle />}
        color="text-red-600"
      />
      <div className="mt-4 space-y-2">
        <Metric label="Overdue" value={analytics.overdue} strong />
        <Metric label="Due Today" value={analytics.dueToday} />
        <Metric label="Due in 3 Days" value={analytics.dueSoon} />
      </div>
    </Card>
  );
}

function FocusNow() {
  return (
    <Card>
      <Header title="Focus Now" icon={<Target />} color="text-indigo-600" />
      <p className="mt-2 text-3xl font-semibold">
        {analytics.focusTasks.length}
      </p>

      <ul className="mt-3 space-y-1 text-sm text-slate-600">
        {analytics.focusTasks.slice(0, 2).map((task) => (
          <li key={task.id}>• {task.title}</li>
        ))}
      </ul>

      <button className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white">
        Enter Focus Mode
      </button>
    </Card>
  );
}

function PriorityLoad() {
  const total =
    analytics.priority.high +
    analytics.priority.medium +
    analytics.priority.low;

  return (
    <Card>
      <Header title="Priority Load" icon={<Layers />} color="text-slate-700" />
      <p className="mt-2 text-3xl font-semibold text-red-600">
        {analytics.priority.high}
      </p>

      <div className="mt-4 space-y-2">
        <Metric label="Medium" value={analytics.priority.medium} />
        <Metric label="Low" value={analytics.priority.low} />
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-red-500"
          style={{ width: `${(analytics.priority.high / total) * 100}%` }}
        />
      </div>
    </Card>
  );
}

function WeeklyProgress() {
  return (
    <Card>
      <Header
        title="Weekly Progress"
        icon={<CheckCircle />}
        color="text-green-600"
      />
      <p className="mt-2 text-3xl font-semibold">
        {analytics.weeklyProgress.completed}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {analytics.weeklyProgress.trend > 0 ? "+" : ""}
        {analytics.weeklyProgress.trend}% vs last week
      </p>
    </Card>
  );
}

function CompletionHealth() {
  return (
    <Card>
      <Header
        title="Completion Health"
        icon={<Activity />}
        color="text-teal-600"
      />
      <p className="mt-2 text-3xl font-semibold">
        {analytics.completionHealth.rate}%
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {analytics.completionHealth.completed} of{" "}
        {analytics.completionHealth.created} tasks completed
      </p>
    </Card>
  );
}

function ActivityCard() {
  return (
    <Card>
      <Header title="Activity" icon={<Zap />} color="text-slate-500" />
      <div className="mt-4 space-y-2">
        <Metric label="Task Updates" value={analytics.activity.updates} />
        <Metric label="Comments" value={analytics.activity.comments} />
      </div>
    </Card>
  );
}

function Header({
  title,
  icon,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      {icon}
      <h3 className="text-sm font-medium text-slate-700">{title}</h3>
    </div>
  );
}

function Metric({
  label,
  value,
  strong,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span
        className={
          strong ? "font-semibold text-red-600" : "font-medium text-slate-700"
        }
      >
        {value}
      </span>
    </div>
  );
}
