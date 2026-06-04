"use client";

import { useEffect, useRef, useState, Fragment, ReactNode, RefObject } from 'react';
import { ArrowRight, Code2, Cpu, Globe, Smartphone, Zap, CheckCircle2, ChevronRight, Layers, TerminalSquare, Rocket, BrainCircuit, Activity, Network, MessageSquare, ShoppingCart, Building2, Check, Send, Mail, User, Phone, Stethoscope, Package, Home as HomeIcon, Truck, BookOpen, Gamepad2, Fuel, Shirt } from 'lucide-react';
import { NeuralCanvas } from "@/components/NeuralCanvas";
import { CustomCursor } from "@/components/CustomCursor";
import { ChatBot } from "@/components/ChatBot";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

function useOnScreen(ref: RefObject<Element | null>, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin, threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [ref, rootMargin]);
  return isIntersecting;
}

const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface Industry {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: string;
  tags: string[];
  image: string;
  accentColor: string;
}

const industries: Industry[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    icon: <Stethoscope className="w-6 h-6" />,
    description: "Healthcare AI Automation",
    details: "We specialize in healthcare AI automation services & consulting. Our team develops automated workflows that integrate with EHR systems & patient management tools to improve care delivery, streamline operations, & ensure compliance with industry standards.",
    tags: ["Chatbots & Virtual Agents", "AI Automation", "Generative AI"],
    image: "https://www.bitsclan.com/images/pioner-imges/healthcare.avif",
    accentColor: "#10B981"
  },
  {
    id: "ecommerce",
    name: "E-commerce & Retail",
    icon: <ShoppingCart className="w-6 h-6" />,
    description: "E-commerce Automation",
    details: "Transform your retail operations with AI-powered automation. From inventory management to customer service, we build systems that increase conversion rates, reduce operational costs, and deliver personalized shopping experiences at scale.",
    tags: ["Order Automation", "Inventory Management", "Customer Intelligence"],
    image: "https://www.bitsclan.com/images/pioner-imges/ecommerce.avif",
    accentColor: "#F59E0B"
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: <HomeIcon className="w-6 h-6" />,
    description: "Real Estate Intelligence",
    details: "Revolutionize property management and sales with AI automation. Automate lead qualification, property matching, document processing, and client communication to close deals faster and manage portfolios more efficiently.",
    tags: ["Lead Qualification", "Document Processing", "Client Management"],
    image: "https://www.bitsclan.com/images/pioner-imges/realestate.avif",
    accentColor: "#8B5CF6"
  },
  {
    id: "logistics",
    name: "Automotive & Logistics",
    icon: <Truck className="w-6 h-6" />,
    description: "Logistics Optimization",
    details: "Streamline supply chain and logistics operations with intelligent automation. Optimize routing, automate shipment tracking, manage inventory in real-time, and reduce delivery times with AI-powered decision making.",
    tags: ["Route Optimization", "Shipment Tracking", "Supply Chain AI"],
    image: "https://www.bitsclan.com/images/pioner-imges/automotive.avif",
    accentColor: "#06B6D4"
  },
  {
    id: "edtech",
    name: "Ed-Tech",
    icon: <BookOpen className="w-6 h-6" />,
    description: "Educational Technology",
    details: "Enhance learning experiences with AI automation. Build intelligent tutoring systems, automate grading and assessment, personalize learning paths, and streamline administrative tasks to focus on student success.",
    tags: ["Personalized Learning", "Automated Grading", "Student Analytics"],
    image: "https://www.bitsclan.com/images/pioner-imges/education.avif",
    accentColor: "#EC4899"
  },
  {
    id: "entertainment",
    name: "Entertainment & Gaming",
    icon: <Gamepad2 className="w-6 h-6" />,
    description: "Entertainment Automation",
    details: "Elevate user engagement with AI-powered automation. From content recommendation engines to automated moderation and player analytics, we build systems that keep users engaged and scale your platform effortlessly.",
    tags: ["Content Recommendation", "Player Analytics", "Automated Moderation"],
    image: "https://www.bitsclan.com/images/pioner-imges/entertainmentMain.avif",
    accentColor: "#EF4444"
  },
  {
    id: "oilgas",
    name: "Oil & Gas",
    icon: <Fuel className="w-6 h-6" />,
    description: "Energy Sector Automation",
    details: "Optimize operations in the energy sector with predictive AI and automation. Monitor equipment health, predict maintenance needs, optimize production schedules, and ensure safety compliance with intelligent systems.",
    tags: ["Predictive Maintenance", "Production Optimization", "Safety Compliance"],
    image: "https://www.bitsclan.com/images/pioner-imges/oil-and-gas.avif",
    accentColor: "#14B8A6"
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    icon: <Shirt className="w-6 h-6" />,
    description: "Fashion Industry AI",
    details: "Transform fashion retail with AI automation. Automate inventory management, trend forecasting, personalized recommendations, and supply chain optimization to stay ahead of market demands and reduce waste.",
    tags: ["Trend Forecasting", "Inventory Optimization", "Personalization"],
    image: "https://www.bitsclan.com/images/pioner-imges/fashion-and-apparel.avif",
    accentColor: "#F97316"
  }
];

