import { documentation } from '../data/documentation';
import type { SearchResult } from '../types/chat';

const normalizeText = (text: string): string => 
  text.toLowerCase().replace(/[^a-z0-9\s]/g, '');

const calculateRelevance = (query: string, text: string): number => {
  const normalizedQuery = normalizeText(query);
  const normalizedText = normalizeText(text);
  
  // Check for exact matches
  if (normalizedText.includes(normalizedQuery)) {
    return 1.0;
  }
  
  // Check for partial matches
  const queryWords = normalizedQuery.split(/\s+/);
  const matchedWords = queryWords.filter(word => 
    normalizedText.includes(word)
  );
  
  return matchedWords.length / queryWords.length;
};

export const searchDocs = async (query: string): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];
  
  for (const doc of documentation) {
    const titleRelevance = calculateRelevance(query, doc.title);
    const contentRelevance = calculateRelevance(query, doc.content);
    const platformRelevance = calculateRelevance(query, doc.platform);
    
    const maxRelevance = Math.max(titleRelevance, contentRelevance, platformRelevance);
    
    if (maxRelevance > 0) {
      results.push({
        platform: doc.platform,
        title: doc.title,
        content: doc.content,
        relevance: maxRelevance
      });
    }
  }
  
  return results.sort((a, b) => b.relevance - a.relevance);
};

export const generateResponse = (query: string, results: SearchResult[]): string => {
  if (results.length === 0) {
    return "I apologize, but I couldn't find specific information about that in the CDP documentation. Could you please rephrase your question or ask about a different CDP-related topic?";
  }

  // Check if the question is CDP-related
  const cdpKeywords = ['segment', 'mparticle', 'lytics', 'zeotap', 'cdp', 'customer data', 'integration', 'profile', 'audience'];
  const isRelevant = cdpKeywords.some(keyword => 
    query.toLowerCase().includes(keyword.toLowerCase())
  );

  if (!isRelevant) {
    return "I'm specifically trained to help with CDP-related questions about Segment, mParticle, Lytics, and Zeotap. Could you please ask a question about one of these platforms?";
  }

  // For comparison questions
  if (query.toLowerCase().includes('compare') || query.toLowerCase().includes('difference')) {
    const platforms = results.map(r => r.platform);
    if (platforms.length > 1) {
      return `Here's a comparison of the approaches in different CDPs:\n\n${
        results.map(r => `${r.platform}:\n${r.content}`).join('\n\n')
      }`;
    }
  }

  // For regular how-to questions
  const bestMatch = results[0];
  return `Here's how to ${bestMatch.title.toLowerCase()} in ${bestMatch.platform}:\n\n${bestMatch.content}`;
};

export const isValidQuestion = (query: string): boolean => {
  return query.length > 0 && query.length <= 500;
};