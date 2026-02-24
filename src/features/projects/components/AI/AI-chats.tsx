import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  Wifi,
  RefreshCw,
  Edit,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ChatMessage, ErrorAction, ErrorMessage } from "../../types";
import { AIChatMessage } from "./ChatMessage";

interface AIChatsResponseProps {
  chat: ChatMessage;
}

const ERROR_SEVERITY = {
  // Critical - Red
  critical: [
    "PROMPT_CONTAINS_MALICIOUS_CONTENT",
    "RATE_LIMIT_USER_EXCEEDED",
    "SERVER_ERROR",
  ],
  // Warning - Amber
  warning: [
    "GENERATION_TIMEOUT",
    "AI_RATE_LIMIT_EXCEEDED",
    "PROJECT_TOO_COMPLEX",
    "GENERATION_PARTIAL_SUCCESS",
  ],
  // Info - Blue (most validation errors)
  info: [
    "PROMPT_TOO_SHORT",
    "PROMPT_TOO_LONG",
    "PROMPT_NOT_A_PROJECT",
    "PROMPT_TOO_VAGUE",
    "PROMPT_CONTAINS_MULTIPLE_PROJECTS",
    "VALIDATION_NETWORK_ERROR",
    "VALIDATION_AI_TIMEOUT",
    "AI_SERVICE_ERROR",
    "AI_INVALID_OUTPUT",
    "GENERATION_NETWORK_ERROR",
    "CIRCULAR_DEPENDENCY_DETECTED",
    "BROWSER_OFFLINE",
  ],
};

const ERROR_ICONS = {
  PROMPT_TOO_SHORT: Info,
  PROMPT_TOO_LONG: Info,
  PROMPT_NOT_A_PROJECT: AlertCircle,
  PROMPT_TOO_VAGUE: AlertTriangle,
  PROMPT_CONTAINS_MULTIPLE_PROJECTS: AlertTriangle,
  PROMPT_CONTAINS_MALICIOUS_CONTENT: ShieldAlert,
  VALIDATION_NETWORK_ERROR: Wifi,
  VALIDATION_AI_TIMEOUT: Clock,
  GENERATION_TIMEOUT: Clock,
  AI_SERVICE_ERROR: AlertTriangle,
  AI_INVALID_OUTPUT: RefreshCw,
  AI_RATE_LIMIT_EXCEEDED: Clock,
  GENERATION_NETWORK_ERROR: Wifi,
  CIRCULAR_DEPENDENCY_DETECTED: AlertCircle,
  GENERATION_PARTIAL_SUCCESS: AlertTriangle,
  RATE_LIMIT_USER_EXCEEDED: ShieldAlert,
  PROJECT_TOO_COMPLEX: AlertTriangle,
  SERVER_ERROR: AlertCircle,
  BROWSER_OFFLINE: Wifi,
};
const AIChatsResponse = ({ chat }: AIChatsResponseProps) => {
  return (
    <div className="flex items-start justify-start w-full animate-message-appear">
      {chat.type == "AI"
        ? chat.projectTask && (
            <AIChatMessage
              project={chat.projectTask}
              onStreamComplete={chat.handleStreamComplete}
              speed={700}
              actions={chat.actions!}
            />
          )
        : chat.type == "ERROR" && <ChatsError chat={chat} />}
    </div>
  );
};

export default AIChatsResponse;

