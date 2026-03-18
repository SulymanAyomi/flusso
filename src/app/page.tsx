import HomepageImage from "@/components/homepage/image";
import Navbar from "@/components/homepage/navbar";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  Grid2x2CheckIcon,
  HammerIcon,
  RocketIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react";
import React from "react";
import { FaStar } from "react-icons/fa";

const Page = () => {
  return (
    <div className="bg-white text-black">
      <Navbar />
      <section className="max-w-3xl mx-auto px-12 pt-20 pb-20 text-center">
        <div className="flex flex-col items-center justify-center w-full py-5">
          <div className="inline-flex items-center gap-1.5 bg-accent-light text-brand2 text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide">
            <div className="w-1.5 h-1.5 bg-brand2 rounded-full"></div>
            AI-powered workspace — now in beta
          </div>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] tracking-tight text-ink mb-6 font-normal">
            Work flows when
            <br />
            everything is
            <em className="text-brand2 not-italic"> in one place</em>
          </h1>
          <p className="text-lg text-ink-2 max-w-lg mx-auto mb-10 font-light leading-relaxed">
            Flusso brings tasks, projects, team collaboration, and AI-powered
            insights into one calm, intelligent workspace.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              size={"lg"}
              className="text-[15px] font-medium px-7 py-5 rounded-lg"
            >
              Get started free
            </Button>
            <Button
              size={"lg"}
              variant={"outline"}
              className="bg-white text-[15px] px-7 py-5 rounded-lg border text-black/80 hover:text-black transition-colors"
            >
              See how it works →
            </Button>
          </div>
          <p className="text-xs text-ink-3 mt-4">
            No credit card required · Free for teams up to 5
          </p>
        </div>
      </section>
      <HomepageImage />
      <section className="max-w-5xl mx-auto px-12 py-24">
        <div className="text-[11px] font-medium tracking-[1.5px] text-brand2 uppercase mb-3 text-center">
          Benefits
        </div>
        <h2 className="font-serif text-4xl tracking-tight text-center font-normal mx-auto mb-3">
          The smarter way to manage work
        </h2>
        <p className="text-neutral-500 text-xs text-center mb-14">
          Everything you need to simpilify your projectss, boost productivity
          and keep your team aligned.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4  overflow-hidden">
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center mb-5">
              <Grid2x2CheckIcon className="size-4 text-green-400" />
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              Seamless Collaboration
            </h3>
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Work together in real time. Assign tasks, share updates, and keep
              everyone aligned across projects.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center mb-5">
              <Grid2x2CheckIcon className="size-4 text-green-400" />
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              All-in-One Workspace
            </h3>
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Manage tasks, projects, and team activities in one intuitive
              platform without switching tools.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center mb-5">
              <Grid2x2CheckIcon className="size-4 text-green-400" />
            </div>
            <h3 className="text-base font-medium text-ink mb-2 tracking-tight">
              Flexible Workflows
            </h3>
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Customize your workflow to match how your team works, from simple
              task lists to structured project plans.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-12 py-24">
        <div className="text-[11px] font-medium tracking-[1.5px] text-brand2 uppercase mb-3 text-center">
          Features
        </div>
        <h2 className="font-serif text-4xl tracking-tight text-center font-normal mx-auto mb-3">
          Powerful tools to keep your projects on track
        </h2>
        <p className="text-neutral-500 text-xs text-center mb-14">
          Stay organized, track progress, and manage work effortlessly with
          features designed for modern teams.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4  overflow-hidden">
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center mb-5">
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
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Create tasks with priorities, deadlines, subtasks, and
              dependencies. Organize by project or personal workspace.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border shadow-sm">
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
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Switch between table, board, and calendar views. Visualize work
              the way your team actually thinks.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl border shadow-sm">
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
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Assign tasks, track contributions, comment on work, and keep the
              entire team aligned in shared workspaces.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border shadow-sm">
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
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Dashboards showing completion rates, project progress, and team
              activity so you always know where things stand.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border shadow-sm">
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
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Group tasks into projects, track milestones, and get full
              visibility into how work is progressing end-to-end.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border shadow-sm">
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
            <p className="text-xs leading-relaxed font-light text-neutral-500">
              Smart suggestions, intelligent scheduling, and workload insights
              powered by AI — built right into your workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border-black/[0.09] py-20 px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-[11px] font-medium tracking-[1.5px] text-brand2 uppercase mb-3 text-center">
            Testimonial
          </div>
          <h2 className="font-serif text-4xl tracking-tight text-center font-normal mx-auto mb-3">
            What our users says
          </h2>
          <p className="text-neutral-500 text-xs text-center mb-14">
            Flusso helped our team stay organized and move faster across
            projects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-black/[0.09] rounded-xl p-7 bg-surface">
              <div className="flex gap-1 mb-4">
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
              </div>
              <p className="text-xs text-neutral-900 font-light leading-relaxed mb-5">
                "We moved off four separate tools into Flusso in one week. The
                whole team actually uses it now, which has never happened
                before."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-[11px] font-medium text-blue-500 flex-shrink-0">
                  SR
                </div>
                <div>
                  <div className="text-sm font-medium text-black">
                    Sarah Reeves
                  </div>
                  <div className="text-xs text-neutral-700">
                    Head of Product, Aether Labs
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-black/[0.09] rounded-xl p-7 bg-surface">
              <div className="flex gap-1 mb-4">
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
              </div>
              <p className="text-xs text-ink-2 font-light leading-relaxed mb-5">
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
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
                <FaStar className="size-3 bg-white text-[#FAC775]" />
              </div>
              <p className="text-xs text-ink-2 font-light leading-relaxed mb-5">
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

      <section className="max-w-5xl mx-auto px-12 py-24">
        <div className="text-[11px] font-medium tracking-[1.5px] text-brand2 uppercase mb-3 text-center">
          Pricing
        </div>
        <h2 className="font-serif text-4xl tracking-tight text-center font-normal mx-auto mb-3">
          Flexible plans for every team
        </h2>
        <p className="text-neutral-500 text-xs text-center mb-14">
          Choose the plan that best fit for your team's needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border  rounded-xl p-7 bg-white">
            <div className="bg-neutral-100 p-2 w-fit rounded size-9 flex items-center justify-center mb-5">
              <HammerIcon className="text-pink-300" />
            </div>
            <p className="font-medium text-xl mb-2">Starter Plan</p>
            <p className="text-sm text-neutral-700 mb-5">
              Perfect plan for individuals and teams getting started with task
              management
            </p>
            <p className="font-bold text-2xl mb-5">FREE</p>

            <div className="h-px bg-black/[0.09] mb-4"></div>
            <ul className="flex flex-col gap-2.5 mb-6 list-none">
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Up to 5 members
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />5 active projects
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Table & board views
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Basic analytics
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-black/[0.09] text-black bg-neutral-200 hover:bg-brand1 hover:text-white transition-colors">
              Get started
            </button>
          </div>

          <div className="shadow shadow-neutral-400 rounded-xl p-7 bg-white">
            <div className="bg-neutral-100 p-2 w-fit rounded size-9 flex items-center justify-center mb-5">
              <RocketIcon className="text-brand1" />
            </div>
            <p className="font-medium text-xl mb-2">Pro Plan</p>
            <p className="text-sm text-neutral-700 mb-5">
              Dsigned for growing teams that need advanced features and
              flexibility
            </p>
            <p className="font-bold text-2xl mb-5">
              <sup className="font-sans text-base align-top mt-2 inline-block">
                NGN
              </sup>
              12
              <sub className="font-sans text-sm text-black/40 align-baseline">
                /month
              </sub>
            </p>

            <div className="h-px bg-black/[0.09] mb-4"></div>
            <ul className="flex flex-col gap-2.5 mb-6 list-none">
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Unlimited members
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Unlimited projects
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                All views + calendar
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Advanced analytics
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                AI assistant
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-black/[0.09] text-white bg-brand1 hover:bg-brand1/90 hover:text-white transition-colors">
              Start free trial
            </button>
          </div>
          <div className="border  rounded-xl p-7 bg-white">
            <div className="bg-neutral-100 p-2 w-fit rounded size-9 flex items-center justify-center mb-5">
              <BriefcaseBusinessIcon className="text-yellow-300" />
            </div>
            <p className="font-medium text-xl mb-2">Enterprise Plan</p>
            <p className="text-sm text-neutral-700 mb-5">
              Best for large teams and enterprises with multiple projects and
              complex workflows
            </p>
            <p className="font-bold text-2xl mb-5">Custom</p>

            <div className="h-px bg-black/[0.09] mb-4"></div>
            <ul className="flex flex-col gap-2.5 mb-6 list-none">
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Everything in Pro
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " /> SSO & SAML
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Dedicated support
              </li>
              <li className="text-sm text-black font-medium flex items-center gap-2">
                <CheckIcon className="text-brand2 size-3.5 " />
                Custom integrations
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-black/[0.09] text-black bg-neutral-200 hover:bg-brand1 hover:text-white transition-colors">
              Contact sales
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-12 py-24 bg-[#f2f2f2] rounded-xl">
        <div className="flex  flex-col justify-between items-center md:items-start w-full">
          <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
            <h2 className="text-4xl tracking-tight font-normal text-center md:text-left mx-auto mb-3">
              Ready to streamline your workflow
            </h2>
            <p className="text-neutral-400 text-sm mb-5 text-center md:text-left">
              Join Flusso today and manage your projects with a smarter, faster
              workflow.
            </p>
            <button className="w-fit py-2.5 px-4 rounded-lg text-sm font-medium border border-black/[0.09] text-white bg-brand1 hover:bg-brand1/90 hover:text-white transition-colors">
              Get Started Now
            </button>
          </div>
          <div className="w-1/2 h-full">
            {/* <img
              src="/homepage.png"
              className="scale-150 rotate-45 w-full overflow-hidden"
            /> */}
          </div>
        </div>
      </section>

      <footer className="max-w-5xl mx-auto bg-white border-t mt-12 px-12 py-10 ">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-serif text-lg">
              Flusso<span className="text-accent">.</span>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Contact:</p>
              <p className="text-xs text-neutral-500 pl-2">flusso@gmail.com</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-sm font-semibold mb-3">Sitemap</p>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                  >
                    Features
                  </a>
                </li>{" "}
                <li>
                  <a
                    href="#"
                    className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Company</p>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Legal</p>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-xs text-neutral-800 text-center">
          © 2025 Flusso, Inc.
        </div>
      </footer>
    </div>
  );
};

export default Page;
