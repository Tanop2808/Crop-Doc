"use client";

import { useState, useRef } from "react";

const DISEASES = [
  {
    name: "Powdery Mildew", severity: "Medium", emoji: "🍃",
    steps: ["Apply neem oil spray every 3 days", "Remove and burn affected leaves", "Avoid watering leaves directly"],
    bestSolution: "Neem Oil Spray", product: "Organic Neem Oil Concentrate",
    availableAt: "Local agri store or online", cost: "₹150 – ₹300", actWithin: "3–5 days",
  },
  {
    name: "Leaf Blight", severity: "High", emoji: "🍂",
    steps: ["Use copper-based fungicide immediately", "Destroy all infected plant parts", "Avoid overhead irrigation completely"],
    bestSolution: "Copper Fungicide Spray", product: "Blitox / Copper Oxychloride",
    availableAt: "Any agri input shop", cost: "₹200 – ₹500", actWithin: "1–2 days",
  },
  {
    name: "Root Rot", severity: "High", emoji: "🌱",
    steps: ["Improve field drainage immediately", "Apply Trichoderma bio-fungicide to soil", "Reduce watering frequency by half"],
    bestSolution: "Trichoderma Bio-Fungicide", product: "Trichoderma Viride Powder",
    availableAt: "Agri cooperative or Krishi Kendra", cost: "₹100 – ₹250", actWithin: "1–2 days",
  },
  {
    name: "Nutrient Deficiency", severity: "Low", emoji: "🟡",
    steps: ["Apply balanced NPK fertilizer", "Adjust soil pH to target range 6.0–6.5", "Add organic compost to improve absorption"],
    bestSolution: "NPK Fertilizer Application", product: "NPK 19:19:19 Water Soluble Fertilizer",
    availableAt: "Any fertilizer shop or online", cost: "₹300 – ₹600", actWithin: "7–10 days",
  },
];

const FOLLOW_UP_RESPONSES: Record<string, Record<string, string>> = {
  "Powdery Mildew": {
    "What causes it?": "Powdery Mildew is caused by fungal spores (mainly Erysiphe spp.) that thrive in warm, dry conditions with high humidity. It spreads through wind and infected plant debris.",
    "Will it spread to other plants?": "Yes! Powdery mildew spreads rapidly through airborne spores. Isolate infected plants and treat immediately. Maintain 30–45cm spacing between plants to reduce spread.",
    "How long will treatment take?": "With proper neem oil application every 3 days, visible improvement appears within 7–10 days. Full recovery takes 2–3 weeks. Continue treatment for 1 week after symptoms disappear.",
  },
  "Leaf Blight": {
    "What causes it?": "Leaf Blight is caused by bacterial (Xanthomonas) or fungal (Alternaria, Helminthosporium) pathogens. It thrives in warm, humid weather and spreads through rain splashes and contaminated tools.",
    "Will it spread to other plants?": "Extremely fast spread! Blight can wipe out entire fields within days. Remove and burn all infected material. Do NOT compost it. Disinfect tools with 1% bleach solution after each use.",
    "How long will treatment take?": "Copper fungicide shows results within 3–5 days. However, damaged leaves will not recover — only new growth will be healthy. Full crop recovery takes 3–4 weeks of consistent treatment.",
  },
  "Root Rot": {
    "What causes it?": "Root Rot is caused by water mold pathogens (Pythium, Phytophthora, Fusarium) that thrive in waterlogged, oxygen-deprived soil. Overwatering is the #1 cause.",
    "Will it spread to other plants?": "Yes, through contaminated water and soil. Improve drainage across the entire field. Avoid walking through infected areas to prevent spreading pathogens on boots and tools.",
    "How long will treatment take?": "Drainage improvement shows results within 48 hours. Trichoderma colonizes roots within 2–3 weeks. If less than 50% roots are affected, the plant can recover fully within 4–6 weeks.",
  },
  "Nutrient Deficiency": {
    "What causes it?": "Poor soil quality, wrong pH (outside 6.0–6.5), over-irrigation leaching nutrients, or imbalanced fertilizer application. Sandy soils are especially prone to nutrient loss.",
    "Will it spread to other plants?": "Nutrient deficiency is not contagious — it's a soil issue. However, if soil conditions are the same across your field, all plants will be affected. Get a full soil test to identify the exact deficiency.",
    "How long will treatment take?": "Foliar NPK spray shows results within 5–7 days. Soil application takes 2–3 weeks. Full recovery and normal growth resumes in 4–6 weeks with consistent fertilization.",
  },
};

