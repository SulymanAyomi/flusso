"use client";
import "./style.css";

import React from "react";

const Page = () => {
  return (
    <div className="bg-surface text-ink font-sans">
      <nav className="sticky top-0 z-50 bg-white border-b border-black/[0.09] flex items-center justify-between px-12 py-5">
        <div className="font-serif text-[22px] tracking-tight">
          Flusso<span className="text-accent">.</span>
        </div>
        <ul className="hidden md:flex gap-8 list-none">
          <li>
            <a
              href="#"
              className="text-sm text-ink-2 hover:text-ink no-underline"
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-ink-2 hover:text-ink no-underline"
            >
              Solutions
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-ink-2 hover:text-ink no-underline"
            >
              Pricing
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-ink-2 hover:text-ink no-underline"
            >
              Blog
            </a>
          </li>
        </ul>
        <button className="bg-ink text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-[#2c2c28] transition-colors">
          Start for free
        </button>
      </nav>

      <section className="max-w-3xl mx-auto px-12 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-1.5 bg-accent-light text-accent-mid text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide">
          <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
          AI-powered workspace — now in beta
        </div>
        <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] tracking-tight text-ink mb-6 font-normal">
          Work flows when
          <br />
          everything is <em className="text-accent not-italic">in one place</em>
        </h1>
        <p className="text-lg text-ink-2 max-w-lg mx-auto mb-10 font-light leading-relaxed">
          Flusso brings tasks, projects, team collaboration, and AI-powered
          insights into one calm, intelligent workspace. Effortless task
          management for modern teams.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button className="bg-ink text-white text-[15px] font-medium px-7 py-3 rounded-lg hover:bg-[#2c2c28] transition-colors">
            Get started free
          </button>
          <button className="bg-white text-ink-2 text-[15px] px-7 py-3 rounded-lg border border-black/[0.09] hover:border-black/20 hover:text-ink transition-colors">
            See how it works →
          </button>
        </div>
        <p className="text-xs text-ink-3 mt-4">
          No credit card required · Free for teams up to 5
        </p>
      </section>

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
                <li className="text-xs px-2.5 py-1.5 rounded text-ink-2 flex items-center gap-2 cursor-pointer">
                  <div className="w-3 h-3 rounded-sm bg-accent-light flex-shrink-0"></div>
                  Dashboard
                </li>
                <li className="text-xs px-2.5 py-1.5 rounded text-ink font-medium flex items-center gap-2 cursor-pointer bg-white border border-black/[0.09]">
                  <div className="w-3 h-3 rounded-sm bg-[#CECBF6] flex-shrink-0"></div>
                  My tasks
                </li>
                <li className="text-xs px-2.5 py-1.5 rounded text-ink-2 flex items-center gap-2 cursor-pointer">
                  <div className="w-3 h-3 rounded-sm bg-[#B5D4F4] flex-shrink-0"></div>
                  Projects
                </li>
                <li className="text-xs px-2.5 py-1.5 rounded text-ink-2 flex items-center gap-2 cursor-pointer">
                  <div className="w-3 h-3 rounded-sm bg-[#FAEEDA] flex-shrink-0"></div>
                  Analytics
                </li>
                <li className="text-xs px-2.5 py-1.5 rounded text-ink-2 flex items-center gap-2 cursor-pointer">
                  <div className="w-3 h-3 rounded-sm bg-[#f1efe8] flex-shrink-0"></div>
                  Team
                </li>
              </ul>
            </div>
            <div className="flex-1 p-5">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-[#f7f6f3] rounded-lg p-3">
                  <strong className="block text-lg font-medium text-ink tracking-tight">
                    12
                  </strong>
                  <span className="text-[10px] text-ink-3">tasks today</span>
                </div>
                <div className="bg-[#f7f6f3] rounded-lg p-3">
                  <strong className="block text-lg font-medium text-ink tracking-tight">
                    3
                  </strong>
                  <span className="text-[10px] text-ink-3">overdue</span>
                </div>
                <div className="bg-[#f7f6f3] rounded-lg p-3">
                  <strong className="block text-lg font-medium text-ink tracking-tight">
                    84%
                  </strong>
                  <span className="text-[10px] text-ink-3">on track</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-ink">My tasks</div>
                <div className="flex gap-1.5">
                  <div className="text-[10px] px-2.5 py-1 rounded-full bg-ink text-white border border-ink cursor-pointer">
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
                  <div className="text-[9px] px-1.5 py-0.5 rounded bg-[#f1efe8] text-ink-3 font-medium">
                    Done
                  </div>
                  <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center text-[9px] font-medium text-accent-mid flex-shrink-0">
                    AK
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 px-3 border border-black/[0.09] rounded-lg bg-white text-[11px] text-ink-2">
                  <div className="w-3.5 h-3.5 rounded flex-shrink-0 border border-black/[0.15]"></div>
                  <div className="flex-1 text-ink">
                    Finalize onboarding flow designs
                  </div>
                  <div className="text-[9px] px-1.5 py-0.5 rounded bg-[#FCEBEB] text-[#A32D2D] font-medium">
                    High
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#EEEDFE] flex items-center justify-center text-[9px] font-medium text-[#534AB7] flex-shrink-0">
                    JM
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 px-3 border border-black/[0.09] rounded-lg bg-white text-[11px] text-ink-2">
                  <div className="w-3.5 h-3.5 rounded flex-shrink-0 border border-black/[0.15]"></div>
                  <div className="flex-1 text-ink">
                    Write release notes for v2.4
                  </div>
                  <div className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAEEDA] text-[#854F0B] font-medium">
                    Medium
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#FAEEDA] flex items-center justify-center text-[9px] font-medium text-[#854F0B] flex-shrink-0">
                    TR
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 px-3 border border-black/[0.09] rounded-lg bg-white text-[11px] text-ink-2">
                  <div className="w-3.5 h-3.5 rounded flex-shrink-0 border border-black/[0.15]"></div>
                  <div className="flex-1 text-ink">
                    Sync with design team on components
                  </div>
                  <div className="text-[9px] px-1.5 py-0.5 rounded bg-[#EAF3DE] text-[#3B6D11] font-medium">
                    Low
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#FCEBEB] flex items-center justify-center text-[9px] font-medium text-[#A32D2D] flex-shrink-0">
                    SL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-b border-black/[0.09] bg-white py-8 px-12 flex items-center justify-center flex-wrap gap-0">
        <span className="text-xs text-ink-3 mr-8 whitespace-nowrap">
          Trusted by teams at
        </span>
        <span className="text-sm font-medium text-[#bbb9b0] px-5">Notion</span>
        <span className="text-sm font-medium text-[#bbb9b0] px-5">Vercel</span>
        <span className="text-sm font-medium text-[#bbb9b0] px-5">Linear</span>
        <span className="text-sm font-medium text-[#bbb9b0] px-5">Loom</span>
        <span className="text-sm font-medium text-[#bbb9b0] px-5">Figma</span>
        <span className="text-sm font-medium text-[#bbb9b0] px-5">Stripe</span>
      </div>

      <section className="max-w-5xl mx-auto px-12 py-24">
        <div className="text-[11px] font-medium tracking-[1.5px] text-accent uppercase mb-3">
          What Flusso does
        </div>
        <h2 className="font-serif text-4xl md:text-[44px] leading-[1.15] tracking-tight text-ink max-w-lg mb-14 font-normal">
          Everything your team needs, nothing you don't.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 border border-black/[0.09] rounded-xl overflow-hidden divide-x divide-y divide-black/[0.09]">
          <div className="bg-white p-8">
            <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="3" width="14" height="2" rx="1" fill="#0F6E56" />
                <rect x="2" y="8" width="10" height="2" rx="1" fill="#0F6E56" />
                <rect
                  x="2"
                  y="13"
                  width="12"
                  height="2"
                  rx="1"
                  fill="#0F6E56"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              Task management
            </h3>
            <p className="text-sm text-ink-2 leading-relaxed font-light">
              Create tasks with priorities, deadlines, subtasks, and
              dependencies. Organize by project or personal workspace.
            </p>
          </div>

          <div className="bg-white p-8">
            <div className="w-9 h-9 rounded-lg bg-[#EEEDFE] flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#534AB7"
                />
                <rect
                  x="10"
                  y="2"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#534AB7"
                  opacity=".4"
                />
                <rect
                  x="2"
                  y="10"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#534AB7"
                  opacity=".4"
                />
                <rect
                  x="10"
                  y="10"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#534AB7"
                  opacity=".7"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              Multiple views
            </h3>
            <p className="text-sm text-ink-2 leading-relaxed font-light">
              Switch between table, board, and calendar views. Visualize work
              the way your team actually thinks.
            </p>
          </div>

          <div className="bg-white p-8">
            <div className="w-9 h-9 rounded-lg bg-[#E6F1FB] flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3" fill="#185FA5" />
                <path
                  d="M3 15c0-3.314 2.686-6 6-6s6 2.686 6 6"
                  stroke="#185FA5"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              Team collaboration
            </h3>
            <p className="text-sm text-ink-2 leading-relaxed font-light">
              Assign tasks, track contributions, comment on work, and keep the
              entire team aligned in shared workspaces.
            </p>
          </div>

          <div className="bg-white p-8">
            <div className="w-9 h-9 rounded-lg bg-[#FAEEDA] flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="11" width="3" height="5" rx="1" fill="#BA7517" />
                <rect
                  x="7.5"
                  y="7"
                  width="3"
                  height="9"
                  rx="1"
                  fill="#BA7517"
                />
                <rect
                  x="13"
                  y="4"
                  width="3"
                  height="12"
                  rx="1"
                  fill="#BA7517"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              Analytics & insights
            </h3>
            <p className="text-sm text-ink-2 leading-relaxed font-light">
              Dashboards showing completion rates, project progress, and team
              activity so you always know where things stand.
            </p>
          </div>

          <div className="bg-white p-8">
            <div className="w-9 h-9 rounded-lg bg-[#EAF3DE] flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2L11.09 7H16L12.47 9.97L13.82 15L9 12L4.18 15L5.53 9.97L2 7H6.91L9 2Z"
                  fill="#3B6D11"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              Project milestones
            </h3>
            <p className="text-sm text-ink-2 leading-relaxed font-light">
              Group tasks into projects, track milestones, and get full
              visibility into how work is progressing end-to-end.
            </p>
          </div>

          <div className="bg-white p-8">
            <div className="w-9 h-9 rounded-lg bg-[#FAECE7] flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="3" fill="#D85A30" />
                <path
                  d="M9 2v2M9 14v2M2 9h2M14 9h2"
                  stroke="#D85A30"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              AI productivity
            </h3>
            <p className="text-sm text-ink-2 leading-relaxed font-light">
              Smart suggestions, intelligent scheduling, and workload insights
              powered by AI — built right into your workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-b border-black/[0.09] py-24 px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-[11px] font-medium tracking-[1.5px] text-accent uppercase mb-3">
            AI project creation
          </div>
          <h2 className="font-serif text-4xl md:text-[42px] leading-[1.15] tracking-tight text-ink max-w-xl mb-3 font-normal">
            Describe your project.
            <br />
            <em className="text-accent not-italic">Flusso builds it.</em>
          </h2>
          <p className="text-base text-ink-2 font-light max-w-lg mb-10 leading-relaxed">
            Type what you're working on in plain language — Flusso's AI
            generates a full project plan with tasks, deadlines, and priorities
            in seconds.
          </p>

          <div className="bg-white border border-black/[0.09] rounded-2xl overflow-hidden">
            <div className="p-6 pb-0">
              <div className="text-[11px] font-medium tracking-[0.8px] text-ink-3 uppercase mb-2.5">
                What are you working on?
              </div>
              <textarea
                id="prompt-input"
                rows={3}
                className="w-full border-none outline-none resize-none font-sans text-[15px] text-ink font-light leading-relaxed bg-transparent placeholder-ink-3"
                placeholder="e.g. Launch a mobile app for food delivery with a 6-week timeline..."
              ></textarea>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between border-t border-black/[0.09] mt-3 flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={"useExample('Rebrand a SaaS product')"}
                  className="text-[11px] px-3 py-1 rounded-full border border-black/[0.09] text-ink-2 bg-surface hover:bg-accent-light hover:border-accent hover:text-accent-mid transition-colors cursor-pointer"
                >
                  Rebrand a SaaS product
                </button>
                <button
                  onClick="useExample('Plan a product launch')"
                  className="text-[11px] px-3 py-1 rounded-full border border-black/[0.09] text-ink-2 bg-surface hover:bg-accent-light hover:border-accent hover:text-accent-mid transition-colors cursor-pointer"
                >
                  Plan a product launch
                </button>
                <button
                  onClick="useExample('Build a company website')"
                  className="text-[11px] px-3 py-1 rounded-full border border-black/[0.09] text-ink-2 bg-surface hover:bg-accent-light hover:border-accent hover:text-accent-mid transition-colors cursor-pointer"
                >
                  Build a company website
                </button>
                <button
                  onClick="useExample('Onboard a new hire')"
                  className="text-[11px] px-3 py-1 rounded-full border border-black/[0.09] text-ink-2 bg-surface hover:bg-accent-light hover:border-accent hover:text-accent-mid transition-colors cursor-pointer"
                >
                  Onboard a new hire
                </button>
              </div>
              <button
                id="gen-btn"
                onClick="generateProject()"
                className="bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#2c2c28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1L9.8 6.2L15 8L9.8 9.8L8 15L6.2 9.8L1 8L6.2 6.2L8 1Z"
                    fill="white"
                  />
                </svg>
                Generate project
              </button>
            </div>
          </div>

          <div id="error-area" className="mt-3"></div>
          <div id="output-area" className="mt-7 hidden"></div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-[11px] font-medium tracking-[1.5px] text-accent uppercase mb-3">
            AI assistant
          </div>
          <h2 className="font-serif text-4xl leading-[1.15] tracking-tight text-ink max-w-sm mb-6 font-normal">
            Your smartest teammate is already on the team.
          </h2>
          <ul className="flex flex-col gap-4 list-none">
            <li className="flex items-start gap-3 text-sm text-ink-2 font-light">
              <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              </div>
              Suggests subtasks and follow-ups automatically as you create work.
            </li>
            <li className="flex items-start gap-3 text-sm text-ink-2 font-light">
              <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              </div>
              Recommends optimal due dates based on priority, workload, and
              dependencies.
            </li>
            <li className="flex items-start gap-3 text-sm text-ink-2 font-light">
              <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              </div>
              Surfaces project risks, overdue patterns, and workload imbalances
              before they become problems.
            </li>
          </ul>
        </div>
        <div className="bg-white border border-black/[0.09] rounded-2xl p-7">
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[10px] font-medium text-ink-3 uppercase tracking-wide mb-1">
                You
              </div>
              <div className="bg-ink text-white text-sm px-4 py-3 rounded-xl self-end ml-auto max-w-[85%] w-fit leading-relaxed">
                What's at risk in the product launch project?
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-ink-3 uppercase tracking-wide mb-1">
                Flusso AI
              </div>
              <div className="bg-[#f4f3f0] text-ink text-sm px-4 py-3 rounded-xl max-w-[85%] leading-relaxed">
                3 tasks on the critical path are overdue by 2+ days. The design
                handoff milestone may slip — I'd recommend reassigning "Finalize
                UI specs" to unblock the dev team. Want me to do that?
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-ink-3 uppercase tracking-wide mb-1">
                You
              </div>
              <div className="bg-ink text-white text-sm px-4 py-3 rounded-xl self-end ml-auto max-w-[85%] w-fit leading-relaxed">
                Yes, reassign it and flag the delay.
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f4f3f0] px-4 py-3 rounded-xl w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-ink-3 ai-dot"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-ink-3 ai-dot"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-ink-3 ai-dot"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-b border-black/[0.09] py-20 px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] font-medium tracking-[1.5px] text-accent uppercase mb-3">
            What teams say
          </div>
          <h2 className="font-serif text-4xl leading-[1.15] tracking-tight text-ink max-w-sm mb-12 font-normal">
            Built for the way real teams work.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-black/[0.09] rounded-xl p-7 bg-surface">
              <div className="flex gap-1 mb-4">
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
              </div>
              <p className="text-sm text-ink-2 font-light leading-relaxed mb-5">
                "We moved off four separate tools into Flusso in one week. The
                whole team actually uses it now, which has never happened
                before."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-[11px] font-medium text-accent-mid flex-shrink-0">
                  SR
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">
                    Sarah Reeves
                  </div>
                  <div className="text-xs text-ink-3">
                    Head of Product, Aether Labs
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-black/[0.09] rounded-xl p-7 bg-surface">
              <div className="flex gap-1 mb-4">
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
              </div>
              <p className="text-sm text-ink-2 font-light leading-relaxed mb-5">
                "The AI insights are genuinely useful — not just noise. It
                caught a resource bottleneck we would have missed until it was
                too late."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EEEDFE] flex items-center justify-center text-[11px] font-medium text-[#534AB7] flex-shrink-0">
                  DK
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">Daniel Kim</div>
                  <div className="text-xs text-ink-3">
                    Engineering Lead, Fora
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-black/[0.09] rounded-xl p-7 bg-surface">
              <div className="flex gap-1 mb-4">
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
                <div className="w-3 h-3 star-shape bg-[#FAC775]"></div>
              </div>
              <p className="text-sm text-ink-2 font-light leading-relaxed mb-5">
                "Flusso made project visibility effortless. I spend less time
                chasing updates and more time doing actual work."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center text-[11px] font-medium text-[#185FA5] flex-shrink-0">
                  ML
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">Maya Lopes</div>
                  <div className="text-xs text-ink-3">Freelance PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-12 py-24">
        <div className="text-[11px] font-medium tracking-[1.5px] text-accent uppercase mb-3">
          Pricing
        </div>
        <h2 className="font-serif text-4xl leading-[1.15] tracking-tight text-ink max-w-sm mb-12 font-normal">
          Simple pricing that scales with your team.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border border-black/[0.09] rounded-xl p-7 bg-white">
            <div className="text-[11px] font-medium tracking-widest uppercase text-ink-3 mb-3">
              Free
            </div>
            <div className="font-serif text-4xl text-ink tracking-tight mb-1">
              <sup className="font-sans text-base align-top mt-2 inline-block">
                $
              </sup>
              0
            </div>
            <div className="text-sm text-ink-2 font-light mb-5">
              For individuals and small teams getting started.
            </div>
            <div className="h-px bg-black/[0.09] mb-4"></div>
            <ul className="flex flex-col gap-2.5 mb-6 list-none">
              <li className="text-sm text-ink-2 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
                Up to 5 members
              </li>
              <li className="text-sm text-ink-2 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
                5 active projects
              </li>
              <li className="text-sm text-ink-2 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
                Table & board views
              </li>
              <li className="text-sm text-ink-2 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
                Basic analytics
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-black/[0.09] text-ink bg-transparent hover:bg-surface transition-colors">
              Get started
            </button>
          </div>

          <div className="border-2 border-ink rounded-xl p-7 bg-ink text-white">
            <div className="text-[11px] font-medium tracking-widest uppercase text-white/40 mb-3">
              Pro
            </div>
            <div className="font-serif text-4xl text-white tracking-tight mb-1">
              <sup className="font-sans text-base align-top mt-2 inline-block">
                $
              </sup>
              12
              <sub className="font-sans text-sm text-white/40 align-baseline">
                /mo per seat
              </sub>
            </div>
            <div className="text-sm text-white/60 font-light mb-5">
              For growing teams that need more power.
            </div>
            <div className="h-px bg-white/10 mb-4"></div>
            <ul className="flex flex-col gap-2.5 mb-6 list-none">
              <li className="text-sm text-white/75 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                Unlimited members
              </li>
              <li className="text-sm text-white/75 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                Unlimited projects
              </li>
              <li className="text-sm text-white/75 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                All views + calendar
              </li>
              <li className="text-sm text-white/75 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                Advanced analytics
              </li>
              <li className="text-sm text-white/75 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                AI assistant
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium bg-white text-ink hover:bg-[#f0efec] transition-colors">
              Start free trial
            </button>
          </div>

          <div className="border border-black/[0.09] rounded-xl p-7 bg-white">
            <div className="text-[11px] font-medium tracking-widest uppercase text-ink-3 mb-3">
              Enterprise
            </div>
            <div className="font-serif text-3xl text-ink tracking-tight mb-1">
              Custom
            </div>
            <div className="text-sm text-ink-2 font-light mb-5">
              For large teams with security and compliance needs.
            </div>
            <div className="h-px bg-black/[0.09] mb-4"></div>
            <ul className="flex flex-col gap-2.5 mb-6 list-none">
              <li className="text-sm text-ink-2 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
                Everything in Pro
              </li>
              <li className="text-sm text-ink-2 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
                SSO & SAML
              </li>
              <li className="text-sm text-ink-2 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
                Dedicated support
              </li>
              <li className="text-sm text-ink-2 font-light flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
                Custom integrations
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-black/[0.09] text-ink bg-transparent hover:bg-surface transition-colors">
              Contact sales
            </button>
          </div>
        </div>
      </section>

      <section className="bg-ink text-white py-24 px-12 text-center">
        <h2 className="font-serif text-5xl leading-[1.15] tracking-tight mb-5 font-normal">
          Less chaos.
          <br />
          <em className="text-[#5DCAA5] not-italic">More flow.</em>
        </h2>
        <p className="text-base text-white/55 max-w-sm mx-auto mb-9 font-light">
          Join thousands of teams using Flusso to bring clarity to their work.
        </p>
        <button className="bg-white text-ink text-[15px] font-medium px-8 py-3.5 rounded-lg hover:bg-[#f0efec] transition-colors">
          Start for free — no credit card needed
        </button>
      </section>

      <footer className="bg-white border-t border-black/[0.09] px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-serif text-lg">
          Flusso<span className="text-accent">.</span>
        </div>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-sm text-ink-3 hover:text-ink no-underline"
          >
            Product
          </a>
          <a
            href="#"
            className="text-sm text-ink-3 hover:text-ink no-underline"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm text-ink-3 hover:text-ink no-underline"
          >
            Blog
          </a>
          <a
            href="#"
            className="text-sm text-ink-3 hover:text-ink no-underline"
          >
            Careers
          </a>
          <a
            href="#"
            className="text-sm text-ink-3 hover:text-ink no-underline"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-ink-3 hover:text-ink no-underline"
          >
            Terms
          </a>
        </div>
        <div className="text-xs text-ink-3">© 2025 Flusso, Inc.</div>
      </footer>
    </div>
  );
};