const ChatsError = ({ chat }: { chat: ErrorMessage }) => {
  if (!chat.errorType) {
    return <DefaultError message={chat.prompt} />;
  }
  // Determine error severity
  const severity = ERROR_SEVERITY.critical.includes(chat.errorType)
    ? "critical"
    : ERROR_SEVERITY.warning.includes(chat.errorType)
      ? "warning"
      : "info";
  const Icon = ERROR_ICONS[chat.errorType] || AlertCircle;

  const styles = {
    critical: {
      border: "border-red-200",
      bg: "bg-red-50/80",
      icon: "text-red-500",
    },
    warning: {
      border: "border-amber-200",
      bg: "bg-amber-50/80",
      icon: "text-amber-500",
    },
    info: {
      border: "border-blue-200",
      bg: "bg-blue-50/80",
      icon: "text-blue-500",
    },
  }[severity];

  switch (chat.errorType) {
    case "PROMPT_TOO_SHORT":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Your prompt is too short. Please describe your project in more
            detail.
          </p>
          <div className="mt-3">
            <p className="text-sm text-slate-600 mb-2">For example:</p>
            <ul className="text-sm text-slate-600 space-y-1 pl-4">
              <li>• Create a marketing campaign for Q4</li>
              <li>• Build a portfolio website with a blog</li>
              <li>• Plan a product launch event</li>
            </ul>
          </div>
          <ErrorActions
            actions={
              chat.actions || [
                { label: "Edit Prompt", variant: "primary", onClick: () => {} },
              ]
            }
          />
        </ErrorLayout>
      );
    case "PROMPT_TOO_LONG":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Your prompt is too long ({chat.metadata?.currentLength} characters).
            Please keep it under {chat.metadata?.maxLength || 2000} characters.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Try focusing on the core objectives rather than every detail.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                { label: "Edit Prompt", variant: "primary", onClick: () => {} },
              ]
            }
          />
        </ErrorLayout>
      );
    case "PROMPT_NOT_A_PROJECT":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            This doesn't seem to describe a project or set of tasks.
          </p>
          <div className="mt-3">
            <p className="text-slate-700 mb-2 text-sm">
              I can help you create projects like:
            </p>
            <ul className="text-slate-600 space-y-1 pl-4 text-sm">
              <li>• Marketing campaigns</li>
              <li>• Product launches</li>
              <li>• Website builds</li>
              <li>• Event planning</li>
            </ul>
          </div>
          <p className="text-slate-700 leading-relaxed mt-3">
            Could you rephrase your request?
          </p>
          <ErrorActions
            actions={chat.actions}
            suggestions={chat.metadata?.suggestions}
            onSuggestion={chat.onSuggestion}
          />
        </ErrorLayout>
      );
    case "PROMPT_TOO_VAGUE":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Your prompt is a bit vague. I need more details to create a good
            project.
          </p>
          {chat.metadata?.suggestions &&
            chat.metadata.suggestions.length > 0 && (
              <p className="text-slate-700 mt-3">Did you mean one of these?</p>
            )}
          <ErrorActions
            actions={chat.actions}
            suggestions={chat.metadata?.suggestions}
            onSuggestion={chat.onSuggestion}
          />
        </ErrorLayout>
      );
    case "PROMPT_CONTAINS_MULTIPLE_PROJECTS":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            It looks like you're describing multiple projects. I can only create
            one project at a time.
          </p>
          {chat.metadata?.suggestions && (
            <div className="mt-3">
              <p className="text-slate-700 mb-2">
                Which one should we start with?
              </p>
            </div>
          )}
          <ErrorActions
            actions={chat.actions}
            suggestions={chat.metadata?.suggestions}
            onSuggestion={chat.onSuggestion}
          />
        </ErrorLayout>
      );
    case "PROMPT_CONTAINS_MALICIOUS_CONTENT":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Your prompt contains invalid characters or patterns.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Please remove any HTML, scripts, or special characters and try
            again.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                { label: "Start Fresh", variant: "primary", onClick: () => {} },
              ]
            }
          />
        </ErrorLayout>
      );
    case "VALIDATION_NETWORK_ERROR":
    case "GENERATION_NETWORK_ERROR":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Connection lost while{" "}
            {chat.errorType.includes("VALIDATION")
              ? "validating"
              : "generating"}{" "}
            your prompt.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Please check your internet connection and try again.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                {
                  label: "Retry",
                  variant: "primary",
                  onClick: () => {},
                  // @ts-ignore
                  icon: RefreshCw,
                },
                {
                  label: "Edit Prompt",
                  variant: "outline",
                  onClick: () => {},
                  icon: Edit,
                },
              ]
            }
          />
        </ErrorLayout>
      );

    case "VALIDATION_AI_TIMEOUT":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Validation took too long. This is unusual.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Please try again or simplify your prompt.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                { label: "Retry", variant: "primary", onClick: () => {} },
                {
                  label: "Simplify Prompt",
                  variant: "outline",
                  onClick: () => {},
                },
              ]
            }
          />
        </ErrorLayout>
      );
    case "GENERATION_TIMEOUT":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Generation took too long. Your project might be too complex for the
            current system.
          </p>
          <p className="text-sm text-slate-600 mt-2">Try one of these:</p>
          <ErrorActions
            actions={
              chat.actions || [
                {
                  label: "Retry Anyway",
                  variant: "primary",
                  onClick: () => {},
                },
                {
                  label: "Simplify Project",
                  variant: "outline",
                  onClick: () => {},
                },
                { label: "Start Over", variant: "ghost", onClick: () => {} },
              ]
            }
          />
        </ErrorLayout>
      );

    case "AI_SERVICE_ERROR":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            The AI service is temporarily unavailable.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            This is usually brief. Please try again in a moment.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                { label: "Retry Now", variant: "primary", onClick: () => {} },
                {
                  label: "Try in 30s",
                  variant: "outline",
                  onClick: () => {},
                  countdown: 30,
                },
                { label: "Start Over", variant: "ghost", onClick: () => {} },
              ]
            }
          />
        </ErrorLayout>
      );

    case "AI_INVALID_OUTPUT":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            The AI generated invalid data. This is rare.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Retrying automatically...
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Attempting to regenerate...</span>
          </div>
        </ErrorLayout>
      );

    case "AI_RATE_LIMIT_EXCEEDED":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            You've made too many requests. This protects the AI service from
            overload.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Please wait {chat.metadata?.retryAfter || 60} seconds before trying
            again.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                {
                  label: `Retry in ${chat.metadata?.retryAfter || 60}s`,
                  variant: "primary",
                  onClick: () => {},
                  countdown: chat.metadata?.retryAfter || 60,
                },
              ]
            }
          />
        </ErrorLayout>
      );

    case "CIRCULAR_DEPENDENCY_DETECTED":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            The AI created tasks with circular dependencies (Task A depends on
            Task B, which depends on Task A).
          </p>
          <p className="text-sm text-slate-600 mt-2">
            I'll try to fix this automatically...
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Resolving dependencies...</span>
          </div>
        </ErrorLayout>
      );

    case "GENERATION_PARTIAL_SUCCESS":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Generated {chat.metadata?.partialData?.taskCount || 8} of{" "}
            {chat.metadata?.partialData?.expectedCount || 12} tasks before
            timing out.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            You can continue with these tasks, or try again for all of them.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                {
                  label: `Continue with ${chat.metadata?.partialData?.taskCount || 8} Tasks`,
                  variant: "primary",
                  onClick: () => {},
                },
                {
                  label: "Try Again for All",
                  variant: "outline",
                  onClick: () => {},
                },
                {
                  label: "Edit Task Count",
                  variant: "ghost",
                  onClick: () => {},
                },
              ]
            }
          />
        </ErrorLayout>
      );

    case "RATE_LIMIT_USER_EXCEEDED":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            You've reached your limit of 5 projects per hour.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            This prevents abuse of the free service. Please try again later.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                {
                  label: `Try Again in ${Math.floor((chat.metadata?.retryAfter || 3600) / 60)}m`,
                  variant: "primary",
                  onClick: () => {},
                  countdown: chat.metadata?.retryAfter,
                },
                {
                  label: "View My Projects",
                  variant: "outline",
                  onClick: () => {},
                },
              ]
            }
          />
        </ErrorLayout>
      );

    case "PROJECT_TOO_COMPLEX":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Your project is too complex for a single workflow. It needs ~25
            tasks.
          </p>
          <p className="text-slate-600 mt-2 mb-3">
            The current system supports up to 15 tasks per project.
          </p>
          {chat.metadata?.suggestions && (
            <div className="mb-3">
              <p className="text-sm text-slate-700 mb-2">
                Try breaking it into smaller projects:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 pl-4">
                {chat.metadata.suggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
          <ErrorActions
            actions={chat.actions}
            suggestions={chat.metadata?.suggestions}
            onSuggestion={chat.onSuggestion}
          />
        </ErrorLayout>
      );

    case "SERVER_ERROR":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            Something unexpected went wrong on our end.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            The error has been logged. Please try again.
          </p>
          {chat.metadata?.errorId && (
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Error ID: {chat.metadata.errorId}
            </p>
          )}
          <ErrorActions
            actions={
              chat.actions || [
                { label: "Retry", variant: "primary", onClick: () => {} },
                { label: "Start Over", variant: "outline", onClick: () => {} },
              ]
            }
          />
        </ErrorLayout>
      );

    case "BROWSER_OFFLINE":
      return (
        <ErrorLayout icon={Icon} styles={styles}>
          <p className="text-slate-700 leading-relaxed">
            You appear to be offline.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Please check your internet connection and try again.
          </p>
          <ErrorActions
            actions={
              chat.actions || [
                {
                  label: "Retry When Online",
                  variant: "primary",
                  onClick: () => {},
                },
              ]
            }
          />
        </ErrorLayout>
      );

    default:
      return <DefaultError message={chat.prompt} />;
  }
};

