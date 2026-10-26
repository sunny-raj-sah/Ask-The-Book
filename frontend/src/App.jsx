 
// import BookQA from "./components/BookQA";
// import Footer from "./components/Footer";
// import Header from "./components/Header";
// import AuthPage from "./components/AuthPage";
// import { useAuth } from "./context/AuthContext";

// function App() {
//   const { user, isAuthLoading, logout } = useAuth();

//   if (isAuthLoading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "grid",
//           placeItems: "center",
//           background: "#101319",
//           color: "#E9E4D8",
//           fontFamily: "Arial, sans-serif",
//         }}
//       >
//         Checking your session...
//       </div>
//     );
//   }

//   if (!user) {
//     return <AuthPage />;
//   }

//   return (
//     <div style={{ fontFamily: "Arial, sans-serif" }}>
//       <Header />

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "flex-end",
//           alignItems: "center",
//           gap: 14,
//           padding: "12px 20px",
//           background: "#151A25",
//           color: "#E9E4D8",
//         }}
//       >
//         <span>
//           Signed in as <strong>{user.name}</strong>
//         </span>

//         <button
//           type="button"
//           onClick={logout}
//           style={{
//             padding: "8px 14px",
//             borderRadius: 7,
//             border: "1px solid #C89B4A",
//             background: "transparent",
//             color: "#E9C47D",
//             cursor: "pointer",
//           }}
//         >
//           Logout
//         </button>
//       </div>

//       <div style={{ padding: 20 }}>
//         <BookQA />
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default App;

// ----------------------------------------------------------

import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookQA from "./components/BookQA";

function App() {
  const { user, isAuthLoading, logout } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="app-loading">
        <div className="loading-mark">AB</div>
        <p>Preparing your workspace...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-auth-layout">
        <AuthPage />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header user={user} onLogout={logout} />

      <main className="workspace">
        <BookQA />
      </main>

      <Footer />
    </div>
  );
}

export default App;
