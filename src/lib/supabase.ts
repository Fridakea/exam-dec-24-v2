import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { TicketInfo } from "@/stores/booking-store";

const publicKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdG9sbnBndmFpcmNsdGhoZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTczMTIsImV4cCI6MjA1MDE5MzMxMn0.eQGLMeHUTSSHPN8bNJ1KAH9TzwR3WD0T503LYsTOSR8";

const supabaseURL = "https://hqtolnpgvairclthheuf.supabase.co";

const supabase = createClient<Database>(supabaseURL, publicKey);

type BookingInsertData = {
  area: string;
  green_camping: boolean;
  chairs: number;
  pavillons: number;
  small_tents: number;
  medium_tents: number;
  large_tents: number;
  total_price: number;
  reservation_id: string;
};

type BookingResult = {
  newId?: string;
  error?: string;
  success: boolean;
};
export const insertBooking = async (bookingData: BookingInsertData, tickets: TicketInfo[]): Promise<BookingResult> => {
  const { data, error } = await supabase.from("booking").insert([bookingData]).select().single();

  console.log(data);
  if (error || !data.id) return { error: error?.message, success: false };

  const { error: ticketError } = await supabase
    .from("ticket")
    .insert(tickets.map((ticket) => ({ ...ticket, booking_id: data.id })));

  if (ticketError) return { error: ticketError.message, success: false };

  return { newId: data.id.toString(), success: true };
};
