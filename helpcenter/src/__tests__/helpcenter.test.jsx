/**
 * Help Center test suite
 *
 * Covers:
 *   1. "help wallet connect" search returns the wallet article
 *   2. All FAQ categories render correctly
 *   3. Article detail page loads correctly
 *   4. Empty search state shows popular articles
 *   5. No results state shows contact support fallback
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import HelpCenter from "../pages/HelpCenter";
import ArticleDetail from "../pages/ArticleDetail";
import SearchBox from "../components/SearchBox";
import { localSearch } from "../search/algolia";
import { getArticlesByCategory, getPopularArticles, CATEGORIES } from "../data/articles";

// ── Helper ────────────────────────────────────────────────────────────────────

function renderWithRouter(ui, { initialEntries = ["/"] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  );
}

// ── 1. Search: "help wallet connect" returns wallet article ───────────────────

describe("localSearch", () => {
  it('returns the wallet connection article for "help wallet connect"', () => {
    const results = localSearch("help wallet connect");
    expect(results.length).toBeGreaterThan(0);
    const slugs = results.map((r) => r.slug);
    expect(slugs).toContain("how-to-connect-your-wallet");
  });

  it('returns the wallet article for "connect wallet"', () => {
    const results = localSearch("connect wallet");
    const slugs = results.map((r) => r.slug);
    expect(slugs).toContain("how-to-connect-your-wallet");
  });

  it('returns the wallet article for "wallet"', () => {
    const results = localSearch("wallet");
    const slugs = results.map((r) => r.slug);
    expect(slugs).toContain("how-to-connect-your-wallet");
  });

  it("returns empty array for empty query", () => {
    expect(localSearch("")).toHaveLength(0);
    expect(localSearch("   ")).toHaveLength(0);
  });

  it("returns empty array for unmatched query", () => {
    const results = localSearch("xyzzy-no-match-12345");
    expect(results).toHaveLength(0);
  });

  it("each result has required fields", () => {
    const results = localSearch("wallet");
    results.forEach((r) => {
      expect(r).toHaveProperty("objectID");
      expect(r).toHaveProperty("title");
      expect(r).toHaveProperty("category");
      expect(r).toHaveProperty("slug");
      expect(r).toHaveProperty("excerpt");
    });
  });
});

// ── 2. All FAQ categories render correctly ────────────────────────────────────

describe("HelpCenter landing page", () => {
  it("renders all four category headings", () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<HelpCenter />} />
      </Routes>
    );
    CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });

  it("renders the search input", () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<HelpCenter />} />
      </Routes>
    );
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders articles under each category", () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<HelpCenter />} />
      </Routes>
    );
    const categories = getArticlesByCategory();
    categories.forEach(({ articles }) => {
      articles.slice(0, 4).forEach((a) => {
        expect(screen.getByText(a.title)).toBeInTheDocument();
      });
    });
  });

  it("renders the contact support section", () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<HelpCenter />} />
      </Routes>
    );
    expect(screen.getByText(/contact support/i)).toBeInTheDocument();
  });
});

// ── 3. Article detail page loads correctly ────────────────────────────────────

describe("ArticleDetail page", () => {
  it("renders the wallet article correctly", () => {
    renderWithRouter(
      <Routes>
        <Route path="/article/:slug" element={<ArticleDetail />} />
      </Routes>,
      { initialEntries: ["/article/how-to-connect-your-wallet"] }
    );
    expect(screen.getByText("How to connect your wallet")).toBeInTheDocument();
    expect(screen.getByText("Wallet & Connections")).toBeInTheDocument();
  });

  it("renders the article body content", () => {
    renderWithRouter(
      <Routes>
        <Route path="/article/:slug" element={<ArticleDetail />} />
      </Routes>,
      { initialEntries: ["/article/how-to-connect-your-wallet"] }
    );
    expect(screen.getByText(/Supported wallets/i)).toBeInTheDocument();
  });

  it("renders the feedback section", () => {
    renderWithRouter(
      <Routes>
        <Route path="/article/:slug" element={<ArticleDetail />} />
      </Routes>,
      { initialEntries: ["/article/how-to-connect-your-wallet"] }
    );
    expect(screen.getByText(/was this article helpful/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/yes, this article was helpful/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/no, this article was not helpful/i)).toBeInTheDocument();
  });

  it("shows thank you message after positive feedback", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/article/:slug" element={<ArticleDetail />} />
      </Routes>,
      { initialEntries: ["/article/how-to-connect-your-wallet"] }
    );
    await user.click(screen.getByLabelText(/yes, this article was helpful/i));
    expect(screen.getByText(/thanks for the feedback/i)).toBeInTheDocument();
  });

  it("shows contact support after negative feedback", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/article/:slug" element={<ArticleDetail />} />
      </Routes>,
      { initialEntries: ["/article/how-to-connect-your-wallet"] }
    );
    await user.click(screen.getByLabelText(/no, this article was not helpful/i));
    expect(screen.getByText(/contact support/i)).toBeInTheDocument();
  });

  it("renders breadcrumb navigation", () => {
    renderWithRouter(
      <Routes>
        <Route path="/article/:slug" element={<ArticleDetail />} />
      </Routes>,
      { initialEntries: ["/article/how-to-connect-your-wallet"] }
    );
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
  });
});

// ── 4. Empty search state shows popular articles ──────────────────────────────

describe("SearchBox — empty state", () => {
  it("shows popular articles when focused with empty query", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/" element={<SearchBox />} />
      </Routes>
    );
    const input = screen.getByRole("searchbox");
    await user.click(input);

    const popular = getPopularArticles();
    // At least one popular article should be visible
    expect(screen.getByText(popular[0].title)).toBeInTheDocument();
  });

  it("popular articles section is labelled", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/" element={<SearchBox />} />
      </Routes>
    );
    await user.click(screen.getByRole("searchbox"));
    expect(screen.getByText(/popular articles/i)).toBeInTheDocument();
  });
});

// ── 5. No results state shows contact support fallback ────────────────────────

describe("SearchBox — no results state", () => {
  it("shows contact support when no results found", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/" element={<SearchBox />} />
      </Routes>
    );
    const input = screen.getByRole("searchbox");
    await user.type(input, "xyzzy-no-match-12345");

    await waitFor(() => {
      expect(screen.getByText(/no results for/i)).toBeInTheDocument();
      expect(screen.getByText(/contact support/i)).toBeInTheDocument();
    });
  });
});

// ── 6. Article data integrity ─────────────────────────────────────────────────

describe("Article data", () => {
  it("wallet connection article exists with required fields", () => {
    const results = localSearch("connect wallet");
    const wallet = results.find((r) => r.slug === "how-to-connect-your-wallet");
    expect(wallet).toBeDefined();
    expect(wallet.title).toBe("How to connect your wallet");
    expect(wallet.category).toBe("Wallet & Connections");
  });

  it("all articles have required fields", () => {
    const { articles } = require("../data/articles");
    articles.forEach((a) => {
      expect(a.objectID).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.category).toBeTruthy();
      expect(a.slug).toBeTruthy();
      expect(a.excerpt).toBeTruthy();
      expect(Array.isArray(a.keywords)).toBe(true);
      expect(a.body).toBeTruthy();
    });
  });

  it("all categories have at least one article", () => {
    const categories = getArticlesByCategory();
    categories.forEach(({ category, articles }) => {
      expect(articles.length).toBeGreaterThan(0);
    });
  });
});
