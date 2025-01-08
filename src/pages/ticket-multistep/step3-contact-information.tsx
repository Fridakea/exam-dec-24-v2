import { useNavigate } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ERoutes } from "@/main";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBookingStore } from "@/stores/booking-store";
import { Label } from "@/components/ui/label";
import { Basket } from "@/components/Basket";
import { useEffect } from "react";
import { MyRegexes } from "@/lib/helpers";

const formSchema = z.object({
  contact_info: z.array(
    z.object({
      first_name: z.string().min(2, "Fornavnet skal være mindst 2 bogstaver"),
      last_name: z.string().min(2, "Efternavnet skal være mindst 2 bogstaver"),
      tel: z.string().min(8, "Et telefon nummer er minimum 8 cifre"),
      email: z.string().email("Ugyldig email"),
      is_vip: z.boolean(),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

export const Step3ContactInformationPage = () => {
  const { totalTickets, totalVipTickets, area, resetFlow, setTicketsInfo } = useBookingStore();

  const ticketNumbers = Array.from({ length: totalTickets }, (_, i) => i + 1);
  const vipTicketNumbers = Array.from({ length: totalVipTickets }, (_, i) => i + 1);

  const navigate = useNavigate();

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
      contact_info: [...vipTicketNumbers, ...ticketNumbers].map((_, i) => ({
        first_name: "",
        last_name: "",
        tel: "",
        email: "",
        is_vip: i < vipTicketNumbers.length,
      })),
    },
    mode: "onTouched",
  });

  // Makes a new list of contact info where the property is updated
  const getUpdatedContactInfo = (
    propertyName: "first_name" | "last_name" | "tel" | "email",
    newValue: any,
    ticket: number,
    contactInfo: any[]
  ) => {
    return contactInfo.map((item, i) =>
      i === ticket - 1 ? { ...contactInfo[ticket - 1], [propertyName]: newValue } : item
    );
  };

  const handleSubmit = (values: FormData) => {
    setTicketsInfo(values.contact_info);
    navigate(`${ERoutes.BUY_TICKET}/4`);
  };

  // For debugging
  useEffect(() => {
    formObject.watch(() => {
      const result = formSchema.safeParse(formObject.getValues());

      // For debugging validation:
      if (!result.success) console.log(result.error.errors);
    });
  }, []);

  return (
    <section className="flex flex-col sm:flex-row gap-10 *:flex-1">
      <Form {...formObject}>
        <form onSubmit={formObject.handleSubmit(handleSubmit)} className="flex flex-col mb-10 sm:mb-0">
          <h1 className="mb-8">Kontaktoplysninger</h1>

          <section className="*:mb-2">
            <FormField
              control={formObject.control}
              name="contact_info"
              render={() => (
                <FormItem>
                  {/* VIP Tickets */}
                  {vipTicketNumbers.map((ticket) => (
                    <div key={ticket} className="p-4 border border-accent rounded-md mb-8 shadow-md">
                      <legend className="mb-4 ~text-lg/xl uppercase flex items-center gap-2">
                        <span className="text-accent font-semibold ~text-3xl/4xl">VIP</span> partout billet {ticket}
                      </legend>

                      <div className="flex flex-col sm:flex-row gap-3 *:flex-1">
                        <div>
                          <FormField
                            control={formObject.control}
                            name={`contact_info.${ticket - 1}.first_name`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Fornavn</Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    required
                                    inputMode="text"
                                    autoComplete="given-name"
                                    onChange={(e) => {
                                      if (!MyRegexes.onlyText.test(e.currentTarget.value)) return;
                                      field.onChange(e.currentTarget.value);
                                    }}
                                    type="text"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div>
                          <FormField
                            control={formObject.control}
                            name={`contact_info.${ticket - 1}.last_name`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Efternavn</Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    required
                                    inputMode="text"
                                    autoComplete="family-name"
                                    onChange={(e) => {
                                      if (!MyRegexes.onlyText.test(e.currentTarget.value)) return;
                                      field.onChange(e.currentTarget.value);
                                    }}
                                    type="text"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <FormField
                            control={formObject.control}
                            name={`contact_info.${ticket - 1}.tel`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Telefon</Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    required
                                    inputMode="tel"
                                    autoComplete="tel"
                                    className="max-w-[65%] sm:max-w-full"
                                    onChange={(e) => {
                                      if (!MyRegexes.onlyNumber.test(e.currentTarget.value)) return;
                                      field.onChange(e.currentTarget.value);
                                    }}
                                    type="tel"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex-[2]">
                          <FormField
                            control={formObject.control}
                            name={`contact_info.${ticket - 1}.email`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Email</Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    required
                                    inputMode="email"
                                    autoComplete="email"
                                    onChange={(e) => field.onChange(e.currentTarget.value)}
                                    type="email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Regular Tickets */}
                  {ticketNumbers.map((ticket) => (
                    <div key={ticket} className="p-4 border border-muted-foreground rounded-md mb-8 shadow-md">
                      <legend className="mb-4 ~text-lg/xl uppercase">Partout billet {ticket}</legend>

                      <div className="flex flex-col sm:flex-row gap-3 *:flex-1">
                        <div>
                          <FormField
                            control={formObject.control}
                            name={`contact_info.${ticket + totalVipTickets - 1}.first_name`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Fornavn</Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    required
                                    inputMode="text"
                                    autoComplete="given-name"
                                    onChange={(e) => {
                                      if (!MyRegexes.onlyText.test(e.currentTarget.value)) return;
                                      field.onChange(e.currentTarget.value);
                                    }}
                                    type="text"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div>
                          <FormField
                            control={formObject.control}
                            name={`contact_info.${ticket + totalVipTickets - 1}.last_name`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Efternavn</Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    required
                                    inputMode="text"
                                    autoComplete="family-name"
                                    onChange={(e) => {
                                      if (!MyRegexes.onlyText.test(e.currentTarget.value)) return;
                                      field.onChange(e.currentTarget.value);
                                    }}
                                    type="text"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <FormField
                            control={formObject.control}
                            name={`contact_info.${ticket + totalVipTickets - 1}.tel`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Telefon</Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    required
                                    inputMode="tel"
                                    autoComplete="tel"
                                    className="max-w-[65%] sm:max-w-full"
                                    onChange={(e) => {
                                      if (!MyRegexes.onlyNumber.test(e.currentTarget.value)) return;
                                      field.onChange(e.currentTarget.value);
                                    }}
                                    type="tel"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex-[2]">
                          <FormField
                            control={formObject.control}
                            name={`contact_info.${ticket + totalVipTickets - 1}.email`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Email</Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    required
                                    inputMode="email"
                                    autoComplete="email"
                                    onChange={(e) => field.onChange(e.currentTarget.value)}
                                    type="email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </FormItem>
              )}
            />
          </section>

          <Button
            size="lg"
            disabled={!formObject.formState.isValid}
            variant="accent"
            className="self-end"
            type="submit"
          >
            Til betaling
          </Button>
        </form>
      </Form>

      <div className="max-w-[45%] lg:max-w-[40%]">
        <Basket />
      </div>
    </section>
  );
};
