"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterCard from "@/components/landing/NewsletterCard";
import NewsletterPreviewModal from "@/components/landing/NewsletterPreviewModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, limit, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle, Mail, Star, Zap, Shield, Users, Clock, MessageCircle } from "lucide-react";

export default function Home() {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchNewsletters = async () => {
      if (!db) return;
      try {
        const q = query(
          collection(db, "newsletters"),
          where("status", "==", "published"),
          where("isEnabled", "==", true),
          orderBy("publishedAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const fetchedNewsletters = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewsletters(fetchedNewsletters);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      }
    };

    fetchNewsletters();
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans overflow-hidden">
      <Navbar />
      <NewsletterPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />

      {/* Abstract Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-24 lg:px-8">
        <div className="mx-auto max-w-7xl py-20 sm:py-32 lg:py-40 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-left"
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl drop-shadow-lg leading-tight">
              Stay Ahead with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                Insightful Newsletters
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-xl">
              Curated content delivered straight to your inbox. Join thousands of readers who trust NewsEcho for quality insights and meaningful updates.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black shadow-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
              <button
                onClick={() => setShowPreview(true)}
                className="group text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors flex items-center"
              >
                Preview Newsletter <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs font-medium text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-bold text-white">10,000+ readers</span> <br /> Trust NewsEcho daily
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-gray-500/20 rounded-2xl blur opacity-75"></div>
            <div className="relative rounded-2xl bg-black/80 border border-white/10 p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-500">Weekly Insights</div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-1/3 bg-white/20 rounded"></div>
                <h3 className="text-2xl font-bold text-white">The Future of Digital Communication</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Discover how emerging technologies are reshaping the way we connect, communicate, and collaborate in our digital world...
                </p>
                <div className="h-40 w-full bg-white/5 rounded-lg border border-white/5 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Image Placeholder</span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-xs text-gray-500">5 min read</span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors"><Mail className="h-4 w-4 text-gray-400" /></button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors"><Star className="h-4 w-4 text-gray-400" /></button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Newsletters */}
      <div id="latest" className="relative z-10 py-24 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
          >
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Featured Newsletters</h2>
              <p className="mt-4 text-lg text-gray-400">
                Discover our most popular newsletters covering technology, business, and design insights
              </p>
            </div>
            <Link href="/newsletters" className="text-sm font-semibold text-white hover:text-gray-300 transition-colors flex items-center">
              View All Newsletters <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {newsletters.length > 0 ? (
              newsletters.map((newsletter) => (
                <motion.div key={newsletter.id} variants={fadeInUp}>
                  <NewsletterCard
                    id={newsletter.id}
                    title={newsletter.title}
                    description={newsletter.description || "No description available."}
                    date={newsletter.publishedAt?.toDate().toLocaleDateString() || "Unknown Date"}
                    slug={newsletter.slug || newsletter.id}
                    redirectUrl="/login"
                  />
                </motion.div>
              ))
            ) : (
              // Fallback static cards if no data
              [
                { title: "Tech Trends Weekly", desc: "Latest developments in AI, machine learning, and emerging technologies.", cat: "Technology" },
                { title: "Business Insights", desc: "Strategic insights and market analysis to help you make informed decisions.", cat: "Business" },
                { title: "Design Inspiration", desc: "Creative trends, design patterns, and visual inspiration from around the world.", cat: "Design" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-lg transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] hover:border-white/20 backdrop-blur-md"
                >
                  <div className="p-8 flex flex-col h-full">
                    <p className="text-xs font-bold tracking-wider text-indigo-400 uppercase mb-3">{item.cat}</p>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm flex-grow">{item.desc}</p>
                    <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Dec {10 + idx}, 2024</span>
                      <Link href="/login" className="text-sm font-semibold text-white flex items-center hover:text-gray-300 transition-colors">Read More <ArrowRight className="ml-1 h-3 w-3" /></Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-base font-semibold leading-7 text-gray-400 uppercase tracking-widest">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Getting started with NewsEcho is simple
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
          >
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

            {[
              { step: "1", title: "Sign Up", desc: "Create your free account in seconds with just your email address." },
              { step: "2", title: "Subscribe", desc: "Choose from our curated selection of newsletters that match your interests." },
              { step: "3", title: "Get Updates", desc: "Receive high-quality content directly in your inbox on your preferred schedule." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-black border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Why Choose NewsEcho */}
      <div className="relative z-10 py-24 bg-white/5 backdrop-blur-sm border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Choose NewsEcho?</h2>
            <p className="mt-4 text-lg text-gray-400">
              Experience the difference with our carefully curated newsletter platform
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: Shield, title: "No Spam Guarantee", desc: "We respect your inbox. Only quality content, no promotional clutter or spam." },
              { icon: Star, title: "Premium Content", desc: "Handpicked articles and insights from industry experts and thought leaders." },
              { icon: MessageCircle, title: "Easy Interaction", desc: "Reply directly to newsletters and engage with authors and fellow readers." },
              { icon: Clock, title: "Time-Efficient", desc: "Digest important information quickly with our concise, well-structured format." },
              { icon: Users, title: "Trusted Community", desc: "Join over 10,000 professionals who rely on NewsEcho for their daily insights." },
              { icon: Zap, title: "Instant Updates", desc: "Stay ahead of trends with real-time notifications and breaking news alerts." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group p-8 rounded-2xl bg-black/40 border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                <feature.icon className="h-10 w-10 text-white mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative isolate overflow-hidden bg-white/5 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16 border border-white/10"
          >
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join 10,000+ Readers Today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Don’t miss out on the insights that matter. Subscribe now and get your first curated newsletter within 24 hours.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <div className="flex w-full max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-full border-0 bg-white/10 px-6 py-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 placeholder:text-gray-500"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-8 text-xs text-gray-500">
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> No spam</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Free forever</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
