import HeroSection from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import KeyFeatures from "./components/landing/Features";
import NewsletterPreview from "./components/landing/NewsletterPreview";
import CommunityHighlight from "./components/landing/CommunityHighlight";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden bg-grid-pattern">
      {/* Background Gradients (Same as Auth Pages) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10">
        <HeroSection />
        <HowItWorks />
        <KeyFeatures />
        <NewsletterPreview />
        <CommunityHighlight />



        <Footer />
      </div>
    </main>
  );
}