export default Page;
//   <script>
//     function useExample(text) {
//       document.getElementById('prompt-input').value = text;
//     }

//     async function generateProject() {
//       const prompt = document.getElementById('prompt-input').value.trim();
//       if (!prompt) return;

//       const btn = document.getElementById('gen-btn');
//       const outputArea = document.getElementById('output-area');
//       const errorArea = document.getElementById('error-area');

//       btn.disabled = true;
//       btn.innerHTML = '<div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white spinner"></div> Generating...';
//       errorArea.innerHTML = '';
//       outputArea.classList.remove('hidden');
//       outputArea.innerHTML = `
//         <div className="flex flex-col items-center justify-center py-12 gap-4">
//           <div className="w-7 h-7 rounded-full border-2 border-black/10 border-t-accent spinner"></div>
//           <div className="text-sm text-ink-2 font-light">Flusso AI is planning your project...</div>
//         </div>`;

//       const systemPrompt = `You are Flusso's AI project planner. Given a project description, generate a detailed project plan as JSON only — no markdown, no explanation, just raw JSON.

// Return this exact structure:
// {
//   "projectName": "string",
//   "summary": "string (one sentence)",
//   "totalDuration": "string (e.g. 6 weeks)",
//   "taskCount": number,
//   "tasks": [
//     {
//       "id": number,
//       "title": "string",
//       "description": "string (1-2 sentences)",
//       "deadline": "string (e.g. Week 1, Day 3 or specific phase)",
//       "priority": "High" | "Medium" | "Low"
//     }
//   ],
//   "milestones": [
//     { "name": "string", "date": "string" }
//   ]
// }

