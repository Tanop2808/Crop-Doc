"use client";

interface LandingPageProps {
  onNavigate: (page: "landing" | "diagnose") => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden px-6 py-20">
        {/* BG gradients */}
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 900px 600px at 60% 40%, rgba(74,222,128,.07) 0%, transparent 70%), radial-gradient(ellipse 500px 400px at 20% 80%, rgba(22,163,74,.05) 0%, transparent 60%)"
          }} />
        <div className="absolute inset-0 pointer-events-none z-0 opacity-35 hero-grid-bg" />
        <span className="absolute top-[15%] right-[8%] pointer-events-none opacity-[.06] text-[120px] select-none z-0 animate-leaf-sway">🌿</span>
        <span className="absolute bottom-[20%] left-[4%] pointer-events-none opacity-[.06] text-[80px] select-none z-0" style={{ animation: "leafSway 8s ease-in-out infinite reverse" }}>🍃</span>

        <div className="relative z-10 text-center max-w-[720px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 rounded-full px-4 py-1.5 text-[13px] font-medium mb-7 animate-fade-up">
            <span className="w-[7px] h-[7px] rounded-full bg-green-500 animate-pulse-dot" />
            AI-Powered · Instant Results · Free Forever
          </div>

          {/* H1 */}
          <h1 className="font-serif text-[clamp(46px,7vw,78px)] leading-[1.08] tracking-[-0.03em] text-gray-900 mb-5 animate-fade-up delay-100">
            Detect Crop Disease <em className="italic text-green-600">Instantly</em>
          </h1>

          <p className="text-[clamp(16px,2vw,19px)] text-gray-500 max-w-[520px] mx-auto mb-10 leading-[1.65] font-normal animate-fade-up delay-200">
            Upload a photo of your crop and get AI-powered diagnosis and precise treatment advice in seconds — no signup, no cost.
          </p>

          <div className="flex flex-col items-center gap-4 animate-fade-up delay-300">
            <button
              onClick={() => onNavigate("diagnose")}
              className="inline-flex items-center gap-2 font-sans font-semibold text-lg px-12 py-[18px] rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white shadow-[0_2px_8px_rgba(22,163,74,.3)] hover:from-green-500 hover:to-green-600 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(22,163,74,.35)] transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M11 8v6M8 11h6"/><path d="m21 21-4.3-4.3"/>
              </svg>
              Diagnose My Crop
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>

            <div className="flex items-center gap-5 flex-wrap justify-center text-[13px] text-gray-500">
              {["Free, always", "Instant results", "No signup required"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-18 pt-6">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
            {[
              { icon: "🌾", number: "10,000+", label: "Farmers Helped" },
              { icon: "🔬", number: "4",       label: "Diseases Detected" },
              { icon: "⚡", number: "2 sec",   label: "Analysis Time" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="bg-white border border-gray-100 rounded-2xl p-7 text-center shadow-sm hover:-translate-y-1 hover:shadow-green transition-all duration-200 relative overflow-hidden group animate-fade-up"
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative z-10">
                  <div className="text-[28px] mb-2">{s.icon}</div>
                  <div className="font-serif text-[32px] text-green-700 leading-none tracking-tight mb-1">{s.number}</div>
                  <div className="text-[13px] text-gray-400 font-medium">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-18">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-green-50 border border-green-200 text-green-700 rounded-full px-4 py-1 text-[12px] font-semibold uppercase tracking-[.08em] mb-3">Simple Process</span>
            <h2 className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.12] text-gray-900 mb-3">How CropDoc Works</h2>
            <p className="text-base text-gray-500 max-w-[460px] mx-auto leading-[1.65]">Three simple steps from photo to treatment plan in under 10 seconds.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 relative max-sm:grid-cols-1">
            <div className="absolute top-11 left-[calc(16.6%+12px)] right-[calc(16.6%+12px)] h-px max-sm:hidden"
              style={{ background: "repeating-linear-gradient(90deg,#86efac 0,#86efac 6px,transparent 6px,transparent 14px)" }} />
            {[
              { n: "1", icon: "📸", title: "Upload Photo",   desc: "Take a clear photo of the affected leaf or plant and upload it directly from your phone." },
              { n: "2", icon: "🤖", title: "AI Analysis",    desc: "Our AI scans the image, identifies disease patterns, and determines severity in seconds." },
              { n: "3", icon: "💊", title: "Get Treatment",  desc: "Receive a precise remedy plan with product recommendations and where to buy them locally." },
            ].map((step, i) => (
              <div
                key={step.n}
                className="bg-white border border-gray-100 rounded-2xl p-8 text-center relative z-10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-green-600 text-white text-[11px] font-bold flex items-center justify-center">{step.n}</div>
                <div className="w-[72px] h-[72px] mx-auto mb-[18px] rounded-full bg-gradient-to-br from-green-100 to-green-50 border-[1.5px] border-green-200 flex items-center justify-center text-[28px]">{step.icon}</div>
                <div className="font-bold text-base text-gray-900 mb-2">{step.title}</div>
                <div className="text-[14px] text-gray-500 leading-[1.6]">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-[28px] px-10 py-14 text-center relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] text-[160px] opacity-[.07] pointer-events-none select-none">🌿</div>
            <div className="relative z-10">
              <div className="font-serif text-[clamp(26px,4vw,40px)] text-white tracking-tight mb-3 leading-[1.2]">
                Your crops need help.<br /><em className="italic opacity-90">CropDoc has the answer.</em>
              </div>
              <p className="text-white/70 text-[15px] mb-7 max-w-[400px] mx-auto">Join thousands of farmers who trust CropDoc for fast, accurate disease diagnosis.</p>
              <button
                onClick={() => onNavigate("diagnose")}
                className="inline-flex items-center gap-2 font-sans font-bold text-base px-9 py-[15px] rounded-xl bg-white text-green-700 shadow-[0_4px_20px_rgba(0,0,0,.15)] hover:-translate-y-px transition-all duration-200"
              >
                Start Free Diagnosis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-9 px-6 border-t border-gray-100 text-center text-green-700 font-serif italic text-[15px]">
        🌿 CropDoc — <span className="opacity-60">Built for farmers. Powered by AI.</span>
      </footer>
    </div>
  );
}
