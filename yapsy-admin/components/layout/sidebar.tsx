"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/navigation";
import { getStoredUser, isSuperAdmin } from "@/lib/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function Sidebar() {
  const pathname = usePathname();
  const [isSuper, setIsSuper] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    setIsSuper(isSuperAdmin(user));
  }, []);

  const visibleNav = useMemo(() => {
    return navigation.filter((item) => !item.superAdminOnly || isSuper);
  }, [isSuper]);

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:block">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
          Yapsy
        </span>
        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
          Admin
        </span>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="space-y-1 p-3">
          {visibleNav.map((item) =>
            item.children ? (
              <CollapsibleNavItem
                key={item.name}
                item={item}
                pathname={pathname}
              />
            ) : (
              <Link
                key={item.name}
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
}

function CollapsibleNavItem({
  item,
  pathname,
}: {
  item: (typeof navigation)[number];
  pathname: string;
}) {
  const isActive = item.children?.some((child) =>
    pathname.startsWith(child.href)
  );
  const [open, setOpen] = useState(isActive ?? false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
        <item.icon className="h-4 w-4" />
        {item.name}
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-4 pt-1">
        {item.children?.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
              pathname === child.href
                ? "bg-sidebar-accent font-medium text-sidebar-primary"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            {child.name}
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
