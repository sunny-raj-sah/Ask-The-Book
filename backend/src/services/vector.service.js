// const vectors = [];

// /**
//  * Store embedding and metadata
//  */
// exports.storeVector = (embedding, metadata) => {
//   vectors.push({
//     embedding,
//     metadata,
//   });
// };

// /**
//  * Calculate Cosine Similarity
//  */
// exports.cosineSimilarity = (a, b) => {
//   if (!Array.isArray(a) || !Array.isArray(b)) return 0;

//   if (a.length === 0 || b.length === 0) return 0;

//   if (a.length !== b.length) return 0;

//   const dotProduct = a.reduce((sum, value, index) => {
//     return sum + value * b[index];
//   }, 0);

//   const magnitudeA = Math.sqrt(
//     a.reduce((sum, value) => sum + value * value, 0)
//   );

//   const magnitudeB = Math.sqrt(
//     b.reduce((sum, value) => sum + value * value, 0)
//   );

//   if (magnitudeA === 0 || magnitudeB === 0) return 0;

//   return dotProduct / (magnitudeA * magnitudeB);
// };

// /**
//  * Search Top K similar chunks
//  */
// exports.searchVectors = (queryEmbedding, topK = 5) => {
//   return vectors
//     .map((vector) => ({
//       score: exports.cosineSimilarity(
//         queryEmbedding,
//         vector.embedding
//       ),
//       metadata: vector.metadata,
//     }))
//     .filter((item) => item.score > 0)
//     .sort((a, b) => b.score - a.score)
//     .slice(0, topK);
// };
// -----------------------------------------------

const vectors = [];

/**
 * Store an embedding and its metadata.
 */
exports.storeVector = (embedding, metadata) => {
  vectors.push({
    embedding,
    metadata,
  });
};

/**
 * Return the total number of stored vectors.
 */
exports.getVectorCount = () => vectors.length;

/**
 * Calculate cosine similarity.
 */
exports.cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return 0;

  if (a.length === 0 || b.length === 0) return 0;
  if (a.length !== b.length) return 0;

  const dotProduct = a.reduce(
    (sum, value, index) => sum + value * b[index],
    0
  );

  const magnitudeA = Math.sqrt(
    a.reduce((sum, value) => sum + value * value, 0)
  );

  const magnitudeB = Math.sqrt(
    b.reduce((sum, value) => sum + value * value, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Search the top K most similar chunks.
 */
exports.searchVectors = (queryEmbedding, topK = 5) => {
  const results = vectors
    .map((vector) => ({
      score: exports.cosineSimilarity(
        queryEmbedding,
        vector.embedding
      ),
      metadata: vector.metadata,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  console.log("Total stored vectors:", vectors.length);

  console.log(
    "Retrieved chunk indexes and scores:",
    results.map((item) => ({
      chunkIndex: item.metadata.chunkIndex,
      score: Number(item.score.toFixed(4)),
    }))
  );

  return results;
};
