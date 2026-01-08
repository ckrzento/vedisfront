'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton rounded ${className}`} />
  );
}

export function DocumentRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <Skeleton className="w-5 h-5 rounded-full" />
      <Skeleton className="w-[180px] h-4" />
      <div className="flex-1" />
      <Skeleton className="w-[60px] h-3" />
      <Skeleton className="w-4 h-4" />
    </div>
  );
}

export function DocumentListSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-[#E8E8E8] divide-y divide-[#E8E8E8]">
      {Array.from({ length: 6 }).map((_, i) => (
        <DocumentRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function FieldRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="w-[140px] h-4" />
      <Skeleton className="w-[200px] h-3" />
      <div className="flex-1" />
      <Skeleton className="w-[50px] h-3" />
    </div>
  );
}

export function DocumentDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="w-[200px] h-7" />
        <Skeleton className="w-[300px] h-4" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-[100px] h-5" />
          <Skeleton className="w-[80px] h-8" />
        </div>
        <div className="bg-white rounded-lg border border-[#E8E8E8] divide-y divide-[#E8E8E8]">
          {Array.from({ length: 4 }).map((_, i) => (
            <FieldRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
