/**
 * Case-insensitive and fuzzy search utility
 * Handles variations like "Book World", "Book Worls", "bookworld", "book world"
 */

/**
 * Normalize search query by removing extra spaces and converting to lowercase
 */
export const normalizeQuery = (query) => {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
};

/**
 * Calculate similarity score between two strings (Levenshtein distance based)
 * Returns a value between 0 and 1, where 1 is an exact match
 */
const calculateSimilarity = (str1, str2) => {
  const s1 = normalizeQuery(str1);
  const s2 = normalizeQuery(str2);
  
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.95;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Calculate edit distance (Levenshtein) between two strings
 */
const getEditDistance = (s1, s2) => {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

/**
 * Search for items with fuzzy matching
 * @param {string} query - Search query
 * @param {Array} items - Array of items to search
 * @param {string|Function} searchField - Field name or function to extract searchable text
 * @param {number} threshold - Minimum similarity score (0-1), default 0.6
 * @returns {Array} Sorted array of matching items with scores
 */
export const fuzzySearch = (query, items, searchField, threshold = 0.6) => {
  if (!query.trim()) return items;
  
  const normalizedQuery = normalizeQuery(query);
  
  return items
    .map(item => {
      let searchText = '';
      
      if (typeof searchField === 'function') {
        searchText = searchField(item);
      } else if (typeof searchField === 'string') {
        searchText = item[searchField] || '';
      }
      
      searchText = String(searchText);
      const normalizedText = normalizeQuery(searchText);
      const score = calculateSimilarity(normalizedQuery, normalizedText);
      
      return { item, score };
    })
    .filter(result => result.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);
};

/**
 * Case-insensitive search - simple substring match
 * @param {string} query - Search query
 * @param {Array} items - Array of items to search
 * @param {string|Function} searchField - Field name or function to extract searchable text
 * @returns {Array} Matching items
 */
export const caseInsensitiveSearch = (query, items, searchField) => {
  if (!query.trim()) return items;
  
  const normalizedQuery = normalizeQuery(query);
  
  return items.filter(item => {
    let searchText = '';
    
    if (typeof searchField === 'function') {
      searchText = searchField(item);
    } else if (typeof searchField === 'string') {
      searchText = item[searchField] || '';
    }
    
    searchText = String(searchText);
    return normalizeQuery(searchText).includes(normalizedQuery);
  });
};

/**
 * Handle "Book World" specific search with variations
 * Recognizes: "Book World", "Book Worls", "bookworld", "book world"
 */
export const isBookWorldQuery = (query) => {
  const normalized = normalizeQuery(query);
  const variations = [
    'book world',
    'bookworld',
    'book worls', // typo tolerance
    'bookworls',
  ];
  
  return variations.some(v => 
    normalized === v || 
    calculateSimilarity(normalized, v) > 0.8
  );
};

/**
 * Prioritize search results for "Book World" queries
 * Moves exact matches and close matches to the top
 */
export const prioritizeResults = (query, items, searchField) => {
  if (!isBookWorldQuery(query)) {
    return items;
  }
  
  // For "Book World" queries, move exact title/name matches to top
  const exact = [];
  const partial = [];
  const others = [];
  
  items.forEach(item => {
    let searchText = '';
    if (typeof searchField === 'function') {
      searchText = searchField(item);
    } else if (typeof searchField === 'string') {
      searchText = item[searchField] || '';
    }
    
    searchText = normalizeQuery(String(searchText));
    const normalized = normalizeQuery(query);
    
    if (searchText === normalized) {
      exact.push(item);
    } else if (searchText.includes(normalized) || normalized.includes(searchText)) {
      partial.push(item);
    } else {
      others.push(item);
    }
  });
  
  return [...exact, ...partial, ...others];
};

/**
 * Multi-field search - search across multiple fields
 * @param {string} query - Search query
 * @param {Array} items - Array of items to search
 * @param {Array<string|Function>} searchFields - Array of field names or functions
 * @param {number} threshold - Minimum similarity score
 * @returns {Array} Matching items sorted by relevance
 */
export const multiFieldSearch = (query, items, searchFields, threshold = 0.6) => {
  if (!query.trim()) return items;
  
  const normalizedQuery = normalizeQuery(query);
  
  return items
    .map(item => {
      let maxScore = 0;
      
      searchFields.forEach(field => {
        let searchText = '';
        
        if (typeof field === 'function') {
          searchText = field(item);
        } else if (typeof field === 'string') {
          searchText = item[field] || '';
        }
        
        searchText = String(searchText);
        const score = calculateSimilarity(normalizedQuery, searchText);
        maxScore = Math.max(maxScore, score);
      });
      
      return { item, score: maxScore };
    })
    .filter(result => result.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);
};

export default {
  normalizeQuery,
  fuzzySearch,
  caseInsensitiveSearch,
  isBookWorldQuery,
  prioritizeResults,
  multiFieldSearch,
  calculateSimilarity,
};
