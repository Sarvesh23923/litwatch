"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { WorkflowSection } from "@/components/WorkflowSection";
import { AIControlSection } from "@/components/AIControlSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ControlTower } from "@/components/ControlTower";
import { TrustSection } from "@/components/TrustSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import type { EntryPoint } from "@/services/leadService";

export default function Home() {
  const [leadForm, setLeadForm] = useState<{ open: boolean; entryPoint: EntryPoint }>({
    open: false,
    entryPoint: "hero",
  });

  const openLeadForm = (entryPoint: EntryPoint) => () =>
    setLeadForm({ open: true, entryPoint });
  const closeLeadForm = () => setLeadForm((s) => ({ ...s, open: false }));

  return (
    <div className="flex flex-1 flex-col">
      <Navbar onRequestDemo={openLeadForm("hero")} />
      <main className="flex-1">
        <Hero onRequestDemo={openLeadForm("hero")} />
        <ProblemSection />
        <WorkflowSection />
        <AIControlSection />
        {/* <ProductShowcase onRequestDemo={openLeadForm("product_showcase")} /> */}
        <FeaturesSection onRequestDemo={openLeadForm("features")} />
        <ControlTower onRequestDemo={openLeadForm("control_tower")} />
        <TrustSection />
        <FinalCTA onRequestDemo={openLeadForm("final_cta")} />
      </main>
      <Footer />

      <LeadForm
        open={leadForm.open}
        entryPoint={leadForm.entryPoint}
        onClose={closeLeadForm}
      />
    </div>
  );
}
