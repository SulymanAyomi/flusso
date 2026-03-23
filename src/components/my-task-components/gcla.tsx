// import React from "react";
// import {
//   AlertCircle,
//   Calendar,
//   TrendingUp,
//   TrendingDown,
//   Minus,
//   CheckCircle2,
//   Clock,
//   BarChart3,
//   ArrowRight,
//   AlertTriangle,
// } from "lucide-react";

// // Sample data - replace with actual API calls
// const sampleData = {
//   attention: {
//     overdue: { count: 3, projects: ["Project Alpha", "Project Beta"] },
//     dueToday: { count: 5 },
//     highPriority: { count: 12, percentage: 35 },
//   },
//   workInProgress: {
//     inProgress: 4,
//     longestOpen: { days: 18, title: "Update API documentation for v2.0" },
//   },
//   momentum: {
//     completedThisWeek: { count: 7, trend: 2, direction: "up" },
//     avgCompletionTime: 3.2,
//     projectsTouched: { current: 3, total: 5 },
//   },
//   priorities: {
//     distribution: {
//       high: 35,
//       medium: 45,
//       low: 20,
//     },
//     totalTasks: 43,
//     status: "healthy", // healthy, caution, unhealthy
//   },
// };

// const MyGTasksAnalytics = ({ data = sampleData }) => {
//   return (
//     <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
//         <p className="text-gray-600 mt-1">
//           Analytics and insights to help you prioritize
//         </p>
//       </div>

//       {/* Analytics Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Card 1: What Needs Attention */}
//         <AttentionCard data={data.attention} />

//         {/* Card 2: Work in Progress */}
//         <WorkInProgressCard data={data.workInProgress} />

//         {/* Card 3: Weekly Momentum */}
//         <MomentumCard data={data.momentum} />

//         {/* Card 4: Priority Health */}
//         <PriorityHealthCard data={data.priorities} />
//       </div>
//     </div>
//   );
// };

// // Card 1: What Needs Attention
// const AttentionCard = ({ data }) => {
//   const hasOverdue = data.overdue.count > 0;
//   const hasDueToday = data.dueToday.count > 0;
//   const highPriorityUnhealthy = data.highPriority.percentage > 60;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">
//             What Needs Attention
//           </h2>
//           <AlertCircle className="w-5 h-5 text-orange-500" />
//         </div>

//         <div className="space-y-4">
//           {/* Overdue Tasks */}
//           <MetricRow
//             label="Overdue"
//             count={data.overdue.count}
//             alert={hasOverdue}
//             alertLevel="error"
//             onClick={() => console.log("Navigate to overdue tasks")}
//           >
//             {hasOverdue && data.overdue.projects.length > 0 && (
//               <span className="text-xs text-gray-500">
//                 across {data.overdue.projects.length} project
//                 {data.overdue.projects.length > 1 ? "s" : ""}
//               </span>
//             )}
//             {!hasOverdue && (
//               <span className="text-xs text-green-600 flex items-center gap-1">
//                 <CheckCircle2 className="w-3 h-3" />
//                 Great work!
//               </span>
//             )}
//           </MetricRow>

//           {/* Due Today */}
//           <MetricRow
//             label="Due Today"
//             count={data.dueToday.count}
//             alert={hasDueToday}
//             alertLevel="warning"
//             onClick={() => console.log("Navigate to due today tasks")}
//           >
//             {!hasDueToday && (
//               <span className="text-xs text-gray-400">Nothing due today</span>
//             )}
//           </MetricRow>

//           {/* High Priority Open */}
//           <MetricRow
//             label="High-Priority Open"
//             count={data.highPriority.count}
//             alert={highPriorityUnhealthy}
//             alertLevel="caution"
//             onClick={() => console.log("Navigate to high priority tasks")}
//           >
//             {highPriorityUnhealthy && (
//               <span className="text-xs text-amber-600">
//                 Consider if this is realistic
//               </span>
//             )}
//           </MetricRow>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Card 2: Work in Progress
// const WorkInProgressCard = ({ data }) => {
//   const wipStatus =
//     data.inProgress <= 3
//       ? "healthy"
//       : data.inProgress <= 5
//       ? "caution"
//       : "unhealthy";

