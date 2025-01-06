import useFetch from "@/hooks/use-fetch";
import { apiBaseUrl, BandData } from "@/lib/api";
import { ERoutes } from "@/main";
import { formatSeconds, useCountdownStore } from "@/stores/countdown-store";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import heroImg from "@/assets/img/hero.webp";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";

export const LandingPage = () => {
  const { error, isPending, data: bands } = useFetch<BandData[]>(`${apiBaseUrl}/bands`);

  const navigate = useNavigate();

  const { remainingSeconds, startCountdown } = useCountdownStore();
  useEffect(() => {
    const milisecondsUntillEvent = new Date("2025-07-15T12:00:00").getTime() - Date.now();
    startCountdown(milisecondsUntillEvent / 1000);
  }, []);

  // "Cacher" den slicede data, indtil amountOfDataShown eller data ændrer sig.
  const totalBands = 16;
  const slicedBands = bands?.slice(0, totalBands);

  const myRef = useRef<HTMLElement | null>(null);

  const { days, hours, minutes, seconds } = formatSeconds(remainingSeconds);

  return (
    <>
      <section className="h-[73vh] sm:h-[77vh] flex flex-col justify-around items-center">
        <div className="w-full h-full mb-10 brightness-[0.45] absolute top-0 left-0 -z-10">
          <img
            src={heroImg}
            alt="Koncert billede"
            className="w-full h-full object-cover brightness-[0.25] absolute top-0 left-0 -z-20"
          />
        </div>

        <div className="h-[65vh] flex flex-col items-center justify-center gap-5 sm:gap-10 text-center">
          <h1 className="max-w-[600px] ~text-6xl/8xl">Foo Festival 2025</h1>
          <h2 className="mb-16 ~text-xl/2xl">Danmarks vikingeby Roskilde</h2>

          <Button size="lg" variant="accent" onClick={() => navigate(`${ERoutes.BUY_TICKET}`)}>
            Køb billet
          </Button>
        </div>

        <Button
          variant="link"
          name="scroll-down"
          onClick={() =>
            myRef.current?.scrollIntoView({
              behavior: "smooth",
            })
          }
          className="animate-bounce"
        >
          <ArrowDown className="!w-10 !h-10" />
        </Button>
      </section>

      <section ref={myRef} className="py-40 sm:py-64 flex flex-col items-center justify-center text-center">
        <h2 className="mb-12 sm:mb-24 ~text-3xl/5xl">Rock til enhver smag!</h2>
        <div className="max-w-[700px] *:~text-lg/3xl *:uppercase">
          <div className="mb-10 sm:mb-20 flex gap-x-5 gap-y-3 sm:gap-x-8 sm:gap-y-5 justify-center flex-wrap *:transition-all">
            {error && <div>{error}</div>}
            {isPending && (
              <>
                <div className="skeleton ~h-7/10 ~w-40/72" />
                <div className="skeleton ~w-12/20 ~h-7/10" />
                <div className="skeleton ~w-28/44 ~h-7/10" />
                <div className="skeleton ~w-28/44 ~h-7/10" />
                <div className="skeleton ~w-28/44 ~h-7/10" />
                <div className="skeleton ~w-24/40 ~h-7/10" />
                <div className="skeleton ~w-16/24 ~h-7/10" />
                <div className="skeleton ~w-28/40 ~h-7/10" />
                <div className="skeleton ~w-16/24 ~h-7/10" />
                <div className="skeleton ~w-48/72 ~h-7/10" />
                <div className="skeleton ~w-32/52 ~h-7/10" />
                <div className="skeleton ~w-20/32 ~h-7/10" />
                <div className="skeleton ~w-20/32 ~h-7/10" />
                <div className="skeleton ~w-36/56 ~h-7/10" />
                <div className="skeleton ~w-24/40 ~h-7/10" />
                <div className="skeleton ~w-16/32 ~h-7/10" />
              </>
            )}
            {slicedBands &&
              slicedBands.map((band, i) => (
                <Link
                  key={i}
                  to={`${ERoutes.BAND}/${band.slug}`}
                  className="hover:text-accent hover:scale-110 hover:font-bold"
                >
                  {band.name}
                </Link>
              ))}
          </div>
          <Link to={ERoutes.SCHEDULE} className="transition-all hover:text-accent hover:scale-110 hover:font-bold">
            Og mange flere...
          </Link>
        </div>
      </section>

      <section className="h-full sm:h-screen pt-32 -m-6 flex flex-col bg-card text-card-foreground">
        <div>
          <h1 className="font-poppins ~text-2xl/4xl text-center mb-5">Dørene åbner om</h1>
          <div className="mb-24 lg:mb-32 flex gap-1 sm:gap-4 items-center justify-center text-center *:font-nova-cut">
            <div className="flex flex-col items-center">
              <h2 className="~text-4xl/7xl">{days}</h2>
              <p className="~text-xs/sm uppercase">Dage</p>
            </div>
            <h2 className="pb-5">:</h2>
            <div className="flex flex-col items-center">
              <h2 className="~text-4xl/7xl">{hours < 10 ? `0${hours}` : hours}</h2>
              <p className="~text-xs/sm uppercase">Timer</p>
            </div>
            <h2 className="pb-5">:</h2>
            <div className="flex flex-col items-center">
              <h2 className="~text-4xl/7xl">{minutes < 10 ? `0${minutes}` : minutes}</h2>
              <p className="~text-xs/sm uppercase">Minutter</p>
            </div>
            <h2 className="pb-5">:</h2>
            <div className="flex flex-col items-center">
              <h2 className="~text-4xl/7xl">{seconds < 10 ? `0${seconds}` : seconds}</h2>
              <p className="~text-xs/sm uppercase">Sekunder</p>
            </div>
          </div>
        </div>

        <div className="p-10 lg:px-20 flex flex-col sm:flex-row gap-10 md:gap-16 lg:gap-24">
          <div className="flex-1">
            <h2 className="mb-10 sm:mb-20 ~text-3xl/5xl text-center text-pretty sm:text-left">
              Festival med hylst til vores nordiske rødder
            </h2>

            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 text-center sm:justify-between sm:text-left">
              <div>
                <h3 className="text-primary-foreground font-medium">Hvor?</h3>
                <p className="sm:max-w-[150px] text-pretty">Roskilde Park, 4000 Roskilde</p>
              </div>

              <div className="sm:*:text-right">
                <h3 className="text-primary-foreground font-medium">Hvornår?</h3>
                <p className="sm:max-w-[175px] text-pretty">Mandag 15.- søndag 21. juli 2025</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex-[2] lg:flex-[1.5] *:mb-4">
            <h3 className="text-muted">Hvad er Foo Festival?</h3>
            <p>
              Træd ind i vikingernes verden, når Roskilde, en af Danmarks ældste vikingebyer, danner rammen om Foo
              Festival – en uge fyldt med rå rock, vikingetraditioner og uforglemmelige oplevelser!
            </p>
            <p>
              Fra mandag til søndag kan du nyde tonerne fra nogle af de bedste rockbands og artister fra ind- og udland,
              mens festivalpladsen summer af liv og aktiviteter. Foo Festival er ikke kun for musikelskere, det er en
              hyldest til vikingerne med historiske aktiviteter og spændende boder.
            </p>
            <p>
              Tag med på en rejse tilbage til fortiden, mens du rocker med i nutiden. Foo Festival er stedet, hvor
              vikinger og rockelskere mødes til en uge med fantastisk musik, historiske vibes og oplevelser, du ikke vil
              gå glip af! Sikre dig din billet nu – Valhalla venter!
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
