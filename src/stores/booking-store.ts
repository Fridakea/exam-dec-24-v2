import { create } from "zustand";

type BookingAddons = {
  greenCamping: boolean;
  chairs: number;
  pavillons: number;
  smallTents: number;
  mediumTents: number;
  largeTents: number;
};

type PaymentInfo = {
  cardholder_name: string;
  card_number: any;
  expiration: string;
  cvc: any;
};

export type TicketInfo = {
  is_vip: boolean;
  first_name: string;
  last_name: string;
  tel: string;
  email: string;
};

type BookingState = {
  totalTickets: number;
  totalVipTickets: number;
  setTotalTickets: (newAmount: number) => void;
  setTotalVipTickets: (newAmount: number) => void;

  ticketsInfo: TicketInfo[];
  setTicketsInfo: (newInfos: TicketInfo[]) => void;

  area: string;
  setArea: (newValue: string) => void;

  addons: BookingAddons;
  setAddons: (newAddons: BookingAddons) => void;

  getTotalPrice: () => number;

  paymentInfo: PaymentInfo;
  setPaymentInfo: (newValue: PaymentInfo) => void;

  reservationId: string | null;
  setReservationId: (newValue: string | null) => void;

  resetFlow: () => void;
};

export const useBookingStore = create<BookingState>((set, get) => ({
  // Tickets
  totalTickets: 0,
  totalVipTickets: 0,
  setTotalTickets: (newAmount) => set({ totalTickets: newAmount }),
  setTotalVipTickets: (newAmount) => set({ totalVipTickets: newAmount }),

  ticketsInfo: [],
  setTicketsInfo: (newInfo) => set({ ticketsInfo: newInfo }),

  area: "",
  setArea: (newValue) => set(() => ({ area: newValue })),

  addons: {
    greenCamping: false,
    chairs: 0,
    pavillons: 0,
    smallTents: 0,
    mediumTents: 0,
    largeTents: 0,
  },
  setAddons: (newAddons) => set({ addons: newAddons }),

  getTotalPrice: () => {
    const { totalTickets, totalVipTickets, area, addons } = get();
    let basePrice = addons.greenCamping ? 249 : 0;
    basePrice = area.length > 0 ? 99 : 0;
    return (
      basePrice +
      totalVipTickets * 1299 +
      totalTickets * 799 +
      addons.chairs * 79 +
      addons.pavillons * 149 +
      addons.smallTents * 199 +
      addons.mediumTents * 299 +
      addons.largeTents * 399
    );
  },

  paymentInfo: {
    cardholder_name: "",
    card_number: undefined,
    expiration: "",
    cvc: undefined,
  },
  setPaymentInfo: (newValue) => set({ paymentInfo: newValue }),

  reservationId: null,
  setReservationId: (newValue) => set({ reservationId: newValue }),

  resetFlow: () =>
    set({
      totalTickets: 0,
      totalVipTickets: 0,
      area: "",

      addons: {
        greenCamping: false,
        chairs: 0,
        pavillons: 0,
        smallTents: 0,
        mediumTents: 0,
        largeTents: 0,
      },
      paymentInfo: {
        cardholder_name: "",
        card_number: undefined,
        expiration: "",
        cvc: undefined,
      },
      reservationId: null,
    }),
}));
