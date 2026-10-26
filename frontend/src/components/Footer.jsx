
// function Footer() {
//   return (
//     <footer
//       style={{
//         position: "fixed",
//         bottom: 0,
//         left: 0,
//         width: "100%",
//         zIndex: 1000,
//         background: "#ffffff",
//         padding: "5px 0",
//         textAlign: "center",
//         borderTop: "1px solid #ddd",
//         boxSizing: "border-box",
//       }}
//     >
//       <p style={{ margin: 0, color: "#666" }}>
//         Built by Sunny Raj
//       </p>
//     </footer>
//   );
// }

// export default Footer;

// ------------------------------------------------------------------

import { BookOpen } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <BookOpen size={15} />
        <span>Ask the Book</span>
      </div>

      <p>
        AI-powered document question answering.
      </p>

      <span className="footer-caption">
        Built with React, Node.js & RAG
      </span>
    </footer>
  );
}

 