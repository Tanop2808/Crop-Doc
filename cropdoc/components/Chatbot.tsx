"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "bot" | "user";
  html: string;
}

const BOT_KB: Record<string, { intro: string; topics: Record<string, string> }> = {
  "powdery mildew": {
    intro: "🍃 <b>Powdery Mildew</b> is a fungal disease showing as white/gray powdery spots on leaves. Here's everything you need to know:",
    topics: {
      symptoms:   "White or gray powdery coating on leaf surfaces, stems, and buds. Leaves may curl or yellow over time. Usually starts on older leaves first.",
      treatment:  "✅ Apply <b>Neem Oil Spray</b> every 3 days. Remove and burn all affected leaves. Avoid watering leaves directly — water only at the base of the plant.",
      product:    "🛒 Use <b>Organic Neem Oil Concentrate</b>. Available at any local agri store or online. Cost: ₹150–₹300.",
      prevention: "💡 Ensure good air circulation between plants. Avoid overhead irrigation. Don't over-fertilize with nitrogen.",
      severity:   "⚠️ Severity: <b>Medium</b>. Act within <b>3–5 days</b>. Spreads quickly but won't kill the plant immediately.",
      organic:    "🌿 Organic options: Neem oil, baking soda spray (1 tsp per litre of water), or diluted milk spray (40% milk + 60% water) applied weekly.",
      cost:       "💰 Treatment cost: ₹150–₹300 for Neem Oil. One bottle covers 1–2 acres when diluted properly.",
    },
  },
  "leaf blight": {
    intro: "🍂 <b>Leaf Blight</b> is a serious disease causing rapid browning and death of leaf tissue. Act fast!",
    topics: {
      symptoms:   "Brown or yellow lesions on leaves with water-soaked edges. Dead patches spread fast. Dark spots with yellow halos may appear.",
      treatment:  "✅ Apply <b>Copper-based Fungicide immediately</b>. Destroy all infected parts — do NOT compost them. Avoid overhead irrigation completely.",
      product:    "🛒 Use <b>Blitox / Copper Oxychloride</b>. Available at any agri input shop. Cost: ₹200–₹500.",
      prevention: "💡 Use disease-resistant seed varieties. Maintain plant spacing for airflow. Avoid working in wet fields.",
      severity:   "🚨 Severity: <b>High</b>. Act within <b>1–2 days</b>. Delay can cause complete crop loss. Treat immediately!",
      organic:    "🌿 Organic option: <b>Bordeaux mixture</b> (copper sulfate + lime). Apply every 7–10 days during wet conditions.",
      cost:       "💰 Treatment cost: ₹200–₹500 for Copper Oxychloride. Severe infections: ₹800–₹1200 per acre including labor.",
    },
  },
  "root rot": {
    intro: "🌱 <b>Root Rot</b> is caused by waterlogged soil and fungal pathogens attacking the roots. Here's what to do:",
    topics: {
      symptoms:   "Yellowing and wilting leaves despite adequate water. Dark, mushy or slimy roots. Stem base appears dark or rotten. Plant collapses despite watering.",
      treatment:  "✅ <b>Improve field drainage immediately</b> — this is step #1. Apply Trichoderma bio-fungicide. Reduce watering by half.",
      product:    "🛒 Use <b>Trichoderma Viride Powder</b>. Available at agri cooperatives or Krishi Kendra. Cost: ₹100–₹250.",
      prevention: "💡 Never over-water. Plant in raised beds. Add compost to improve soil structure. Avoid low-lying waterlogged areas.",
      severity:   "🚨 Severity: <b>High</b>. Act within <b>1–2 days</b>. Once roots are fully rotten the plant cannot be saved.",
      organic:    "🌿 Trichoderma is itself bio-organic. Also try drenching soil with diluted hydrogen peroxide (3%).",
      cost:       "💰 Treatment cost: ₹100–₹250 for Trichoderma powder. Drainage improvement: ₹500–₹1000 per acre in labor.",
    },
  },
  "nutrient deficiency": {
    intro: "🟡 <b>Nutrient Deficiency</b> is a soil/nutrition problem — not an infection. The good news: it's easy to fix!",
    topics: {
      symptoms:   "Yellowing between leaf veins (interveinal chlorosis), pale or discolored leaves, stunted growth, small fruits.",
      treatment:  "✅ Apply <b>balanced NPK fertilizer</b>. Adjust soil pH to 6.0–6.5. Add organic compost to improve nutrient absorption.",
      product:    "🛒 Use <b>NPK 19:19:19 Water Soluble Fertilizer</b>. Available at any fertilizer shop or online. Cost: ₹300–₹600.",
      prevention: "💡 Get a soil test every season (₹50–₹100 at Krishi Kendra). Use crop rotation. Add compost regularly.",
      severity:   "✅ Severity: <b>Low</b>. Act within <b>7–10 days</b>. Not immediately life-threatening but reduces yield significantly.",
      organic:    "🌿 Vermicompost, neem cake, cow dung manure, and bone meal are excellent organic options.",
      cost:       "💰 Treatment cost: ₹300–₹600 for NPK fertilizer. Soil testing: ₹50–₹100 (highly recommended first).",
    },
  },
};

