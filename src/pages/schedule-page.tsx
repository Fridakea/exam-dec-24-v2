import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ERoutes } from "@/main";
import { dayNames, EnrichedScheduleData, getEnrichedSchedule } from "@/lib/api";
import { findBandImage } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SchedulePage = () => {
  const [enrichedScheduleData, setEnrichedScheduleData] = useState<EnrichedScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [sceneFilter, setSceneFilter] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getEnrichedSchedule()
      .then((data) => {
        setEnrichedScheduleData(data);
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

  return (
    <div className="flex flex-col">
      <h1 className="mb-8">Program</h1>
      <div className="flex flex-col lg:flex-row lg:gap-20 lg:items-start">
        <div className="flex-1 mb-4">
          <div className="mb-2">
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
          <h3 className="mb-2">Scener</h3>
          <div className="w-full flex justify-around lg:justify-between">
            <Button
              variant="outline"
              className={`flex items-end gap-0 flex-wrap ${
                sceneFilter === sceneArray[0] ? "bg-secondary border-accent" : ""
              }`}
              onClick={() => setSceneFilter(sceneFilter === sceneArray[0] ? "" : sceneArray[0])}
            >
              <h1 className="text-accent-foreground">M</h1>
              <p>idgard</p>
            </Button>

            <Button
              variant="outline"
              className={`flex items-end gap-0 flex-wrap ${
                sceneFilter === sceneArray[1] ? "bg-secondary border-accent" : ""
              }`}
              onClick={() => setSceneFilter(sceneFilter === sceneArray[1] ? "" : sceneArray[1])}
            >
              <h1 className="text-accent-foreground">V</h1>
              <p>anaheim</p>
            </Button>

            <Button
              variant="outline"
              className={`flex items-end gap-0 flex-wrap ${
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
      {enrichedScheduleData &&
        Object.entries(enrichedScheduleData).map(([_, bands], i) =>
          !bands.some((band) => band.name.toLowerCase().includes(searchValue.toLowerCase())) ? (
            ""
          ) : (
            <section key={i}>
              <h2>{dayNames[i]}</h2>
              <p className="text-muted-foreground mb-4">{bands.length} bands spiller</p>

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
          )
        )}
    </div>
  );
};
