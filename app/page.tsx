import HeroSection from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import KeyFeatures from "./components/landing/Features";
import NewsletterPreview from "./components/landing/NewsletterPreview";
import CommunityHighlight from "./components/landing/CommunityHighlight";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <HeroSection />
      <HowItWorks />
      <KeyFeatures />
      <NewsletterPreview />
      <CommunityHighlight />

      {/* Final CTA */}
      <section className="py-24 bg-black text-center border-t border-neutral-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif mb-6 text-white">Ready to start your publication?</h2>
          <p className="text-secondary max-w-xl mx-auto mb-10">
            Join thousands of writers who trust NewsEcho for their daily delivery.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-neutral-900">
            Start Publishing for Free
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
