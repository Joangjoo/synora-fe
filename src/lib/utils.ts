import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return "Baru saja";
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to minutes, hours, days
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  
  // Return formatted date for older dates
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}