// Generate 5-7 tasks and 3 milestones. Make tasks specific, actionable, and realistic. Vary priorities. Return ONLY the JSON object.`;

//       try {
//         const response = await fetch("https://api.anthropic.com/v1/messages", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             model: "claude-sonnet-4-20250514",
//             max_tokens: 1000,
//             system: systemPrompt,
//             messages: [{ role: "user", content: `Create a project plan for: ${prompt}` }]
//           })
//         });

//         const data = await response.json();
//         const raw = data.content.map(b => b.text || '').join('').trim();
//         const clean = raw.replace(/```json|```/g, '').trim();
//         const plan = JSON.parse(clean);
//         renderProject(plan);
//       } catch (err) {
//         outputArea.classList.add('hidden');
//         errorArea.innerHTML = `<div className="text-sm text-[#A32D2D] bg-[#FCEBEB] rounded-lg px-4 py-3 mt-3">Something went wrong generating your project. Please try again.</div>`;
//       } finally {
//         btn.disabled = false;
//         btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L9.8 6.2L15 8L9.8 9.8L8 15L6.2 9.8L1 8L6.2 6.2L8 1Z" fill="white"/></svg> Generate project';
//       }
//     }

//     function priClass(p) {
//       if (p === 'High') return 'bg-[#FCEBEB] text-[#A32D2D]';
//       if (p === 'Medium') return 'bg-[#FAEEDA] text-[#854F0B]';
//       return 'bg-[#EAF3DE] text-[#3B6D11]';
//     }

