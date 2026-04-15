import { headerNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/shared/ui/navigation-menu";
import { SiteContacts } from "@/shared/ui/site-contacts";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	HeaderIconLink,
	catalogMenuLinkClassName,
	catalogTriggerClassName,
	getEmailHref,
	getPhoneHref,
	isActiveRoute,
	navLinkClassName,
} from "./header.shared";

function DesktopNavigation({ pathname }: { pathname: string | null }) {
  return (
    <NavigationMenu
      aria-label="Основная навигация"
      className="hidden lg:flex max-w-none"
      positionerClassName="z-20 transition-none"
      popupClassName="overflow-hidden rounded-b-[14px] rounded-t-none bg-white shadow-[0px_10px_22px_0px_rgba(0,0,0,0.08)] ring-0"
    >
      <NavigationMenuList className="gap-1 xl:gap-2">
        {headerNavigation.map((item) => {
          const isActive = isActiveRoute(pathname, item.href);

          return (
            <NavigationMenuItem key={item.href}>
              {item.children ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(
                      catalogTriggerClassName,
                      "px-3 text-base xl:text-lg xl:px-4",
                      isActive && "!text-[var(--text-muted)]",
                    )}
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[220px] rounded-b-[14px] rounded-t-none bg-white p-0 shadow-none ring-0">
                    <div className="py-[13px]">
                      {item.children.map((child) => (
                        <NavigationMenuLink
                          key={child.href}
                          render={<Link href={child.href} />}
                          closeOnClick
                          className={catalogMenuLinkClassName}
                        >
                          <span>{child.label}</span>
                          <ChevronRightIcon
                            strokeWidth={1.5}
                            className="size-4 shrink-0 translate-x-[-6px] opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-data-active:translate-x-0 group-data-active:opacity-100"
                          />
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  render={<Link href={item.href} />}
                  closeOnClick
                  data-active={isActive ? "" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    navLinkClassName,
                    "px-3 text-base xl:text-lg xl:px-4",
                    isActive && "text-[var(--accent)] hover:text-[var(--accent-hover)]",
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function TabletHeaderActions() {
  return (
    <div className="hidden items-center gap-2 lg:flex xl:hidden">
      <HeaderIconLink
        href={getPhoneHref()}
        ariaLabel="Позвонить"
        iconSrc="/icons/ic_contact_pill_phone.png"
        size={36}
      />
      <HeaderIconLink
        href={getEmailHref()}
        ariaLabel="Написать на email"
        iconSrc="/icons/ic_contact_pill_mail.png"
        size={36}
      />
    </div>
  );
}

export function DesktopHeader({ pathname }: { pathname: string | null }) {
  return (
    <div className="relative z-10 hidden min-h-[84px] items-center justify-between gap-5 py-3 lg:flex lg:min-h-[88px] xl:min-h-[93px]">
      <div className="flex min-w-0 items-center gap-8 xl:gap-[6.85rem]">
        <Link href="/" className="inline-flex items-center" aria-label="На главную страницу">
          <Image
            src="/logo-dm.svg"
            alt="Держи Марку"
            width={273}
            height={37}
            className="h-auto w-[178px] lg:w-[204px] xl:w-[273px]"
          />
        </Link>

        <DesktopNavigation pathname={pathname} />
      </div>

      <TabletHeaderActions />
      <SiteContacts className="hidden xl:flex" />
    </div>
  );
}
