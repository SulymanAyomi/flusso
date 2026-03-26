import { clsx, type ClassValue } from "clsx"
import { format, formatDistanceToNow } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export function snakeCaseToTitleCase(str: string) {
  return str.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const formatTwoDigits = (num: number): string => {
  return num.toString().padStart(2, "0").slice(-2)
}

export function calculatePercentageChange(previousCount: number, currentCount: number) {
  if (previousCount === 0) {
    return {
      change: currentCount > 0 ? 100 : 0,
      direction: currentCount > 0 ? "up" : "neutral"
    };
  }

  const diff = currentCount - previousCount;
  const change = Math.abs((diff / previousCount) * 100);
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";

  return { change: Math.round(change), direction };
}

export function formatActivityDate(date: string) {
  const newDate = new Date(date)
  const now = new Date()
  const diff = now.getTime() - newDate.getTime()
  const ONE_WEEK = 7 * 24 * 24 * 60 * 60 * 1000
  if (diff < ONE_WEEK) {
    return formatDistanceToNow(newDate, { addSuffix: true })
  }

  return format(newDate, "MMM d, yyyy")
}