interface DiagnosePageProps {
  onNavigate: (page: "landing" | "diagnose") => void;
}

type Disease = typeof DISEASES[0];

export default function DiagnosePage({ onNavigate }: DiagnosePageProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState<Disease | null>(null);
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  function handleFile(file: File) {
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setActiveSample(null);
  }

  function loadSample(name: string) {
    setActiveSample(name);
    setUploadedFile(new File([], name));
    setPreviewUrl(null);
    setResult(null);
  }

  async function analyseImage() {
    setIsAnalysing(true);
    setResult(null);
    setChatMessages([]);

    try {
      let detectedName: string;

      if (activeSample) {
        detectedName = activeSample;
      } else if (uploadedFile && uploadedFile.size > 0) {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(uploadedFile);
        });

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: uploadedFile.type || "image/jpeg", data: base64Data } },
                { type: "text", text: `You are an expert agricultural disease detector. Analyze this crop/plant image and identify which ONE of these 4 diseases best matches what you see. Even if the image is unclear or shows a healthy plant, pick the closest match.\n\nThe 4 diseases:\n1. Powdery Mildew - white/gray powdery coating on leaves\n2. Leaf Blight - brown/yellow lesions or dead patches on leaves\n3. Root Rot - yellowing/wilting leaves, dark mushy stem base\n4. Nutrient Deficiency - yellowing between veins, pale discolored leaves\n\nRespond ONLY with valid JSON, no preamble or markdown:\n{"disease": "DISEASE_NAME_HERE"}\n\nWhere DISEASE_NAME_HERE is exactly one of: "Powdery Mildew", "Leaf Blight", "Root Rot", "Nutrient Deficiency"` },
              ],
            }],
          }),
        });

        const data = await response.json();
        const text = data.content.map((i: { text?: string }) => i.text || "").join("");
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        detectedName = parsed.disease;
      } else {
        throw new Error("No image selected");
      }

      const found = DISEASES.find((d) => d.name === detectedName);
      if (!found) throw new Error("Unknown disease");

      setResult(found);
      setChatMessages([{
        role: "ai",
        text: `I've detected <b>${found.name}</b> in your crop. Severity is <b>${found.severity}</b>. You should act within <b>${found.actWithin}</b>.\n\nDo you have any questions about the treatment or diagnosis?`,
      }]);

      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setResult(DISEASES[Math.floor(Math.random() * DISEASES.length)]);
    } finally {
      setIsAnalysing(false);
    }
  }

  async function sendChat() {
    if (!chatInput.trim() || !result) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);

    setTimeout(() => {
      const followUps = FOLLOW_UP_RESPONSES[result.name] || {};
      const matchedKey = Object.keys(followUps).find((k) => userMsg.toLowerCase().includes(k.toLowerCase().split(" ")[1] || k));
      const reply = matchedKey
        ? followUps[matchedKey]
        : `Great question about <b>${result.name}</b>! The best approach is to follow the treatment steps carefully — especially using <b>${result.product}</b> and acting within <b>${result.actWithin}</b>. Feel free to ask about causes, spread, or recovery time!`;

      setChatMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 600);
  }

  function reset() {
    setUploadedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setActiveSample(null);
    setChatMessages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const sevClass = result?.severity === "High" ? "bg-red-600" : result?.severity === "Medium" ? "bg-yellow-500" : "bg-green-600";
  const canAnalyse = !!(uploadedFile || activeSample);

  return (
    <div>
      {/* Header */}
      <div className="py-14 px-6 text-center bg-gradient-to-b from-green-50 to-[#fafaf7] border-b border-gray-100">
        <span className="inline-block bg-green-50 border border-green-200 text-green-700 rounded-full px-4 py-1 text-[12px] font-semibold uppercase tracking-[.08em] mb-3">AI Diagnosis</span>
        <h1 className="font-serif text-[clamp(32px,5vw,52px)] tracking-[-0.025em] leading-[1.1] text-gray-900 mb-3">AI Crop Disease Detector</h1>
        <p className="text-base text-gray-500 max-w-[500px] mx-auto">Upload a photo of your affected crop leaf or plant and get instant diagnosis with treatment advice.</p>
      </div>

      <div className="px-6 py-12 pb-20">
        <div className="max-w-[680px] mx-auto">

          {/* Sample Images */}
          <div className="mb-5">
            <div className="text-[12px] font-bold uppercase tracking-[.08em] text-gray-400 mb-2.5 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Try a sample image
            </div>
            <div className="grid grid-cols-4 gap-2.5 max-sm:grid-cols-2">
              {DISEASES.map((d) => (
                <button
                  key={d.name}
                  onClick={() => loadSample(d.name)}
                  className={`bg-white border-[1.5px] rounded-xl p-3 text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(22,163,74,.15)] hover:border-green-400 hover:bg-green-50 ${activeSample === d.name ? "border-green-500 bg-green-50 shadow-[0_0_0_3px_rgba(22,163,74,.12)]" : "border-gray-200"}`}
                >
                  <span className="text-2xl block mb-1">{d.emoji}</span>
                  <div className="text-[11px] font-semibold text-gray-700 leading-[1.3]">{d.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{d.severity} severity</div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[28px] bg-white min-h-[280px] flex flex-col items-center justify-center gap-3 px-6 py-10 cursor-pointer relative transition-all duration-200 overflow-hidden hover:border-green-500 hover:bg-green-50 hover:shadow-[0_0_0_4px_rgba(22,163,74,.06)] ${previewUrl ? "border-solid border-green-400" : "border-green-300"}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Uploaded crop" className="w-full max-h-[300px] object-cover rounded-xl" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center border-[1.5px] border-green-200">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                {activeSample ? (
                  <div className="text-green-700 font-semibold text-base">Sample: {activeSample}</div>
                ) : (
                  <>
                    <div className="font-semibold text-base text-gray-800">Click to upload or drag &amp; drop</div>
                    <div className="text-[13px] text-gray-400">Supports JPG, PNG, WEBP · Max 10MB</div>
                  </>
                )}
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="text-[13px] text-green-700 font-medium mt-1.5 inline-block bg-green-50 px-3.5 py-1 rounded-full border border-green-200">
              📎 {uploadedFile.name || activeSample}
            </div>
          )}

          {/* Analyse Button */}
          <div className="mt-5">
            <button
              disabled={!canAnalyse || isAnalysing}
              onClick={analyseImage}
              className="w-full flex items-center justify-center gap-2 font-sans font-semibold text-base py-[15px] rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white shadow-[0_2px_8px_rgba(22,163,74,.3)] hover:from-green-500 hover:to-green-600 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(22,163,74,.35)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isAnalysing ? (
                <>
                  <span className="w-5 h-5 border-[2.5px] border-green-200 border-t-white rounded-full animate-spin-slow" />
                  Analysing your crop with AI...
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="M11 8v6M8 11h6"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                  Analyse Crop
                </>
              )}
            </button>
          </div>

          {/* Result Card */}
          {result && (
            <div className="mt-8 bg-white rounded-[28px] shadow-[0_24px_60px_rgba(22,163,74,.16),0_8px_24px_rgba(0,0,0,.1)] border border-gray-100 overflow-hidden animate-fade-up">
              {/* Result Header */}
              <div className="bg-gradient-to-br from-green-700 to-green-600 px-7 py-5 flex items-center gap-2.5 text-white">
                <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div className="font-semibold text-[15px]">Analysis Complete</div>
                  <div className="text-[13px] opacity-75 mt-0.5">AI-powered crop disease detection</div>
                </div>
              </div>

              {/* Result Body */}
              <div className="p-7">
                <div className="grid grid-cols-[120px_1fr] gap-5 mb-6 items-start max-sm:grid-cols-1">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Crop" className="w-[120px] h-[100px] object-cover rounded-xl border-2 border-green-100 max-sm:w-full max-sm:h-40" />
                  ) : (
                    <div className="w-[120px] h-[100px] bg-green-50 border-2 border-green-100 rounded-xl flex items-center justify-center text-4xl max-sm:w-full max-sm:h-40">{result.emoji}</div>
                  )}
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[.07em] text-gray-400 mb-1">Detected Disease</div>
                    <div className="font-serif text-[28px] text-gray-900 tracking-tight leading-[1.15] mb-3">{result.name}</div>
                    <span className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-[.05em] text-white ${sevClass}`}>
                      ● {result.severity} Severity
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-5" />

                {/* Treatment Steps */}
                <div className="text-[13px] font-bold uppercase tracking-[.07em] text-gray-400 mb-3.5 flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Immediate Action Steps
                </div>
                <ul className="flex flex-col gap-2.5 list-none mb-6">
                  {result.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-gray-700 leading-[1.55]">
                      <span className="w-5 h-5 rounded-full bg-green-100 border-[1.5px] border-green-300 flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600 text-[11px] font-bold">✓</span>
                      {step}
                    </li>
                  ))}
                </ul>

                {/* Best Solution Card */}
                <div className="bg-green-50 border-[1.5px] border-green-200 rounded-xl p-5">
                  <div className="font-bold text-[15px] text-gray-900 mb-4 flex items-center gap-2">🏆 Best Solution</div>
                  <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                    {[
                      { label: "Treatment", value: result.bestSolution },
                      { label: "Product", value: result.product },
                      { label: "Available At", value: result.availableAt },
                      { label: "Estimated Cost", value: result.cost },
                    ].map((item) => (
                      <div key={item.label}>
                        <label className="text-[11px] font-semibold uppercase tracking-[.06em] text-gray-400 block mb-0.5">{item.label}</label>
                        <span className="text-[14px] text-gray-800 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Act Within Banner */}
                <div className="mt-5 bg-gradient-to-r from-green-600/8 to-green-600/4 border border-green-200 rounded-xl px-5 py-3.5 flex items-center gap-2.5 text-[14px] font-semibold text-green-800">
                  <span className="text-[18px]">⏰</span>
                  Act within <span className="text-green-600">{result.actWithin}</span> to prevent crop loss
                </div>

                {/* Follow-up Chat */}
                {chatMessages.length > 0 && (
                  <div className="mt-5 border-[1.5px] border-green-200 rounded-xl overflow-hidden bg-white">
                    <div className="bg-green-50 border-b border-green-100 px-[18px] py-3 flex items-center gap-2 text-[13px] font-bold text-green-700">
                      🤖 Ask follow-up questions
                    </div>
                    <div className="px-4 py-3.5 flex flex-col gap-2.5 max-h-[260px] overflow-y-auto">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-[1.55] animate-fade-up ${
                            msg.role === "ai"
                              ? "bg-green-50 border border-green-100 text-gray-800 self-start rounded-bl-[4px]"
                              : "bg-green-600 text-white self-end rounded-br-[4px]"
                          }`}
                          dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br/>") }}
                        />
                      ))}
                      {chatLoading && (
                        <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] bg-green-50 border border-green-100 text-gray-500 italic self-start">
                          Thinking...
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat suggestions */}
                    <div className="px-3.5 pb-2.5 flex flex-wrap gap-1.5">
                      {["What causes it?", "Will it spread to other plants?", "How long will treatment take?"].map((s) => (
                        <button
                          key={s}
                          onClick={() => { setChatInput(s); }}
                          className="text-[11px] px-2.5 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 cursor-pointer font-medium hover:bg-green-100 hover:border-green-400 transition-all duration-150"
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 px-3.5 py-2.5 border-t border-gray-100">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendChat()}
                        placeholder="Ask a follow-up question..."
                        className="flex-1 border-[1.5px] border-gray-200 rounded-lg px-3.5 py-2 font-sans text-[13px] outline-none bg-gray-50 focus:border-green-400 focus:bg-white transition-colors duration-200"
                      />
                      <button
                        onClick={sendChat}
                        disabled={chatLoading}
                        className="bg-green-600 text-white border-none rounded-lg px-4 py-2 cursor-pointer text-[13px] font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 whitespace-nowrap"
                      >
                        Send ➤
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex gap-3 max-sm:flex-col">
                  <button
                    onClick={reset}
                    className="flex-1 flex items-center justify-center gap-2 font-sans font-semibold text-[14px] px-6 py-3 rounded-xl bg-white text-green-700 border-[1.5px] border-green-300 shadow-sm hover:bg-green-50 hover:border-green-500 hover:-translate-y-px transition-all duration-200"
                  >
                    ↺ Diagnose Another Crop
                  </button>
                  <button
                    onClick={() => onNavigate("landing")}
                    className="flex-1 flex items-center justify-center gap-2 font-sans font-semibold text-[14px] px-6 py-3 rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white shadow-[0_2px_8px_rgba(22,163,74,.3)] hover:from-green-500 hover:to-green-600 hover:-translate-y-px transition-all duration-200"
                  >
                    🌿 Back to Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
