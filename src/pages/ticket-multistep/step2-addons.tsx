import { useEffect } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ERoutes } from "@/main";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusMinusInput } from "@/components/PlusMinusInput";
import { useBookingStore } from "@/stores/booking-store";
import { Basket } from "@/components/Basket";

const formSchema = z.object({
  greenCamping: z.boolean(),
  chairs: z.number().int().min(0).max(20),
  pavillons: z.number().int().min(0).max(20),
  smallTents: z.number().int().min(0).max(20),
  mediumTents: z.number().int().min(0).max(20),
  largeTents: z.number().int().min(0).max(20),
});

type FormData = z.infer<typeof formSchema>;

export const Step2BuyAddonsPage = () => {
  const navigate = useNavigate();

  // TODO save the addons the user chooses
  const { area, setAddons, resetFlow } = useBookingStore();

  // This useEffect runs only once, when the component mounts.
  useEffect(() => {
    // If no area is choosen in the booking store - clear store values, and navigate.
    {
      area.length <= 0 && resetFlow();
      area.length <= 0 && navigate(ERoutes.BUY_TICKET);
    }

    // Changes the value of values, every time the form changes. See https://react-hook-form.com/docs/useform/watch
    formObject.watch(() => {
      setAddons(formObject.getValues());
    });
  }, []);

  const formObject = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      greenCamping: false,
      chairs: 0,
      pavillons: 0,
      smallTents: 0,
      mediumTents: 0,
      largeTents: 0,
    },
  });

  const handleSubmit = (values: FormData) => {
    setAddons(values);

    navigate(`${ERoutes.BUY_TICKET}/3`);
  };

  return (
    <section className="flex flex-col sm:flex-row gap-10 *:flex-1">
      <Form {...formObject}>
        <form onSubmit={formObject.handleSubmit(handleSubmit)} className="flex flex-col mb-10 sm:mb-0">
          <h1 className="mb-8 flex items-start gap-1">
            Tilvalg
            <span className="~text-base/lg -mt-2">(Optional)</span>
          </h1>

          <FormField
            control={formObject.control}
            name="greenCamping"
            render={({ field }) => (
              <FormItem className="mb-10 flex justify-between items-center gap-3">
                <div className="flex flex-col leading-none">
                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Green camping
                  </FormLabel>
                  <FormDescription className="mb-1 text-sm text-muted-foreground">
                    Modtag kun genanvendeligt og miljøbevist festival gear
                  </FormDescription>
                  <FormDescription className="text-sm text-muted-foreground">249 KR</FormDescription>
                </div>

                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h2 className="mb-8">Camping Gear</h2>

          <FormField
            control={formObject.control}
            name="chairs"
            render={({ field }) => (
              <FormItem className="mb-6 flex flex-row items-center">
                <div className="flex flex-col gap-1 flex-1">
                  <FormLabel className="leading-snug">Festival stol m. kopholder</FormLabel>
                  <FormDescription>79 KR</FormDescription>
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
            name="pavillons"
            render={({ field }) => (
              <FormItem className="mb-6 flex flex-row items-center">
                <div className="flex flex-col gap-1 flex-1">
                  <FormLabel>Festival pavillon</FormLabel>
                  <FormDescription>149 KR</FormDescription>
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
            name="smallTents"
            render={({ field }) => (
              <FormItem className="mb-6 flex flex-row items-center">
                <div className="flex flex-col gap-1 flex-1">
                  <FormLabel>1 personers telt</FormLabel>
                  <FormDescription>199 KR</FormDescription>
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
            name="mediumTents"
            render={({ field }) => (
              <FormItem className="mb-6 flex flex-row items-center">
                <div className="flex flex-col gap-1 flex-1">
                  <FormLabel>2 personers telt</FormLabel>
                  <FormDescription>299 KR</FormDescription>
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
            name="largeTents"
            render={({ field }) => (
              <FormItem className="mb-6 flex flex-row items-center">
                <div className="flex flex-col gap-1 flex-1">
                  <FormLabel>3 personers telt</FormLabel>
                  <FormDescription>399 KR</FormDescription>
                </div>
                <FormControl>
                  <PlusMinusInput field={field} max={20} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button size="lg" variant="accent" className="self-end" type="submit">
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