//     function renderProject(plan) {
//       const tasksHTML = plan.tasks.map((t, i) => `
//         <div className="task-card bg-white border border-black/[0.09] rounded-xl p-4 grid grid-cols-[1fr_auto] gap-2" style="animation-delay:${i * 0.06}s">
//           <div>
//             <div className="flex items-center gap-2.5 mb-1">
//               <div className="w-5 h-5 rounded-full border border-black/[0.15] flex items-center justify-center text-[10px] font-medium text-ink-3 flex-shrink-0">${t.id}</div>
//               <div className="text-sm font-medium text-ink">${t.title}</div>
//             </div>
//             <div className="text-[13px] text-ink-2 font-light leading-relaxed pl-8">${t.description}</div>
//           </div>
//           <div className="flex flex-col items-end gap-1.5">
//             <div className="text-[11px] px-2.5 py-1 rounded-full bg-accent-light text-accent-mid font-medium whitespace-nowrap">${t.deadline}</div>
//             <div className="text-[10px] px-2 py-0.5 rounded font-medium ${priClass(t.priority)}">${t.priority}</div>
//           </div>
//         </div>
//       `).join('');

//       const milestonesHTML = plan.milestones.map(m => `
//         <div className="flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
//           <div className="text-sm text-ink flex-1">${m.name}</div>
//           <div className="text-xs text-ink-3">${m.date}</div>
//         </div>
//       `).join('');

