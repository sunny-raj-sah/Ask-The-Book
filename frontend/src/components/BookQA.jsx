 
// import { useState, useRef, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   BookOpen,
//   KeyRound,
//   Eye,
//   EyeOff,
//   UploadCloud,
//   FileText,
//   Send,
//   Loader2,
//   CheckCircle2,
//   XCircle,
//   BookmarkCheck,
//   Menu,
//   X,
// } from "lucide-react";

// import { apiRequest } from "../utils/api";

// export default function BookQA() {
//   // API key
//   const [apiKey, setApiKey] = useState("");
//   const [showKey, setShowKey] = useState(false);
//   const [keySaved, setKeySaved] = useState(false);

//   // Mobile sidebar
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // PDF upload and indexing
//   const [file, setFile] = useState(null);
//   const [isBookIndexed, setIsBookIndexed] = useState(false);
//   const [uploadState, setUploadState] = useState({
//     status: "idle",
//     message: "",
//   });

//   const fileInputRef = useRef(null);

//   // Questions and conversation history
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [askState, setAskState] = useState({
//     status: "idle",
//     message: "",
//   });

//   const conversationRef = useRef(null);
//   const questionInputRef = useRef(null);

//   const keyHeaders = () =>
//     apiKey.trim() ? { "x-api-key": apiKey.trim() } : {};

//   // Restore the saved API key
//   useEffect(() => {
//     const savedKey = sessionStorage.getItem("OPENAI_API_KEY");

//     if (savedKey) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setApiKey(savedKey);
//       setKeySaved(true);
//     }
//   }, []);

//   // Scroll to the latest conversation message
//   useEffect(() => {
//     const container = conversationRef.current;

//     if (container) {
//       container.scrollTop = container.scrollHeight;
//     }
//   }, [messages, askState.status]);

//   // Close the mobile sidebar using Escape
//   useEffect(() => {
//     const handleEscape = (event) => {
//       if (event.key === "Escape") {
//         setSidebarOpen(false);
//       }
//     };

//     window.addEventListener("keydown", handleEscape);

//     return () => {
//       window.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   const handleSaveKey = () => {
//     const trimmedKey = apiKey.trim();

//     if (!trimmedKey) {
//       toast.error("Please enter an OpenAI API key.");
//       return;
//     }

//     sessionStorage.setItem("OPENAI_API_KEY", trimmedKey);
//     setApiKey(trimmedKey);
//     setKeySaved(true);

//     toast.success("OpenAI API key saved.");
//   };

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files?.[0];

//     if (!selectedFile) return;

//     if (
//       selectedFile.type !== "application/pdf" &&
//       !selectedFile.name.toLowerCase().endsWith(".pdf")
//     ) {
//       toast.error("Please select a PDF file.");
//       event.target.value = "";
//       return;
//     }

//     setFile(selectedFile);

//     // A newly selected PDF must be uploaded and indexed again.
//     setIsBookIndexed(false);
//     setUploadState({ status: "idle", message: "" });

//     // Reset the previous conversation for the newly selected document.
//     setMessages([]);
//     setAskState({ status: "idle", message: "" });
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       const message = "Choose a PDF before uploading.";

//       setUploadState({ status: "error", message });
//       toast.error(message);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("book", file);

//     // Do not allow questions while a new document is being indexed.
//     setIsBookIndexed(false);

//     setUploadState({
//       status: "loading",
//       message: "Reading pages and building chunks…",
//     });

//     try {
//       const data = await apiRequest("/api/book/upload", {
//         method: "POST",
//         headers: keyHeaders(),
//         body: formData,
//       });

//       setIsBookIndexed(true);

//       setUploadState({
//         status: "success",
//         message: `Indexed ${data.pages} pages into ${data.totalChunks} chunks.`,
//       });

//       toast.success("Book uploaded and indexed successfully.");
//     } catch (error) {
//       setIsBookIndexed(false);

//       const message =
//         error.message || "Upload failed. Is the server running?";

//       setUploadState({ status: "error", message });
//       toast.error(message);
//     }
//   };

//   const handleAsk = async (event) => {
//     event?.preventDefault();

//     const submittedQuestion = question.trim();

//     if (!submittedQuestion) {
//       setAskState({
//         status: "error",
//         message: "Type a question first.",
//       });

//       toast.error("Type a question first.");
//       questionInputRef.current?.focus();
//       return;
//     }

//     if (askState.status === "loading") return;

//     // Require a successful PDF upload and indexing operation.
//     if (!isBookIndexed) {
//       const message = "Please upload and index a PDF before asking questions.";

//       setAskState({ status: "error", message });
//       toast.error(message);
//       return;
//     }

//     setMessages((previous) => [
//       ...previous,
//       {
//         id: `${Date.now()}-question`,
//         role: "user",
//         content: submittedQuestion,
//       },
//     ]);

//     setQuestion("");
//     setAskState({ status: "loading", message: "" });

//     try {
//       const data = await apiRequest("/api/qa/ask", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...keyHeaders(),
//         },
//         body: JSON.stringify({ question: submittedQuestion }),
//       });

//       if (typeof data.answer !== "string") {
//         throw new Error("The server did not return a valid answer.");
//       }

//       setMessages((previous) => [
//         ...previous,
//         {
//           id: `${Date.now()}-answer`,
//           role: "assistant",
//           content: data.answer,
//         },
//       ]);

//       setAskState({ status: "success", message: "" });
//     } catch (error) {
//       const message = error.message || "Failed to get an answer.";

//       setAskState({ status: "error", message });
//       toast.error(message);
//     } finally {
//       questionInputRef.current?.focus();
//     }
//   };

//   const handleQuestionKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleAsk(event);
//     }
//   };

//   return (
//     <div className="bookqa-root">
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: "#1B2130",
//             color: "#E9E4D8",
//             border: "1px solid #2C3346",
//             fontFamily: "Inter, sans-serif",
//           },
//         }}
//       />

//       <style>{`
//         .bookqa-root {
//           width: 100%;
//           height: 100%;
//           min-width: 0;
//           min-height: 0;
//           overflow: hidden;
//           position: relative;
//           background: #101319;
//           color: #E9E4D8;
//           font-family: 'Source Serif 4', Georgia, serif;
//         }

//         .bookqa-root *,
//         .bookqa-root *::before,
//         .bookqa-root *::after {
//           box-sizing: border-box;
//         }

//         .bookqa-root .sans {
//           font-family: Inter, sans-serif;
//         }

//         .bookqa-root .mono {
//           font-family: 'IBM Plex Mono', monospace;
//         }

//         .bookqa-root input::placeholder,
//         .bookqa-root textarea::placeholder {
//           color: #6B7180;
//         }

//         .bookqa-root .field:focus-visible,
//         .bookqa-root .btn:focus-visible,
//         .bookqa-root .sidebar-toggle:focus-visible {
//           outline: 2px solid #C89B4A;
//           outline-offset: 2px;
//         }

//         .bookqa-root .app-shell {
//           display: flex;
//           position: relative;
//           width: 100%;
//           height: 100%;
//           min-height: 0;
//           overflow: hidden;
//         }

//         /* Desktop sidebar */
//         .bookqa-root .sidebar {
//           position: relative;
//           z-index: 30;
//           width: 300px;
//           min-width: 300px;
//           flex-shrink: 0;
//           height: 100%;
//           overflow-y: auto;
//           overscroll-behavior: contain;
//           border-right: 1px solid #232A3B;
//           padding: 36px 22px;
//           background: #151A25;
//         }

//         .bookqa-root .mobile-sidebar-close,
//         .bookqa-root .mobile-toolbar,
//         .bookqa-root .sidebar-backdrop {
//           display: none;
//         }

//         .bookqa-root .main {
//           position: relative;
//           z-index: 1;
//           display: flex;
//           flex: 1;
//           flex-direction: column;
//           width: 0;
//           min-width: 0;
//           min-height: 0;
//           height: 100%;
//           padding: 32px 40px 0;
//           overflow: hidden;
//         }

//         .bookqa-root .main-header {
//           flex-shrink: 0;
//           padding-bottom: 20px;
//         }

//         .bookqa-root .conversation {
//           flex: 1 1 auto;
//           min-width: 0;
//           min-height: 0;
//           overflow-x: hidden;
//           overflow-y: auto;
//           overscroll-behavior: contain;
//           scrollbar-gutter: stable;
//           padding: 4px 10px 24px 0;
//           scroll-behavior: smooth;
//         }

//         .bookqa-root .conversation::-webkit-scrollbar,
//         .bookqa-root .sidebar::-webkit-scrollbar {
//           width: 6px;
//         }

//         .bookqa-root .conversation::-webkit-scrollbar-thumb,
//         .bookqa-root .sidebar::-webkit-scrollbar-thumb {
//           background: #343B4E;
//           border-radius: 10px;
//         }

//         .bookqa-root .composer {
//           flex-shrink: 0;
//           padding: 16px 0 20px;
//           background: #101319;
//           border-top: 1px solid #232A3B;
//         }

//         .bookqa-root .message-row {
//           display: flex;
//           min-width: 0;
//           margin-bottom: 22px;
//         }

//         .bookqa-root .message-row.user {
//           justify-content: flex-end;
//         }

//         .bookqa-root .message-bubble {
//           max-width: min(85%, 820px);
//           min-width: 0;
//           overflow-wrap: anywhere;
//           white-space: pre-wrap;
//           line-height: 1.75;
//           font-size: 15.5px;
//         }

//         .bookqa-root .message-bubble.user {
//           padding: 13px 17px;
//           background: #1B2130;
//           color: #E9E4D8;
//           border: 1px solid #2C3346;
//           border-radius: 14px 14px 4px 14px;
//         }

//         .bookqa-root .message-bubble.assistant {
//           position: relative;
//           width: 100%;
//           padding: 22px 24px;
//           background: #F2ECDD;
//           color: #232016;
//           border-radius: 12px;
//           box-shadow: 0 8px 24px rgba(0,0,0,0.2);
//         }

//         .bookqa-root .message-bubble.assistant::before {
//           content: "";
//           position: absolute;
//           left: 0;
//           top: 14px;
//           bottom: 14px;
//           width: 3px;
//           background: #C89B4A;
//           border-radius: 2px;
//         }

//         .bookqa-root .question-input {
//           display: block;
//           width: 100%;
//           max-height: 180px;
//           min-height: 56px;
//           resize: vertical;
//           background: #1B2130;
//           border: 1px solid #2C3346;
//           border-radius: 12px;
//           padding: 15px 16px;
//           color: #E9E4D8;
//           font-size: 15px;
//           line-height: 1.6;
//         }

//         .bookqa-root .question-input:disabled {
//           opacity: 0.7;
//         }

//         .bookqa-root .empty-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 180px;
//           height: 100%;
//           padding: 24px;
//           text-align: center;
//           color: #777E90;
//         }

//         /* Tablet and mobile */
//         @media (max-width: 860px) {
//           .bookqa-root .app-shell {
//             height: 100%;
//             min-height: 0;
//             isolation: isolate;
//           }

//           .bookqa-root .sidebar {
//             position: absolute;
//             inset: 0 auto 0 0;
//             z-index: 30;
//             width: min(300px, 86vw);
//             min-width: 0;
//             height: 100%;
//             padding: 24px 18px;
//             overflow-x: hidden;
//             overflow-y: auto;
//             border-right: 1px solid #343B4E;
//             border-bottom: none;
//             box-shadow: 14px 0 40px rgba(0, 0, 0, 0.3);
//             transform: translateX(-105%);
//             visibility: hidden;
//             pointer-events: none;
//             transition:
//               transform 220ms ease,
//               visibility 220ms ease;
//           }

//           .bookqa-root .sidebar.sidebar-open {
//             transform: translateX(0);
//             visibility: visible;
//             pointer-events: auto;
//           }

//           .bookqa-root .sidebar-backdrop {
//             display: block;
//             position: absolute;
//             inset: 0;
//             z-index: 20;
//             width: 100%;
//             height: 100%;
//             padding: 0;
//             border: none;
//             border-radius: 0;
//             background: rgba(0, 0, 0, 0.58);
//             cursor: pointer;
//           }

//           .bookqa-root .mobile-sidebar-close {
//             display: flex;
//             align-items: center;
//             justify-content: flex-end;
//             margin: -10px -4px 18px 0;
//           }

//           .bookqa-root .sidebar-close-button {
//             display: inline-flex;
//             align-items: center;
//             justify-content: center;
//             width: 36px;
//             height: 36px;
//             padding: 0;
//             color: #E9E4D8;
//             background: #202637;
//             border: 1px solid #343B4E;
//             border-radius: 9px;
//             cursor: pointer;
//           }

//           .bookqa-root .main {
//             width: 100%;
//             min-width: 0;
//             height: 100%;
//             padding: 16px 20px 0;
//           }

//           .bookqa-root .mobile-toolbar {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             min-height: 42px;
//             margin-bottom: 14px;
//           }

//           .bookqa-root .sidebar-toggle {
//             display: inline-flex;
//             align-items: center;
//             justify-content: center;
//             flex-shrink: 0;
//             width: 40px;
//             height: 40px;
//             padding: 0;
//             color: #E9E4D8;
//             background: #1B2130;
//             border: 1px solid #343B4E;
//             border-radius: 10px;
//             cursor: pointer;
//           }

//           .bookqa-root .mobile-toolbar-title {
//             min-width: 0;
//             color: #C7CBD6;
//             font-family: Inter, sans-serif;
//             font-size: 13px;
//             font-weight: 600;
//           }

//           .bookqa-root .main-header {
//             padding-bottom: 16px;
//           }

//           .bookqa-root .conversation {
//             scrollbar-gutter: auto;
//             padding-right: 4px;
//           }

//           .bookqa-root .message-bubble {
//             max-width: 95%;
//             font-size: 14.5px;
//           }

//           .bookqa-root .composer {
//             padding-top: 12px;
//             padding-bottom: max(12px, env(safe-area-inset-bottom));
//           }
//         }

//         @media (max-width: 480px) {
//           .bookqa-root .main {
//             padding-right: 14px;
//             padding-left: 14px;
//           }

//           .bookqa-root .main-header h2 {
//             font-size: 24px !important;
//           }

//           .bookqa-root .main-header p {
//             font-size: 12.5px !important;
//             line-height: 1.6;
//           }

//           .bookqa-root .message-bubble.assistant {
//             padding: 18px;
//           }

//           .bookqa-root .question-input {
//             min-height: 52px;
//             padding: 12px;
//             font-size: 14px;
//           }

//           .bookqa-root .composer button[type="submit"] {
//             padding: 10px 14px !important;
//           }

//           .bookqa-root .composer .composer-hint {
//             max-width: 55%;
//             font-size: 10px !important;
//             line-height: 1.5;
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .bookqa-root *,
//           .bookqa-root *::before,
//           .bookqa-root *::after {
//             scroll-behavior: auto !important;
//             transition: none !important;
//             animation: none !important;
//           }
//         }

//         @keyframes bookqa-spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         .bookqa-root .spin {
//           animation: bookqa-spin 0.8s linear infinite;
//         }
//       `}</style>

//       <div className="app-shell">
//         {/* Mobile sidebar backdrop */}
//         {sidebarOpen && (
//           <button
//             type="button"
//             className="sidebar-backdrop"
//             onClick={() => setSidebarOpen(false)}
//             aria-label="Close navigation sidebar"
//           />
//         )}

//         {/* Sidebar */}
//         <aside
//           id="bookqa-sidebar"
//           className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
//           aria-label="Book settings"
//           aria-hidden={
//             typeof window !== "undefined" &&
//             window.matchMedia("(max-width: 860px)").matches
//               ? !sidebarOpen
//               : undefined
//           }
//         >
//           <div className="mobile-sidebar-close">
//             <button
//               type="button"
//               className="sidebar-close-button"
//               onClick={() => setSidebarOpen(false)}
//               aria-label="Close sidebar"
//             >
//               <X size={19} />
//             </button>
//           </div>

//           {/* Branding */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 20,
//               marginBottom: 30,
//             }}
//           >
//             <div
//               style={{
//                 width: 34,
//                 height: 34,
//                 borderRadius: 8,
//                 background: "#1e232e",
//                 border: "1px solid #adb2c1",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <BookOpen size={17} color="#C89B4A" strokeWidth={1.75} />
//             </div>

//             <h1
//               style={{
//                 fontSize: 18,
//                 fontWeight: 700,
//                 margin: 10,
//                 letterSpacing: "-0.01em",
//                 color: "white",
//               }}
//             >
//               Ask the Book
//             </h1>
//           </div>

//           {/* API key */}
//           <div style={{ marginBottom: 28 }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 marginBottom: 6,
//               }}
//             >
//               <KeyRound size={14} color="#C89B4A" />

//               <h2
//                 className="sans"
//                 style={{
//                   fontSize: 12.5,
//                   fontWeight: 600,
//                   margin: 0,
//                   color: "#C7CBD6",
//                 }}
//               >
//                 API key
//               </h2>

//               {keySaved && (
//                 <span
//                   className="sans"
//                   style={{
//                     marginLeft: "auto",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 3,
//                     fontSize: 11,
//                     color: "#7FAE93",
//                   }}
//                 >
//                   <BookmarkCheck size={12} /> Saved
//                 </span>
//               )}
//             </div>

//             <p
//               className="sans"
//               style={{
//                 fontSize: 11.5,
//                 color: "#7B8092",
//                 margin: "0 0 10px",
//                 lineHeight: 1.5,
//               }}
//             >
//               Provide your OpenAI key to use OpenAI models. Leave empty to use
//               HuggingFace embeddings + Groq AI.
//             </p>

//             <div style={{ position: "relative" }}>
//               <input
//                 className="field mono"
//                 type={showKey ? "text" : "password"}
//                 value={apiKey}
//                 onChange={(event) => {
//                   setApiKey(event.target.value);
//                   setKeySaved(false);
//                 }}
//                 placeholder="OpenAI API key (optional)"
//                 autoComplete="off"
//                 style={{
//                   width: "100%",
//                   background: "#12161F",
//                   border: "1px solid #2C3346",
//                   borderRadius: 8,
//                   padding: "9px 36px 9px 11px",
//                   color: "#E9E4D8",
//                   fontSize: 12.5,
//                 }}
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowKey((value) => !value)}
//                 aria-label={showKey ? "Hide key" : "Show key"}
//                 className="btn"
//                 style={{
//                   position: "absolute",
//                   right: 7,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   color: "#8B90A0",
//                   padding: 3,
//                 }}
//               >
//                 {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
//               </button>
//             </div>

//             <button
//               type="button"
//               onClick={handleSaveKey}
//               className="btn sans"
//               style={{
//                 width: "100%",
//                 marginTop: 8,
//                 background: "#C89B4A",
//                 color: "#12161F",
//                 border: "none",
//                 borderRadius: 8,
//                 padding: "8px 0",
//                 fontWeight: 600,
//                 fontSize: 12.5,
//                 cursor: "pointer",
//               }}
//             >
//               Save key
//             </button>
//           </div>

//           <div
//             style={{
//               height: 1,
//               background: "#232A3B",
//               margin: "0 0 18px",
//             }}
//           />

//           {/* PDF upload */}
//           <div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 marginBottom: 10,
//               }}
//             >
//               <UploadCloud size={14} color="#C89B4A" />

//               <h2
//                 className="sans"
//                 style={{
//                   fontSize: 12.5,
//                   fontWeight: 600,
//                   margin: 0,
//                   color: "#C7CBD6",
//                 }}
//               >
//                 Book
//               </h2>
//             </div>

//             <div
//               role="button"
//               tabIndex={0}
//               onClick={() => fileInputRef.current?.click()}
//               onKeyDown={(event) => {
//                 if (event.key === "Enter" || event.key === " ") {
//                   event.preventDefault();
//                   fileInputRef.current?.click();
//                 }
//               }}
//               style={{
//                 border: "1.5px dashed #3A4258",
//                 borderRadius: 10,
//                 padding: "20px 14px",
//                 textAlign: "center",
//                 cursor: "pointer",
//                 background: "#12161F",
//               }}
//             >
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="application/pdf,.pdf"
//                 onChange={handleFileChange}
//                 style={{ display: "none" }}
//               />

//               <FileText
//                 size={18}
//                 color={file ? "#C89B4A" : "#5C6273"}
//                 style={{ marginBottom: 6 }}
//               />

//               <div
//                 className="sans"
//                 style={{
//                   fontSize: 12,
//                   color: "#C7CBD6",
//                   overflowWrap: "anywhere",
//                 }}
//               >
//                 {file ? file.name : "Click to choose a PDF"}
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleUpload}
//               disabled={uploadState.status === "loading"}
//               className="btn sans"
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 7,
//                 marginTop: 10,
//                 background: "#3E6259",
//                 color: "#EAF2ED",
//                 border: "none",
//                 borderRadius: 8,
//                 padding: "9px 0",
//                 fontWeight: 600,
//                 fontSize: 12.5,
//                 cursor:
//                   uploadState.status === "loading" ? "default" : "pointer",
//                 opacity: uploadState.status === "loading" ? 0.75 : 1,
//               }}
//             >
//               {uploadState.status === "loading" ? (
//                 <Loader2 size={14} className="spin" />
//               ) : (
//                 <UploadCloud size={14} />
//               )}

