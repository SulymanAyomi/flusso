// components/TagBadge.tsx
import { X } from "lucide-react";
import { cn } from "@/lib/utils"; // optional utility for classnames

type TagBadgeProps = {
  name: string;
  onRemove?: () => void;
  className?: string;
};

function getColorFromName(name: string) {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "bg-red-100 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-teal-100 text-teal-800",
  ];
  return colors[hash % colors.length];
}

export function TagBadge({ name, onRemove, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-sm rounded-full font-medium",
        getColorFromName(name),
        className
      )}
    >
      {name}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-80">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
