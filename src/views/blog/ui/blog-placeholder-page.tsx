import { RequestCta } from "@/features/request-cta";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import { buttonVariants } from "@/shared/ui/button";
import Link from "next/link";

export function BlogPlaceholderPage() {
  return (
    <>
      <section className="flex flex-col">
        <PageBreadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Блог", href: "/blog" },
          ]}
          currentLabel="Скоро будет"
        />
        <h1 className="m-0 font-heading text-4xl md:text-6xl xl:text-7xl font-bold uppercase text-[var(--heading)]">Скоро будет</h1>
      </section>

      <section className="my-[45px]">
        <div className="max-w-[760px] rounded-[18px] bg-[var(--card-bg)] p-6 md:rounded-[22.5px] md:p-8 xl:p-10">
          <div className="space-y-5">
            <h2 className="font-heading text-2xl uppercase leading-none text-[var(--heading)] md:text-4xl xl:text-5xl">Материал ещё не готов</h2>
            <p className="max-w-[38rem] text-sm leading-[1.4] text-[var(--text)] md:text-lg xl:text-xl">
              Мы уже работаем над этой публикацией. Скоро здесь появится полноценная статья со всеми деталями.
            </p>
            <Link href="/blog" className={buttonVariants({ variant: "blue" })}>
              Вернуться в блог
            </Link>
          </div>
        </div>
      </section>

      <RequestCta />
    </>
  );
}
