/**
 * Help Center landing page.
 * Shows a prominent search bar and articles grouped by category.
 */
import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import { getArticlesByCategory } from "../data/articles";
import styles from "./HelpCenter.module.css";

const CATEGORY_ICONS = {
  "Wallet & Connections": "🔗",
  "Transactions": "💸",
  "Account & Security": "🔒",
  "Getting Started": "🚀",
};

export default function HelpCenter() {
  const categories = getArticlesByCategory();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>How can we help you?</h1>
        <p className={styles.heroSubtitle}>
          Search our help center or browse articles by category.
        </p>
        <SearchBox placeholder="Search for help… e.g. 'connect wallet'" autoFocus />
      </header>

      {/* Categories */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {categories.map(({ category, articles }) => (
            <section key={category} className={styles.card} aria-labelledby={`cat-${category}`}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} aria-hidden="true">
                  {CATEGORY_ICONS[category] ?? "📄"}
                </span>
                <h2 id={`cat-${category}`} className={styles.cardTitle}>{category}</h2>
              </div>

              <ul className={styles.articleList}>
                {articles.slice(0, 4).map((a) => (
                  <li key={a.slug}>
                    <Link to={`/article/${a.slug}`} className={styles.articleLink}>
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>

              {articles.length > 4 && (
                <Link
                  to={`/category/${encodeURIComponent(category)}`}
                  className={styles.viewAll}
                  aria-label={`View all ${category} articles`}
                >
                  View all {articles.length} articles →
                </Link>
              )}
            </section>
          ))}
        </div>

        {/* Contact support footer */}
        <div className={styles.support}>
          <p>Can't find what you're looking for?</p>
          <a href="/support" className={styles.supportBtn}>Contact Support</a>
        </div>
      </main>
    </div>
  );
}
