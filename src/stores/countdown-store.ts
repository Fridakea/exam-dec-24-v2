import { create } from "zustand";

// With help from ChatGPT
// A local zustand, to keep track of the shared timer across the app.
type CountdownStore = {
  remainingSeconds: number;
  setRemainingSeconds: (newSeconds: number) => void;
  intervalId: NodeJS.Timeout | null;
  setIntervalId: (id: NodeJS.Timeout | null) => void;
  hasCountdownFinished: boolean;
  setHasCountdownFinished: (newValue: boolean) => void;
  startCountdown: (totalSeconds: number) => void;
  stopCountdown: () => void;
};

export const useCountdownStore = create<CountdownStore>((set, get) => ({
  remainingSeconds: 0,
  setRemainingSeconds: (newSeconds) => set({ remainingSeconds: newSeconds }),

  intervalId: null,
  setIntervalId: (newId) =>
    set((state) => {
      if (state.intervalId) clearInterval(state.intervalId); // Clear old ID
      return { intervalId: newId }; // return the new one
    }),
  hasCountdownFinished: false,
  setHasCountdownFinished: (newValue) => set({ hasCountdownFinished: newValue }),
  startCountdown: (totalSeconds: number) => {
    const { setRemainingSeconds, setIntervalId, setHasCountdownFinished } = get();
    setRemainingSeconds(totalSeconds);

    // Prevent multiple intervals from being set
    if (get().intervalId) return;
    setHasCountdownFinished(false);

    const interval = setInterval(() => {
      const currentSeconds = get().remainingSeconds;
      if (currentSeconds <= 0) {
        setHasCountdownFinished(true);
        clearInterval(interval);
        setIntervalId(null);
      } else {
        setRemainingSeconds(currentSeconds - 1);
      }
    }, 1000);

    setIntervalId(interval);
  },
  stopCountdown: () => {
    const { intervalId, setIntervalId, setRemainingSeconds } = get();
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setRemainingSeconds(0);
    }
  },
}));

// Things for formatting times.
const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const formatSeconds = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / (DAY / SECOND));
  const hours = Math.floor((totalSeconds % (DAY / SECOND)) / (HOUR / SECOND));
  const minutes = Math.floor((totalSeconds % (HOUR / SECOND)) / (MINUTE / SECOND));
  const seconds = Math.floor(totalSeconds % (MINUTE / SECOND));

  return { days, hours, minutes, seconds };
};
