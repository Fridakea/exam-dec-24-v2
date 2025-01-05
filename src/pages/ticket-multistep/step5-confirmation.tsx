import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useBookingStore } from "@/stores/booking-store";
import { postFullfill } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { ERoutes } from "@/main";
import { BasketSection } from "@/components/BasketSection";
import { insertBooking } from "@/lib/supabase";

export const Step5ConfirmationPage = () => {
  const navigate = useNavigate();

  const { area, paymentInfo, addons, reservationId, resetFlow, getTotalPrice, ticketsInfo } = useBookingStore();
  const { cardholder_name, card_number, expiration, cvc } = paymentInfo;

  // This useEffect runs only once, when the component mounts.
  useEffect(() => {
    // If no area is choosen in the booking store - clear store values, and navigate.
    {
      area.length <= 0 && resetFlow();
      area.length <= 0 && navigate(ERoutes.BUY_TICKET);
    }
  }, []);

  const handleSubmit = async () => {
    if (!reservationId) {
      window.alert("failed to finish reservation (no id)");
      return;
    }
    const { error, message } = await postFullfill(reservationId);
    if (error) window.alert(message);
    else {
      const { success, error, newId } = await insertBooking(
        {
          area,
          green_camping: addons.greenCamping,
          chairs: addons.chairs,
          pavillons: addons.pavillons,
          small_tents: addons.smallTents,
          medium_tents: addons.mediumTents,
          large_tents: addons.largeTents,
          total_price: getTotalPrice(),
          reservation_id: reservationId,
        },
        ticketsInfo
      );
      console.log(success, error, newId);

      navigate(`${ERoutes.BUY_TICKET}/6`);
    }
  };

  return (
    <section className="flex flex-col">
      <h1 className="mb-8">Din Bestilling</h1>

      <section className="flex flex-col sm:flex-row sm:*:w-[50%] gap-2 sm:gap-12 mb-10 sm:mb-0">
        <div className="relative p-8 mb-8 bg-secondary rounded-2xl text-secondary-foreground -z-10">
          <BasketSection />
        </div>

        <div>
          <div>
            <h2 className="mb-5">Betalingsoplysninger</h2>

            <h3 className="font-medium text-popover-foreground">Kortholders navn:</h3>
            <p className="mb-2">{cardholder_name}</p>

            <h3>Kortnummer:</h3>
            <p className="mb-2">{card_number}</p>

            <h3>Udløbsdato:</h3>
            <p className="mb-2">{expiration}</p>

            <h3>CVC:</h3>
            <p className="mb-2">{cvc}</p>

            <Button
              variant="default"
              className="self-end"
              type="button"
              onClick={() => navigate(`${ERoutes.BUY_TICKET}/4`)}
            >
              Rediger oplysninger
            </Button>
          </div>
        </div>
      </section>

      <Button size="lg" variant="accent" className="self-end mb-10 sm:mb-0" onClick={handleSubmit}>
        Gennemfør køb
      </Button>
    </section>
  );
};