//   const wipColors = {
//     healthy: "text-green-600 bg-green-50",
//     caution: "text-amber-600 bg-amber-50",
//     unhealthy: "text-red-600 bg-red-50",
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Work in Progress
//           </h2>
//           <BarChart3 className="w-5 h-5 text-blue-500" />
//         </div>

//         <div className="space-y-4">
//           {/* Tasks in Progress */}
//           <div
//             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => console.log("Navigate to in-progress tasks")}
//           >
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium text-gray-700">
//                   Tasks In Progress
//                 </span>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-semibold ${wipColors[wipStatus]}`}
//                 >
//                   {data.inProgress}
//                 </span>
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Optimal focus: 2-3 concurrent tasks
//               </p>
//             </div>
//             <ArrowRight className="w-4 h-4 text-gray-400" />
//           </div>

//           {/* Longest Open Task */}
//           <div
//             className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
//             onClick={() => console.log("Navigate to specific task")}
//           >
//             <div className="flex items-start justify-between gap-3">
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                   <span className="text-sm font-medium text-gray-700">
//                     Longest Open Task
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-900 truncate">
//                   {data.longestOpen.title}
//                 </p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <span
//                     className={`text-xs font-semibold ${
//                       data.longestOpen.days > 30
//                         ? "text-red-600"
//                         : "text-amber-600"
//                     }`}
//                   >
//                     {data.longestOpen.days} days
//                   </span>
//                   {data.longestOpen.days > 30 && (
//                     <AlertTriangle className="w-3 h-3 text-red-500" />
//                   )}
//                 </div>
//               </div>
//               <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Card 3: Weekly Momentum
// const MomentumCard = ({ data }) => {
//   const TrendIcon =
//     data.completedThisWeek.direction === "up"
//       ? TrendingUp
//       : data.completedThisWeek.direction === "down"
//       ? TrendingDown
//       : Minus;

//   const trendColor =
//     data.completedThisWeek.direction === "up"
//       ? "text-green-600"
//       : data.completedThisWeek.direction === "down"
//       ? "text-red-600"
//       : "text-gray-600";

//   const projectEngagementLow =
//     data.projectsTouched.current / data.projectsTouched.total < 0.5;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Weekly Momentum
//           </h2>
//           <Calendar className="w-5 h-5 text-purple-500" />
//         </div>

//         <div className="space-y-4">
//           {/* Completed This Week */}
//           <div
//             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => console.log("Navigate to completed tasks")}
//           >
//             <div className="flex-1">
//               <span className="text-sm font-medium text-gray-700">
//                 Completed This Week
//               </span>
//               <div className="flex items-center gap-2 mt-1">
//                 <span className="text-2xl font-bold text-gray-900">
//                   {data.completedThisWeek.count}
//                 </span>
//                 <div className={`flex items-center gap-1 ${trendColor}`}>
//                   <TrendIcon className="w-4 h-4" />
//                   <span className="text-sm font-semibold">
//                     {Math.abs(data.completedThisWeek.trend)} from last week
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <ArrowRight className="w-4 h-4 text-gray-400" />
//           </div>

//           {/* Average Completion Time */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="p-3 bg-blue-50 rounded-lg">
//               <p className="text-xs text-gray-600 mb-1">Avg. Completion Time</p>
//               <p className="text-xl font-bold text-blue-700">
//                 {data.avgCompletionTime}{" "}
//                 <span className="text-sm font-normal">days</span>
//               </p>
//             </div>

//             {/* Projects Touched */}
//             <div
//               className="p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
//               onClick={() => console.log("Navigate to projects")}
//             >
//               <p className="text-xs text-gray-600 mb-1">Projects Touched</p>
//               <p className="text-xl font-bold text-purple-700">
//                 {data.projectsTouched.current}
//                 <span className="text-sm font-normal text-gray-600">
//                   /{data.projectsTouched.total}
//                 </span>
//               </p>
//               {projectEngagementLow && (
//                 <p className="text-xs text-amber-600 mt-1">
//                   Some projects need attention
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Card 4: Priority Health
// const PriorityHealthCard = ({ data }) => {
//   const statusConfig = {
//     healthy: {
//       label: "Well-balanced priorities",
//       icon: CheckCircle2,
//       color: "text-green-600",
//       bgColor: "bg-green-50",
//       borderColor: "border-green-200",
//     },
//     caution: {
//       label: "Many high-priority tasks—review if all are urgent",
//       icon: AlertTriangle,
//       color: "text-amber-600",
//       bgColor: "bg-amber-50",
//       borderColor: "border-amber-200",
//     },
//     unhealthy: {
//       label: "Priority inflation detected—consider re-prioritizing",
//       icon: AlertCircle,
//       color: "text-red-600",
//       bgColor: "bg-red-50",
//       borderColor: "border-red-200",
//     },
//   };

