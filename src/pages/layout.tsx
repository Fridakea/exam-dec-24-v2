import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { ERoutes } from "@/main.tsx";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";
import { Logo } from "@/assets/img/logo-export";

export const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="pt-5 pb-10 px-4 max-w-[1200px] mx-auto flex flex-row items-center justify-between">
        <Link to={ERoutes.HOME} role="menuitem" onClick={() => setIsMenuOpen(false)}>
          <div className="flex gap-2 items-center">
            <p hidden>Logo ikon</p>
            <Logo className="w-24 sm:w-32 transition-all hover:text-accent" />
          </div>
        </Link>

        <Sheet open={isMenuOpen} onOpenChange={(open) => setIsMenuOpen(open)}>
          <SheetTrigger>
            <p hidden>Burgermenu</p>
            <Menu className="h-12 w-12 stroke-1 transition-all hover:text-accent" />
          </SheetTrigger>

          <SheetContent>
            <DialogTitle hidden>Menu</DialogTitle>
            <DialogDescription hidden>Her vises menu underpunkterne</DialogDescription>
            <nav className="flex flex-col items-center gap-16 sm:gap-32 tracking-widest font-medium uppercase">
              <Link to={ERoutes.HOME} role="menuitem" onClick={() => setIsMenuOpen(false)}>
                <p hidden>Logo ikon</p>
                <Logo className="w-48 sm:w-56 pt-10 sm:pt-20 transition-all hover:text-accent" />
              </Link>
              <Link to={ERoutes.SCHEDULE} role="menuitem" onClick={() => setIsMenuOpen(false)}>
                <h2 className="transition-all hover:text-accent">Program</h2>
              </Link>
              <Link to={ERoutes.BUY_TICKET} role="menuitem" onClick={() => setIsMenuOpen(false)}>
                <h2 className="transition-all hover:text-accent">Køb billet</h2>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main className="max-w-[1200px] mx-auto px-6">
        <Outlet />
      </main>
    </>
  );
};