//               {uploadState.status === "loading"
//                 ? "Uploading…"
//                 : "Upload & index"}
//             </button>

//             <div style={{ marginTop: 8 }}>
//               <StatusLine state={uploadState} />
//             </div>

//             {isBookIndexed && (
//               <p
//                 className="sans"
//                 style={{
//                   margin: "9px 0 0",
//                   color: "#7FAE93",
//                   fontSize: 11.5,
//                   lineHeight: 1.5,
//                 }}
//               >
//                 PDF indexed and ready for questions.
//               </p>
//             )}
//           </div>
//         </aside>

//         {/* Main conversation */}
//         <main className="main">
//           <header className="main-header">
//             {/* Hamburger appears only on mobile/tablet */}
//             <div className="mobile-toolbar">
//               <button
//                 type="button"
//                 className="sidebar-toggle"
//                 onClick={() => setSidebarOpen(true)}
//                 aria-label="Open sidebar"
//                 aria-controls="bookqa-sidebar"
//                 aria-expanded={sidebarOpen}
//               >
//                 <Menu size={21} />
//               </button>

//               <span className="mobile-toolbar-title">
//                 Ask the Book
//               </span>
//             </div>

//             {/* <h2
//               style={{
//                 fontSize: 28,
//                 fontWeight: 700,
//                 margin: "0 0 6px",
//                 letterSpacing: "-0.01em",
//               }}
//             >
//               Ask a question
//             </h2> */}