//   const config = statusConfig[data.status];
//   const StatusIcon = config.icon;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Priority Health
//           </h2>
//           <BarChart3 className="w-5 h-5 text-indigo-500" />
//         </div>

//         {/* Priority Distribution Bar */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs font-medium text-gray-600">
//               Distribution
//             </span>
//             <span className="text-xs text-gray-500">
//               Out of {data.totalTasks} tasks
//             </span>
//           </div>

//           <div className="w-full h-8 flex rounded-lg overflow-hidden">
//             <div
//               className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
//               style={{ width: `${data.distribution.high}%` }}
//             >
//               {data.distribution.high > 15 && `${data.distribution.high}%`}
//             </div>
//             <div
//               className="bg-amber-400 flex items-center justify-center text-white text-xs font-semibold"
//               style={{ width: `${data.distribution.medium}%` }}
//             >
//               {data.distribution.medium > 15 && `${data.distribution.medium}%`}
//             </div>
//             <div
//               className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
//               style={{ width: `${data.distribution.low}%` }}
//             >
//               {data.distribution.low > 15 && `${data.distribution.low}%`}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="flex items-center gap-4 mt-3">
//             <div className="flex items-center gap-1.5">
//               <div className="w-3 h-3 rounded-sm bg-red-500"></div>
//               <span className="text-xs text-gray-600">
//                 High: {data.distribution.high}%
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-3 h-3 rounded-sm bg-amber-400"></div>
//               <span className="text-xs text-gray-600">
//                 Medium: {data.distribution.medium}%
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-3 h-3 rounded-sm bg-green-500"></div>
//               <span className="text-xs text-gray-600">
//                 Low: {data.distribution.low}%
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Health Status */}
//         <div
//           className={`flex items-start gap-3 p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}
//         >
//           <StatusIcon
//             className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`}
//           />
//           <div className="flex-1">
//             <p className={`text-sm font-semibold ${config.color}`}>
//               {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
//             </p>
//             <p className="text-xs text-gray-600 mt-1">{config.label}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Metric Row Component
// interface MetricRowProps {
//   label: string;
//   count: number;
//   alert: boolean;
//   alertLevel: "error" | "warning" | "caution";
//   onClick: () => void;
//   children?: React.ReactNode;
// }

// const MetricRow = ({ label, count, alert, alertLevel, onClick, children }: MetricRowProps) => {
//   const alertColors = {
//     error:
//       count > 0
//         ? "bg-red-50 border-red-200 hover:bg-red-100"
//         : "bg-gray-50 border-gray-200 hover:bg-gray-100",
//     warning:
//       count > 0
//         ? "bg-orange-50 border-orange-200 hover:bg-orange-100"
//         : "bg-gray-50 border-gray-200 hover:bg-gray-100",
//     caution: alert
//       ? "bg-amber-50 border-amber-200 hover:bg-amber-100"
//       : "bg-gray-50 border-gray-200 hover:bg-gray-100",
//   };

//   const countColors = {
//     error: count > 0 ? "text-red-700 bg-red-100" : "text-gray-700 bg-gray-100",
//     warning:
//       count > 0 ? "text-orange-700 bg-orange-100" : "text-gray-700 bg-gray-100",
//     caution: alert
//       ? "text-amber-700 bg-amber-100"
//       : "text-gray-700 bg-gray-100",
//   };

//   return (
//     <div
//       className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${alertColors[alertLevel]}`}
//       onClick={onClick}
//     >
//       <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-gray-700">{label}</span>
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-semibold ${countColors[alertLevel]}`}
//           >
//             {count}
//           </span>
//         </div>
//         {children && <div className="mt-1">{children}</div>}
//       </div>
//       <ArrowRight className="w-4 h-4 text-gray-400" />
//     </div>
//   );
// };

// export default MyGTasksAnalytics;
