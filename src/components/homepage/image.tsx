import { BarChart2Icon, MoreVerticalIcon, UsersIcon } from "lucide-react";
import React from "react";
import {
  GoCheckCircleFill,
  GoFileDirectory,
  GoHome,
  GoHomeFill,
  GoReport,
} from "react-icons/go";

const HomepageImage = () => {
  return (
    <div className="max-w-4xl mx-auto px-12 mb-20">
      <div className="bg-white border border-black/[0.09] rounded-2xl overflow-hidden">
        <div className="bg-[#f4f3f0] border-b border-black/[0.09] px-5 py-3 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f09595]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FAC775]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#97C459]"></div>
          <div className="ml-3 bg-white border border-black/[0.09] rounded px-4 py-0.5 text-[11px] text-ink-3">
            app.flusso.io/workspace
          </div>
        </div>
        <div className="flex min-h-[280px]">
          <div className="hidden md:block w-44 border-r border-black/[0.09] bg-surface p-5 flex-shrink-0">
            <div className="font-serif text-base text-ink mb-5">
              Flusso<span className="text-accent">.</span>
            </div>
            <ul className="flex flex-col gap-0.5 list-none">
              <li className="text-xs px-2.5 py-1.5 rounded text-secondary-foreground flex items-center gap-2 cursor-pointer">
                <GoHome className="size-3 " />
                Dashboard
              </li>
              <li className="text-xs px-2.5 py-1.5 rounded text-secondary-foreground flex items-center gap-2 cursor-pointer">
                <GoFileDirectory className="size-3 " />
                Projects
              </li>
              <li className="text-xs px-2.5 py-1.5 rounded flex items-center gap-2 cursor-pointer bg-[#EBF2FF] hover:bg-[#EBF2FF]/90 border data-[active=true]:border border-[#1546e733]  text-[#1546e7]">
                <GoCheckCircleFill className="size-3" />
                My tasks
              </li>

              <li className="text-xs px-2.5 py-1.5 rounded text-secondary-foreground flex items-center gap-2 cursor-pointer">
                <BarChart2Icon className="size-3 " />
                Analytics
              </li>
              <li className="text-xs px-2.5 py-1.5 rounded text-secondary-foreground flex items-center gap-2 cursor-pointer">
                <UsersIcon className="size-3 " />
                Team
              </li>
            </ul>
          </div>
          <div className="flex-1 p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="bg-red-100 text-red-900 rounded-lg p-3">
                <strong className="block text-lg font-medium text-ink tracking-tight">
                  12
                </strong>
                <span className="text-[10px] text-ink-3">tasks today</span>
              </div>
              <div className="bg-yellow-100 text-yellow-900 rounded-lg p-3">
                <strong className="block text-lg font-medium text-ink tracking-tight">
                  3
                </strong>
                <span className="text-[10px] text-ink-3"> tasks overdue</span>
              </div>
              <div className="bg-green-100 text-green-900 rounded-lg p-3">
                <strong className="block text-lg font-medium text-ink tracking-tight">
                  50%
                </strong>
                <span className="text-[10px] text-ink-3">tasks completed</span>
              </div>
              <div className="bg-violet-100 text-violet-900 rounded-lg p-3">
                <strong className="block text-lg font-medium text-ink tracking-tight">
                  84%
                </strong>
                <span className="text-[10px] text-ink-3">on track</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-ink">My tasks</div>
              <div className="flex gap-1.5">
                <div className="text-[10px] px-2.5 py-1 rounded-full bg-brand1 text-white border border-brand1 cursor-pointer">
                  All
                </div>
                <div className="text-[10px] px-2.5 py-1 rounded-full border border-black/[0.09] text-ink-2 cursor-pointer">
                  Today
                </div>
                <div className="text-[10px] px-2.5 py-1 rounded-full border border-black/[0.09] text-ink-2 cursor-pointer">
                  This week
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 p-2 px-3 border border-black/[0.09] rounded-lg bg-white text-[11px] text-ink-2">
                <div className="w-3.5 h-3.5 rounded flex-shrink-0 bg-accent border-accent border"></div>
                <div className="flex-1 text-ink line-through text-ink-3">
                  Review Q3 product roadmap
                </div>
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-medium">
                  High
                </div>
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-green-200 text-black font-medium">
                  Completed
                </div>
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-medium text-blue-800 flex-shrink-0">
                  AK
                </div>
                <MoreVerticalIcon className="size-4" />
              </div>
              <div className="flex items-center gap-2.5 p-2 px-3 border border-black/[0.09] rounded-lg bg-white text-[11px] text-ink-2">
                <div className="w-3.5 h-3.5 rounded flex-shrink-0 border border-black/[0.15]"></div>
                <div className="flex-1 text-ink">
                  Finalize onboarding flow designs
                </div>
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-[#FCEBEB] text-[#A32D2D] font-medium">
                  High
                </div>
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-200 text-black font-medium">
                  In progress
                </div>
                <div className="w-5 h-5 rounded-full bg-[#EEEDFE] flex items-center justify-center text-[9px] font-medium text-[#534AB7] flex-shrink-0">
                  JM
                </div>
                <MoreVerticalIcon className="size-4" />
              </div>
              <div className="flex items-center gap-2.5 p-2 px-3 border border-black/[0.09] rounded-lg bg-white text-[11px] text-ink-2">
                <div className="w-3.5 h-3.5 rounded flex-shrink-0 border border-black/[0.15]"></div>
                <div className="flex-1 text-ink">
                  Write release notes for v2.4
                </div>
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAEEDA] text-[#854F0B] font-medium">
                  Medium
                </div>
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-200 text-black font-medium">
                  In progress
                </div>
                <div className="w-5 h-5 rounded-full bg-[#FAEEDA] flex items-center justify-center text-[9px] font-medium text-[#854F0B] flex-shrink-0">
                  TR
                </div>
                <MoreVerticalIcon className="size-4" />
              </div>
              <div className="flex items-center gap-2.5 p-2 px-3 border border-black/[0.09] rounded-lg bg-white text-[11px] text-ink-2">
                <div className="w-3.5 h-3.5 rounded flex-shrink-0 border border-black/[0.15]"></div>
                <div className="flex-1 text-ink">
                  Sync with design team on components
                </div>
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 font-medium">
                  Low
                </div>
                <div className="text-[9px] px-1.5 py-0.5 rounded bg-red-200 text-black font-medium">
                  Todo
                </div>
                <div className="w-5 h-5 rounded-full bg-[#FCEBEB] flex items-center justify-center text-[9px] font-medium text-[#A32D2D] flex-shrink-0">
                  SL
                </div>
                <MoreVerticalIcon className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageImage;