//             {/* <p
//               className="sans"
//               style={{
//                 margin: 0,
//                 fontSize: 14,
//                 color: "#9AA0AF",
//               }}
//             >
//               Answers are drawn strictly from the book you've indexed.
//             </p> */}
//           </header>

//           <section
//             ref={conversationRef}
//             className="conversation"
//             aria-label="Question and answer history"
//             aria-live="polite"
//           >
//             {messages.length === 0 ? (
//               <div className="empty-state sans">
//                 <BookOpen
//                   size={32}
//                   color="#C89B4A"
//                   style={{ marginBottom: 14, opacity: 0.8 }}
//                 />

//                 <div
//                   style={{
//                     fontSize: 15,
//                     color: "#C7CBD6",
//                     marginBottom: 8,
//                   }}
//                 >
//                   Start a conversation with your book
//                 </div>

//                 <div style={{ fontSize: 13, lineHeight: 1.6 }}>
//                   Upload and index a PDF, then ask a question below.
//                   Your questions and answers will appear here.
//                 </div>
//               </div>
//             ) : (
//               messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`message-row ${message.role}`}
//                 >
//                   <div className={`message-bubble ${message.role}`}>
//                     {message.role === "assistant" && (
//                       <div
//                         className="sans"
//                         style={{
//                           fontSize: 11.5,
//                           letterSpacing: "0.06em",
//                           color: "#8A7A4E",
//                           marginBottom: 10,
//                           textTransform: "uppercase",
//                         }}
//                       >
//                         Answer
//                       </div>
//                     )}

