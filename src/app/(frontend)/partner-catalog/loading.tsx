import { Skeleton } from "@/shared/ui/skeleton";

function CatalogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[18px] bg-[var(--card-bg)] md:rounded-[22.5px]">
      <div className="relative aspect-square w-full overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none bg-[#e7f0ff]" />
      </div>
      <div className="space-y-3 p-[18px] md:p-[22px]">
        <Skeleton className="h-5 w-28 bg-[#ddd9cf]" />
        <Skeleton className="h-8 w-full bg-[#e4e0d6]" />
        <Skeleton className="h-8 w-4/5 bg-[#e4e0d6]" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-32 bg-[#ddd9cf]" />
          <Skeleton className="h-4 w-24 bg-[#ddd9cf]" />
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-10 w-10 rounded-[6px] bg-[#ddd9cf]" />
          <Skeleton className="h-10 w-10 rounded-[6px] bg-[#ddd9cf]" />
          <Skeleton className="h-10 w-10 rounded-[6px] bg-[#ddd9cf]" />
          <Skeleton className="h-10 w-10 rounded-[6px] bg-[#ddd9cf]" />
        </div>
        <Skeleton className="h-[47px] w-full rounded-[7px] bg-[#d8e8ff]" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <section className="mt-8 mb-[45px] md:mt-12">
      <div className="mb-6 space-y-4">
        <Skeleton className="h-4 w-56 bg-[#ddd9cf]" />
        <Skeleton className="h-12 w-[320px] max-w-full bg-[#e4e0d6] md:h-16 md:w-[520px]" />
      </div>

      <div className="mb-5 md:mb-4 md:grid md:grid-cols-[245px_minmax(0,1fr)] md:items-center md:gap-8 xl:gap-[63px]">
        <Skeleton className="h-11 w-44 rounded-full bg-[#e4e0d6]" />
        <div className="mt-3 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-4 w-40 bg-[#ddd9cf]" />
          <div className="hidden gap-2 md:flex">
            <Skeleton className="h-10 w-14 rounded-full bg-[#e4e0d6]" />
            <Skeleton className="h-10 w-14 rounded-full bg-[#e4e0d6]" />
            <Skeleton className="h-10 w-14 rounded-full bg-[#e4e0d6]" />
          </div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-[245px_minmax(0,1fr)] md:items-start md:gap-8 xl:gap-[63px]">
        <aside className="hidden md:block">
          <div className="rounded-[18px] bg-white p-5 md:rounded-[22.5px]">
            <div className="space-y-3">
              <Skeleton className="h-5 w-full bg-[#e4e0d6]" />
              <Skeleton className="h-5 w-4/5 bg-[#e4e0d6]" />
              <Skeleton className="h-5 w-3/4 bg-[#e4e0d6]" />
              <Skeleton className="h-5 w-5/6 bg-[#e4e0d6]" />
              <Skeleton className="h-5 w-2/3 bg-[#e4e0d6]" />
            </div>
          </div>
        </aside>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 lg:grid-cols-3 2xl:grid-cols-4">
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
          <CatalogCardSkeleton />
        </div>
      </div>
    </section>
  );
}
