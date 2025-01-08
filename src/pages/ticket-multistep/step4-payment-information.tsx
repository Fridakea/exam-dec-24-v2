import { useNavigate } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBookingStore } from "@/stores/booking-store";
import { ERoutes } from "@/main";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Basket } from "@/components/Basket";

const formSchema = z.object({
  cardholder_name: z.string().min(2, "Navnet skal være mindst 2 bogstaver"),
  card_number: z
    .number()
    .int()
    .refine((num) => num.toString().length >= 16, {
      message: "Kortnummeret er min. 16 cifre",
    }),
  expiration: z.string().min(4, "Udløbsdatoen er 4 cifre"),
  cvc: z
    .number()
    .int()
    .refine((num) => num.toString().length === 3, {
      message: "CVC er 3 cifre",
    }),
});

type FormData = z.infer<typeof formSchema>;

const dateRegex = "^(0[1-9]?|1[0-2]?)?\\d{0,2}$";

export const Step4PaymentInformationPage = () => {
  const navigate = useNavigate();

  const { area, paymentInfo, setPaymentInfo, resetFlow } = useBookingStore();
  const { cardholder_name, card_number, expiration, cvc } = paymentInfo;

  // This useEffect runs only once, when the component mounts.
  useEffect(() => {
    // If no area is choosen in the booking store - clear store values, and navigate.
    {
      area.length <= 0 && resetFlow();
      area.length <= 0 && navigate(ERoutes.BUY_TICKET);
    }
  }, []);

  const formObject = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardholder_name: cardholder_name,
      card_number: card_number,
      expiration: expiration,
      cvc: cvc,
    },
    mode: "onTouched",
  });

  const handleSubmit = (values: FormData) => {
    setPaymentInfo(values);

    navigate(`${ERoutes.BUY_TICKET}/5`);
  };

  return (
    <section className="flex flex-col sm:flex-row gap-10 *:flex-1">
      <Form {...formObject}>
        <form onSubmit={formObject.handleSubmit(handleSubmit)} className="flex flex-col mb-10 sm:mb-0">
          <h1 className="mb-8 ~text-3xl/4xl">Betalingsoplysninger</h1>

          <section className="flex flex-col payment-flex-row gap-3">
            <div className="flex flex-col gap-2 flex-grow">
              <FormField
                control={formObject.control}
                name="cardholder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kortholders navn</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" inputMode="text" autoComplete="cc-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formObject.control}
                name="card_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kortnummer</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        onChange={(e) => field.onChange(Number(e.currentTarget.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row payment-flex-col gap-2 mb-8">
              <FormField
                control={formObject.control}
                name="expiration"
                render={({ field }) => (
                  <FormItem className="min-w-[155px]">
                    <FormLabel>
                      Udløbsdato <span className="text-muted-foreground text-xs">(MM/ÅÅ)</span>
                    </FormLabel>
                    <FormControl>
                      <InputOTP maxLength={4} pattern={dateRegex} inputMode="numeric" autoComplete="cc-exp" {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formObject.control}
                name="cvc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        className="max-w-[170px]"
                        onChange={(e) => field.onChange(Number(e.currentTarget.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <div className="mb-10 flex gap-2 items-center">
            <Checkbox id="terms" required={true} />

            <div className="flex flex-col leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-start gap-1"
              >
                Jeg accepterer vilkår og betingelser
                <span className="~text-2xs/xs -mt-1">*</span>
              </label>
            </div>
          </div>

          <Button
            size="lg"
            disabled={!formObject.formState.isValid}
            variant="accent"
            className="self-end"
            type="submit"
          >
            Se overblik
          </Button>
        </form>
      </Form>

      <div className="max-w-[45%] lg:max-w-[40%]">
        <Basket />
      </div>
    </section>
  );
};