//                     {message.content}
//                   </div>
//                 </div>
//               ))
//             )}

//             {askState.status === "loading" && (
//               <div
//                 className="sans"
//                 role="status"
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 9,
//                   color: "#9AA0AF",
//                   fontSize: 13,
//                   padding: "8px 0 20px",
//                 }}
//               >
//                 <Loader2 size={16} className="spin" color="#C89B4A" />
//                 Finding an answer from your book…
//               </div>
//             )}

//             {askState.status === "error" && (
//               <div style={{ paddingBottom: 16 }}>
//                 <StatusLine state={askState} />
//               </div>
//             )}
//           </section>

//           {/* Composer remains at the bottom */}
//           <form className="composer" onSubmit={handleAsk}>
//              <button
//                 type="submit"
//                 disabled={
//                   askState.status === "loading" ||
//                   !question.trim() ||
//                   !isBookIndexed
//                 }
//                 className="btn sans"
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8,
//                   flexShrink: 0,
//                   background: "#C89B4A",
//                   color: "#12161F",
//                   border: "none",
//                   borderRadius: 9,
//                   padding: "11px 20px",
//                   fontWeight: 600,
//                   fontSize: 14,
//                   cursor:
//                     askState.status === "loading" ||
//                     !question.trim() ||
//                     !isBookIndexed
//                       ? "not-allowed"
//                       : "pointer",
//                   opacity:
//                     askState.status === "loading" ||
//                     !question.trim() ||
//                     !isBookIndexed
//                       ? 0.65
//                       : 1,
//                 }}
//               >
//                 {askState.status === "loading" ? (
//                   <Loader2 size={16} className="spin" />
//                 ) : (
//                   <Send size={16} />
//                 )}

