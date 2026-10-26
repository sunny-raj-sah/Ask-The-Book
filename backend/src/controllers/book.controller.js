// this is working with hugging face api
// const { extractTextFromPDF } = require("../services/pdf.service");
// const { createChunks } = require("../services/chunk.service");
// const { createEmbedding } = require("../services/embed.service");

// const {
//   createOpenAIEmbedding
// }
//   = require("../services/openai.embed.service");
// const { storeVector } = require("../services/vector.service");

// exports.uploadBook = async (req, res) => {

//   const clientKey =
//     req.headers["x-api-key"];


//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // 1️⃣ Extract text from PDF
//     const { text, totalPages } = await extractTextFromPDF(req.file.path);

//     // 2️⃣ Create chunks
//     const chunks = createChunks(text);

//     // 3️⃣ Create embeddings & store vectors
//     if (clientKey) {
//       const MAX_CHUNKS = 1; // safe limit

//       for (let i = 0; i < Math.min(chunks.length, MAX_CHUNKS); i++) {
//         // User OpenAI key
//         embedding =
//           await createOpenAIEmbedding(
//             chunks[i].content,
//             clientKey
//           );


//         storeVector(embedding, {
//           text: chunks[i].content,
//           chunkIndex: i,
//         });
//       }
//     }

//     else {
//       const MAX_CHUNKS = 1; // safe limit

//       for (let i = 0; i < Math.min(chunks.length, MAX_CHUNKS); i++) {
//         const embedding = await createEmbedding(chunks[i].content);

//         storeVector(embedding, {
//           text: chunks[i].content,
//           chunkIndex: i,
//         });
//       }
//       // }
//       // 4️⃣ Send response AFTER storing vectors
//       res.status(200).json({
//         message: "Book uploaded, chunked, and indexed successfully",
//         pages: totalPages,
//         totalChunks: chunks.length,
//       });
//     } catch (error) {
//       res.status(500).json({
//         error: "Failed to process book",
//         details: error.message,
//       });
    
//     }
//   };
// ---------------------------------------------------------------------------------------------
// const { extractTextFromPDF } = require("../services/pdf.service");
// const { createChunks } = require("../services/chunk.service");
// const { createEmbedding } = require("../services/embed.service");
// const {
//   createOpenAIEmbedding,
// } = require("../services/openai.embed.service");
// const { storeVector } = require("../services/vector.service");

// exports.uploadBook = async (req, res) => {
//   const clientKey = req.headers["x-api-key"];

//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         error: "No file uploaded",
//       });
//     }

//     // 1. Extract text from PDF
//     const { text, totalPages } = await extractTextFromPDF(
//       req.file.path
//     );

//     if (!text || !text.trim()) {
//       return res.status(400).json({
//         error: "No readable text found in PDF",
//       });
//     }

//     // 2. Create chunks
//     const chunks = createChunks(text);

//     if (!chunks || chunks.length === 0) {
//       return res.status(400).json({
//         error: "No text chunks were created",
//       });
//     }

//     // 3. Create embeddings and store vectors
//     const MAX_CHUNKS = 1;
//     const chunksToProcess = chunks.slice(0, MAX_CHUNKS);

//     for (let i = 0; i < chunksToProcess.length; i++) {
//       const chunk = chunksToProcess[i];

//       const embedding = clientKey
//         ? await createOpenAIEmbedding(chunk.content, clientKey)
//         : await createEmbedding(chunk.content);

//       if (!embedding) {
//         throw new Error(`Embedding generation failed for chunk ${i}`);
//       }

//       await storeVector(embedding, {
//         text: chunk.content,
//         chunkIndex: i,
//       });
//     }

//     // 4. Send response for both embedding providers
//     return res.status(200).json({
//       message: "Book uploaded, chunked, and indexed successfully",
//       pages: totalPages,
//       totalChunks: chunks.length,
//       indexedChunks: chunksToProcess.length,
//       embeddingProvider: clientKey ? "OpenAI" : "Hugging Face",
//     });
//   } catch (error) {
//     console.error("Book processing error:", error);

//     return res.status(500).json({
//       error: "Failed to process book",
//       details: error.message,
//     });
//   }
// };
// --------------------------------------------------------------------------------------------------------------------
 
const { extractTextFromPDF } = require("../services/pdf.service");
const { createChunks } = require("../services/chunk.service");
const { createEmbedding } = require("../services/embed.service");
const {
  createOpenAIEmbedding,
} = require("../services/openai.embed.service");
const { storeVector } = require("../services/vector.service");

exports.uploadBook = async (req, res) => {
  const clientKey = req.headers["x-api-key"];

  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    // 1. Extract text from PDF
    const { text, totalPages } = await extractTextFromPDF(
      req.file.path
    );

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "No readable text found in PDF",
      });
    }

    // 2. Create chunks
    const chunks = createChunks(text);

    if (!chunks || chunks.length === 0) {
      return res.status(400).json({
        error: "No text chunks were created",
      });
    }

    console.log("Total chunks created:", chunks.length);

    // 3. Generate embeddings and index ALL chunks
    let indexedChunks = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embedding = clientKey
        ? await createOpenAIEmbedding(chunk.content, clientKey)
        : await createEmbedding(chunk.content);

      if (!embedding) {
        throw new Error(
          `Embedding generation failed for chunk ${i}`
        );
      }

      await storeVector(embedding, {
        text: chunk.content,
        chunkIndex: i,
      });

      indexedChunks++;

      console.log(
        `Indexed chunk ${i + 1}/${chunks.length}`
      );
    }

    // 4. Return indexing details
    return res.status(200).json({
      message: "Book uploaded, chunked, and indexed successfully",
      pages: totalPages,
      totalChunks: chunks.length,
      indexedChunks,
      embeddingProvider: clientKey
        ? "OpenAI"
        : "Hugging Face",
    });
  } catch (error) {
    console.error("Book processing error:", error);

    return res.status(500).json({
      error: "Failed to process book",
      details: error.message,
    });
  }
};
