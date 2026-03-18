export default function PerformanceDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* 1️⃣ Workspace Execution Status */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">
              Workspace Execution Status
            </h2>
            <p className="text-red-600 font-medium mt-1">⚠ At Risk</p>
          </div>
          <div className="text-3xl font-bold text-red-600">38%</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <p className="text-gray-500">Completion Rate</p>
            <p className="font-semibold">1.6% (1 / 62)</p>
          </div>
          <div>
            <p className="text-gray-500">Overdue Ratio</p>
            <p className="font-semibold text-red-600">26% (16)</p>
          </div>
          <div>
            <p className="text-gray-500">Unassigned Ratio</p>
            <p className="font-semibold text-orange-600">88% (55)</p>
          </div>
          <div>
            <p className="text-gray-500">Active Members</p>
            <p className="font-semibold">1</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm">
            Fix Bottlenecks
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-xl text-sm">
            View Critical Tasks
          </button>
        </div>
      </div>

      {/* 2️⃣ Bottlenecks + Momentum */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Execution Bottlenecks */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Execution Bottlenecks</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between text-red-600 font-medium">
              <span>16 Overdue Tasks</span>
              <span>→</span>
            </li>
            <li className="flex justify-between text-orange-600 font-medium">
              <span>55 Unassigned Tasks</span>
              <span>→</span>
            </li>
            <li className="flex justify-between text-yellow-600 font-medium">
              <span>5 High Priority Due Soon</span>
              <span>→</span>
            </li>
            <li className="flex justify-between text-blue-600 font-medium">
              <span>0 Tasks Completed This Week</span>
              <span>→</span>
            </li>
          </ul>
        </div>

        {/* Execution Momentum */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Execution Momentum</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Tasks Completed</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between">
              <span>Tasks Created</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between">
              <span>Net Backlog Growth</span>
              <span className="font-semibold text-orange-600">+7</span>
            </div>
            <div className="flex justify-between">
              <span>% Change from Last Week</span>
              <span className="font-semibold">0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3️⃣ Workload + Projects */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Workload Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Team Load</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>John</span>
              <span className="font-semibold">24 tasks</span>
            </li>
            <li className="flex justify-between">
              <span>Mary</span>
              <span className="font-semibold">6 tasks</span>
            </li>
            <li className="flex justify-between text-orange-600 font-medium">
              <span>Unassigned</span>
              <span>55 tasks</span>
            </li>
          </ul>
          <button className="mt-4 text-sm text-blue-600">
            Reassign Tasks →
          </button>
        </div>

        {/* Projects Snapshot */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Projects Snapshot</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>In Progress</span>
              <span className="font-semibold">17</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Overdue</span>
              <span className="font-semibold">2</span>
            </div>
            <div className="flex justify-between">
              <span>On Hold</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Completion</span>
              <span className="font-semibold">12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4️⃣ Priority Focus */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Critical Focus</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Testing API Integration</span>
            <span className="text-red-600">Overdue</span>
          </div>
          <div className="flex justify-between">
            <span>UI Final Review</span>
            <span className="text-orange-600">High • Feb 5</span>
          </div>
          <div className="flex justify-between">
            <span>Backend Refactor</span>
            <span className="text-yellow-600">Medium • Feb 10</span>
          </div>
        </div>
      </div>

      {/* 5️⃣ Activity */}
      <div className="bg-gray-50 rounded-2xl p-6 text-center text-sm text-gray-500 border">
        No activity recorded this week. Assign tasks or update progress to
        generate momentum.
      </div>
    </div>
  );
}
