"use client";

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  {
    category: "Marketingo",
    icon: "📢",
    prompts: [
      "Plan a bungalow project",
      "Tell me a joke",
      "Build an app",
      "Plan a training session",
    ],
  },
  {
    category: "Marketing",
    icon: "📢",
    prompts: [
      "Launch a content marketing campaign for a SaaS product",
      "Plan a social media strategy for Q1 2026",
    ],
  },
  {
    category: "Development",
    icon: "💻",
    prompts: [
      "Build a portfolio website with case studies and contact form",
      "Create a mobile app MVP with user authentication",
    ],
  },
  {
    category: "Events",
    icon: "🎉",
    prompts: [
      "Organize a virtual conference with 5 speakers",
      "Plan a product launch event for 200 attendees",
    ],
  },
  {
    category: "Business",
    icon: "📊",
    prompts: [
      "Develop a go-to-market strategy for a new feature",
      "Create an onboarding process for new employees",
    ],
  },
];

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-600 text-center">
        Or try an example:
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXAMPLE_PROMPTS.map((category, categoryIndex) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 px-2">
              <span className="text-base">{category.icon}</span>
              <span>{category.category}</span>
            </div>

            {category.prompts.map((prompt, promptIndex) => (
              <button
                key={prompt}
                onClick={() => onSelect(prompt)}
                className="
                  w-full text-left px-4 py-3 rounded-lg
                  bg-white/60 hover:bg-white
                  border border-slate-200 hover:border-blue-300
                  text-sm text-slate-700 hover:text-slate-900
                  transition-all duration-200
                  hover:shadow-md hover:scale-[1.02]
                  active:scale-[0.98]
                  group
                "
                style={{
                  animationDelay: `${
                    (categoryIndex * 2 + promptIndex) * 0.05
                  }s`,
                }}
              >
                <span className="block truncate">{prompt}</span>
                <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 block">
                  Click to use →
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
