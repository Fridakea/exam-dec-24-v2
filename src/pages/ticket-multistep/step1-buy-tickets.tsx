import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { ERoutes } from "@/main";
import { useBookingStore } from "@/stores/booking-store";
import { apiBaseUrl, AreaData, putReserve } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusMinusInput } from "@/components/PlusMinusInput";
import { RadioCard } from "@/components/RadioCard";
import { Basket } from "@/components/Basket";
import { useCountdownStore } from "@/stores/countdown-store";

const formSchema = z.object({
  ticket_amount: z.number().int().min(0).max(20),
  vip_ticket_amount: z.number().int().min(0).max(20),
  area: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

export const Step1BuyTicketsPage = () => {
  const navigate = useNavigate();
  const { startCountdown, stopCountdown } = useCountdownStore();

  const { error, isPending, data: dataAreas } = useFetch<AreaData[]>(`${apiBaseUrl}/available-spots`);

  const { totalTickets, totalVipTickets, setTotalTickets, setTotalVipTickets, setArea, setReservationId } =
    useBookingStore();
  const totalTicketsAdded = totalTickets + totalVipTickets;

  const formObject = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticket_amount: 0,
      vip_ticket_amount: 0,
      area: "",
    },
    mode: "onSubmit",
  });

  // This useEffect runs only once, when the component mounts.
  useEffect(() => {
    stopCountdown();
    // Changes the value of values, every time the form changes. See https://react-hook-form.com/docs/useform/watch
    formObject.watch(() => {
      setTotalTickets(formObject.getValues().ticket_amount);
      setTotalVipTickets(formObject.getValues().vip_ticket_amount);
      setArea(formObject.getValues().area);
    });
  }, []);

  const amount = totalTickets + totalVipTickets;

  const handleSubmit = async () => {
    setTotalTickets(formObject.getValues().ticket_amount);
    setTotalVipTickets(formObject.getValues().vip_ticket_amount);
    setArea(formObject.getValues().area);

    const response = await putReserve(formObject.getValues().area, amount);
    startCountdown(response.timeout / 1000);
    setReservationId(response.id);

    navigate(`${ERoutes.BUY_TICKET}/2`);
  };

  return (
    <section className="flex flex-col sm:flex-row gap-10 *:flex-1">
      <Form {...formObject}>
        <form onSubmit={formObject.handleSubmit(handleSubmit)} className="flex flex-col mb-10 sm:mb-0">
          <h1 className="mb-8">Køb biletter</h1>

          <FormField
            control={formObject.control}
            name="vip_ticket_amount"
            render={({ field }) => (
              <FormItem className="mb-6 flex flex-row items-center">
                <div className="flex flex-col gap-1 flex-1">
                  <FormLabel>VIP Partout billet</FormLabel>
                  <FormDescription>1299 KR</FormDescription>
                </div>
                <FormControl>
                  <PlusMinusInput field={field} max={20} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formObject.control}
            name="ticket_amount"
            render={({ field }) => (
              <FormItem className="mb-6 flex flex-row items-center">
                <div className="flex flex-col gap-1 flex-1">
                  <FormLabel>Partout billet</FormLabel>
                  <FormDescription>799 KR</FormDescription>
                </div>
                <FormControl>
                  <PlusMinusInput field={field} max={20} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h1 className="mt-10 mb-8">Tilkøb</h1>

          <FormField
            name="area"
            render={() => (
              <FormItem className="mb-12">
                <div className="mb-4 *:mb-2">
                  <FormLabel className="flex items-start gap-1">
                    Vælg camping område
                    <span className="~text-2xs/xs -mt-1">*</span>
                  </FormLabel>
                  <FormDescription>Reservationsgebyr på 99 kr</FormDescription>
                </div>

                <div className="flex flex-row flex-wrap gap-4">
                  {isPending && (
                    <div className="w-full h-fit flex flex-wrap gap-4">
                      <div className="skeleton w-40 h-20 lg:w-[163px]" />
                      <div className="skeleton w-32 h-20 lg:w-[143px]" />
                      <div className="skeleton w-36 h-20 lg:w-[150px]" />
                      <div className="skeleton w-40 h-20 lg:w-[160px]" />
                    </div>
                  )}
                  {error && <p>{error}</p>}

                  {dataAreas
                    ?.filter((areaObj: any) => areaObj.available >= totalTicketsAdded && areaObj.available > 0)
                    .map((areaObj: any) => (
                      <FormField
                        key={areaObj.area}
                        control={formObject.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem key={areaObj.area}>
                            <FormControl>
                              <RadioCard
                                id={areaObj.area}
                                value={areaObj.area}
                                name="area-radio-group"
                                header={areaObj.area}
                                subHeader={`${areaObj.available} ledige pladser`}
                                isChecked={field.value === areaObj.area}
                                onChange={(newValue) => field.onChange(newValue)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                </div>
              </FormItem>
            )}
          />

          <Button
            size="lg"
            variant="accent"
            className="self-end"
            disabled={!formObject.formState.isValid || amount <= 0} //
            type="submit"
          >
            Næste
          </Button>
        </form>
      </Form>

      <div className="max-w-[45%] lg:max-w-[40%]">
        <Basket />
      </div>
    </section>
  );
};
