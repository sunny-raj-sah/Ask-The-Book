 
import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  BookOpen,
  ArrowRight,
  LoaderCircle,
  FileSearch,
  BrainCircuit,
  ShieldCheck,
  Layers3,
  Check,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

const features = [
  {
    icon: FileSearch,
    title: "PDF document ingestion",
    description:
      "Upload PDFs, extract their text, and split content into searchable chunks.",
  },
  {
    icon: BrainCircuit,
    title: "Retrieval-augmented generation",
    description:
      "Retrieve relevant document content to ground AI-generated answers.",
  },
  {
    icon: ShieldCheck,
    title: "JWT authentication",
    description:
      "Authenticate users and protect document assistant API endpoints.",
  },
];

const technologies = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Transformers.js",
  "Groq",
  "RAG",
  "JWT",
];

export default function AuthPage() {
  const { login, signup } = useAuth();

  const [showAuthForm, setShowAuthForm] = useState(false);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";


  const authCardRef = useRef(null);

const handleHeaderAuthClick = (nextMode) => {
  switchMode(nextMode);

  setShowAuthForm(true);

  requestAnimationFrame(() => {
    authCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (isSignup && (name.trim().length < 2 || name.trim().length > 80)) {
      toast.error("Name must contain between 2 and 80 characters.");
      return;
    }

    if (isSignup && password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signup(name.trim(), email.trim(), password);
        toast.success("Account created successfully.");
      } else {
        await login(email.trim(), password);
        toast.success("Login successful.");
      }
    } catch (error) {
      toast.error(error?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    if (loading) return;
    setMode(nextMode);
  };

  return (
    <div className="auth-page">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1B2130",
            color: "#E9E4D8",
            border: "1px solid #2C3346",
          },
        }}
      />

      <header className="auth-nav">
        <a className="auth-brand" href="/" aria-label="Ask the Book home">
          <span className="auth-brand-icon">
            <BookOpen size={21} aria-hidden="true" />
          </span>

          <span className="auth-brand-copy">
            <strong>Ask the Book</strong>
            <small>AI DOCUMENT INTELLIGENCE</small>
          </span>
        </a>

        <div className="auth-nav-right">
          <span>Already have an account?</span>
          <button
            type="button"
              className="auth-nav-signin"
            // onClick={() => switchMode("login")}
 onClick={() => setShowAuthForm((prev) => !prev)}
            disabled={loading}
          >
           {showAuthForm ? "Back to details" : "Sign in"}
          </button>
        </div>
        {/* ----------------------- */}
        {/* for big screen */}
 
 <div className="auth-nav-right-big-screen">
  <span>
    {mode === "login"
      ? "Don't have an account?"
      : "Already have an account?"}
  </span>

  <button
    type="button"
    className="auth-nav-signin"
    onClick={() =>
      handleHeaderAuthClick(mode === "login" ? "signup" : "login")
    }
    disabled={loading}
  >
    {mode === "login" ? "Sign up" : "Sign in"}
  </button>
</div>

      </header>

      <main className="auth-main">
          <div className={`auth-intro ${showAuthForm ? "mobile-hidden" : ""}`}>
        <section className="auth-intro" aria-labelledby="auth-intro-title">
          <div className="auth-eyebrow">
            <span className="eyebrow-dot" />
            AI-POWERED DOCUMENT INTELLIGENCE
          </div>

          <h1 id="auth-intro-title">
            Turn documents
            <br />
            into <span>answers.</span>
          </h1>

          <p className="auth-description">
            Ask questions about your PDFs and get answers grounded in their
            content. Explore document understanding through
            retrieval-augmented generation.
          </p>

          <div className="auth-feature-list">
            {features.map(({ icon: Icon, title, description }) => (
              <article className="auth-feature" key={title}>
                <div className="auth-feature-icon">
                  <Icon size={19} aria-hidden="true" />
                </div>

                <div className="auth-feature-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>

                <Check
                  className="auth-feature-check"
                  size={16}
                  aria-hidden="true"
                />
              </article>
            ))}
          </div>

          <div className="auth-tech-section">
            <span className="auth-tech-label">BUILT WITH</span>

            <div className="auth-tech-list">
              {technologies.map((technology) => (
                <span className="auth-tech-chip" key={technology}>
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </section>
        </div>
                <div className={`auth-card-wrapper ${showAuthForm ? "auth-card-visible" : ""}`}>
        <section className="auth-card" aria-labelledby="auth-card-title"  ref={authCardRef}>
          <div className="auth-card-top">
            <div className="auth-card-icon">
              {isSignup ? (
                <Layers3 size={21} aria-hidden="true" />
              ) : (
                <BookOpen size={21} aria-hidden="true" />
              )}
            </div>

            <span className="auth-card-label">
              YOUR DOCUMENT WORKSPACE
            </span>
          </div>

          <div className="auth-card-heading">
            <h2 id="auth-card-title">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>

            <p>
              {isSignup
                ? "Create an account to start exploring your documents."
                : "Sign in to continue to your document workspace."}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              className={!isSignup ? "active" : ""}
              onClick={() => switchMode("login")}
              disabled={loading}
            >
              Login
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              className={isSignup ? "active" : ""}
              onClick={() => switchMode("signup")}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignup && (
              <label htmlFor="auth-name">
                Full name

                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  required
                  disabled={loading}
                />
              </label>
            )}

            <label htmlFor="auth-email">
              Email address

              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </label>

            <label htmlFor="auth-password">
              Password

              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                  isSignup
                    ? "At least 8 characters"
                    : "Enter your password"
                }
                minLength={isSignup ? 8 : undefined}
                autoComplete={
                  isSignup ? "new-password" : "current-password"
                }
                required
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    className="auth-spinner"
                    size={18}
                    aria-hidden="true"
                  />
                  Please wait...
                </>
              ) : (
                <>
                  {isSignup ? "Create account" : "Sign in to workspace"}
                  <ArrowRight size={17} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup
              ? "Already have an account?"
              : "New to Ask the Book?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? "login" : "signup")}
              disabled={loading}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>

          <div className="auth-security">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>JWT-protected authentication</span>
          </div>
        </section>
       </div>
      </main>

      <footer className="auth-footer">
        <span>Ask the Book</span>
        <span>AI Document Q&A · Full-stack RAG project</span>
      </footer>
    </div>
  );
}
