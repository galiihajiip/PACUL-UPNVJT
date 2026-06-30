"use client";

export function SkeletonKPICard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-8 w-8 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-20 rounded" />
      <div className="skeleton h-3 w-36 rounded" />
    </div>
  );
}

export function SkeletonChartCard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <div className="skeleton h-4 w-40 rounded" />
      <div className="skeleton h-48 w-full rounded-xl" />
    </div>
  );
}

export function SkeletonPostCard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="skeleton h-9 w-9 rounded-full" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="skeleton h-3 w-28 rounded" />
          <div className="skeleton h-2.5 w-20 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="skeleton h-3 w-3/5 rounded" />
      <div className="flex gap-3 pt-1">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-[#F3F4F6]">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="py-3 pr-4">
          <div className="skeleton h-3 rounded" style={{ width: `${60 + (i * 7) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonMapCard() {
  return (
    <div className="skeleton h-80 w-full rounded-2xl" />
  );
}