const BOT_KEYWORDS = [
  { words: ["powdery","mildew","white powder","white spot","gray coat","white coat"],         disease: "powdery mildew" },
  { words: ["blight","brown spot","yellow lesion","dead patch","water soak","leaf die"],      disease: "leaf blight" },
  { words: ["root rot","root","wilting","wilt","mushy","soggy","waterlog","drainage","dark stem"], disease: "root rot" },
  { words: ["nutrient","deficiency","yellow leaf","pale leaf","stunted","npk","fertiliz","compost","interveinal"], disease: "nutrient deficiency" },
  { words: ["symptom","identify","sign","look like","what is","how does","detect"],           topic: "symptoms" },
  { words: ["treat","treatment","cure","fix","solution","remedy","how to","steps","what to"], topic: "treatment" },
  { words: ["product","buy","where","shop","purchase","store","krishi","kendra","brand"],     topic: "product" },
  { words: ["prevent","prevention","avoid","stop","protect","future","recur"],                topic: "prevention" },
  { words: ["sever","urgent","danger","bad","how serious","critical","how long","days","time"], topic: "severity" },
  { words: ["organic","natural","chemical free","bio","home remedy","without chemical"],      topic: "organic" },
  { words: ["cost","price","rupee","₹","expensive","afford","money","budget","cheap"],        topic: "cost" },
];

