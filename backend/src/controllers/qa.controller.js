const { createEmbedding } = require("../services/embed.service");
const { searchVectors } = require("../services/vector.service");

const {
generateOpenAIAnswer
}
=require("../services/openai.chat.service");
// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const clientKey =
req.headers["x-api-key"];


 
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // 1️⃣ Convert question to embedding
    const questionEmbedding = await createEmbedding(question);

    // 2️⃣ Find top 5 relevant chunks
    const relevantChunks = searchVectors(questionEmbedding, 5);


    // 3. Debug the retrieved context
    console.log("\n========== RAG DEBUG ==========");
    console.log("Question:", question);
    console.log("Retrieved chunks:", relevantChunks.length);

    relevantChunks.forEach((chunk, index) => {
      console.log(`\n--- Chunk ${index + 1} ---`);
      console.log("Metadata:", chunk.metadata);
      console.log("Text:", chunk.metadata?.text);
    });

    console.log("\n==============================\n");

    
    // 3️⃣ Build prompt for AI
    const contextText = relevantChunks
      .map((c, idx) => `Chunk ${idx + 1}: ${c.metadata.text}`)
      .join("\n\n");

//     const prompt = `
// You are an expert tutor. Use ONLY the information from the book chunks below to answer the question.

// Book Chunks:
// ${contextText}

// Question: ${question}

// Answer in a clear, structured way:
// `;
// console.log("Retrieved Context:");
// console.log(contextText);
  const prompt = `You are an expert tutor helping a student understand a book.

Use ONLY the information in the "Context" section below to answer the question.
Do not use outside knowledge. If the context doesn't contain enough information,
say so explicitly instead of guessing.

### Context
${contextText}

### Question
${question}

### Instructions
- Answer using only the context above.
- Structure the answer with short paragraphs or bullet points where it helps.
- Keep the tone clear and educational, like explaining to a student.
- If you quote the book, keep quotes short and mark them clearly.
- If the answer isn't in the context, say: "The book does not provide enough information to answer this question."

### Answer
`;

    // 4️⃣ Ask OpenAI
    // const completion = await openai.chat.completions.create({
    //   //   model: "gpt-4",
    //   model: "gpt-3.5-turbo",

    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.2,
    // });


    // for the groq
let answer;
if(clientKey){
 try{
  answer =
  await generateOpenAIAnswer(
    prompt,
    clientKey
  );
 }
 catch(error){
  return res.status(401).json({
      error: "Failed to use the provided OpenAI API key",
      details: error.message,
    });
 }

}
else{
    const completion = await groq.chat.completions.create({
  model: process.env.GROQ_MODEL,
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.2,
});

  answer = completion.choices[0].message.content;}
// console.log("Groq Answer:");
// console.log(answer);
    // const answer = completion.choices[0].message.content;

    // 5️⃣ Return answer
    res.status(200).json({
      question,
      answer,
      retrievedChunks: relevantChunks.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to answer question",
      details: error.message,
    });
  }
};
// -------------------------------------------------------------------------------------------------

// just to use teh embedding and vector without using the ai and ans this question


// const { createEmbedding } = require("../services/embed.service");
// const { searchVectors } = require("../services/vector.service");

// exports.askQuestion = async (req, res) => {
//   try {
//     const { question } = req.body;

//     if (!question) {
//       return res.status(400).json({ error: "Question is required" });
//     }

//     // 1️⃣ Convert question to embedding (still needed for vector search)
//     const questionEmbedding = await createEmbedding(question);

//     // 2️⃣ Find top 5 relevant chunks
//     //for now we are use the Mock Embeddings
//     // const relevantChunks = searchVectors(questionEmbedding, 5);
//     const relevantChunks = searchVectors([], 5);

//     // 3️⃣ Mock AI Answer using retrieved chunks
//     const contextText = relevantChunks
//       .map((c, idx) => `Chunk ${idx + 1}: ${c.metadata.text}`)
//       .join("\n\n");

//     const answer = `This is a simulated answer using ${
//       relevantChunks.length
//     } chunks from the book. Context preview: ${contextText.slice(0, 300)}...`;

//     // 4️⃣ Return simulated answer
//     res.status(200).json({
//       question,
//       answer,
//       retrievedChunks: relevantChunks.length,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to answer question",
//       details: error.message,
//     });
//   }
// };
// // -----------------

// // const { searchVectors } = require("../services/vector.service");

// // exports.askQuestion = async (req, res) => {
// //   try {
// //     const { question } = req.body;

// //     if (!question) {
// //       return res.status(400).json({ error: "Question is required" });
// //     }

// //     // 🔥 Keyword-based retrieval
// //     const relevantChunks = searchVectors(question, 5);

// //     if (relevantChunks.length === 0) {
// //       return res.json({
// //         question,
// //         answer: "No relevant content found in the book.",
// //         retrievedChunks: 0,
// //       });
// //     }

// //     const contextText = relevantChunks
// //       .map((c, idx) => `Chunk ${idx + 1}: ${c.metadata.text}`)
// //       .join("\n\n");

// //     const answer = `
// // Based on the book content:

// // ${contextText.slice(0, 800)}...
// // `;

// //     res.status(200).json({
// //       question,
// //       answer,
// //       retrievedChunks: relevantChunks.length,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       error: "Failed to answer question",
// //       details: error.message,
// //     });
// //   }
// // };



 