interface ErrorLayoutProps {
  icon: React.ElementType;
  styles: {
    border: string;
    bg: string;
    icon: string;
  };
  children: React.ReactNode;
}

const ErrorLayout = ({ icon: Icon, styles, children }: ErrorLayoutProps) => {
  return (
    <div className="w-full flex items-start gap-3">
      {/* <Sparkles className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" /> */}
      <div
        className={`${styles.bg} backdrop-blur-sm rounded-2xl rounded-tl-none px-6 py-4 shadow-sm border ${styles.border} w-full md:w-fit md:max-w-[85%]`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${styles.icon} mt-0.5 flex-shrink-0`} />
          <div className="flex-1 space-y-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

interface ErrorActionsProps {
  actions?: ErrorAction[];
  suggestions?: string[];
  onSuggestion?: (onSuggestion: string) => void;
}

const ErrorActions = ({
  actions,
  suggestions,
  onSuggestion,
}: ErrorActionsProps) => {
  if (!actions && !suggestions) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {/* Render suggestion dropdown if provided */}
      {onSuggestion && suggestions && suggestions.length > 0 && (
        <SuggestionsDropdown
          suggestions={suggestions}
          onSuggestion={onSuggestion}
        />
      )}

      {/* Render action buttons */}
      {actions?.map((action, index) => (
        <ActionButton key={index} action={action} />
      ))}
    </div>
  );
};

interface ActionButtonProps {
  action: ErrorAction;
}

const ActionButton = ({ action }: ActionButtonProps) => {
  const [countdown, setCountdown] = useState(action.countdown || 0);
  const [isDisabled, setIsDisabled] = useState(
    action.disabled || !!action.countdown,
  );

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const getLabel = () => {
    if (countdown > 0) {
      return action.label.replace(/\d+/, countdown.toString());
    }
    return action.label;
  };

  return (
    <Button
      variant={action.variant || "primary"}
      size="sm"
      onClick={action.onClick}
      disabled={isDisabled}
      className="rounded-xl text-xs font-medium min-w-[100px]"
    >
      {countdown > 0 && <Clock className="w-3 h-3 mr-1.5" />}
      {getLabel()}
    </Button>
  );
};

interface SuggestionsDropdownProps {
  suggestions: string[];
  onSuggestion: (onSuggestion: string) => void;
}

const SuggestionsDropdown = ({
  suggestions,
  onSuggestion,
}: SuggestionsDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl text-xs font-medium"
        >
          Try These Examples ▼
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[320px]">
        {suggestions.map((suggestion, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => onSuggestion(suggestion)}
            className="font-medium p-3 cursor-pointer"
          >
            {suggestion}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DefaultError = ({ message }: { message: string }) => {
  return (
    <ErrorLayout
      icon={AlertCircle}
      styles={{
        border: "border-slate-200",
        bg: "bg-slate-50/80",
        icon: "text-slate-500",
      }}
    >
      <p className="text-slate-700 leading-relaxed">{message}</p>
      <ErrorActions
        actions={[
          { label: "Retry", variant: "primary", onClick: () => {} },
          { label: "Start Over", variant: "outline", onClick: () => {} },
        ]}
      />
    </ErrorLayout>
  );
};
