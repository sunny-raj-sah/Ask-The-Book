//  export default function Header() {
//   return (
//     <>
//       <header
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           zIndex: 1000,
//           background: "white",
//           borderBottom: "1px solid #ddd",
//         }}
//       >
//         <h2
//           style={{
//             margin: 0,
//             padding: "1px 1px",
//             textAlign: "center",
//             color: "black",
//           }}
//         >
//           Book Q&A System
//         </h2>

//         <p style={{ margin: "2px 0 0", color: "#666" }}>
//           AI-powered Document Question Answering
//         </p>
//       </header>
//     </>
//   );
// }

// -----------------------------------------------------------------

import { BookOpen, LogOut  } from "lucide-react";
import "./Header.css";

export default function Header({ user, onLogout }) {
  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="site-header">
      <a className="site-brand" href="/" aria-label="Ask the Book home">
        <span className="site-brand-icon">
          <BookOpen size={21} />
        </span>

        <span className="site-brand-copy">
          <strong>Ask the Book</strong>
          <small>AI DOCUMENT INTELLIGENCE</small>
        </span>
      </a>

      <div className="header-user-area">
        <div className="header-user">
          <span className="user-avatar">
            {initials}
          </span>

          <span className="header-user-details">
            <span className="header-user-name">
              {user?.name || "User"}
            </span>

            <span className="header-user-email">
              {user?.email || ""}
            </span>
          </span>
        </div>

        <span className="header-divider" />

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
          aria-label="Log out of your account"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