//                 {askState.status === "loading" ? "Thinking…" : "Ask"}
//               </button>
//             <textarea
//               ref={questionInputRef}
//               className="field sans question-input"
//               value={question}
//               onChange={(event) => setQuestion(event.target.value)}
//               onKeyDown={handleQuestionKeyDown}
//               placeholder="Ask something about your book… (Enter to send, Shift + Enter for a new line)"
//               rows={2}
//               aria-label="Your question"
//               disabled={askState.status === "loading"}
//             />

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 gap: 12,
//                 marginTop: 12,
//               }}
//             >
//               <span
//                 className="sans composer-hint"
//                 style={{
//                   color: "#737A8C",
//                   fontSize: 11.5,
//                 }}
//               >
//                 {isBookIndexed
//                   ? "Ready to answer from your indexed PDF."
//                   : "Upload and index a PDF to get started."}
//               </span>

             
//             </div>
//           </form>
//         </main>
//       </div>
//     </div>
//   );
// }

// function StatusLine({ state }) {
//   if (state.status === "idle" || !state.message) return null;

//   const isError = state.status === "error";
//   const Icon = isError ? XCircle : CheckCircle2;
//   const color = isError ? "#D07A6E" : "#7FAE93";

//   return (
//     <span
//       className="sans"
//       style={{
//         display: "flex",
//         alignItems: "flex-start",
//         gap: 6,
//         fontSize: 12.5,
//         lineHeight: 1.5,
//         color,
//         overflowWrap: "anywhere",
//       }}
//     >
//       <Icon size={14} style={{ flexShrink: 0, marginTop: 2 }} />
//       {state.message}
//     </span>
//   );
// }
// ------------------------------------------------------------------------------------------


import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  BookOpen,
  KeyRound,
  Eye,
  EyeOff,
  UploadCloud,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  BookmarkCheck,
  Menu,
  X,
} from "lucide-react";

import { apiRequest } from "../utils/api";

