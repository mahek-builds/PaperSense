import { motion } from "motion/react";
import { FileText, Zap, Search, Brain, Upload, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const features = [
    {
      icon: Search,
      title: "Semantic Search",
      description: "Powered by FAISS vector database for lightning-fast document retrieval",
    },
    {
      icon: Brain,
      title: "AI Q&A",
      description: "LLM-powered answers with precise context from your documents",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Optimized PDF parsing and intelligent chunking for better results",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b-4 border-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center">
              <FileText className="w-5 h-5 text-background" strokeWidth={2.5} />
            </div>
            <h1
              className="tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}
            >
              PaperSense
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="#features"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              Features
            </a>
            <a
              href="#docs"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              Docs
            </a>
            <Link to="/dashboard">
              <button className="px-6 py-2 border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-colors">
                Login
              </button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 border-2 border-secondary bg-secondary/10">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary" style={{ fontFamily: "var(--font-mono)" }}>
                AI-Powered Intelligence
              </span>
            </div>
            <h1
              className="mb-6 leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "4.5rem",
                lineHeight: "1",
              }}
            >
              Chat with Your Documents using AI
            </h1>
            <p className="mb-10 opacity-70" style={{ fontSize: "1.25rem", lineHeight: "1.6" }}>
              Transform static PDFs into interactive knowledge bases. Ask questions,
              get precise answers with source citations, all powered by advanced AI.
            </p>
            <div className="flex gap-4">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-primary text-background border-2 border-primary hover:bg-primary/90 transition-colors flex items-center gap-2"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <Upload className="w-5 h-5" />
                  Upload PDF
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Try Demo
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="border-4 border-foreground bg-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 blur-3xl"></div>
              <div className="relative space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border-2 border-muted-foreground flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 px-3 py-2 border border-border bg-muted/50 inline-block">
                      <p className="text-sm opacity-70">
                        What are the key findings in section 3?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary border-2 border-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-5 h-5 text-background" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="px-3 py-2 border-2 border-primary/30 bg-primary/5">
                      <p className="text-sm mb-3">
                        Section 3 highlights three major findings: improved accuracy
                        by 34%, reduced processing time, and enhanced reliability.
                      </p>
                      <div className="space-y-1">
                        <div className="text-xs opacity-50 flex items-center gap-2">
                          <div className="w-1 h-1 bg-secondary"></div>
                          <span style={{ fontFamily: "var(--font-mono)" }}>
                            Page 12, Chunk 3
                          </span>
                        </div>
                        <div className="text-xs opacity-50 flex items-center gap-2">
                          <div className="w-1 h-1 bg-secondary"></div>
                          <span style={{ fontFamily: "var(--font-mono)" }}>
                            Page 15, Chunk 7
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t-4 border-border">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2
            className="mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "3rem" }}
          >
            Powerful Features
          </h2>
          <p className="opacity-70 max-w-2xl mx-auto" style={{ fontSize: "1.125rem" }}>
            Built with cutting-edge AI technology to transform how you interact
            with documents
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="border-4 border-foreground bg-card p-8 hover:bg-foreground/5 transition-colors group"
            >
              <div className="mb-6 w-14 h-14 border-2 border-primary bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-background transition-colors" strokeWidth={2} />
              </div>
              <h3
                className="mb-3"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
              >
                {feature.title}
              </h3>
              <p className="opacity-70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-border mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center opacity-50">
          <p style={{ fontFamily: "var(--font-mono)" }}>
            © 2026 PaperSense. AI-Powered Document Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
