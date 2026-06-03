import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Certifications } from "@/components/Certifications";
import { Projects } from "@/components/Projects";
import { SocLab } from "@/components/SocLab";
import { Recruiter } from "@/components/Recruiter";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const ParticleNetwork = dynamic(() => import("@/components/ParticleNetwork").then((mod) => mod.ParticleNetwork), { ssr: false });

export default function Home() {
  return (
    <>
      <ParticleNetwork />
      <Navbar />
      <Hero />
      
      {/* Bento Grid Layout for dynamic spacing on Desktop */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 auto-rows-min">
          <div className="xl:col-span-2 shadow-2xl rounded-2xl"><About /></div>
          <div className="xl:col-span-1 shadow-2xl rounded-2xl"><Skills /></div>
          <div className="xl:col-span-3 shadow-2xl rounded-2xl"><Recruiter /></div>
          <div className="xl:col-span-3 shadow-2xl rounded-2xl"><Certifications /></div>
        </div>
      </section>

      <Projects />
      <SocLab />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
