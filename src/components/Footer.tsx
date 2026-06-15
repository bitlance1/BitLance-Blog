import { Bitcoin } from "lucide-react";

export function Footer() {
  return (
    <>
      {/* Contextual CTA */}
      <section className="bg-white border-t border-gray-100 py-16 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="heading-display text-2xl font-bold text-gray-900 mb-4">
            Build your borderless career
          </h2>
          <p className="text-gray-500 mb-8">
            Bitlance connects top global talent with Bitcoin-native companies. Get paid instantly over the Lightning Network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="https://www.bitlance.work/signup" className="w-full sm:w-auto rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm">
               Sign up as a freelancer
             </a>
             <a href="https://www.bitlance.work/signup" className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
               Hire Bitcoin-Native Talent
             </a>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
           <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-500 text-white">
              <Bitcoin className="h-4 w-4 stroke-[1.5]" />
            </div>
            <span className="font-bold text-gray-900">Bitlance</span>
          </div>
          
          <div className="flex items-center gap-6 text-gray-500 font-medium">
            <a href="#" className="hover:text-gray-900 transition-colors">Blog</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Resources</a>
            <a href="#" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
          </div>
          
          <p className="text-gray-400">© {new Date().getFullYear()} Bitlance Inc.</p>
        </div>
      </footer>
    </>
  );
}
