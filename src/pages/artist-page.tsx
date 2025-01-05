import useFetch from "@/hooks/use-fetch";
import {
  apiBaseUrl,
  BandData,
  BandPerformanceData,
  dayNamesObject,
  getBandPerformanceData,
  ScheduleData,
} from "@/lib/api";
import { ERoutes } from "@/main";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { findBandImage } from "@/lib/helpers";
import { twMerge } from "tailwind-merge";

const cssClasses = {
  breadcrumb: "mb-4 flex gap-2 items-center text-muted-foreground sm:hidden",
};

export const ArtistPage = () => {
  const { slug } = useParams();

  const { error, isPending, data: band } = useFetch<BandData>(`${apiBaseUrl}/bands/${slug}`);
  const { error: sError, isPending: isSPending, data: schedule } = useFetch<ScheduleData>(`${apiBaseUrl}/schedule`);

  const [bandPerformanceData, setBandPerformanceData] = useState<BandPerformanceData | null>(null);
  const totalMembers = band?.members.length;

  useEffect(() => {
    if (!schedule || !band) return;
    setBandPerformanceData(getBandPerformanceData(schedule, band.name));
  }, [schedule, band]);

  return (
    <div>
      {error && <div>{error}</div>}
      {sError && <div>{sError}</div>}

      {(isPending || isSPending) && (
        <div>
          <div className={twMerge("w-[65%] h-5 skeleton", cssClasses.breadcrumb)} />
          <section className="sm:h-[75vh] flex flex-col gap-10 sm:flex-row sm:gap-20">
            <div className="skeleton w-full h-52 sm:h-full sm:w-2/5" />
            <div className="mb-10 sm:w-1/2">
              <div className="hidden sm:inline-block skeleton w-full h-6 mb-8" />
              <div className="skeleton w-full h-12 mb-2 sm:h-14" />
              <div className="skeleton w-full h-6 mb-5" />
              <div className="skeleton w-full h-[50vh] sm:h-[56.5vh]" />
            </div>
          </section>
        </div>
      )}
      {band && bandPerformanceData && (
        <div>
          <div className={cssClasses.breadcrumb}>
            <Link to={ERoutes.SCHEDULE}>Program</Link>
            <ChevronRight />
            <Link to={`${ERoutes.SCHEDULE}/${band.slug}`}>{band.name}</Link>
          </div>

          <section className="sm:h-[75vh] !mb-10 flex flex-col gap-10 sm:flex-row sm:gap-20">
            <img
              src={findBandImage(band.logo)}
              alt={band.logoCredits}
              className="w-full h-52 object-cover sm:h-full sm:w-2/5 sm:flex-1"
            />

            <div className="sm:flex-[2]">
              <div className="hidden mb-10 gap-2 items-center text-muted-foreground sm:inline-flex">
                <Link to={ERoutes.SCHEDULE}>Program</Link>
                <ChevronRight />
                <Link to={`${ERoutes.SCHEDULE}/${band.slug}`}>{band.name}</Link>
              </div>

              <h1 className="~text-5xl/6xl">{band.name}</h1>
              <div className="flex gap-2 items-center mb-4 *:~text-lg/xl *:text-accent">
                <h2>{`${dayNamesObject[bandPerformanceData.day]} Kl. ${bandPerformanceData.start}`}</h2>
                <h2 className="mt-1">*</h2>
                <h2>På {bandPerformanceData.scene}</h2>
              </div>
              <h3>Hvem er {band.name}?</h3>
              <p className="mb-4">{band.bio}</p>
              <h3 className="text-card">
                Genre: <span className="normal-case text-foreground">{band.genre}.</span>
              </h3>
              <h3 className="text-card">
                Medlemmer:
                <span className="normal-case text-foreground">
                  {band.members &&
                    band.members.map((member, i) => (i + 1 !== totalMembers ? ` ${member},` : ` ${member}.`))}
                </span>
              </h3>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
