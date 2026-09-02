import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm bg-white/[0.04]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent",
        className,
      )}
    />
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="rounded-md border border-white/8 bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16 rounded-xs" />
      </div>
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3.5 w-28" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-white/6">
      <Skeleton className="h-3.5 w-8" />
      <Skeleton className="h-3.5 flex-1 max-w-40" />
      <Skeleton className="h-3.5 flex-1 max-w-28" />
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="h-6 w-16 rounded-xs ml-auto" />
    </div>
  );
}
