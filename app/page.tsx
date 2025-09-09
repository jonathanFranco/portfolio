import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { StacksSection } from "@/components/stacks-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { ProjectsSection } from "@/components/projects-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <StacksSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
      <Toaster />
    </main>
  )
}
