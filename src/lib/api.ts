export const apiBaseUrl = "https://pentagonal-holy-beetle.glitch.me"; // "http://localhost:8080";

const headersList = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export type AreaData = {
  area: string;
  spots: number;
  available: number;
  direction: number;
};

export type BandData = {
  name: string;
  members: string[];
  genre: string;
  logoCredits: string;
  logo: string;
  bio: string;
  slug: string;
};

type ScheduleAct = {
  start: string;
  end: string;
  act: string;
};

type Scene = "Midgard" | "Vanaheim" | "Jotunheim";
type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const dayNamesObject: Record<Day, string> = {
  mon: "Mandag",
  tue: "Tirsdag",
  wed: "Onsdag",
  thu: "Torsdag",
  fri: "Fredag",
  sat: "Lørdag",
  sun: "Søndag",
};
export const dayNames = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

// A "Record" is like an object. It takes two types, the first is the property names, the second is the value types.
// So { name: string; email: string; } is the same as Record<"name" | "email", string>.
// Its useful when you have many properties, with the same value types.
export type ScheduleData = Record<Scene, Record<Day, ScheduleAct[]>>;

export type BandPerformanceData = {
  name: string;
  day: Day;
  start: string;
  end: string;
  scene: string;
};

// With help from ChatGPT
// This function loops over all acts on all days in all scenes, to find the bands performance.
export const getBandPerformanceData = (schedule: ScheduleData, bandName: string): BandPerformanceData | null => {
  // Iterate over each scene
  for (const [scene, days] of Object.entries(schedule)) {
    // Iterate over each day in the scene
    for (const [day, acts] of Object.entries(days)) {
      // Check each act in the day's ScheduleAct[]
      for (const act of acts) {
        if (act.act === bandName) {
          return {
            name: bandName,
            day: day as Day, // Day of the week
            start: act.start,
            end: act.end,
            scene: scene, // Scene name
          };
        }
      }
    }
  }

  // If no performance is found
  return null;
};

type PutReserveResult = {
  message: string;
  id: string;
  timeout: number;
};

export const putReserve = async (area: string, amount: number): Promise<PutReserveResult> => {
  const response = await fetch(`${apiBaseUrl}/reserve-spot`, {
    method: "PUT",
    headers: headersList,
    body: JSON.stringify({
      area: area,
      amount: amount,
    }),
  });

  return await response.json();
};

type PostFullfillResult = {
  error: boolean;
  message: string;
};
export const postFullfill = async (id: string): Promise<PostFullfillResult> => {
  const response = await fetch(`${apiBaseUrl}/fullfill-reservation`, {
    method: "POST",
    headers: headersList,
    body: JSON.stringify({ id: id }),
  });

  return {
    error: response.status > 300,
    message: await response.json(),
  };
};

type EnrichedBandData = {
  name: string;
  members: string[];
  genre: string;
  logoCredits: string;
  logo: string;
  bio: string;
  slug: string;
  // Extra stuff
  scene: string;
  start: string;
  end: string;
};

export type EnrichedScheduleData = Record<Day, EnrichedBandData[]>;

// With help from ChatGPTs
export const getEnrichedSchedule = async (): Promise<EnrichedScheduleData> => {
  const bandsResponse = await fetch(`${apiBaseUrl}/bands`);
  const bandsData: BandData[] = await bandsResponse.json();

  const scheduleResponse = await fetch(`${apiBaseUrl}/schedule`);
  const scheduleData: ScheduleData = await scheduleResponse.json();

  const enrichedSchedule: EnrichedScheduleData = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  };

  // Iterate over each scene in the schedule
  for (const [scene, days] of Object.entries(scheduleData)) {
    // Iterate over each day in the scene
    for (const [day, acts] of Object.entries(days)) {
      // Iterate over each act in the day's schedule
      for (const act of acts) {
        // Find the matching band in the bandsData
        const band = bandsData.find((b) => b.name === act.act);

        if (band) {
          // Combine the band data with the schedule information
          const enrichedBand: EnrichedBandData = {
            ...band,
            scene,
            start: act.start,
            end: act.end,
          };

          // Add the enriched band data to the corresponding day
          enrichedSchedule[day as Day].push(enrichedBand);
        }
      }
    }
  }

  return enrichedSchedule;
};