//       document.getElementById('output-area').innerHTML = `
//         <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
//           <div>
//             <div className="font-serif text-2xl tracking-tight text-ink font-normal">${plan.projectName}</div>
//             <div className="text-sm text-ink-3 mt-1 font-light">${plan.summary}</div>
//           </div>
//           <div className="flex gap-2 flex-wrap">
//             <div className="text-xs px-3 py-1.5 rounded-full border border-black/[0.09] text-ink-2 bg-white">${plan.totalDuration}</div>
//             <div className="text-xs px-3 py-1.5 rounded-full border border-black/[0.09] text-ink-2 bg-white">${plan.taskCount} tasks</div>
//             <div className="text-xs px-3 py-1.5 rounded-full border border-black/[0.09] text-ink-2 bg-white">${plan.milestones.length} milestones</div>
//           </div>
//         </div>
//         <div className="flex flex-col gap-2">${tasksHTML}</div>
//         <div className="mt-6 bg-white border border-black/[0.09] rounded-xl p-5">
//           <div className="text-[11px] font-medium text-ink-3 uppercase tracking-wide mb-4">Milestones</div>
//           <div className="flex flex-col gap-3">${milestonesHTML}</div>
//         </div>
//         <div className="mt-6 bg-ink rounded-xl px-7 py-6 flex items-center justify-between gap-4 flex-wrap">
//           <div>
//             <div className="text-base font-medium text-white mb-0.5">Ready to build this in Flusso?</div>
//             <div className="text-sm text-white/60 font-light">Import this project and start working in seconds.</div>
//           </div>
//           <button className="bg-white text-ink text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#f0efec] transition-colors flex-shrink-0">Import to Flusso →</button>
//         </div>
//       `;
//     }
//   </script>
