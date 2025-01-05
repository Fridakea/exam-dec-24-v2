import { ERoutes } from "@/main";
import { useNavigate } from "react-router";

import { TicketIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { BasketSection } from "@/components/BasketSection";
import { useCountdownStore } from "@/stores/countdown-store";
import { useEffect } from "react";
import { CheckAnimation } from "@/components/check-animation/CheckAnimation";

export const Step6ReceiptPage = () => {
  const navigate = useNavigate();

  const { stopCountdown } = useCountdownStore();

  useEffect(() => {
    stopCountdown();
  }, []);

  return (
    <section className="flex flex-col sm:flex-row gap-10 sm:*:w-1/2">
      <div className="flex flex-col items-center gap-5 mb-10">
        <div className="sm:mt-10">
          <CheckAnimation />
        </div>

        <div>
          <h1 className="text-center ~text-5xl/7xl mb-2">Tak</h1>
          <h2 className="text-center mb-10">for din bestilling!</h2>
        </div>

        <div className="w-[85%] mb-8 py-8 px-10 flex justify-center items-center relative text-card-foreground tracking-widest text-center select-none">
          <TicketIcon className="w-full h-full object-contain absolute top-0 left-0 -z-10 text-card" />
          <h2>Download biletter</h2>
        </div>

        <div className="w-full flex flex-row-reverse flex-wrap gap-4 justify-around">
          <Button
            size="lg"
            type="button"
            variant="accent"
            className="border-accent"
            onClick={() => navigate(ERoutes.SCHEDULE)}
          >
            Program
          </Button>
          <Button
            size="lg"
            type="button"
            variant="outline"
            className="border-accent"
            onClick={() => navigate(ERoutes.HOME)}
          >
            Forside
          </Button>
        </div>
      </div>

      <div className="relative p-10 bg-secondary rounded-2xl text-secondary-foreground -z-10">
        <h2 className="mb-8">Din kvittering</h2>
        <BasketSection />
      </div>
    </section>
  );
};
