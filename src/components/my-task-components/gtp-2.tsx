import React from "react";

const MyGtTaskAnalytics = () => {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Card 1 – Needs Attention */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-red-900">Needs Attention</h3>
          <span className="text-xs text-red-700">Overdue or due today</span>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-semibold text-red-900">2</p>
          <p className="mt-1 text-sm text-red-700">tasks need attention</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-red-700">1 high priority</span>
          <button className="text-sm font-medium text-red-900 hover:underline">
            View tasks →
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <h3 className="text-sm font-medium text-green-900">Needs Attention</h3>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <p className="text-sm text-green-800">You’re clear for today</p>
        </div>
      </div>
      {/* Card 2 – Focus Now */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <p className="text-sm text-neutral-700">Nothing urgent right now</p>
        </div>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-neutral-900">Focus Now</h3>

        <div className="mt-4">
          <p className="text-2xl font-semibold text-neutral-900">2 tasks</p>
          <p className="text-sm text-neutral-600">need your attention</p>
        </div>

        {/* Task preview */}
        <ul className="mt-4 space-y-1">
          <li className="truncate text-sm text-neutral-800">
            • Finish API integration
          </li>
          <li className="truncate text-sm text-neutral-800">
            • Review payment flow
          </li>
        </ul>

        <button className="mt-4 w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          Start focus mode
        </button>
      </div>

      {/* Card 3 – Progress This Week */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h3 className="text-sm font-medium text-neutral-900">
          Progress This Week
        </h3>

        <div className="mt-4">
          <p className="text-3xl font-semibold text-neutral-900">3</p>
          <p className="mt-1 text-sm text-neutral-600">tasks completed</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-green-600">+2 vs last week</span>
          <button className="text-sm font-medium text-neutral-900 hover:underline">
            View completed →
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyGtTaskAnalytics;
