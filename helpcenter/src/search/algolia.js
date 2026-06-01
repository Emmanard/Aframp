/**
 * Algolia search client configuration.
 *
 * Environment variables (set in .env):
 *   VITE_ALGOLIA_APP_ID      — Algolia Application ID
 *   VITE_ALGOLIA_SEARCH_KEY  — Search-only API key (public, read-only)
 *
 * Falls back to a local in-memory search when env vars are not set,
 * so the help center works without an Algolia account in development.
 */
import algoliasearch from "algoliasearch/lite";
import { articles, getPopularArticles } from "../data/articles";

export const INDEX_NAME = "aframp_helpcenter";

// ── Algolia client ────────────────────────────────────────────────────────────

const APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;

export const algoliaClient = APP_ID && SEARCH_KEY
  ? algoliasearch(APP_ID, SEARCH_KEY)
  : null;

// ── Local fallback search ─────────────────────────────────────────────────────
// Used when Algolia credentials are not configured.
// Searches title, excerpt, keywords, and body.

export function localSearch(query) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase();
  return articles
    .filter((a) => {
      const haystack = [
        a.title,
        a.excerpt,
        a.category,
        a.body,
        ...(a.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .map((a) => ({
      objectID: a.objectID,
      title: a.title,
      category: a.category,
      slug: a.slug,
      excerpt: a.excerpt,
    }));
}

export function isAlgoliaConfigured() {
  return Boolean(APP_ID && SEARCH_KEY);
}
