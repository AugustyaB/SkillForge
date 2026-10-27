/**
 * Information Retrieval (IR) Evaluation Metrics.
 * Pure mathematical implementations of industry-standard ranking metrics:
 * - MRR (Mean Reciprocal Rank)
 * - DCG@k (Discounted Cumulative Gain)
 * - NDCG@k (Normalized Discounted Cumulative Gain)
 * - HitRate@k (Precision at rank k)
 */

export interface QueryEvaluationRecord {
  queryId: string;
  query: string;
  retrieved: string[];
  relevanceMap: Record<string, number>;
}

/**
 * Calculates Discounted Cumulative Gain at rank k (DCG@k)
 * Uses standard graded relevance formula: sum_{i=1}^k (2^{rel_i} - 1) / log2(i + 1)
 */
export function calculateDCG(
  rankedItems: string[],
  relevanceMap: Record<string, number>,
  k = 5
): number {
  if (!rankedItems || rankedItems.length === 0 || k <= 0) {
    return 0;
  }
  const topK = rankedItems.slice(0, k);
  let dcg = 0;
  for (let i = 0; i < topK.length; i++) {
    const item = topK[i];
    if (!item) continue;
    const rel = relevanceMap[item] || 0;
    if (rel > 0) {
      const numerator = Math.pow(2, rel) - 1;
      const denominator = Math.log2(i + 2); // i=0 => log2(2) = 1
      dcg += numerator / denominator;
    }
  }
  return dcg;
}

/**
 * Calculates Ideal Discounted Cumulative Gain at rank k (IDCG@k)
 */
export function calculateIDCG(relevanceMap: Record<string, number>, k = 5): number {
  if (!relevanceMap || k <= 0) {
    return 0;
  }
  const sortedGains = Object.values(relevanceMap)
    .filter((rel) => typeof rel === 'number' && rel > 0)
    .sort((a, b) => b - a)
    .slice(0, k);

  let idcg = 0;
  for (let i = 0; i < sortedGains.length; i++) {
    const rel = sortedGains[i] ?? 0;
    const numerator = Math.pow(2, rel) - 1;
    const denominator = Math.log2(i + 2);
    idcg += numerator / denominator;
  }
  return idcg;
}

/**
 * Calculates Normalized Discounted Cumulative Gain at rank k (NDCG@k)
 * Returns a score between 0.0 and 1.0.
 */
export function calculateNDCG(
  rankedItems: string[],
  relevanceMap: Record<string, number>,
  k = 5
): number {
  const idcg = calculateIDCG(relevanceMap, k);
  if (idcg === 0) {
    // If no relevant documents exist for this query (e.g. empty/hostile queries),
    // return 1.0 if retrieval correctly yielded no items or safe fallback, else 0.
    return rankedItems.length === 0 ? 1.0 : 0.0;
  }
  const dcg = calculateDCG(rankedItems, relevanceMap, k);
  return Math.min(1.0, dcg / idcg);
}

/**
 * Calculates Reciprocal Rank (RR) for a single query.
 * RR = 1 / rank of first relevant item (relevance > 0). If none found, 0.
 */
export function calculateReciprocalRank(
  rankedItems: string[],
  relevanceMap: Record<string, number>
): number {
  if (!rankedItems || rankedItems.length === 0) {
    return 0;
  }
  for (let i = 0; i < rankedItems.length; i++) {
    const item = rankedItems[i];
    if (item && (relevanceMap[item] || 0) > 0) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

/**
 * Calculates Mean Reciprocal Rank (MRR) across an evaluation query set.
 */
export function calculateMRR(records: QueryEvaluationRecord[]): number {
  const evaluatable = records.filter(
    (r) => Object.keys(r.relevanceMap).length > 0 && Object.values(r.relevanceMap).some((v) => v > 0)
  );
  if (evaluatable.length === 0) {
    return 1.0;
  }
  const totalRR = evaluatable.reduce((sum, record) => {
    return sum + calculateReciprocalRank(record.retrieved, record.relevanceMap);
  }, 0);
  return totalRR / evaluatable.length;
}

/**
 * Calculates HitRate at rank k (HitRate@k).
 * Measures the fraction of queries where at least one relevant document is in the top k.
 */
export function calculateHitRate(records: QueryEvaluationRecord[], k = 3): number {
  const evaluatable = records.filter(
    (r) => Object.keys(r.relevanceMap).length > 0 && Object.values(r.relevanceMap).some((v) => v > 0)
  );
  if (evaluatable.length === 0) {
    return 1.0;
  }
  const hits = evaluatable.reduce((sum, record) => {
    const topK = record.retrieved.slice(0, k);
    const hasHit = topK.some((item) => (record.relevanceMap[item] || 0) > 0);
    return sum + (hasHit ? 1 : 0);
  }, 0);
  return hits / evaluatable.length;
}
