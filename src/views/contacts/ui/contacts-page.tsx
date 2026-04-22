import { RequestDialog, RequestDialogButton } from "@/features/request-dialog";
import { siteInfo } from "@/shared/config/site-info";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import Image from "next/image";
import { YandexMapCard } from "./yandex-map-card";

const contactLinks = [
  {
    href: `tel:${siteInfo.phone.replace(/\D+/g, "")}`,
    label: siteInfo.phone,
  },
  {
    href: `mailto:${siteInfo.email}`,
    label: siteInfo.email,
  },
] as const;

function ContactLeadLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block whitespace-nowrap font-heading text-4xl sm:text-6xl leading-none tracking-[0.015em] text-[var(--heading)] transition-opacity hover:opacity-80"
    >
      {label}
    </a>
  );
}

function ContactsMapCard() {
  return (
    <div>
      <p className="my-4 text-sm md:text-lg xl:text-xl tracking-[-0.04em] text-[#404040] xl:my-[18px]">{siteInfo.address}</p>

      <div className="relative aspect-square overflow-hidden rounded-[12px] border-[5px] border-[var(--accent)] bg-white md:h-[360px] md:aspect-auto xl:h-[225px] xl:min-w-[450px] xl:w-full xl:max-w-full rounded-[18px] md:rounded-[22.5px] xl:border-[6px]">
        <YandexMapCard />
      </div>
    </div>
  );
}

function DiscussionCta() {
  return (
    <RequestDialog source="contacts-page">
      <RequestDialogButton />
    </RequestDialog>
  );
}

function MobileContactsHero() {
  return (
    <div className="mb-[70px] xl:hidden">
      <div className="overflow-hidden rounded-[18px] md:rounded-[22.5px] md:mx-auto md:max-w-[760px]">
        <div className="relative aspect-[340/256] overflow-hidden  md:aspect-[16/11]">
          <Image
            src="/contacts/img_contacts_cover.png"
            alt="Команда в фирменном мерче"
            fill
            priority
            sizes="(max-width: 767px) 340px, 760px"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="rounded-[18px] md:rounded-[22.5px] bg-[rgba(232,231,226,0.7)] p-5 backdrop-blur-[15px] md:p-7">
        <h1 className="sr-only">Контакты</h1>

        <div className="space-y-2 md:space-y-3">
          {contactLinks.map((item) => (
            <ContactLeadLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>

        <div className="mt-8 md:mt-10">
          <ContactsMapCard />
        </div>

        <div className="mt-6 md:mt-8">
          <DiscussionCta />
        </div>
      </div>
    </div>
  );
}

function DesktopContactsHero() {
  return (
    <div className="relative hidden h-[720px] xl:block">
      <div className="absolute inset-y-0 right-[calc(var(--layout-side-padding)*-1)] w-[68%]">
        <Image
          src="/contacts/img_contacts_cover.png"
          alt="Команда в фирменном мерче"
          fill
          priority
          sizes="68vw"
          className="object-cover object-top"
        />
      </div>

      <div className="absolute inset-y-0 left-0 z-10 mb-[75px] flex w-fit max-w-[min(771px,calc(100%-140px))] flex-col justify-between rounded-[18px] md:rounded-[22.5px] bg-[rgba(232,231,226,0.5)] p-5 px-[50px] py-[43px] backdrop-blur-[15px]">
        <div>
          <h1 className="sr-only">Контакты</h1>

          <div className="space-y-[2px]">
            {contactLinks.map((item) => (
              <ContactLeadLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>
        </div>

        <div>
          <ContactsMapCard />
          <div className="mt-[44px]">
            <DiscussionCta />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactsPage() {
  return (
    <>
      <PageBreadcrumb
        className="mb-8 md:mb-10 xl:mb-5"
        item={{
          labelFrom: "Главная",
          labelTo: "Контакты",
          href: "/",
        }}
      />

      <MobileContactsHero />
      <DesktopContactsHero />
    </>
  );
}
