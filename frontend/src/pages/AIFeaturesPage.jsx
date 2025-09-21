import React, { useMemo, useState, useRef } from "react";
import ChatWidget from "../components/ChatWidget";

export default function AIFeaturesPage() {
  return (
    <div style={sx.page}>
      <Hero />
      <MainPanels />
      <SummaryResults />
      <ChatBot />
      <FooterSpacer />
    </div>
  );
}

/* ────────────── CHAT BOT ────────────── */
function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello 👋 I’m your AI assistant. Ask me anything about books!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "⚠️ Error connecting to AI service." }]);
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section style={sx.chatWrap}>
      <div style={sx.chatCard}>
        <h2 style={sx.chatHeader}>💬 Chat with AI</h2>
        <div style={sx.chatMessages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...sx.chatBubble,
                ...(m.role === "user" ? sx.chatUser : sx.chatBot),
              }}
            >
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={sx.chatInputRow}>
          <input
            style={sx.chatInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your question..."
            disabled={loading}
          />
          <button style={sx.chatSendBtn} onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ────────────── HERO ────────────── */
function Hero() {
  return (
    <section style={sx.heroWrap}>
      <div style={sx.hero}>
        <GradientCircle>
          <BrainIcon />
        </GradientCircle>
        <h1 style={sx.heroTitle}>AI-Powered Reading Experience</h1>
        <p style={sx.heroSubtitle}>
          Transform your reading with artificial intelligence. Get instant summaries, mood-based
          recommendations, and personalized insights.
        </p>
        <div style={{ marginTop: 8 }}>
          <Badge>Premium Feature</Badge>
        </div>
        <Tabs
          tabs={[
            { key: "summaries", label: "Summarize Books" },
            { key: "moods", label: "Mood Recommendations" },
          ]}
          defaultKey="summaries"
        />
      </div>
    </section>
  );
}

/* ────────────── MAIN PANELS ────────────── */
function MainPanels() {
  return (
    <section style={sx.mainPanels}>
      <div style={sx.columns}>
        <UploadCard />
        <LibraryCard />
      </div>
    </section>
  );
}

function UploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) setFileName(f.name);
  };

  const onFilePick = (e) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  return (
    <Card title="AI Book Summarization" icon={<BookSparkIcon />}>
      <p style={sx.muted}>
        Upload any PDF or select from your purchased books to get instant AI-generated summaries.
      </p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        style={{ ...sx.dropzone, ...(isDragging ? sx.dropzoneActive : null) }}
      >
        <div style={{ fontSize: 56 }}>⤴</div>
        <div style={{ fontWeight: 600, marginTop: 6 }}>Upload New PDF</div>
        <div style={sx.mutedSmall}>Drag and drop or click to select a PDF file</div>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => inputRef.current?.click()} style={sx.primaryBtn}>
            Choose File
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={onFilePick}
            style={{ display: "none" }}
          />
        </div>
        {fileName ? (
          <div style={{ marginTop: 12, fontSize: 13 }}>
            Selected: <b>{fileName}</b>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function LibraryCard() {
  const [analyzing, setAnalyzing] = useState(false);
  return (
    <div style={sx.libraryCol}>
      <div style={sx.libraryCard}>
        <div style={sx.libraryHeader}>Or select from your library:</div>
        <div style={sx.bookRow}>
          <Avatar initials="SC" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>The AI Revolution</div>
            <div style={sx.mutedSmall}>Dr. Sarah Chen</div>
          </div>
          <button
            onClick={() => {
              setAnalyzing(true);
              setTimeout(() => setAnalyzing(false), 900);
            }}
            style={sx.secondaryBtn}
          >
            {analyzing ? "Analyzing..." : "Analyze Now"}
          </button>
        </div>
        <div style={sx.premiumRow}>
          <div style={sx.lockBox}>🔒</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Upgrade to Premium</div>
            <div style={sx.mutedSmall}>Access all your books</div>
          </div>
          <button style={sx.upgradeBtn}>Upgrade</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────── SUMMARY RESULTS ────────────── */
function SummaryResults() {
  return (
    <section style={sx.resultsWrap}>
      <div style={sx.resultsCard}>
        <div style={sx.resultsHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SparkIcon />
            <div style={{ fontWeight: 700 }}>AI Summary Results</div>
          </div>
          <div style={sx.mutedSmall}>
            Analysis for <b>"The AI Revolution"</b>
          </div>
        </div>
        <Accordion
          items={[
            {
              id: "short",
              title: <HeaderTag tag="Quick Read" text="Short Summary" />,
              content: (
                <ul style={sx.list}>
                  <li>Modern AI moved from rule-based to deep learning.</li>
                  <li>AI reshapes industries, labor markets, and creativity.</li>
                  <li>Adopt pragmatically with clear use-cases and data.</li>
                </ul>
              ),
            },
            {
              id: "long",
              title: <HeaderTag tag="Detailed" text="Long Summary" />,
              content: (
                <div style={sx.paras}>
                  <p>Evolution of AI from symbolic to neural networks…</p>
                  <p>Adoption patterns across industries…</p>
                  <p>Risks and governance checklist…</p>
                </div>
              ),
            },
            {
              id: "keys",
              title: <HeaderTag tag="Action Items" text="Key Takeaways" />,
              content: (
                <ul style={sx.list}>
                  <li>Inventory decisions for high-ROI pilots.</li>
                  <li>Centralize consented data with logs.</li>
                  <li>Define red-team tests for sensitive flows.</li>
                </ul>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}

/* ────────────── UI PRIMITIVES ────────────── */
function Card({ title, icon, children }) {
  return (
    <div style={sx.card}>
      <div style={sx.cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon}
          <div style={{ fontWeight: 700 }}>{title}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
function Tabs({ tabs, defaultKey }) {
  const [active, setActive] = useState(defaultKey ?? tabs[0]?.key);
  return (
    <div style={sx.tabs}>
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            style={{ ...sx.tabBtn, ...(isActive ? sx.tabBtnActive : null) }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
function Badge({ children }) {
  return <div style={sx.badge}>{children}</div>;
}
function GradientCircle({ children }) {
  return <div style={sx.gradientCircle}>{children}</div>;
}
function Avatar({ initials = "SC" }) {
  return <div style={sx.avatar}>{initials}</div>;
}
function HeaderTag({ tag, text }) {
  return (
    <div style={sx.headerTagRow}>
      <span style={sx.pillTag}>{tag}</span>
      <span>{text}</span>
    </div>
  );
}
function Accordion({ items }) {
  const [openId, setOpenId] = useState(items?.[0]?.id);
  return (
    <div>
      {items.map((it) => {
        const open = openId === it.id;
        return (
          <div key={it.id} style={sx.accordionItem}>
            <button
              onClick={() => setOpenId(open ? null : it.id)}
              style={sx.accordionHeader}
            >
              <div>{it.title}</div>
              <div style={{ transform: open ? "rotate(180deg)" : "none" }}>▼</div>
            </button>
            {open && <div style={sx.accordionBody}>{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ────────────── ICONS ────────────── */
function BrainIcon() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8.5 5a3 3…" /></svg>; }
function BookSparkIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6.5…" /></svg>; }
function SparkIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2…" /></svg>; }

/* ────────────── FOOTER SPACER ────────────── */
function FooterSpacer() {
  return <div style={sx.footerSpacer} />;
}

/* ────────────── STYLES ────────────── */
const sx = {
  /* merged chat styles + main styles */
  chatWrap: { maxWidth: 800, margin: "40px auto", padding: "0 20px" },
  chatCard: { border: "1px solid #ede9fe", borderRadius: 16, background: "#fff", padding: 16, boxShadow: "0 10px 24px rgba(99,102,241,0.07)", display: "flex", flexDirection: "column", gap: 12 },
  chatHeader: { fontWeight: 700, fontSize: 18, marginBottom: 8 },
  chatMessages: { flex: 1, minHeight: 200, maxHeight: 300, overflowY: "auto", padding: 8, border: "1px solid #f3f4f6", borderRadius: 12, background: "#fafafa", display: "flex", flexDirection: "column", gap: 8 },
  chatBubble: { padding: "8px 12px", borderRadius: 12, maxWidth: "75%", fontSize: 14, lineHeight: 1.5 },
  chatUser: { alignSelf: "flex-end", background: "#7c3aed", color: "#fff" },
  chatBot: { alignSelf: "flex-start", background: "#f3f4f6", color: "#111827" },
  chatInputRow: { display: "flex", gap: 8, marginTop: 8 },
  chatInput: { flex: 1, padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, fontSize: 14 },
  chatSendBtn: { background: "#7c3aed", color: "#fff", border: 0, padding: "10px 16px", borderRadius: 10, fontWeight: 600, cursor: "pointer" },

  page: { minHeight: "100vh", background: "radial-gradient(1200px 600px at 50% -100px, #f4ecff 10%, #faf7ff 40%, #ffffff 70%)", color: "#111827" },
  heroWrap: { paddingTop: 24 },
  hero: { maxWidth: 880, margin: "0 auto", padding: "32px 20px 8px", textAlign: "center" },
  gradientCircle: { margin: "0 auto 10px", width: 74, height: 74, borderRadius: "9999px", display: "grid", placeItems: "center", background: "conic-gradient(from 180deg at 50% 50%, #9333ea, #a855f7, #f472b6, #60a5fa, #9333ea)", boxShadow: "0 8px 28px rgba(147,51,234,0.25)" },
  heroTitle: { fontSize: 36, lineHeight: 1.2, margin: "8px 0", fontWeight: 800 },
  heroSubtitle: { maxWidth: 820, margin: "0 auto", color: "#4b5563", fontSize: 16.5 },
  badge: { display: "inline-block", fontSize: 12, fontWeight: 600, padding: "6px 10px", color: "#6d28d9", background: "#f3e8ff", border: "1px solid #e9d5ff", borderRadius: 999 },
  tabs: { marginTop: 18, display: "inline-flex", gap: 6, background: "#f5f3ff", border: "1px solid #e9e5f9", padding: 4, borderRadius: 999 },
  tabBtn: { border: 0, background: "transparent", padding: "8px 14px", borderRadius: 999, cursor: "pointer", fontWeight: 600, color: "#6b21a8" },
  tabBtnActive: { background: "#fff", boxShadow: "0 1px 0 rgba(0,0,0,.06)" },
  mainPanels: { maxWidth: 1160, margin: "22px auto 0", padding: "0 20px" },
  columns: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 },
  card: { background: "#fff", border: "1px solid #ede9fe", borderRadius: 16, padding: 20, boxShadow: "0 10px 24px rgba(99,102,241,0.07)" },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  dropzone: { marginTop: 10, border: "2px dashed #e9d5ff", borderRadius: 16, padding: "40px 16px", textAlign: "center", background: "linear-gradient(180deg, #faf5ff, #ffffff)", transition: "150ms ease" },
  dropzoneActive: { borderColor: "#a78bfa", background: "linear-gradient(180deg, #f4f0ff, #ffffff)" },
  muted: { color: "#6b7280", marginBottom: 6 },
  mutedSmall: { color: "#6b7280", fontSize: 13 },
  primaryBtn: { background: "#7c3aed", color: "#fff", border: 0, padding: "10px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer" },
  libraryCol: { display: "flex", flexDirection: "column" },
  libraryCard: { background: "#fff", border: "1px solid #ede9fe", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12 },
  libraryHeader: { fontWeight: 600, marginBottom: 6 },
  bookRow: { display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 12, border: "1px solid #f3f4f6" },
  secondaryBtn: { background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", fontWeight: 600, cursor: "pointer" },
  premiumRow: { display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, background: "#f9fafb", marginTop: 8 },
  lockBox: { width: 28, height: 28, borderRadius: "9999px", display: "grid", placeItems: "center", background: "#f3f4f6", fontSize: 14 },
  upgradeBtn: { background: "#7c3aed", color: "#fff", border: 0, padding: "8px 14px", borderRadius: 8, fontWeight: 600, cursor: "pointer" },

  resultsWrap: { maxWidth: 900, margin: "32px auto", padding: "0 20px" },
  resultsCard: { background: "#fff", border: "1px solid #ede9fe", borderRadius: 16, padding: 20, boxShadow: "0 10px 24px rgba(99,102,241,0.07)" },
  resultsHeader: { marginBottom: 16 },
  list: { listStyle: "disc", paddingLeft: 20, color: "#374151" },
  paras: { display: "flex", flexDirection: "column", gap: 10, color: "#374151" },
  headerTagRow: { display: "flex", alignItems: "center", gap: 8 },
  pillTag: { fontSize: 12, fontWeight: 600, padding: "2px 6px", background: "#f3f4f6", borderRadius: 6, color: "#6b7280" },

  accordionItem: { borderTop: "1px solid #f3f4f6" },
  accordionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "12px 0", fontWeight: 600, background: "transparent", border: 0, cursor: "pointer" },
  accordionBody: { padding: "0 0 12px", color: "#374151", fontSize: 14, lineHeight: 1.5 },

  avatar: { width: 36, height: 36, borderRadius: "9999px", background: "#ede9fe", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 14, color: "#5b21b6" },

  footerSpacer: { height: 60 },
};
