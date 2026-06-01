/**
 * SearchBox — instant search input with results dropdown.
 * Uses Algolia InstantSearch when configured, falls back to local search.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { localSearch, isAlgoliaConfigured } from "../search/algolia";
import { getPopularArticles } from "../data/articles";
import styles from "./SearchBox.module.css";

export default function SearchBox({ placeholder = "Search for help…", autoFocus = false }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const popular = getPopularArticles();

  // Run search on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const hits = localSearch(query);
    setResults(hits);
    setActiveIndex(-1);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleFocus = () => setOpen(true);

  const handleKeyDown = useCallback(
    (e) => {
      const items = query.trim() ? results : popular;
      if (!open || items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        navigate(`/article/${items[activeIndex].slug}`);
        setOpen(false);
        setQuery("");
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, query, results, popular, activeIndex, navigate]
  );

  function handleSelect(slug) {
    navigate(`/article/${slug}`);
    setOpen(false);
    setQuery("");
  }

  const showEmpty = open && !query.trim();
  const showResults = open && query.trim().length > 0;
  const noResults = showResults && results.length === 0;

  return (
    <div ref={containerRef} className={styles.container} role="search">
      <div className={styles.inputWrapper}>
        <span className={styles.icon} aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          aria-label="Search help articles"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-results"
          autoComplete="off"
        />
        {query && (
          <button
            className={styles.clear}
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div id="search-results" className={styles.dropdown} role="listbox">
          {/* Empty state — show popular articles */}
          {showEmpty && (
            <>
              <p className={styles.dropdownLabel}>Popular articles</p>
              {popular.map((a, i) => (
                <button
                  key={a.objectID}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={`${styles.result} ${i === activeIndex ? styles.active : ""}`}
                  onClick={() => handleSelect(a.slug)}
                >
                  <span className={styles.resultTitle}>{a.title}</span>
                  <span className={styles.resultCategory}>{a.category}</span>
                </button>
              ))}
            </>
          )}

          {/* Search results */}
          {showResults && !noResults && (
            <>
              <p className={styles.dropdownLabel}>{results.length} result{results.length !== 1 ? "s" : ""}</p>
              {results.map((a, i) => (
                <button
                  key={a.objectID}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={`${styles.result} ${i === activeIndex ? styles.active : ""}`}
                  onClick={() => handleSelect(a.slug)}
                >
                  <span className={styles.resultTitle}>{highlight(a.title, query)}</span>
                  <span className={styles.resultCategory}>{a.category}</span>
                  <span className={styles.resultExcerpt}>{a.excerpt}</span>
                </button>
              ))}
            </>
          )}

          {/* No results */}
          {noResults && (
            <div className={styles.noResults}>
              <p>No results for <strong>"{query}"</strong></p>
              <a href="/support" className={styles.supportLink}>Contact support →</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Bold-highlight matching query text in a string. */
function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}
