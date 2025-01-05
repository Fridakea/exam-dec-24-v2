import { FC, ReactElement } from "react";
import { useBookingStore } from "@/stores/booking-store";

import { TicketIcon } from "@/assets/icons";
import { DottedLine } from "./DottedLine";
import { twMerge } from "tailwind-merge";

export const BasketSection = () => {
  const { totalTickets, totalVipTickets, area, addons } = useBookingStore();
  const { greenCamping, chairs, pavillons, smallTents, mediumTents, largeTents } = addons;

  return (
    <section className="sm:h-[60vh]">
      {totalVipTickets <= 0 && totalTickets <= 0 && area.length <= 0 && (
        <div>
          <p>Kurven er tom</p>
        </div>
      )}

      {totalVipTickets > 0 && (
        <TicketItem price={1299} amount={totalVipTickets}>
          <div className="flex gap-2">
            <h2 className="text-accent font-bold">VIP</h2>
            <h3 className="flex items-center gap-2">Partout Billet</h3>
          </div>
        </TicketItem>
      )}

      {totalTickets > 0 && (
        <TicketItem price={799} amount={totalTickets}>
          <h3 className="flex items-center gap-2">Partout Billet</h3>
        </TicketItem>
      )}

      {area.length > 0 && (
        <TicketItem price={99}>
          <>
            <h3 className="flex items-center gap-2">Camping Reservation</h3>
            <p className="text-base text-accent">{area}</p>
          </>
        </TicketItem>
      )}

      {greenCamping && (
        <TicketItem price={249} ticketClass="text-green" green="bg-green">
          <>
            <h3 className="flex items-center gap-2">Green Camping</h3>
          </>
        </TicketItem>
      )}

      {chairs > 0 && (
        <TicketItem
          price={79}
          amount={chairs}
          ticketClass={greenCamping ? "text-green" : ""}
          green={greenCamping ? "bg-green" : ""}
        >
          <h3 className="flex items-center gap-2">Festivalstol m. kopholder</h3>
        </TicketItem>
      )}

      {pavillons > 0 && (
        <TicketItem
          price={149}
          amount={pavillons}
          ticketClass={greenCamping ? "text-green" : ""}
          green={greenCamping ? "bg-green" : ""}
        >
          <h3 className="flex items-center gap-2">Festival pavillon</h3>
        </TicketItem>
      )}

      {smallTents > 0 && (
        <TicketItem
          price={199}
          amount={smallTents}
          ticketClass={greenCamping ? "text-green" : ""}
          green={greenCamping ? "bg-green" : ""}
        >
          <h3 className="flex items-center gap-2">1 personers telt</h3>
        </TicketItem>
      )}

      {mediumTents > 0 && (
        <TicketItem
          price={299}
          amount={mediumTents}
          ticketClass={greenCamping ? "text-green" : ""}
          green={greenCamping ? "bg-green" : ""}
        >
          <h3 className="flex items-center gap-2">2 personers telt</h3>
        </TicketItem>
      )}

      {largeTents > 0 && (
        <TicketItem
          price={399}
          amount={largeTents}
          ticketClass={greenCamping ? "text-green" : ""}
          green={greenCamping ? "bg-green" : ""}
        >
          <h3 className="flex items-center gap-2">3 personers telt</h3>
        </TicketItem>
      )}
    </section>
  );
};

type TicketItemProps = {
  price: number;
  amount?: number;
  green?: string;
  ticketClass?: string;
  children?: ReactElement;
};

const TicketItem: FC<TicketItemProps> = ({ price, amount = 0, green = "", ticketClass = "", children }) => (
  <>
    <div className="py-5 px-[10%] relative uppercase">
      <TicketIcon className={twMerge(ticketClass, "w-full h-full object-contain absolute top-0 left-0 z-0")} />
      <div className="flex justify-between items-center relative z-10">
        <div>
          {children}
          <p className="text-sm text-muted-foreground">{price} kr</p>
        </div>
        {amount > 0 && <p>x {amount}</p>}
      </div>
    </div>
    <DottedLine className={green} />
  </>
);
