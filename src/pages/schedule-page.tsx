import { useEffect, useState } from "react";
import { ERoutes } from "@/main";
import { dayNames, EnrichedScheduleData, getEnrichedSchedule } from "@/lib/api";
import { findBandImage } from "@/lib/helpers";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Filter } from "lucide-react";

export const SchedulePage = () => {
  const [bandsForDaysData, setBandsForDaysData] = useState<EnrichedScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [sceneFilter, setSceneFilter] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getEnrichedSchedule()
      .then((data) => {
        setBandsForDaysData(data);
        setApiError(null);
        setIsLoading(false);
      })
      .catch((error) => {
        setApiError(error);
        setIsLoading(false);
      });
  }, []);

  const sceneArray = ["Midgard", "Vanaheim", "Jotunheim"];

  const cssClasses = {
    bandsGrid: "mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3 lg:gap-x-8 sm:gap-y-5",
  };

  let bandAmount = 0;

  return (
    <div className="flex flex-col">
      <h1 className="mb-8">Program</h1>
      <div className="mb-4 flex flex-col lg:flex-row gap-4 lg:gap-20 lg:items-start">
        <div className="flex-1 mb-4">
          <div className="mb-2 flex gap-2">
            <Search />
            <Label htmlFor="seacrh" className="~text-lg/xl">
              Søg
            </Label>
          </div>
          <Input
            id="search"
            type="search"
            placeholder="Søg efter band..."
            className="w-full h-fit"
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
        </div>

        <div className="mb-4 flex-[1.5]">
          <div className="flex gap-2">
            <Filter />
            <h3 className="mb-2">Scener</h3>
          </div>
          <div className="relative w-full flex gap-2 justify-around flex-wrap lg:justify-between">
            <Button
              variant="outline"
              role="button"
              name="Midgaard-filter"
              className={`sm:w-fit flex gap-0 sm:gap-1 flex-grow sm:flex-grow-0 ${
                sceneFilter === "" ? "bg-secondary border-accent" : ""
              }`}
              onClick={() => setSceneFilter("")}
            >
              <h1 className="text-background">.</h1>
              <p>Alle</p>
              <h1 className="text-background">.</h1>
            </Button>

            <Button
              variant="outline"
              role="button"
              name="Midgaard-filter"
              className={`w-full sm:w-fit flex gap-0 sm:gap-1 flex-grow sm:flex-grow-0 ${
                sceneFilter === sceneArray[0] ? "bg-secondary border-accent" : ""
              }`}
              onClick={() => setSceneFilter(sceneFilter === sceneArray[0] ? "" : sceneArray[0])}
            >
              <h1 className="text-accent-foreground">M</h1>
              <p>idgard</p>
            </Button>

            <Button
              variant="outline"
              role="button"
              name="Vanaheim-filter"
              className={`w-full sm:w-fit flex gap-0 sm:gap-1 flex-grow sm:flex-grow-0 ${
                sceneFilter === sceneArray[1] ? "bg-secondary border-accent" : ""
              }`}
              onClick={() => setSceneFilter(sceneFilter === sceneArray[1] ? "" : sceneArray[1])}
            >
              <h1 className="text-accent-foreground">V</h1>
              <p>anaheim</p>
            </Button>

            <Button
              variant="outline"
              role="button"
              name="Jotunheim-filter"
              className={`w-full sm:w-fit flex gap-0 sm:gap-1 flex-grow sm:flex-grow-0 ${
                sceneFilter === sceneArray[2] ? "bg-secondary border-accent" : ""
              }`}
              onClick={() => setSceneFilter(sceneFilter === sceneArray[2] ? "" : sceneArray[2])}
            >
              <h1 className="text-accent-foreground">J</h1>
              <p>otunheim</p>
            </Button>
          </div>
        </div>
      </div>

      {apiError && <div>{apiError}</div>}
      {isLoading && (
        <section>
          <div className="skeleton w-28 h-8 my-2 sm:w-32 sm:mt-0" />
          <div className="skeleton w-32 h-4 mb-4 sm:h-5 sm:w-36" />
          <div className={cssClasses.bandsGrid}>
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
            <div className="skeleton w-full h-40 sm:h-52" />
          </div>
        </section>
      )}

      {bandsForDaysData &&
        Object.entries(bandsForDaysData).map(([_, bands], i) => {
          // If no bands contain the search input, render nothing, not even the day.
          if (!bands.some((band) => band.name.toLowerCase().includes(searchValue.toLowerCase()))) {
            return "";
          }

          bandAmount = bands
            .filter((band) => band.scene.includes(sceneFilter))
            .filter((band) => band.name.toLowerCase().includes(searchValue.toLowerCase())).length;

          return (
            <section key={i}>
              <h2>{dayNames[i]}</h2>
              <p className="text-muted-foreground mb-4">
                {bandAmount === 1 ? `${bandAmount} band` : `${bandAmount} bands`}
              </p>

              <div className={cssClasses.bandsGrid}>
                {bands
                  .filter((band) => band.name.toLowerCase().includes(searchValue.toLowerCase()))
                  .filter((band) => band.scene.includes(sceneFilter))
                  .map((band, i) => (
                    <Link
                      to={`${ERoutes.BAND}/${band.slug}`}
                      key={i}
                      className="relative w-full h-full inline-flex flex-col gap-2 transition-all hover:text-accent hover:scale-110"
                    >
                      <p className="absolute right-3 top-1 font-nova-cut text-accent-foreground ~text-2xl/4xl z-10">
                        {band.scene[0]}
                      </p>
                      <img
                        src={findBandImage(band.logo)}
                        alt={band.logoCredits}
                        className="w-full h-40 sm:h-52 object-cover brightness-50 grayscale-[50%] hover:brightness-75"
                      />
                      <h3 className="text-center truncate">{band.name}</h3>
                    </Link>
                  ))}
              </div>
            </section>
          );
        })}
    </div>
  );
};