export default function BookQA() {
  // API key
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // PDF upload and indexing
  const [file, setFile] = useState(null);
  const [isBookIndexed, setIsBookIndexed] = useState(false);
  const [uploadState, setUploadState] = useState({
    status: "idle",
    message: "",
  });

  const fileInputRef = useRef(null);

  // Questions and conversation history
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [askState, setAskState] = useState({
    status: "idle",
    message: "",
  });

  const conversationRef = useRef(null);
  const questionInputRef = useRef(null);

  const keyHeaders = () =>
    apiKey.trim() ? { "x-api-key": apiKey.trim() } : {};

  // Restore the saved API key for the current session
  useEffect(() => {
    const savedKey = sessionStorage.getItem("OPENAI_API_KEY");

    if (savedKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiKey(savedKey);
      setKeySaved(true);
    }
  }, []);

  // Scroll to the latest conversation message
  useEffect(() => {
    const container = conversationRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, askState.status]);

  // Close the mobile sidebar using Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSaveKey = () => {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      toast.error("Please enter an OpenAI API key.");
      return;
    }

    sessionStorage.setItem("OPENAI_API_KEY", trimmedKey);
    setApiKey(trimmedKey);
    setKeySaved(true);

    toast.success("OpenAI API key saved.");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setIsBookIndexed(false);
    setUploadState({ status: "idle", message: "" });

    // Reset the conversation when a new document is selected
    setMessages([]);
    setAskState({ status: "idle", message: "" });
  };

  const handleUpload = async () => {
    if (!file) {
      const message = "Choose a PDF before uploading.";

      setUploadState({ status: "error", message });
      toast.error(message);
      return;
    }

    const formData = new FormData();
    formData.append("book", file);

    // Prevent questions while the new document is being indexed
    setIsBookIndexed(false);

    setUploadState({
      status: "loading",
      message: "Reading pages and building chunks…",
    });

    try {
      const data = await apiRequest("/api/book/upload", {
        method: "POST",
        headers: keyHeaders(),
        body: formData,
      });

      setIsBookIndexed(true);

      setUploadState({
        status: "success",
        message: `Indexed ${data.pages} pages into ${data.totalChunks} chunks.`,
      });

      toast.success("Book uploaded and indexed successfully.");
    } catch (error) {
      setIsBookIndexed(false);

      const message =
        error.message || "Upload failed. Is the server running?";

      setUploadState({ status: "error", message });
      toast.error(message);
    }
  };

  const handleAsk = async (event) => {
    event?.preventDefault();

    // Avoid duplicate submissions
    if (askState.status === "loading") return;

    const submittedQuestion = question.trim();

    if (!submittedQuestion) {
      setAskState({
        status: "error",
        message: "Type a question first.",
      });

      toast.error("Type a question first.");
      questionInputRef.current?.focus();
      return;
    }

    if (!isBookIndexed) {
      const message =
        "Please upload and index a PDF before asking questions.";

      setAskState({ status: "error", message });
      toast.error(message);
      return;
    }

    // Add the user's question to the conversation
    setMessages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-question`,
        role: "user",
        content: submittedQuestion,
      },
    ]);

    setQuestion("");
    setAskState({ status: "loading", message: "" });

    try {
      const data = await apiRequest("/api/qa/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...keyHeaders(),
        },
        body: JSON.stringify({
          question: submittedQuestion,
        }),
      });

      if (typeof data.answer !== "string") {
        throw new Error("The server did not return a valid answer.");
      }

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-answer`,
          role: "assistant",
          content: data.answer,
        },
      ]);

      setAskState({ status: "success", message: "" });
    } catch (error) {
      const message = error.message || "Failed to get an answer.";

      setAskState({ status: "error", message });
      toast.error(message);
    } finally {
      questionInputRef.current?.focus();
    }
  };

  const handleQuestionKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAsk(event);
    }
  };

  const isAsking = askState.status === "loading";
  const canAsk = question.trim().length > 0 && isBookIndexed && !isAsking;

  return (
    <div className="bookqa-root">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1B2130",
            color: "#E9E4D8",
            border: "1px solid #2C3346",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />

      <style>{`
        .bookqa-root {
          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          position: relative;
          background: #101319;
          color: #E9E4D8;
          font-family: 'Source Serif 4', Georgia, serif;
        }

        .bookqa-root *,
        .bookqa-root *::before,
        .bookqa-root *::after {
          box-sizing: border-box;
        }

        .bookqa-root .sans {
          font-family: Inter, sans-serif;
        }

        .bookqa-root .mono {
          font-family: 'IBM Plex Mono', monospace;
        }

        .bookqa-root input::placeholder,
        .bookqa-root textarea::placeholder {
          color: #6B7180;
        }

        .bookqa-root .field:focus-visible,
        .bookqa-root .btn:focus-visible,
        .bookqa-root .sidebar-toggle:focus-visible,
        .bookqa-root .sidebar-close-button:focus-visible,
        .bookqa-root .pdf-picker:focus-visible {
          outline: 2px solid #C89B4A;
          outline-offset: 2px;
        }

        .bookqa-root .app-shell {
          display: flex;
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }

        /* Sidebar */
        .bookqa-root .sidebar {
          position: relative;
          z-index: 30;
          width: 300px;
          min-width: 300px;
          flex-shrink: 0;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          border-right: 1px solid #232A3B;
          padding: 30px 22px;
          background: #151A25;
        }

        .bookqa-root .mobile-sidebar-close,
        .bookqa-root .mobile-toolbar,
        .bookqa-root .sidebar-backdrop {
          display: none;
        }

        /* Main layout */
        .bookqa-root .main {
          position: relative;
          z-index: 1;
          display: flex;
          flex: 1 1 0;
          flex-direction: column;
          width: 0;
          min-width: 0;
          min-height: 0;
          height: 100%;
          padding: 20px 32px 0;
          overflow: hidden;
        }

        .bookqa-root .main-header {
          flex-shrink: 0;
          padding-bottom: 8px;
        }

        /* Independently scrollable conversation history */
        .bookqa-root .conversation {
          flex: 1 1 0;
          min-width: 0;
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-gutter: stable;
          padding: 4px 10px 12px 0;
          scroll-behavior: smooth;
        }

        .bookqa-root .conversation::-webkit-scrollbar,
        .bookqa-root .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .bookqa-root .conversation::-webkit-scrollbar-thumb,
        .bookqa-root .sidebar::-webkit-scrollbar-thumb {
          background: #343B4E;
          border-radius: 10px;
        }

        /* Bottom-anchored question composer */
        .bookqa-root .composer {
          flex-shrink: 0;
          padding: 12px 0 16px;
          background: #101319;
          border-top: 1px solid #232A3B;
        }

        .bookqa-root .composer-input-row {
          display: flex;
          align-items: stretch;
          gap: 10px;
          min-width: 0;
        }

        .bookqa-root .composer-input-row .question-input {
          flex: 1 1 auto;
          width: 0;
          min-width: 0;
        }

        .bookqa-root .composer-ask-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          align-self: stretch;
          flex-shrink: 0;
          min-width: 90px;
          padding: 12px 18px;
          background: #C89B4A;
          color: #12161F;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 160ms ease, background 160ms ease;
        }

        .bookqa-root .composer-ask-btn:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .bookqa-root .composer-hint-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 8px;
        }

        .bookqa-root .composer-hint {
          color: #737A8C;
          font-size: 11px;
          line-height: 1.5;
        }

        /* Compact conversation history */
        .bookqa-root .message-row {
          display: flex;
          min-width: 0;
          margin-bottom: 12px;
        }

        .bookqa-root .message-row:last-child {
          margin-bottom: 4px;
        }

        .bookqa-root .message-row.user {
          justify-content: flex-end;
        }

        .bookqa-root .message-bubble {
          max-width: min(85%, 820px);
          min-width: 0;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
          line-height: 1.6;
          font-size: 14.5px;
        }

        .bookqa-root .message-bubble.user {
          padding: 10px 14px;
          background: #1B2130;
          color: #E9E4D8;
          border: 1px solid #2C3346;
          border-radius: 12px 12px 4px 12px;
        }

        .bookqa-root .message-bubble.assistant {
          position: relative;
          width: 100%;
          max-width: 100%;
          padding: 15px 20px;
          background: #F2ECDD;
          color: #232016;
          border-radius: 10px;
          box-shadow: 0 5px 16px rgba(0, 0, 0, 0.14);
        }

        .bookqa-root .message-bubble.assistant::before {
          content: "";
          position: absolute;
          left: 0;
          top: 10px;
          bottom: 10px;
          width: 3px;
          background: #C89B4A;
          border-radius: 2px;
        }

        .bookqa-root .answer-label {
          margin-bottom: 5px;
          color: #8A7A4E;
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .bookqa-root .question-input {
          display: block;
          width: 100%;
          max-height: 150px;
          min-height: 54px;
          resize: vertical;
          background: #1B2130;
          border: 1px solid #2C3346;
          border-radius: 10px;
          padding: 12px 14px;
          color: #E9E4D8;
          font-size: 14px;
          line-height: 1.5;
          font-family: Inter, sans-serif;
        }

        .bookqa-root .question-input:focus {
          border-color: #C89B4A;
          outline: none;
        }

        .bookqa-root .question-input:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .bookqa-root .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 180px;
          height: 100%;
          padding: 24px;
          text-align: center;
          color: #777E90;
        }

        .bookqa-root .pdf-picker {
          border: 1.5px dashed #3A4258;
          border-radius: 10px;
          padding: 18px 12px;
          text-align: center;
          cursor: pointer;
          background: #12161F;
          transition: border-color 160ms ease, background 160ms ease;
        }

        .bookqa-root .pdf-picker:hover {
          border-color: #C89B4A;
          background: #171C27;
        }

        /* Tablet and mobile */
        @media (max-width: 860px) {
          .bookqa-root .app-shell {
            height: 100%;
            min-height: 0;
            isolation: isolate;
          }

          .bookqa-root .sidebar {
            position: absolute;
            inset: 0 auto 0 0;
            z-index: 30;
            width: min(300px, 86vw);
            min-width: 0;
            height: 100%;
            padding: 22px 18px;
            overflow-x: hidden;
            overflow-y: auto;
            border-right: 1px solid #343B4E;
            box-shadow: 14px 0 40px rgba(0, 0, 0, 0.3);
            transform: translateX(-105%);
            visibility: hidden;
            pointer-events: none;
            transition:
              transform 220ms ease,
              visibility 220ms ease;
          }

          .bookqa-root .sidebar.sidebar-open {
            transform: translateX(0);
            visibility: visible;
            pointer-events: auto;
          }

          .bookqa-root .sidebar-backdrop {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 20;
            width: 100%;
            height: 100%;
            padding: 0;
            border: none;
            border-radius: 0;
            background: rgba(0, 0, 0, 0.58);
            cursor: pointer;
          }

          .bookqa-root .mobile-sidebar-close {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin: -8px -4px 16px 0;
          }

          .bookqa-root .sidebar-close-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            padding: 0;
            color: #E9E4D8;
            background: #202637;
            border: 1px solid #343B4E;
            border-radius: 9px;
            cursor: pointer;
          }

          .bookqa-root .main {
            width: 100%;
            min-width: 0;
            height: 100%;
            padding: 12px 18px 0;
          }

          .bookqa-root .mobile-toolbar {
            display: flex;
            align-items: center;
            gap: 12px;
            min-height: 38px;
            margin-bottom: 8px;
          }

          .bookqa-root .sidebar-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 38px;
            height: 38px;
            padding: 0;
            color: #E9E4D8;
            background: #1B2130;
            border: 1px solid #343B4E;
            border-radius: 9px;
            cursor: pointer;
          }

          .bookqa-root .mobile-toolbar-title {
            min-width: 0;
            color: #C7CBD6;
            font-family: Inter, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }

          .bookqa-root .main-header {
            padding-bottom: 4px;
          }

          .bookqa-root .conversation {
            scrollbar-gutter: auto;
            padding-right: 4px;
            padding-bottom: 10px;
          }

          .bookqa-root .message-row {
            margin-bottom: 10px;
          }

          .bookqa-root .message-bubble {
            max-width: 95%;
            font-size: 14px;
            line-height: 1.6;
          }

          .bookqa-root .message-bubble.assistant {
            max-width: 100%;
            padding: 14px 17px;
          }

          .bookqa-root .composer {
            padding-top: 10px;
            padding-bottom: max(10px, env(safe-area-inset-bottom));
          }

          .bookqa-root .composer-input-row {
            gap: 8px;
          }

          .bookqa-root .composer-ask-btn {
            min-width: 78px;
            padding: 10px 14px;
            font-size: 13px;
          }

          .bookqa-root .question-input {
            min-height: 50px;
            padding: 11px 12px;
            font-size: 13px;
          }

          .bookqa-root .composer-hint-row {
            margin-top: 7px;
          }
        }

        @media (max-width: 480px) {
          .bookqa-root .main {
            padding-right: 12px;
            padding-left: 12px;
          }

          .bookqa-root .message-bubble {
            font-size: 13.5px;
          }

          .bookqa-root .message-bubble.user {
            padding: 9px 12px;
          }

          .bookqa-root .message-bubble.assistant {
            padding: 12px 15px;
          }

          .bookqa-root .composer-input-row {
            gap: 7px;
          }

          .bookqa-root .composer-ask-btn {
            min-width: 66px;
            gap: 5px;
            padding: 9px 10px;
            font-size: 12px;
          }

          .bookqa-root .composer-ask-btn svg {
            width: 14px;
            height: 14px;
          }

          .bookqa-root .question-input {
            min-height: 48px;
            max-height: 120px;
            padding: 10px;
            font-size: 12.5px;
          }

          .bookqa-root .composer-hint {
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bookqa-root *,
          .bookqa-root *::before,
          .bookqa-root *::after {
            scroll-behavior: auto !important;
            transition: none !important;
            animation: none !important;
          }
        }

        @keyframes bookqa-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .bookqa-root .spin {
          animation: bookqa-spin 0.8s linear infinite;
        }
      `}</style>

      <div className="app-shell">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <button
            type="button"
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation sidebar"
          />
        )}

        {/* Sidebar */}
        <aside
          id="bookqa-sidebar"
          className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
          aria-label="Book settings"
        >
          <div className="mobile-sidebar-close">
            <button
              type="button"
              className="sidebar-close-button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={19} />
            </button>
          </div>

          {/* Branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 26,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#1e232e",
                border: "1px solid #adb2c1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BookOpen size={17} color="#C89B4A" strokeWidth={1.75} />
            </div>

            <h1
              style={{
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.01em",
                color: "white",
              }}
            >
              Ask the Book
            </h1>
          </div>

          {/* API key */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <KeyRound size={14} color="#C89B4A" />

              <h2
                className="sans"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  margin: 0,
                  color: "#C7CBD6",
                }}
              >
                API key
              </h2>

              {keySaved && (
                <span
                  className="sans"
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 11,
                    color: "#7FAE93",
                  }}
                >
                  <BookmarkCheck size={12} /> Saved
                </span>
              )}
            </div>

            <p
              className="sans"
              style={{
                fontSize: 11.5,
                color: "#7B8092",
                margin: "0 0 10px",
                lineHeight: 1.5,
              }}
            >
              Provide your OpenAI key to use OpenAI models. Leave empty to use
              HuggingFace embeddings + Groq AI.
            </p>

            <div style={{ position: "relative" }}>
              <input
                className="field mono"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(event) => {
                  setApiKey(event.target.value);
                  setKeySaved(false);
                }}
                placeholder="OpenAI API key (optional)"
                autoComplete="off"
                aria-label="OpenAI API key"
                style={{
                  width: "100%",
                  background: "#12161F",
                  border: "1px solid #2C3346",
                  borderRadius: 8,
                  padding: "9px 36px 9px 11px",
                  color: "#E9E4D8",
                  fontSize: 12.5,
                }}
              />

              <button
                type="button"
                onClick={() => setShowKey((value) => !value)}
                aria-label={showKey ? "Hide key" : "Show key"}
                className="btn"
                style={{
                  position: "absolute",
                  right: 7,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8B90A0",
                  padding: 3,
                }}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveKey}
              className="btn sans"
              style={{
                width: "100%",
                marginTop: 8,
                background: "#C89B4A",
                color: "#12161F",
                border: "none",
                borderRadius: 8,
                padding: "8px 0",
                fontWeight: 600,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              Save key
            </button>
          </div>

          <div
            style={{
              height: 1,
              background: "#232A3B",
              margin: "0 0 18px",
            }}
          />

          {/* PDF upload */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <UploadCloud size={14} color="#C89B4A" />

              <h2
                className="sans"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  margin: 0,
                  color: "#C7CBD6",
                }}
              >
                Book
              </h2>
            </div>

            <div
              className="pdf-picker"
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                aria-label="Choose a PDF file"
                style={{ display: "none" }}
              />

              <FileText
                size={18}
                color={file ? "#C89B4A" : "#5C6273"}
                style={{ marginBottom: 6 }}
              />

              <div
                className="sans"
                style={{
                  fontSize: 12,
                  color: "#C7CBD6",
                  overflowWrap: "anywhere",
                }}
              >
                {file ? file.name : "Click to choose a PDF"}
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={uploadState.status === "loading"}
              className="btn sans"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                marginTop: 10,
                background: "#3E6259",
                color: "#EAF2ED",
                border: "none",
                borderRadius: 8,
                padding: "9px 0",
                fontWeight: 600,
                fontSize: 12.5,
                cursor:
                  uploadState.status === "loading" ? "default" : "pointer",
                opacity: uploadState.status === "loading" ? 0.75 : 1,
              }}
            >
              {uploadState.status === "loading" ? (
                <Loader2 size={14} className="spin" />
              ) : (
                <UploadCloud size={14} />
              )}

              {uploadState.status === "loading"
                ? "Uploading…"
                : "Upload & index"}
            </button>

            <div style={{ marginTop: 8 }}>
              <StatusLine state={uploadState} />
            </div>

            {isBookIndexed && (
              <p
                className="sans"
                style={{
                  margin: "9px 0 0",
                  color: "#7FAE93",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                }}
              >
                PDF indexed and ready for questions.
              </p>
            )}
          </div>
        </aside>

        {/* Main conversation */}
        <main className="main">
          <header className="main-header">
            <div className="mobile-toolbar">
              <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                aria-controls="bookqa-sidebar"
                aria-expanded={sidebarOpen}
              >
                <Menu size={21} />
              </button>

              <span className="mobile-toolbar-title">Ask the Book</span>
            </div>
          </header>

          <section
            ref={conversationRef}
            className="conversation"
            aria-label="Question and answer history"
            aria-live="polite"
            aria-busy={isAsking}
          >
            {messages.length === 0 ? (
              <div className="empty-state sans">
                <BookOpen
                  size={32}
                  color="#C89B4A"
                  style={{ marginBottom: 14, opacity: 0.8 }}
                />

                <div
                  style={{
                    fontSize: 15,
                    color: "#C7CBD6",
                    marginBottom: 8,
                  }}
                >
                  Start a conversation with your book
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  Upload and index a PDF, then ask a question below. Your
                  questions and answers will appear here.
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-row ${message.role}`}
                >
                  <div className={`message-bubble ${message.role}`}>
                    {message.role === "assistant" && (
                      <div className="sans answer-label">Answer</div>
                    )}

                    {message.content}
                  </div>
                </div>
              ))
            )}

            {isAsking && (
              <div
                className="sans"
                role="status"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  color: "#9AA0AF",
                  fontSize: 12.5,
                  padding: "4px 0 12px",
                }}
              >
                <Loader2 size={15} className="spin" color="#C89B4A" />
                Finding an answer from your book…
              </div>
            )}

            {askState.status === "error" && (
              <div style={{ paddingBottom: 10 }}>
                <StatusLine state={askState} />
              </div>
            )}
          </section>

          {/* Fixed bottom composer: textarea left, Ask button right */}
          <form className="composer" onSubmit={handleAsk}>
            <div className="composer-input-row">
              <textarea
                ref={questionInputRef}
                className="field sans question-input"
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);

                  if (askState.status === "error") {
                    setAskState({ status: "idle", message: "" });
                  }
                }}
                onKeyDown={handleQuestionKeyDown}
                placeholder="Ask something about your book…"
                rows={2}
                aria-label="Your question"
                disabled={isAsking}
              />

              <button
                type="submit"
                disabled={!canAsk}
                className="btn sans composer-ask-btn"
                aria-label={isAsking ? "Finding an answer" : "Ask question"}
              >
                {isAsking ? (
                  <Loader2 size={16} className="spin" />
                ) : (
                  <Send size={16} />
                )}

                {isAsking ? "Thinking…" : "Ask"}
              </button>
            </div>

            <div className="composer-hint-row small">
              <small>
              <span className="sans composer-hint">
                {isBookIndexed
                  ? "Ready to answer from your indexed PDF."
                  : "Upload and index a PDF to get started."}
              </span>

              </small>
              <small>
              <span className="sans composer-hint">
                Enter to send · Shift + Enter for a new line
              </span>
              </small>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function StatusLine({ state }) {
  if (state.status === "idle" || !state.message) return null;

  const isError = state.status === "error";
  const Icon = isError ? XCircle : CheckCircle2;
  const color = isError ? "#D07A6E" : "#7FAE93";

  return (
    <span
      className="sans"
      role={isError ? "alert" : "status"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 6,
        fontSize: 12.5,
        lineHeight: 1.5,
        color,
        overflowWrap: "anywhere",
      }}
    >
      <Icon size={14} style={{ flexShrink: 0, marginTop: 2 }} />
      {state.message}
    </span>
  );
}


