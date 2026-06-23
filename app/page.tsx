import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Workflow from "@/components/sections/Workflow";
import Assistant from "@/components/sections/Assistant";
import Gallery from "@/components/sections/Gallery";
import VideoShowcase from "@/components/sections/VideoShowcase";
import CmoDashboard from "@/components/sections/CmoDashboard";
import AskDeveloper from "@/components/sections/AskDeveloper";
import Reviews from "@/components/sections/Reviews";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Services />
        <Workflow />
        <Gallery />
        <VideoShowcase />
        <CmoDashboard />
        <Assistant />
        <AskDeveloper />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
