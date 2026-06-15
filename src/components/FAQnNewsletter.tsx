import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "How can freelancers get paid in Bitcoin?",
    answer: "Using non-custodial Lightning wallets or on-chain addresses. When an invoice is presented and paid, the funds flow directly peer-to-peer. Platforms like Bitlance use smart contracts to hold funds in escrow until work is delivered."
  },
  {
    question: "What are Bitcoin freelance jobs?",
    answer: "These are standard professional roles (software engineering, design, marketing) where compensation is strictly denominated or paid out via BTC."
  },
  {
    question: "How does Lightning Network payment work?",
    answer: "Lightning is a Layer-2 scaling solution on top of Bitcoin, allowing for instant, high-volume micro-transactions with virtually zero routing fees—ideal for hourly or milestone-based freelance payouts."
  }
];

export function FAQnNewsletter() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <h2 className="heading-display text-3xl font-bold text-gray-900 mb-4">FAQ</h2>
              <p className="text-gray-500 text-sm">Answers to common questions about earning Bitcoin independently.</p>
            </div>
            
            <div className="md:col-span-3 space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="border-b border-gray-200 last:border-0"
                >
                  <button
                    className="w-full py-5 flex items-center justify-between text-left group"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 text-gray-500 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-display text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Stay Ahead of the Bitcoin Economy
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Get the latest Bitcoin freelancing insights, remote work tips, and industry updates delivered directly to your inbox.
          </p>

          <form className="mx-auto max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-grow rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-sm"
            />
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-400">Join 15,000+ professionals. No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
