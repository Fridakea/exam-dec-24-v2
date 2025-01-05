import { useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useBookingStore } from "@/stores/booking-store";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BasketSection } from "./BasketSection";

export function Basket() {
  const { getTotalPrice } = useBookingStore();

  // Calculate total sum and formating as DKK link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  const moneyFormatter = new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    minimumFractionDigits: 0,
  });
  const totalSum = moneyFormatter.format(getTotalPrice());

  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <section className="relative w-full py-8 px-5 md:p-8 bg-secondary rounded-2xl text-secondary-foreground flex flex-col justify-between">
        <h2 className="~text-2xl/3xl mb-5">Min kurv</h2>
        <div className="overflow-y-auto">
          <BasketSection />
        </div>
        <div className="mt-5 flex justify-between">
          <h3>I alt</h3>
          <p>{totalSum}</p>
        </div>
      </section>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-fit -mx-4 p-4 fixed bottom-0 rounded-none rounded-t-lg flex justify-between"
        >
          <p>Pil op</p>
          <p>I ALT: {totalSum}</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 h-screen rounded-none flex flex-col justify-between">
        <div className="overflow-y-scroll py-2">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-full h-fit p-4 absolute top-0 left-0 rounded-none flex justify-between z-10"
            >
              <p>Pil ned</p>
              <p>Luk</p>
            </Button>
          </DrawerClose>

          <DrawerHeader className="mt-5 -ml-4 text-left">
            <DrawerTitle>Min kurv</DrawerTitle>
            <DrawerDescription hidden>Her vises de ting du har produkter til kurven</DrawerDescription>
          </DrawerHeader>

          <BasketSection />
        </div>

        <DrawerFooter>
          <div className="flex justify-between uppercase">
            <h3>I alt</h3>
            <p>{totalSum}</p>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
