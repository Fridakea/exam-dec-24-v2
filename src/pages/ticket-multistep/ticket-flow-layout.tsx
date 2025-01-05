import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { ERoutes } from "@/main";
import { formatSeconds, useCountdownStore } from "@/stores/countdown-store";

import { Logo } from "@/assets/img/logo-export";
import { useBookingStore } from "@/stores/booking-store";

export const TicketFlowLayout = () => {
  const { remainingSeconds, hasCountdownFinished, setHasCountdownFinished, stopCountdown } = useCountdownStore();
  const { resetFlow } = useBookingStore();
  const navigate = useNavigate();

  const { minutes, seconds } = formatSeconds(remainingSeconds);

  useEffect(() => {
    if (hasCountdownFinished) {
      window.alert("Time ran out! make a new reservation.");
      setHasCountdownFinished(false);
      stopCountdown();

      // Clear store values, and navigate.
      resetFlow();
      navigate(`${ERoutes.BUY_TICKET}`);
    }
  }, [hasCountdownFinished]);

  return (
    <div>
      <header className="w-full bg-card shadow-xl">
        <nav className="max-w-screen mx-auto px-4 mb-4 sm:max-w-[1200px] text-card-foreground flex justify-between items-center">
          <Link to={ERoutes.HOME}>
            <div className="flex gap-2 items-center">
              <Logo className="w-24 sm:w-32 transition-all hover:text-accent" />
              <h2 className="hidden sm:block font-nova-cut">Foo festival 2025</h2>
            </div>
          </Link>
          <h3>15-21 juli</h3>
        </nav>
      </header>
      <main className="relative max-w-screen mx-auto p-4 sm:max-w-[1200px]">
        <div className="mb-6">
          {remainingSeconds > 0 && (
            <p className="w-full absolute top-0 left-0 text-center flex items-center justify-center gap-2">
              Tid til at gennemføre
              <span className={twMerge(remainingSeconds <= 1 ? "text-destructive" : "", "~text-lg/xl font-bold")}>
                {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </p>
          )}
        </div>
        <Outlet />
      </main>
    </div>
  );
};
