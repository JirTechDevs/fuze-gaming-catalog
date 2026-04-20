"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog, ImagePlus, LayoutDashboard, LogOut, Package2 } from "lucide-react";
import { signOutAction } from "@/features/admin-auth/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useActionToast } from "@/hooks/use-action-toast";
import { initialActionResult } from "@/lib/action-result";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminShellProps {
  children: ReactNode;
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/catalog", label: "Catalog", icon: Package2 },
  { href: "/dashboard/banner", label: "Banner", icon: ImagePlus },
  { href: "/dashboard/settings", label: "Settings", icon: Cog },
];

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [signOutState, signOutFormAction] = useActionState(
    signOutAction,
    initialActionResult,
  );

  useActionToast(signOutState);

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.97),hsl(var(--background)/0.98))]"
      >
        <SidebarHeader className="px-3 py-4">
          <div className="flex items-center gap-3 rounded-[1.1rem] border border-primary/18 bg-primary/6 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] border border-primary/25 bg-background/60">
              <Image
                src="/images/logo.png"
                alt="Fuzevalo"
                width={22}
                height={22}
                className="h-[22px] w-[22px] object-contain"
              />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="font-display text-xs tracking-[0.34em] text-primary/72">
                FUZEVALO
              </p>
              <p className="mt-1 text-xs text-muted-foreground/68">
                Admin dashboard
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent className="px-2 pb-2">
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className="rounded-[0.95rem]"
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.08),_transparent_48%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)/0.98))]">
        <div className="border-b border-border/28 bg-background/72 px-4 py-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="rounded-full border border-border/45 bg-card/70 text-foreground hover:bg-card/95" />
              <div>
                <p className="font-display text-[11px] tracking-[0.34em] text-primary/68">
                  ADMIN PANEL
                </p>
                <h1 className="font-display text-lg font-bold tracking-[0.08em] text-foreground sm:text-xl">
                  Fuzevalo Dashboard
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="rounded-full border border-primary/18 bg-primary/7 px-3 py-1.5 text-xs text-primary/82">
                Authenticated
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-destructive/26 bg-destructive/10 px-3 py-1.5 text-xs text-destructive transition hover:bg-destructive/16"
                  >
                    <LogOut className="size-3.5" />
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[1.5rem] border-border/45 bg-[linear-gradient(180deg,hsl(var(--card)/0.96),hsl(var(--background)/0.98))]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-xl tracking-[0.08em] text-foreground">
                      Konfirmasi Logout
                    </AlertDialogTitle>
                    <AlertDialogDescription className="leading-6 text-muted-foreground/76">
                      Kamu yakin ingin keluar dari dashboard admin? Session login saat ini akan diakhiri.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-[0.95rem] border-border/45 bg-background/60">
                      Batal
                    </AlertDialogCancel>
                    <form action={signOutFormAction}>
                      <AlertDialogAction
                        type="submit"
                        className="rounded-[0.95rem] bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Ya, logout
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
