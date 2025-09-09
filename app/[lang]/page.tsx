import { AboutSection } from "@/components/about-section";
import { Certificates } from "@/components/certificates";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ContactSection } from "@/components/contact-section";
import { ExperienceSection } from "@/components/experience-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import {
  PROJECTS_SCENE_LENGTH,
  ProjectsSection,
} from "@/components/projects-section";
import { Scene, SceneController } from "@/components/scene";
import {
  ProposalSection,
  ServiceCatalogSection,
  ServicesSection,
} from "@/components/services-section";
import { StacksSection } from "@/components/stacks-section";
import { Toaster } from "@/components/ui/toaster";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { stackSceneLength } from "@/lib/scenes";
import { notFound } from "next/navigation";

export default function Home({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const t = getDictionary(params.lang);
  const b = t.backdrops;

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        {t.skipLink}
      </a>

      <Header />
      <SceneController />

      <main id="top" className="relative z-[1] min-h-svh">
        <Scene length={1.6}>
          <HeroSection />
        </Scene>
        <Scene length={1.9} backdrop={b.about}>
          <AboutSection />
        </Scene>
        <Scene
          length={stackSceneLength(t.experience.items.length)}
          backdrop={b.experience}
        >
          <ExperienceSection />
        </Scene>
        <Scene length={1.9} backdrop={b.stacks}>
          <StacksSection />
        </Scene>
        <Scene length={1.9} backdrop={b.education}>
          <section
            id="certificates"
            className="relative bg-muted/40 pb-24 md:pb-32"
          >
            <div className="mx-auto max-w-7xl px-6 md:px-10">
              <Certificates />
            </div>
          </section>
        </Scene>
        <Scene length={PROJECTS_SCENE_LENGTH} backdrop={b.projects}>
          <ProjectsSection />
        </Scene>
        <Scene length={1.9} backdrop={b.process}>
          <ServicesSection />
        </Scene>
        <Scene length={1.9} backdrop={b.services}>
          <ServiceCatalogSection />
        </Scene>
        <Scene length={1.9} backdrop={b.proposal}>
          <ProposalSection />
        </Scene>
        <Scene length={1.4} backdrop={b.contact}>
          <ContactSection />
        </Scene>
        <Footer />
      </main>

      <ChatWidget />

      <Toaster />
    </>
  );
}
