import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./assets/fonts/fontfaces.css";
import "./index.css";

import { LandingPage } from "./pages/landing-page";
import { SchedulePage } from "./pages/schedule-page";
import { Layout } from "./pages/layout";
import { ArtistPage } from "./pages/artist-page";
import { Step1BuyTicketsPage } from "./pages/ticket-multistep/step1-buy-tickets";
import { Step2BuyAddonsPage } from "./pages/ticket-multistep/step2-addons";
import { Step3ContactInformationPage } from "./pages/ticket-multistep/step3-contact-information";
import { Step4PaymentInformationPage } from "./pages/ticket-multistep/step4-payment-information";
import { Step5ConfirmationPage } from "./pages/ticket-multistep/step5-confirmation";
import { Step6ReceiptPage } from "./pages/ticket-multistep/step6-receipt";
import { TicketFlowLayout } from "./pages/ticket-multistep/ticket-flow-layout";
import ScrollToTop from "./components/ScrollToTop";

export enum ERoutes {
  HOME = "/",
  SCHEDULE = "/program",
  BUY_TICKET = "/billet",
  BAND = "/artist",
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={ERoutes.HOME} element={<LandingPage />} />
          <Route path={ERoutes.SCHEDULE} element={<SchedulePage />} />
          <Route path={`${ERoutes.BAND}/:slug`} element={<ArtistPage />} />
        </Route>

        <Route path={ERoutes.BUY_TICKET} element={<TicketFlowLayout />}>
          <Route index element={<Step1BuyTicketsPage />} />
          <Route path={`${ERoutes.BUY_TICKET}/2`} element={<Step2BuyAddonsPage />} />
          <Route path={`${ERoutes.BUY_TICKET}/3`} element={<Step3ContactInformationPage />} />
          <Route path={`${ERoutes.BUY_TICKET}/4`} element={<Step4PaymentInformationPage />} />
          <Route path={`${ERoutes.BUY_TICKET}/5`} element={<Step5ConfirmationPage />} />
          <Route path={`${ERoutes.BUY_TICKET}/6`} element={<Step6ReceiptPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
