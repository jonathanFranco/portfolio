import { AboutSection } from "@/components/about-section";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { ServicesSection } from "@/components/services-section";
import { StacksSection } from "@/components/stacks-section";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main id="top" className="relative z-[1] min-h-svh">
        <HeroSection />
        <AboutSection />
        <StacksSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
        <Footer />
      </main>

      <ChatWidget />

      <Toaster />
    </>
  );
}
