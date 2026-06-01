/**
 * Article detail page — full article view with feedback and related articles.
 */
import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import SearchBox from "../components/SearchBox";
import { getArticleBySlug, getRelatedArticles } from "../data/articles";
import styles from "./ArticleDetail.module.css";

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);
  const [feedback, setFeedback] = useState(null); // null | "yes" | "no"

  if (!article) return <Navigate to="/404" replace />;

  const related = getRelatedArticles(slug);

  return (
    <div className={styles.page}>
      {/* Top nav */}
      <nav className={styles.topNav} aria-label="Site navigation">
        <Link to="/" className={styles.homeLink}>← Help Center</Link>
        <div className={styles.navSearch}>
          <SearchBox placeholder="Search…" />
        </div>
      </nav>

      <div className={styles.layout}>
        <main className={styles.article} aria-labelledby="article-title">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link to="/">Help Center</Link>
            <span aria-hidden="true"> / </span>
            <Link to={`/category/${encodeURIComponent(article.category)}`}>
              {article.category}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{article.title}</span>
          </nav>

          {/* Article header */}
          <header className={styles.header}>
            <span className={styles.categoryBadge}>{article.category}</span>
            <h1 id="article-title" className={styles.title}>{article.title}</h1>
            <p className={styles.excerpt}>{article.excerpt}</p>
          </header>

          {/* Article body */}
          <div className={styles.body}>
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>

          {/* Feedback */}
          <div className={styles.feedback} aria-label="Article feedback">
            <p className={styles.feedbackQuestion}>Was this article helpful?</p>
            {feedback === null ? (
              <div className={styles.feedbackButtons}>
                <button
                  className={`${styles.feedbackBtn} ${styles.yes}`}
                  onClick={() => setFeedback("yes")}
                  aria-label="Yes, this article was helpful"
                >
                  👍 Yes
                </button>
                <button
                  className={`${styles.feedbackBtn} ${styles.no}`}
                  onClick={() => setFeedback("no")}
                  aria-label="No, this article was not helpful"
                >
                  👎 No
                </button>
              </div>
            ) : feedback === "yes" ? (
              <p className={styles.feedbackThanks}>Thanks for the feedback! 🎉</p>
            ) : (
              <p className={styles.feedbackThanks}>
                Sorry to hear that.{" "}
                <a href="/support" className={styles.supportLink}>Contact support →</a>
              </p>
            )}
          </div>
        </main>

        {/* Related articles sidebar */}
        {related.length > 0 && (
          <aside className={styles.sidebar} aria-label="Related articles">
            <h2 className={styles.sidebarTitle}>Related articles</h2>
            <ul className={styles.relatedList}>
              {related.map((a) => (
                <li key={a.slug}>
                  <Link to={`/article/${a.slug}`} className={styles.relatedLink}>
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