function IndustriesSelector({ selectedIndustry, onSelect }: { selectedIndustry: string; onSelect: (id: string) => void }) {
  return (
    <FadeIn>
      <div className="space-y-2 pr-2">
        <div className="space-y-2 pb-4">
          {industries.map((industry, i) => (
            <FadeIn key={industry.id} delay={i * 0.05}>
              <button
                onClick={() => onSelect(industry.id)}
                className={`w-full p-3 border transition-all duration-300 flex items-center gap-2 group ${
                  selectedIndustry === industry.id
                    ? "bg-[#FFD000]/10 border-[#FFD000]/50"
                    : "bg-[#1A1D24] border-white/5 hover:border-[#FFD000]/30"
                }`}
                data-testid={`industry-btn-${industry.id}`}
              >
                <div className={`p-2 rounded transition-colors shrink-0 ${
                  selectedIndustry === industry.id
                    ? "bg-[#FFD000]/20 text-[#FFD000]"
                    : "bg-white/5 text-[#98A2B3] group-hover:text-[#FFD000]"
                }`}>
                  {industry.icon}
                </div>
                <span className={`text-sm font-semibold transition-colors truncate ${
                  selectedIndustry === industry.id
                    ? "text-[#FFD000]"
                    : "text-[#F1F3F5] group-hover:text-[#FFD000]"
                }`}>
                  {industry.name}
                </span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-all shrink-0 ${
                  selectedIndustry === industry.id
                    ? "text-[#FFD000] rotate-90"
                    : "text-[#FFD000]/40 group-hover:text-[#FFD000]"
                }`} />
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

function IndustryShowcase({ selectedIndustry }: { selectedIndustry: string }) {
  const industry = industries.find(ind => ind.id === selectedIndustry) || industries[0];

  return (
    <FadeIn delay={0.2}>
      <div className="relative h-full">
        <div className="relative w-full h-[500px] md:h-[600px] border-2 border-[#FFD000]/30 overflow-hidden group bg-[#1A1D24] rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD000]/20 via-[#FFB300]/10 to-[#0F1115] z-10" />
          <img 
            src={industry.image} 
            alt={industry.name} 
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
          
          {/* Industry Card Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/60 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#FFD000]/20 rounded">
                {industry.icon}
              </div>
              <h4 className="text-3xl md:text-4xl font-bold text-[#F1F3F5]">{industry.name}</h4>
            </div>
            <p className="text-[#98A2B3] font-light leading-relaxed mb-6 text-sm md:text-base">
              {industry.details}
            </p>
            <div className="flex gap-2 flex-wrap">
              {industry.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1.5 bg-[#FFD000]/10 text-[#FFD000]/80 border border-[#FFD000]/30 font-mono font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const testimonials = [
    {
      quote: "Quilonix delivered in 3 weeks what our internal team couldn't ship in 6 months. The automation alone saves us 40 hours a week.",
      author: "Head of Operations",
      company: "E-commerce Scale-up",
    },
    {
      quote: "We went from zero to a fully deployed AI-powered platform. The quality of the build is honestly embarrassing for our competitors.",
      author: "Founder & CEO",
      company: "SaaS Startup",
    },
    {
      quote: "They don't just write code — they rethink the whole workflow. Our lead response time dropped by 80% after they built our automation stack.",
      author: "Director of Growth",
      company: "Real Estate Tech",
    },
  ];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  return (
    <div className="relative">
      {/* Slider Container with Controls on Sides */}
      <div className="flex items-center gap-6">
        {/* Left Button */}
        <button
          onClick={prevTestimonial}
          className="flex-shrink-0 p-3 bg-[#1A1D24] border border-[#FFD000]/30 hover:border-[#FFD000]/60 hover:bg-[#FFD000]/10 rounded-lg transition-all duration-300"
          aria-label="Previous testimonial"
        >
          <ChevronRight className="w-6 h-6 text-[#FFD000] rotate-180" />
        </button>

        {/* Slider Container with Overflow Hidden */}
        <div className="flex-1 overflow-hidden">
          {/* Testimonial Cards Slider */}
          <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="min-h-[350px] p-8 md:p-12 bg-[#0F1115] border border-[#FFD000]/10 rounded-lg space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="text-[#FFD000]/60 text-4xl font-serif leading-none mb-4">"</div>
                    <p className="text-[#98A2B3] text-lg md:text-xl leading-relaxed font-light italic">
                      {testimonial.quote}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-[#FFD000]/10">
                    <div className="text-base font-semibold text-[#F1F3F5]">{testimonial.author}</div>
                    <div className="text-sm font-mono text-[#98A2B3] uppercase tracking-widest">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={nextTestimonial}
          className="flex-shrink-0 p-3 bg-[#1A1D24] border border-[#FFD000]/30 hover:border-[#FFD000]/60 hover:bg-[#FFD000]/10 rounded-lg transition-all duration-300"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-[#FFD000]" />
        </button>
      </div>

      {/* Dot Indicators at Bottom Center */}
      <div className="mt-8 flex gap-2 justify-center">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToTestimonial(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-[#FFD000] w-8"
                : "bg-[#FFD000]/30 w-2 hover:bg-[#FFD000]/60"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("healthcare");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F1F3F5] selection:bg-[#FFD000] selection:text-black overflow-x-hidden" style={{ fontFamily: '"Inter", sans-serif', cursor: "none" }}>
      <CustomCursor />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0F1115]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-[#FFD000]" />
            <span className="font-bold text-xl tracking-widest uppercase text-[#F1F3F5]">QUILONIX</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#98A2B3]">
            <a href="#services" className="hover:text-[#F1F3F5] transition-colors" data-testid="link-services">Services</a>
            <a href="#work" className="hover:text-[#F1F3F5] transition-colors" data-testid="link-work">Work</a>
            <a href="#pricing" className="hover:text-[#F1F3F5] transition-colors" data-testid="link-pricing">Pricing</a>
            <a href="#contact" className="hover:text-[#F1F3F5] transition-colors" data-testid="link-contact">Contact</a>
          </div>
          <Button data-testid="btn-initiate" className="bg-[#FFB300] text-black hover:bg-[#FFD000] hover:text-black transition-all font-bold rounded-lg border border-transparent hover:shadow-[0_0_15px_rgba(255,179,0,0.5)]">
            Initiate Sequence
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden">
        {/* Background image layer */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="/images/quilonix-hero.png" alt="Tech Abstract" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1115] via-transparent to-[#0F1115]" />
        </div>
        {/* Neural network canvas animation */}
        <NeuralCanvas />
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD000] rounded-full blur-[150px] opacity-[0.06] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFB300] rounded-full blur-[150px] opacity-[0.06] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl">
            <FadeIn delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-black leading-[1.1] mb-6 tracking-tight text-[#F1F3F5]">
                We automate the <span className="text-[#F1F3F5]/30 line-through">hard</span> parts.<br />
                You scale the <span className="text-[#FFD000]">rest.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-[#98A2B3] mb-10 max-w-2xl font-light leading-relaxed">
                Quilonix is the elite <span className="text-[#FFD000] font-semibold">AI &amp; Automation</span> agency engineering the future. We fuse high-end design with deep-tech architecture to build unstoppable systems.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button data-testid="btn-start-building" className="h-14 px-8 bg-[#FFB300] text-black hover:bg-[#FFD000] hover:text-black font-bold text-lg rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,179,0,0.3)]">
                  Start Building <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button data-testid="btn-view-capabilities" variant="outline" className="h-14 px-8 border-[#FFD000]/30 text-[#F1F3F5] hover:bg-[#FFD000]/5 hover:border-[#FFD000]/60 font-semibold text-lg rounded-lg backdrop-blur-sm">
                  View Capabilities
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs font-mono tracking-widest text-[#98A2B3]">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#FFD000]/60 to-transparent" />
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-32 relative bg-[#0F1115] z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-sm font-mono text-[#FFD000] tracking-widest mb-4 uppercase">Services</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-[#F1F3F5]">Engineering the Future With AI, Blockchain, & Custom Software</h3>
            <p className="text-[#98A2B3] mb-16 max-w-3xl font-light">Whether you need custom software, strategic IT consulting, cutting-edge blockchain, advanced AI, or solid cybersecurity right here in the United States, we've got you covered.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - AI & ML Solutions */}
            <FadeIn delay={0.1}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="group relative p-8 bg-[#1A1D24] border border-white/5 hover:border-[#FFD000]/50 transition-all duration-500 h-[480px] md:h-[440px] flex flex-col text-left hover:bg-[#1A1D24]/80 rounded-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD000]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <BrainCircuit className="w-10 h-10 text-[#FFD000] mb-6 shrink-0" />
                <h4 className="text-2xl font-bold mb-4 text-[#F1F3F5]">AI & ML Solutions for Business Growth</h4>
                <p className="text-[#98A2B3] mb-6 flex-grow font-light text-sm leading-relaxed overflow-hidden">Enable your business to thrive, grow, & succeed in the modern digital age through our AI & ML solutions. We are an AI & ML development company, & we specialize in creating intelligent, scalable, & innovative solutions that will give your organization the tools they need to succeed.</p>
                <div className="flex items-center gap-2 text-[#FFD000] group-hover:gap-3 transition-all mt-auto">
                  <span className="text-sm font-semibold">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </FadeIn>

            {/* Card 2 - MVP Development Services */}
            <FadeIn delay={0.2}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="group relative p-8 bg-[#1A1D24] border border-white/5 hover:border-[#FFB300]/50 transition-all duration-500 h-[480px] md:h-[440px] flex flex-col text-left hover:bg-[#1A1D24]/80 rounded-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB300]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <Activity className="w-10 h-10 text-[#FFB300] mb-6 shrink-0" />
                <h4 className="text-2xl font-bold mb-4 text-[#F1F3F5]">MVP Development Services</h4>
                <p className="text-[#98A2B3] mb-6 flex-grow font-light text-sm leading-relaxed overflow-hidden">Transform your bold idea into a tangible, testable product. We create fully functional MVPs that validate market demand and gather real user feedback. Our 550+ successful projects help startups make confident, data-driven decisions.</p>
                <div className="flex items-center gap-2 text-[#FFD000] group-hover:gap-3 transition-all mt-auto">
                  <span className="text-sm font-semibold">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </FadeIn>

            {/* Card 3 - DevOps Services */}
            <FadeIn delay={0.3}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="group relative p-8 bg-[#1A1D24] border border-white/5 hover:border-[#F1F3F5]/30 transition-all duration-500 h-[480px] md:h-[440px] flex flex-col text-left hover:bg-[#1A1D24]/80 rounded-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <TerminalSquare className="w-10 h-10 text-[#F1F3F5] mb-6 shrink-0" />
                <h4 className="text-2xl font-bold mb-4 text-[#F1F3F5]">DevOps Services</h4>
                <p className="text-[#98A2B3] mb-6 flex-grow font-light text-sm leading-relaxed overflow-hidden">We provide end-to-end DevOps as a Service, combining expert DevOps consulting, automation, & DevSecOps services. Our cloud DevOps solutions help businesses achieve faster delivery, stronger security, & reliable scalability through our tailored consulting services.</p>
                <div className="flex items-center gap-2 text-[#FFD000] group-hover:gap-3 transition-all mt-auto">
                  <span className="text-sm font-semibold">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </FadeIn>

            {/* Card 4 - Custom Software Solutions */}
            <FadeIn delay={0.4}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="group relative p-8 bg-[#1A1D24] border border-white/5 hover:border-[#FFD000]/50 transition-all duration-500 h-[480px] md:h-[440px] flex flex-col text-left hover:bg-[#1A1D24]/80 rounded-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD000]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <Code2 className="w-10 h-10 text-[#FFD000] mb-6 shrink-0" />
                <h4 className="text-2xl font-bold mb-4 text-[#F1F3F5]">Custom Software Solutions Tailored to You</h4>
                <p className="text-[#98A2B3] mb-6 flex-grow font-light text-sm leading-relaxed overflow-hidden">Bitsclan's custom software development services help businesses design & implement tailored solutions. With our expertise in scalability, innovation, & efficiency, we ensure technology investments drive measurable results & deliver long-term business value.</p>
                <div className="flex items-center gap-2 text-[#FFD000] group-hover:gap-3 transition-all mt-auto">
                  <span className="text-sm font-semibold">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </FadeIn>

            {/* Card 5 - Intelligent Automation */}
            <FadeIn delay={0.5}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="group relative p-8 bg-[#1A1D24] border border-white/5 hover:border-[#FFB300]/50 transition-all duration-500 h-[480px] md:h-[440px] flex flex-col text-left hover:bg-[#1A1D24]/80 rounded-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB300]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap className="w-10 h-10 text-[#FFB300] mb-6 shrink-0" />
                <h4 className="text-2xl font-bold mb-4 text-[#F1F3F5]">Intelligent Automation for Business Processes</h4>
                <p className="text-[#98A2B3] mb-6 flex-grow font-light text-sm leading-relaxed overflow-hidden">We help organizations automate and optimize business processes using intelligent automation. By combining workflow automation, AI-driven decision support, and system integrations, we reduce manual effort, improve operational efficiency, and enable teams to scale without increasing overhead.</p>
                <div className="flex items-center gap-2 text-[#FFD000] group-hover:gap-3 transition-all mt-auto">
                  <span className="text-sm font-semibold">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </FadeIn>

            {/* Card 6 - CTA Card */}
            <FadeIn delay={0.6}>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="group relative p-8 bg-gradient-to-br from-[#FFD000]/10 to-[#FFB300]/10 border border-[#FFD000]/30 hover:border-[#FFD000]/60 transition-all duration-500 h-[480px] md:h-[440px] flex flex-col items-center justify-center text-center hover:bg-gradient-to-br hover:from-[#FFD000]/15 hover:to-[#FFB300]/15 rounded-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD000]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-3xl md:text-4xl font-black text-[#F1F3F5] mb-6">Build the Future With Us</h4>
                <p className="text-[#FFD000] font-semibold text-lg group-hover:text-[#FFD000] transition-colors">Get Started Today</p>
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative aspect-square md:aspect-[4/3] w-full border border-[#FFD000]/20 overflow-hidden group rounded-lg">
                <div className="absolute inset-0 bg-[#FFD000]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
                <img src="/images/quilonix-nodes.png" alt="Neural Network" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD000]/10 border border-[#FFD000]/20 rounded-full text-xs font-mono text-[#FFD000]">
                  <Cpu className="w-3 h-3" />
                  <span>CORE_PHILOSOPHY</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold leading-tight text-[#F1F3F5]">
                  Design is not how it looks.<br />
                  <span className="text-[#FFD000]">It's how it computes.</span>
                </h3>
                <p className="text-lg text-[#98A2B3] font-light">Most agencies build software that works. Quilonix builds systems that think. By operating at the intersection of high-end design and deep-tech architecture, we ensure your technology feels effortless while performing impossible feats beneath the surface.</p>
                <ul className="space-y-4 pt-4">
                  {["Zero-latency execution pipelines", "Autonomous data processing", "Pixel-perfect responsive interfaces"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#F1F3F5]/80">
                      <CheckCircle2 className="w-5 h-5 text-[#FFD000] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Tech Stack Ticker */}
      <section className="py-12 border-y border-white/5 bg-[#1A1D24] overflow-hidden">
        <div className="flex animate-ticker" style={{ width: "max-content" }}>
          {[...Array(3)].map((_, i) => (
            <Fragment key={i}>
              {["REACT", "NEXT.JS", "LARAVEL", "NODE.JS", "PYTHON", "ANGULAR", "FLUTTER", "ANDROID"].map((tech, j) => (
                <Fragment key={j}>
                  <span className="text-4xl font-black text-[#F1F3F5]/10 tracking-tighter px-8">{tech}</span>
                  <span className="text-[#FFD000]/30 text-4xl self-center">/</span>
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FFD000]/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-b border-[#FFD000]/10 pb-16">
            {[
              { val: "10x", label: "Output Multiplier" },
              { val: "0ms", label: "Human Friction" },
              { val: "99%", label: "Uptime SLA" },
              { val: "∞", label: "Scalability" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center md:text-left">
                  <div className="text-5xl md:text-7xl font-black mb-2 text-[#FFD000]">{stat.val}</div>
                  <div className="text-sm text-[#98A2B3] uppercase tracking-widest font-mono">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-32 border-t border-white/5 bg-[#0F1115] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#FFD000]/5 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header - Full Width */}
          <div className="mb-8">
            <h2 className="text-sm font-mono text-[#FFD000] tracking-widest mb-3 uppercase">Industries</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-[#F1F3F5]">Reinventing How Industries Operate in the Age of AI</h3>
            <p className="text-[#98A2B3] font-light leading-relaxed max-w-2xl">
              Driving innovation & transforming industries with advanced AI automation expertise & actionable insights.
            </p>
          </div>

          {/* Content Grid - List and Image */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-start">
            {/* Left: Industries List - 2 columns */}
            <div className="lg:col-span-2">
              <IndustriesSelector selectedIndustry={selectedIndustry} onSelect={setSelectedIndustry} />
            </div>

            {/* Right: Industry Showcase - 3 columns */}
            <div className="lg:col-span-3">
              <IndustryShowcase selectedIndustry={selectedIndustry} />
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 border-t border-white/5 bg-[#1A1D24]">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn delay={0.2}>
            <div className="mb-12">
              <h3 className="text-sm font-mono text-[#FFD000] tracking-widest mb-2 uppercase">Client Feedback</h3>
              <h2 className="text-4xl md:text-5xl font-black text-[#F1F3F5]">Don't just take our words for it!</h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <TestimonialSlider />
          </FadeIn>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 border-t border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD000]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn>
            <h2 className="text-sm font-mono text-[#FFD000] tracking-widest mb-4 uppercase">Pricing</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-[#F1F3F5]">Simple, flexible pricing.</h3>
            <p className="text-[#98A2B3] mb-16 max-w-2xl font-light">Work short-term or long-term. Your choice. We're not cheap—we're valuable. Transparent pricing designed for small to medium businesses that want serious results.</p>
          </FadeIn>

          {/* Hourly Rate Option */}
          <FadeIn delay={0.1}>
            <div className="mb-16 p-8 bg-gradient-to-r from-[#FFD000]/10 to-[#FFB300]/10 border border-[#FFD000]/30 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h4 className="text-2xl font-bold text-[#F1F3F5] mb-2">Hourly Rate</h4>
                  <p className="text-[#98A2B3] font-light">Perfect for ongoing projects, maintenance, or when scope isn't fully defined yet.</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-[#98A2B3] font-light">Starting from</span>
                  <span className="text-5xl font-black text-[#FFD000]">$20</span>
                  <span className="text-lg text-[#98A2B3] font-mono">/hour</span>
                </div>
              </div>
              <p className="text-sm text-[#98A2B3]/70 mt-4 font-mono">Minimum 10-hour engagement • Flexible scaling • Detailed time tracking & reporting</p>
            </div>
          </FadeIn>

          <div className="mb-12">
            <FadeIn delay={0.15}>
              <p className="text-center text-[#98A2B3] font-light text-lg">— OR —</p>
            </FadeIn>
          </div>

          {/* Project-Based Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* Starter */}
            <FadeIn delay={0.2}>
              <div className="relative p-8 bg-[#1A1D24] border border-white/5 flex flex-col h-full rounded-lg">
                <div className="mb-6">
                  <div className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest mb-2">Starter</div>
                  <div className="text-4xl font-black mb-1 text-[#F1F3F5]">$2,500</div>
                  <div className="text-sm text-[#98A2B3] font-mono">fixed project</div>
                </div>
                <p className="text-[#98A2B3] text-sm mb-8 font-light leading-relaxed border-t border-white/5 pt-6">
                  Ideal for small businesses launching their first automation or simple web presence.
                </p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {[
                    "1 focused automation workflow",
                    "Landing page or simple web app",
                    "Basic API integration",
                    "10-day delivery",
                    "30-day support included",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#F1F3F5]/70">
                      <Check className="w-4 h-4 text-[#FFD000] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} data-testid="btn-pricing-starter" variant="outline" className="w-full h-12 border-[#FFD000]/30 text-[#F1F3F5] hover:bg-[#FFD000]/5 hover:border-[#FFD000]/60 rounded-lg font-semibold">
                  Get Quote
                </Button>
              </div>
            </FadeIn>

            {/* Growth — featured */}
            <FadeIn delay={0.3}>
              <div className="relative p-8 bg-[#1A1D24] border border-[#FFD000]/50 flex flex-col h-full shadow-[0_0_40px_rgba(255,208,0,0.12)] rounded-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-mono px-3 py-1 bg-[#FFB300] text-black tracking-widest uppercase font-bold">Most Popular</span>
                </div>
                <div className="mb-6">
                  <div className="text-xs font-mono text-[#FFD000] uppercase tracking-widest mb-2">Growth</div>
                  <div className="text-4xl font-black mb-1 text-[#F1F3F5]">$5,000</div>
                  <div className="text-sm text-[#98A2B3] font-mono">fixed project</div>
                </div>
                <p className="text-[#98A2B3] text-sm mb-8 font-light leading-relaxed border-t border-[#FFD000]/10 pt-6">
                  For growing SMBs ready to scale with a complete, integrated solution.
                </p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {[
                    "Full web app + mobile responsive",
                    "Up to 3 automation workflows",
                    "Multi-platform integrations",
                    "Custom AI chatbot",
                    "7-day priority delivery",
                    "60-day support included",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#F1F3F5]/80">
                      <Check className="w-4 h-4 text-[#FFD000] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} data-testid="btn-pricing-growth" className="w-full h-12 bg-[#FFB300] hover:bg-[#FFD000] text-black rounded-lg font-bold shadow-[0_0_20px_rgba(255,179,0,0.3)] hover:shadow-[0_0_30px_rgba(255,208,0,0.4)] transition-all">
                  Get Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </FadeIn>

            {/* Enterprise */}
            <FadeIn delay={0.4}>
              <div className="relative p-8 bg-[#1A1D24] border border-white/5 flex flex-col h-full rounded-lg">
                <div className="mb-6">
                  <div className="text-xs font-mono text-[#FFB300] uppercase tracking-widest mb-2">Enterprise</div>
                  <div className="text-4xl font-black mb-1 text-[#FFD000]">Custom</div>
                  <div className="text-sm text-[#98A2B3] font-mono">dedicated team</div>
                </div>
                <p className="text-[#98A2B3] text-sm mb-8 font-light leading-relaxed border-t border-white/5 pt-6">
                  Complex systems, multi-phase projects, or ongoing retainer partnerships with dedicated support.
                </p>
                <ul className="space-y-3 mb-10 flex-grow">
                  {[
                    "Unlimited scope & complexity",
                    "Dedicated development team",
                    "Custom AI model training",
                    "SLA-backed infrastructure",
                    "Ongoing maintenance & support",
                    "Quarterly strategy reviews",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#F1F3F5]/70">
                      <Check className="w-4 h-4 text-[#FFB300] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} data-testid="btn-pricing-custom" className="w-full h-12 bg-[#FFB300] hover:bg-[#FFD000] text-black rounded-lg font-bold transition-all">
                  Schedule Call
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Pricing Note */}
          <FadeIn delay={0.5}>
            <div className="mt-16 text-center">
              <p className="text-[#98A2B3] font-light max-w-2xl mx-auto">
                All projects include discovery call, detailed proposal, and transparent communication. We're not here to be the cheapest—we're here to deliver the most value. Every quote is customized to your specific needs.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Contact / CTA */}
      <section id="contact" className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#FFD000]/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#FFB300]/5 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: CTA copy */}
            <FadeIn>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD000]/10 border border-[#FFD000]/20 rounded-full text-xs font-mono text-[#FFD000]">
                  <Activity className="w-3 h-3" />
                  <span>OPEN_FOR_WORK</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black leading-tight text-[#F1F3F5]">
                  The Future Belongs to Those Who<br />
                  <span className="text-[#FFD000]">Automate Today</span>
                </h2>
                <p className="text-lg text-[#98A2B3] font-light leading-relaxed max-w-md">
                  Tell us what you're building. We'll respond within 24 hours with a clear plan — no fluff, no sales pitch, just a straight answer on how we'd approach it.
                </p>
                <div className="pt-6 space-y-4">
                  {[
                    { icon: <Mail className="w-4 h-4 text-[#FFD000]" />, label: "Email us at", value: "hello@quilonix.com" },
                    { icon: <Phone className="w-4 h-4 text-[#FFB300]" />, label: "Call or WhatsApp", value: "+1 (555) 000-QNIX" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-[#1A1D24] border border-[#FFD000]/10">
                      <div className="w-8 h-8 flex items-center justify-center border border-[#FFD000]/20">{item.icon}</div>
                      <div>
                        <div className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest">{item.label}</div>
                        <div className="text-sm font-semibold text-[#F1F3F5]/80">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right: Form */}
            <FadeIn delay={0.2}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 border border-[#FFD000]/20 bg-[#FFD000]/5 p-12 text-center" data-testid="contact-success">
                  <CheckCircle2 className="w-12 h-12 text-[#FFD000]" />
                  <h4 className="text-2xl font-bold text-[#F1F3F5]">Message received.</h4>
                  <p className="text-[#98A2B3] font-light">We'll be in touch within 24 hours. Check your inbox — and check your competitors, because you're about to leave them behind.</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="contact-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest">Full Name</FormLabel>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]/40" />
                              <FormControl>
                                <Input
                                  placeholder="Alex Johnson"
                                  className="pl-10 bg-[#1A1D24] border-[#FFD000]/10 text-[#F1F3F5] placeholder:text-[#98A2B3]/40 rounded-lg focus:border-[#FFD000]/50 focus:ring-0 h-12"
                                  data-testid="input-name"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest">Email</FormLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]/40" />
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="alex@company.com"
                                  className="pl-10 bg-[#1A1D24] border-[#FFD000]/10 text-[#F1F3F5] placeholder:text-[#98A2B3]/40 rounded-lg focus:border-[#FFD000]/50 focus:ring-0 h-12"
                                  data-testid="input-email"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest">Phone / WhatsApp (optional)</FormLabel>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]/40" />
                              <FormControl>
                                <Input
                                  placeholder="+1 555 000 0000"
                                  className="pl-10 bg-[#1A1D24] border-[#FFD000]/10 text-[#F1F3F5] placeholder:text-[#98A2B3]/40 rounded-lg focus:border-[#FFD000]/50 focus:ring-0 h-12"
                                  data-testid="input-phone"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest">Company (optional)</FormLabel>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]/40" />
                              <FormControl>
                                <Input
                                  placeholder="Acme Inc."
                                  className="pl-10 bg-[#1A1D24] border-[#FFD000]/10 text-[#F1F3F5] placeholder:text-[#98A2B3]/40 rounded-lg focus:border-[#FFD000]/50 focus:ring-0 h-12"
                                  data-testid="input-company"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest">Subject (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. AI Chatbot for our website"
                              className="bg-[#1A1D24] border-[#FFD000]/10 text-[#F1F3F5] placeholder:text-[#98A2B3]/40 rounded-lg focus:border-[#FFD000]/50 focus:ring-0 h-12"
                              data-testid="input-subject"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest">Tell us what you're building</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="We need an AI chatbot that handles customer support for our SaaS product, integrated with our existing Slack workspace and ticketing system..."
                              className="bg-[#1A1D24] border-[#FFD000]/10 text-[#F1F3F5] placeholder:text-[#98A2B3]/40 rounded-lg focus:border-[#FFD000]/50 focus:ring-0 min-h-[140px] resize-none"
                              data-testid="input-message"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={submitting}
                      data-testid="btn-submit-contact"
                      className="w-full h-14 bg-[#FFB300] text-black hover:bg-[#FFD000] hover:text-black font-bold text-base rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,208,0,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Sending..." : <><span>Send Message</span> <Send className="ml-2 w-4 h-4" /></>}
                    </Button>
                    {submitError && (
                      <p className="text-red-400 text-sm text-center font-mono">{submitError}</p>
                    )}
                    <p className="text-xs text-[#98A2B3]/40 text-center font-mono">Response within 24 hours. No spam. Ever.</p>
                  </form>
                </Form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      <ChatBot />

      {/* Footer */}
      <footer className="py-12 border-t border-[#FFD000]/10 bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#FFD000]/60" />
            <span className="font-bold text-lg tracking-widest text-[#98A2B3]">QUILONIX</span>
          </div>
          <div className="text-[#98A2B3]/60 text-sm">
            © {new Date().getFullYear()} Quilonix AI Automation Agency. All systems operational.
          </div>
          <div className="flex gap-6 text-sm text-[#98A2B3]/60 font-mono uppercase">
            <a href="#" className="hover:text-[#FFD000] transition-colors" data-testid="link-twitter">Twitter</a>
            <a href="#" className="hover:text-[#FFD000] transition-colors" data-testid="link-github">GitHub</a>
            <a href="#" className="hover:text-[#FFD000] transition-colors" data-testid="link-linkedin">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
