import HomeHero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Features from "./components/Features/Features";
import Screenshots from "./components/Screenshots/Screenshots";
import Testimonials from "./components/Testimonials/Testimonials";
import Security from "./components/Security/Security";
import CTA from "./components/CTA/CTA";

export default function Home() {
    return (
      <main>
        <HomeHero />
        <HowItWorks />
        <Features />
        <Screenshots />
        <Testimonials />
        <Security />
        <CTA />
      </main>
    );
}
