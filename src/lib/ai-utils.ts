import * as tf from '@tensorflow/tfjs';
import * as universalSentenceEncoder from '@tensorflow-models/universal-sentence-encoder';

let model: universalSentenceEncoder.UniversalSentenceEncoder | null = null;

export async function loadUniversalSentenceEncoder() {
  if (!model) {
    model = await universalSentenceEncoder.load();
    console.log('Universal Sentence Encoder model loaded.');
  }
}

export async function generateEmbedding(text: string): Promise<tf.Tensor | null> {
  if (!model) {
    console.error('Universal Sentence Encoder model not loaded.');
    return null;
  }
  // The model expects an array of strings and returns a Tensor of embeddings
  const embeddings = await model.embed([text]);
  // We only embedded one string, so return the first (and only) embedding
  return embeddings.squeeze(); // Remove the extra dimension
}

export function cosineSimilarity(embedding1: tf.Tensor, embedding2: tf.Tensor): number {
  // Ensure the tensors are 1D vectors
  if (embedding1.rank !== 1 || embedding2.rank !== 1) {
    console.error('Input embeddings must be 1D tensors.');
    // Dispose of tensors before returning
    embedding1.dispose();
    embedding2.dispose();
    return 0; // Or throw an error
  }

  const dotProduct = tf.dot(embedding1, embedding2);
  const norm1 = tf.norm(embedding1);
  const norm2 = tf.norm(embedding2);

  // Calculate similarity and immediately dispose of intermediate tensors
  const similarity = dotProduct.div(norm1.mul(norm2)).dataSync()[0];

  // Dispose of all tensors used in the calculation
  dotProduct.dispose();
  norm1.dispose();
  norm2.dispose();
  embedding1.dispose(); // Dispose of input tensors as well, assuming they are created specifically for this calculation
  embedding2.dispose();

  return similarity;
}

const keywordResponses: { [key: string]: string } = {
  "minimum order": "Our MOQ is 500pcs.",
  "moq": "Our minimum order quantity (MOQ) is 500pcs.",
  "delivery time": "Standard delivery time is 7-10 business days after design confirmation.",
  "lead time": "Our lead time is typically 7-10 business days after design approval.",
};

export function findKeywordMatch(text: string): string | null {
  const lowerText = text.toLowerCase();
  for (const keyword in keywordResponses) {
    if (lowerText.includes(keyword)) {
      return keywordResponses[keyword];
    }
  }
  return null;
}