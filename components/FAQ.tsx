"use client";

import { useState, useRef, RefObject, ReactNode, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What does an AI automation agency do?",
    answer: "An AI automation agency helps businesses automate repetitive tasks, optimize workflows, and improve decision-making using artificial intelligence. It builds intelligent systems that reduce manual effort, increase efficiency, and integrate seamlessly with existing business tools and platforms. At Quilonix, we specialize in creating custom AI solutions tailored to your specific business needs."
  },
  {
    question: "How can AI automation improve business efficiency?",
    answer: "AI automation eliminates manual, repetitive work by handling data entry, processing, and decision-making at scale. This frees your team to focus on strategic work. Common improvements include: 40-80% reduction in processing time, 90%+ accuracy in data handling, 24/7 operation without human intervention, and seamless integration with your existing systems."
  },
  {
    question: "Is AI automation suitable for small businesses?",
    answer: "Absolutely. AI automation is especially valuable for small businesses because it multiplies your team's output without hiring. Whether you're a solo founder or a 50-person team, automation can handle customer support, lead qualification, order processing, and more. Our Starter package ($1,499) is designed specifically for small businesses launching their first automation."
  },
  {
    question: "What processes can be automated using AI?",
    answer: "Nearly any repetitive, rule-based process can be automated: customer support (chatbots), lead qualification and follow-up, order processing and fulfillment, data entry and validation, invoice processing, appointment scheduling, email management, report generation, inventory management, and more. We assess your workflows and identify the highest-impact automation opportunities."
  },
  {
    question: "How long does it take to implement AI automation?",
    answer: "Implementation timelines vary based on complexity. Simple automations (chatbots, basic workflows) typically take 2-4 weeks. More complex systems (multi-platform integrations, custom AI models) take 4-8 weeks. Our Growth package includes a 7-day priority delivery SLA for standard projects. We'll provide a clear timeline during your initial consultation."
  },
  {
    question: "Does AI automation require integration with existing systems?",
    answer: "Most automation projects involve integrating with your existing tools—CRM, e-commerce platform, accounting software, etc. We handle all integrations as part of our service. We work with REST APIs, Zapier, Make.com, and custom integrations. Our Growth package includes third-party API integrations, and our Custom tier handles unlimited complexity."
  },
  {
    question: "What problems can AI automation solve in a business?",
    answer: "AI automation solves: slow response times (24/7 availability), high operational costs (reduced manual labor), human error (consistent, accurate processing), team burnout (eliminating tedious tasks), missed opportunities (faster lead response), and scaling challenges (systems that grow with you). We've helped clients reduce operational costs by 40-60% while improving quality."
  },
  {
    question: "What is the return on investment of AI automation?",
    answer: "ROI varies by use case, but most clients see payback within 3-6 months. For example: a restaurant chatbot increased reservations by 3x, an e-commerce automation saved 25 hours/week (worth ~$30k annually), and a real estate platform increased lead conversion by 40%. We discuss expected ROI during your consultation and track metrics post-launch."
  },
  {
    question: "How do I know if my business needs AI automation?",
    answer: "You likely need automation if: your team spends 10+ hours/week on repetitive tasks, you're losing leads due to slow response times, you have manual data entry across multiple systems, customer support is overwhelming, or you want to scale without proportionally increasing headcount. Schedule a call with us—we'll audit your workflows and identify opportunities."
  },
  {
    question: "What is the difference between AI automation and traditional automation?",
    answer: "Traditional automation follows rigid, pre-programmed rules. AI automation learns, adapts, and makes intelligent decisions. For example: traditional automation might flag an invoice as 'needs review,' while AI automation understands context, validates against historical patterns, and approves it automatically. AI automation is more flexible, handles edge cases better, and improves over time."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FFD000]/5 blur-[100px] rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <FadeIn>
          <h2 className="text-sm font-mono text-[#FFD000] tracking-widest mb-4 uppercase">FAQ</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-[#F1F3F5]">Your Questions on AI Automation, Answered</h3>
          <p className="text-[#98A2B3] mb-16 max-w-2xl font-light">Everything you need to know about AI automation, implementation, and how it can transform your business.</p>
        </FadeIn>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FadeIn key={index} delay={index * 0.05}>
              <div className="border border-white/5 hover:border-[#FFD000]/30 transition-all duration-300 bg-[#1A1D24] overflow-hidden rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#FFD000]/5 transition-colors duration-300 text-left group"
                  data-testid={`faq-button-${index}`}
                >
                  <h4 className="text-lg font-semibold text-[#F1F3F5] group-hover:text-[#FFD000] transition-colors duration-300 pr-4">
                    {item.question}
                  </h4>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FFD000] shrink-0 transition-transform duration-500 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div
                    className="px-6 py-5 border-t border-white/5 bg-[#0F1115]/50 animate-in fade-in slide-in-from-top-2 duration-300"
                    data-testid={`faq-answer-${index}`}
                  >
                    <p className="text-[#98A2B3] font-light leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div className="mt-16 p-8 bg-[#1A1D24] border border-[#FFD000]/20 text-center rounded-lg">
            <p className="text-[#98A2B3] mb-4 font-light">
              Still have questions? We're here to help.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFB300] text-black hover:bg-[#FFD000] font-bold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,179,0,0.3)]"
            >
              Get in Touch
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