const FALLBACKS = [
  "I can help with <b>Powdery Mildew</b>, <b>Leaf Blight</b>, <b>Root Rot</b>, and <b>Nutrient Deficiency</b>. Try: <i>\"How do I treat leaf blight?\"</i>",
  "Try typing a symptom like <i>\"white spots on leaves\"</i> or <i>\"wilting plant\"</i>!",
  "I know symptoms, treatment, products, cost, and organic alternatives for all 4 diseases. What would you like to know?",
];

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", html: "👋 Hi! I'm your CropDoc assistant. I can help with all 4 crop diseases.<br/><br/>Ask me about <b>Powdery Mildew</b>, <b>Leaf Blight</b>, <b>Root Rot</b>, or <b>Nutrient Deficiency</b> — or just type your symptom!" },
  ]);
  const [chips, setChips] = useState([
    "🍃 Powdery Mildew", "🍂 Leaf Blight", "🌱 Root Rot", "🟡 Nutrient Deficiency",
  ]);
  const [input, setInput] = useState("");
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [lastDisease, setLastDisease] = useState<string | null>(null);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  function addMsg(html: string, role: "bot" | "user") {
    setMessages((prev) => [...prev, { role, html }]);
  }

  function getResponse(inputText: string): { response: string; newChips?: string[] } {
    const q = inputText.toLowerCase();
    let matchedDisease: string | null = null;
    let matchedTopic: string | null = null;

    for (const k of BOT_KEYWORDS) {
      if ("disease" in k && k.words.some((w) => q.includes(w))) { matchedDisease = k.disease as string; break; }
    }
    for (const k of BOT_KEYWORDS) {
      if ("topic" in k && k.words.some((w) => q.includes(w))) { matchedTopic = k.topic as string; break; }
    }

    const disease = matchedDisease || lastDisease;
    if (matchedDisease) setLastDisease(matchedDisease);

    if (disease && matchedTopic) return { response: BOT_KB[disease].topics[matchedTopic] };

    if (disease && !matchedTopic) {
      const topicChips = ["🔍 Symptoms","✅ Treatment","🛒 Product","💡 Prevention","🌿 Organic fix","💰 Cost"];
      setChips(topicChips);
      return { response: BOT_KB[disease].intro + "<br/><br/>What would you like to know? Tap a button below 👇" };
    }

    if (!disease && matchedTopic) return { response: "Which disease are you asking about? 🍃 <b>Powdery Mildew</b>, 🍂 <b>Leaf Blight</b>, 🌱 <b>Root Rot</b>, or 🟡 <b>Nutrient Deficiency</b>?" };

    if (/^(hi|hello|hey|namaste|helo|hii|good)/.test(q)) return { response: "👋 Namaste! I'm your CropDoc assistant. Ask me about any of the 4 diseases — symptoms, treatment, products, cost, or organic alternatives!" };
    if (q.includes("thank")) return { response: "🙏 You're welcome! Your crops are in good hands. Feel free to ask anything else!" };
    if (q.includes("help") || q.includes("what can")) return { response: "I can help with: <b>Symptoms · Treatment · Products · Prevention · Severity · Organic alternatives · Cost</b> — for all 4 crop diseases!" };

    const resp = FALLBACKS[fallbackIdx % FALLBACKS.length];
    setFallbackIdx((i) => i + 1);
    return { response: resp };
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMsg(text, "user");
    setTimeout(() => {
      const { response } = getResponse(text);
      addMsg(response, "bot");
    }, 300);
  }

  function handleChip(chip: string) {
    const text = chip.replace(/^[\W]+/, "").trim();
    setInput("");
    addMsg(text, "user");
    setTimeout(() => {
      const { response } = getResponse(text);
      addMsg(response, "bot");
    }, 300);
  }

  if (!isOpen) return null;

  return (
    <div className="chatbot-window fixed top-[68px] right-6 z-[998] w-[360px] max-h-[530px] bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,.18),0_4px_20px_rgba(22,163,74,.12)] border border-gray-100 flex flex-col overflow-hidden max-[480px]:w-[calc(100vw-32px)] max-[480px]:right-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-green-600 px-[18px] py-3.5 flex items-center gap-2.5 text-white flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-[18px] flex-shrink-0">🌿</div>
        <div className="flex-1">
          <div className="font-bold text-[14px]">CropDoc Assistant</div>
          <div className="text-[11px] opacity-80 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot flex-shrink-0" />
            Online · Always here to help
          </div>
        </div>
        <button onClick={onClose} className="bg-transparent border-none text-white cursor-pointer text-[20px] opacity-80 hover:opacity-100 p-1 leading-none">×</button>
      </div>

      {/* Messages */}
      <div ref={msgsRef} className="chatbot-msgs flex-1 overflow-y-auto px-3 py-3.5 flex flex-col gap-2.5 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[86%] px-3 py-2.5 rounded-2xl text-[13px] leading-[1.6] animate-fade-up ${
              msg.role === "bot"
                ? "bg-white border border-gray-100 text-gray-800 self-start rounded-bl-[4px] shadow-sm"
                : "bg-gradient-to-br from-green-600 to-green-700 text-white self-end rounded-br-[4px]"
            }`}
            dangerouslySetInnerHTML={{ __html: msg.html }}
          />
        ))}
      </div>

      {/* Chips */}
      <div className="px-3 py-2 flex flex-wrap gap-1.5 bg-gray-50 border-t border-gray-100 flex-shrink-0">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChip(chip)}
            className="text-[11px] px-2.5 py-1 rounded-full border border-green-200 bg-white text-green-700 cursor-pointer font-semibold whitespace-nowrap hover:bg-green-50 hover:border-green-400 transition-all duration-150"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 px-3 py-2.5 border-t border-gray-100 bg-white flex-shrink-0">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your question..."
          className="flex-1 border-[1.5px] border-gray-200 rounded-lg px-3 py-2 font-sans text-[13px] outline-none bg-gray-50 focus:border-green-400 focus:bg-white transition-colors duration-200"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white border-none rounded-lg px-3.5 py-2 cursor-pointer text-base hover:bg-green-700 transition-colors duration-200"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
