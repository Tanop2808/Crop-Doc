"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import DiagnosePage from "@/components/DiagnosePage";
import Chatbot from "@/components/Chatbot";

type Page = "landing" | "diagnose";

export default function Home() {
  const [page, setPage] = useState<Page>("landing");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBadge, setChatBadge] = useState(true);

  function navigate(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleChat() {
    setChatOpen((o) => !o);
    setChatBadge(false);
  }

  return (
    <>
      <Navbar onNavigate={navigate} onToggleChat={toggleChat} chatBadge={chatBadge} />
      {page === "landing" ? (
        <LandingPage onNavigate={navigate} />
      ) : (
        <DiagnosePage onNavigate={navigate} />
      )}
      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
