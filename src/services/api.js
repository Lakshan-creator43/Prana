import { remedies } from '../data/remedies';
import { sources } from '../data/sources';
import { searchHistory } from '../data/history';
import { checkRedFlags } from '../data/redFlags';

export const USE_MOCK = false;

const API_BASE = import.meta.env.VITE_API_URL || '';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Analyze user-submitted symptoms for risk level and red flags.
 * Returns { riskLevel: 'low'|'moderate'|'high', redFlags: string[], symptoms: string }
 */
export async function analyzeSymptoms(symptomsText) {
  if (USE_MOCK) {
    await delay(800);
    const flags = checkRedFlags(symptomsText);
    let riskLevel = 'low';
    if (flags.length > 0) riskLevel = 'high';
    else if (
      symptomsText.toLowerCase().includes('stomach') ||
      symptomsText.toLowerCase().includes('pain') ||
      symptomsText.toLowerCase().includes('fever')
    ) {
      riskLevel = 'moderate';
    }
    return { riskLevel, redFlags: flags, symptoms: symptomsText };
  }
  // Backend: POST /api/analyze-symptoms { symptoms: symptomsText }
  const res = await fetch(`${API_BASE}/api/analyze-symptoms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms: symptomsText }),
  });
  return res.json();
}

/**
 * Research remedies based on analyzed symptoms.
 * Returns { remedies: Remedy[], sourcesUsed: string[] }
 */
export async function researchRemedies(symptomsText) {
  if (USE_MOCK) {
    await delay(1200);
    return {
      remedies: [...remedies],
      sourcesUsed: sources.map((s) => s.id),
    };
  }
  const res = await fetch(`${API_BASE}/api/research-remedies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms: symptomsText }),
  });
  return res.json();
}

/**
 * Get safety information for a specific remedy.
 * Returns { allergyWarnings, conditionWarnings, medicationInteractions, overallRisk }
 */
export async function getSafety(remedyId, userProfile = {}) {
  if (USE_MOCK) {
    await delay(600);
    return {
      allergyWarnings: [
        {
          allergen: 'Bee products (honey)',
          severity: 'moderate',
          source: { id: 'nccih', citation: 'NCCIH Honey Fact Sheet, 2023' },
        },
      ],
      conditionWarnings: [
        {
          condition: 'Diabetes',
          note: 'Honey contains natural sugars and may affect blood glucose levels.',
          source: { id: 'mayo', citation: 'Mayo Clinic: Diabetes and Natural Sweeteners, 2023' },
        },
      ],
      medicationInteractions: [
        {
          medication: 'Warfarin (blood thinner)',
          interaction: 'Ginger may increase bleeding risk when combined with anticoagulants.',
          severity: 'moderate',
          source: { id: 'nccih', citation: 'NCCIH Ginger Fact Sheet, 2023' },
        },
      ],
      overallRisk: 'low',
    };
  }
  const res = await fetch(`${API_BASE}/api/safety/${remedyId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userProfile),
  });
  return res.json();
}

/**
 * Get search history.
 * Returns { history: HistoryEntry[] }
 */
export async function getHistory() {
  if (USE_MOCK) {
    await delay(400);
    return { history: [...searchHistory] };
  }
  const res = await fetch(`${API_BASE}/api/history`);
  return res.json();
}

/**
 * Save a remedy for later reference.
 * Returns { status: 'saved' }
 */
export async function saveRemedy(searchId, remedyId, remedyName, remedyData) {
  if (USE_MOCK) {
    await delay(300);
    return { status: 'saved' };
  }
  const res = await fetch(`${API_BASE}/api/save-remedy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search_id: searchId,
      remedy_id: remedyId,
      remedy_name: remedyName,
      remedy_data: remedyData,
    }),
  });
  return res.json();
}

/**
 * Get all saved remedies.
 * Returns { savedRemedies: SavedRemedy[] }
 */
export async function getSavedRemedies() {
  if (USE_MOCK) {
    await delay(400);
    return { savedRemedies: [] };
  }
  const res = await fetch(`${API_BASE}/api/saved-remedies`);
  return res.json();
}

/**
 * Delete a saved remedy by its database ID.
 * Returns { status: 'deleted' }
 */
export async function deleteSavedRemedy(remedyDbId) {
  if (USE_MOCK) {
    await delay(300);
    return { status: 'deleted' };
  }
  const res = await fetch(`${API_BASE}/api/saved-remedies/${remedyDbId}`, {
    method: 'DELETE',
  });
  return res.json();
}


// ──────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────

/**
 * Get all comments for a remedy.
 * Returns { comments: Comment[] }
 */
export async function getComments(remedyId) {
  if (USE_MOCK) {
    await delay(400);
    return { comments: [] };
  }
  const res = await fetch(`${API_BASE}/api/comments/${remedyId}`);
  return res.json();
}

/**
 * Add a comment to a remedy.
 * Returns { comment: Comment }
 */
export async function addComment(remedyId, authorName, content, parentId = null) {
  if (USE_MOCK) {
    await delay(300);
    return {
      comment: {
        id: Date.now(),
        remedyId,
        parentId,
        authorName: authorName || 'Anonymous',
        content,
        createdAt: new Date().toISOString(),
        replies: [],
      },
    };
  }
  const res = await fetch(`${API_BASE}/api/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      remedy_id: remedyId,
      author_name: authorName,
      content,
      parent_id: parentId,
    }),
  });
  return res.json();
}

/**
 * Delete a comment by its ID.
 * Returns { status: 'deleted' }
 */
export async function deleteComment(commentId) {
  if (USE_MOCK) {
    await delay(300);
    return { status: 'deleted' };
  }
  const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
    method: 'DELETE',
  });
  return res.json();
}


// ──────────────────────────────────────────────
// Research Feedback
// ──────────────────────────────────────────────

/**
 * Submit research feedback (rating + text).
 * Returns { status: 'saved', feedbackId: number }
 */
export async function submitFeedback(rating, helpful = '', improve = '', searchId = null) {
  if (USE_MOCK) {
    await delay(300);
    return { status: 'saved', feedbackId: Date.now() };
  }
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rating,
      helpful,
      improve,
      search_id: searchId,
    }),
  });
  return res.json();
}

