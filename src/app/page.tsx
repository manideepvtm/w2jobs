import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedJobs from "@/components/home/FeaturedJobs";
import WhyW2Section from "@/components/home/WhyW2Section";
import CTASection from "@/components/home/CTASection";

export const metadata = {
  title: "W2Jobs — Find W2 Jobs, No Corp-to-Corp",
  description:
    "The premier job portal exclusively for W2 employees. Browse thousands of direct hire and W2-only positions.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedJobs />
        <WhyW2Section />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
