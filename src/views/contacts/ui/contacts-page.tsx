import { RequestDialog, RequestDialogButton } from "@/features/request-dialog";
import { getSiteInfo } from "@/shared/config/site-info/get-site-info";
import { getContactsPageData, type ContactsMapSettings } from "@/shared/lib/payload/contacts-page";
import { formatPhoneHref } from "@/shared/lib/phone";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import Image from "next/image";
import { YandexMapCard } from "./yandex-map-card";

type ContactLinks = ReadonlyArray<{
  href: string;
  label: string;
}>;

type ContactsHeroProps = {
  address: string;
  brandName: string;
  contactLinks: ContactLinks;
  heroImage: {
    alt: string;
    url: string;
  };
  mapSettings: ContactsMapSettings;
};

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

function ContactsMapCard({ address, brandName, mapSettings }: Pick<ContactsHeroProps, "address" | "brandName" | "mapSettings">) {
  return (
    <div>
      <p className="my-4 text-sm md:text-lg xl:text-xl tracking-[-0.04em] text-[#404040] xl:my-[18px]">{address}</p>

      <div className="relative aspect-square overflow-hidden rounded-[12px] border-[5px] border-[var(--accent)] bg-white md:h-[360px] md:aspect-auto xl:h-[225px] xl:min-w-[450px] xl:w-full xl:max-w-full rounded-[18px] md:rounded-[22.5px] xl:border-[6px]">
        <YandexMapCard address={address} brandName={brandName} {...mapSettings} />
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

function MobileContactsHero({ address, brandName, contactLinks, heroImage, mapSettings }: ContactsHeroProps) {
  return (
    <div className="mb-[70px] xl:hidden">
      <div className="overflow-hidden rounded-[18px] md:rounded-[22.5px] md:mx-auto md:max-w-[760px]">
        <div className="relative aspect-[340/256] overflow-hidden  md:aspect-[16/11]">
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            preload={true}
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
          <ContactsMapCard address={address} brandName={brandName} mapSettings={mapSettings} />
        </div>

        <div className="mt-6 md:mt-8">
          <DiscussionCta />
        </div>
      </div>
    </div>
  );
}

function DesktopContactsHero({ address, brandName, contactLinks, heroImage, mapSettings }: ContactsHeroProps) {
  return (
    <div className="relative hidden h-[720px] xl:block">
      <div className="absolute inset-y-0 right-[calc(var(--layout-side-padding)*-1)] w-[68%]">
        <Image
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          preload={true}
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
          <ContactsMapCard address={address} brandName={brandName} mapSettings={mapSettings} />
          <div className="mt-[44px]">
            <DiscussionCta />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function ContactsPage() {
  const [siteInfo, contactsPageData] = await Promise.all([getSiteInfo(), getContactsPageData()]);
  const contactLinks = [
    {
      href: formatPhoneHref(siteInfo.phone),
      label: siteInfo.phone,
    },
    {
      href: `mailto:${siteInfo.email}`,
      label: siteInfo.email,
    },
  ] as const;

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

      <MobileContactsHero
        address={siteInfo.address}
        brandName={siteInfo.brandName}
        contactLinks={contactLinks}
        heroImage={contactsPageData.heroImage}
        mapSettings={contactsPageData.mapSettings}
      />
      <DesktopContactsHero
        address={siteInfo.address}
        brandName={siteInfo.brandName}
        contactLinks={contactLinks}
        heroImage={contactsPageData.heroImage}
        mapSettings={contactsPageData.mapSettings}
      />
    </>
  );
}
