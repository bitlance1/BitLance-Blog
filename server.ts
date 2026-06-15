import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Ensure db.json exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({
      articles: [],
      categories: [
        { id: "c1", name: "Bitcoin", slug: "bitcoin" },
        { id: "c2", name: "Lightning Network", slug: "lightning-network" },
        { id: "c3", name: "Freelancing", slug: "freelancing" },
      ],
      tags: [],
      users: [
        {
          id: "admin-1",
          role: "admin",
          name: "Admin",
          avatar: "https://i.pravatar.cc/150?u=admin",
        },
        {
          id: "pub-1",
          role: "publisher",
          name: "Publisher",
          avatar: "https://i.pravatar.cc/150?u=pub",
        },
      ],
    }),
  );
}

function getDb() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}

function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Seed articles if empty
const dbData = getDb();
if (dbData.articles.length === 0) {
  dbData.articles = [
    {
      id: "a_1",
      title: "10 Best Niches for Bitcoin Freelancers in 2026",
      featured_image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c3",
      status: "published",
      content:
        "<p>Freelancing in the Bitcoin space is growing rapidly...</p><h2>1. Lightning Network Integration</h2><p>Lots of details here</p><h3>Understanding LND</h3><p>More details...</p><h2>2. Smart Contract Development</h2><p>Working with Bitcoin scripts.</p>",
      published_at: new Date(Date.now() - 100000000).toISOString(),
      updated_at: new Date(Date.now() - 100000000).toISOString(),
    },
    {
      id: "a_2",
      title: "How to Calculate Your Hourly Rate in Sats",
      featured_image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2672&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c3",
      status: "published",
      content:
        "<p>Pricing yourself in Sats is challenging but rewarding...</p>",
      published_at: new Date(Date.now() - 150000000).toISOString(),
      updated_at: new Date(Date.now() - 150000000).toISOString(),
    },
    {
      id: "a_3",
      title: "Understanding Lightning Invoices vs On-chain Transactions",
      featured_image:
        "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2669&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c2",
      status: "published",
      content: "<p>A deep dive into the two payment layers of Bitcoin...</p>",
      published_at: new Date(Date.now() - 200000000).toISOString(),
      updated_at: new Date(Date.now() - 200000000).toISOString(),
    },
    {
      id: "a_4",
      title: "Building a Portfolio That Bitcoin Companies Love",
      featured_image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
      author_id: "admin-1",
      category_id: "c3",
      status: "published",
      content: "<p>Here is how to structure your portfolio...</p>",
      published_at: new Date(Date.now() - 250000000).toISOString(),
      updated_at: new Date(Date.now() - 250000000).toISOString(),
    },
    {
      id: "a_5",
      title: "Taxes and Compliance for Crypto Freelancers",
      featured_image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=2670&auto=format&fit=crop",
      author_id: "admin-1",
      category_id: "c1",
      status: "published",
      content: "<p>Keep out of trouble with this quick guide...</p>",
      published_at: new Date(Date.now() - 300000000).toISOString(),
      updated_at: new Date(Date.now() - 300000000).toISOString(),
    },
    {
      id: "a_6",
      title: "Cold Email Templates for Bitcoin Clients",
      featured_image:
        "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=2574&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c3",
      status: "published",
      content: "<p>These templates actually get replies from founders...</p>",
      published_at: new Date(Date.now() - 350000000).toISOString(),
      updated_at: new Date(Date.now() - 350000000).toISOString(),
    },
    {
      id: "a_7",
      title: "Self-Custody Basics for Digital Nomads",
      featured_image:
        "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c1",
      status: "published",
      content: "<p>How to travel safely with your digital wealth...</p>",
      published_at: new Date(Date.now() - 400000000).toISOString(),
      updated_at: new Date(Date.now() - 400000000).toISOString(),
    },
    {
      id: "a_8",
      title: "Setting Up Your First Multi-Sig Escrow Contract",
      featured_image:
        "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=2670&auto=format&fit=crop",
      author_id: "admin-1",
      category_id: "c2",
      status: "published",
      content: "<p>Step by step guide to secure freelancing on Bitcoin...</p>",
      published_at: new Date(Date.now() - 450000000).toISOString(),
      updated_at: new Date(Date.now() - 450000000).toISOString(),
    },
  ];
  saveDb(dbData);
}

async function startServer() {
  const app = express();

  // Increase payload limit for base64 image uploads in tiptap
  app.use(express.json({ limit: "50mb" }));

  // API Routes

  // 1. Articles
  app.get("/api/articles", (req, res) => {
    const db = getDb();
    let articles = db.articles;
    // Filtering (Admin sees all, readers see published)
    if (req.query.status) {
      articles = articles.filter((a: any) => a.status === req.query.status);
    }
    res.json(articles);
  });

  app.get("/api/articles/:slug", (req, res) => {
    const db = getDb();
    const article = db.articles.find(
      (a: any) => a.slug === req.params.slug || a.id === req.params.slug,
    );
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  });

  app.post("/api/articles", (req, res) => {
    const db = getDb();
    const article = {
      ...req.body,
      id: "a_" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
    };
    db.articles.push(article);
    saveDb(db);
    res.json(article);
  });

  app.put("/api/articles/:id", (req, res) => {
    const db = getDb();
    let articleIndex = db.articles.findIndex(
      (a: any) => a.id === req.params.id,
    );
    if (articleIndex === -1)
      return res.status(404).json({ error: "Not found" });

    db.articles[articleIndex] = {
      ...db.articles[articleIndex],
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    saveDb(db);
    res.json(db.articles[articleIndex]);
  });

  app.delete("/api/articles/:id", (req, res) => {
    const db = getDb();
    db.articles = db.articles.filter((a: any) => a.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 2. Categories
  app.get("/api/categories", (req, res) => {
    res.json(getDb().categories);
  });

  app.post("/api/categories", (req, res) => {
    const db = getDb();
    const newCategory = {
      ...req.body,
      id: "c_" + Date.now(),
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    db.categories.push(newCategory);
    saveDb(db);
    res.json(newCategory);
  });

  app.delete("/api/categories/:id", (req, res) => {
    const db = getDb();
    db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 3. Users
  app.get("/api/users", (req, res) => {
    res.json(getDb().users);
  });

  app.post("/api/users", (req, res) => {
    const db = getDb();
    const newUser = {
      ...req.body,
      id: "u_" + Date.now(),
      avatar: req.body.avatar || "https://i.pravatar.cc/150?u=" + Date.now(),
    };
    db.users.push(newUser);
    saveDb(db);
    res.json(newUser);
  });

  app.delete("/api/users/:id", (req, res) => {
    const db = getDb();
    db.users = db.users.filter((u: any) => u.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 4. Bookmarks
  app.get("/api/bookmarks", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const bookmarks = db.bookmarks || [];
    const userBookmarks = bookmarks.filter((b: any) => b.user_id === userId);

    // Join with articles and sort by newest bookmark first (mocking this by reversing array)
    const populated = userBookmarks
      .map((b: any) => {
        const article = db.articles.find((a: any) => a.id === b.article_id);
        return { ...article, bookmarked_at: b.created_at };
      })
      .filter((a: any) => a.id)
      .reverse();

    res.json(populated);
  });

  app.post("/api/bookmarks", (req, res) => {
    const db = getDb();
    if (!db.bookmarks) db.bookmarks = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const articleId = req.body.article_id;

    const existing = db.bookmarks.find(
      (b: any) => b.user_id === userId && b.article_id === articleId,
    );
    if (!existing) {
      db.bookmarks.push({
        user_id: userId,
        article_id: articleId,
        created_at: new Date().toISOString(),
      });
      saveDb(db);
    }
    res.json({ success: true });
  });

  app.delete("/api/bookmarks/:articleId", (req, res) => {
    const db = getDb();
    if (!db.bookmarks) db.bookmarks = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const articleId = req.params.articleId;

    db.bookmarks = db.bookmarks.filter(
      (b: any) => !(b.user_id === userId && b.article_id === articleId),
    );
    saveDb(db);
    res.json({ success: true });
  });

  app.get("/api/bookmarks/check/:articleId", (req, res) => {
    const db = getDb();
    const bookmarks = db.bookmarks || [];
    const userId = req.headers["x-user-id"] || "user_1";
    const existing = bookmarks.find(
      (b: any) => b.user_id === userId && b.article_id === req.params.articleId,
    );
    res.json({ isBookmarked: !!existing });
  });

  // 5. Follows
  app.get("/api/follows", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const follows = db.follows || [];

    // Get list of followed authors with their details
    const userFollows = follows
      .filter((f: any) => f.follower_id === userId)
      .map((f: any) => {
        const author = db.users.find((u: any) => u.id === f.author_id);
        return { ...author, followed_at: f.created_at };
      })
      .filter((a: any) => a.id);

    res.json(userFollows);
  });

  app.get("/api/follows/feed", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const follows = db.follows || [];

    // Get list of followed author IDs
    const followedAuthorIds = follows
      .filter((f: any) => f.follower_id === userId)
      .map((f: any) => f.author_id);

    // Fetch articles by followed authors
    const feedArticles = db.articles
      .filter(
        (a: any) =>
          followedAuthorIds.includes(a.author_id) && a.status === "published",
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.published_at || b.created_at).getTime() -
          new Date(a.published_at || a.created_at).getTime(),
      );

    res.json(feedArticles);
  });

  app.post("/api/follows", (req, res) => {
    const db = getDb();
    if (!db.follows) db.follows = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const authorId = req.body.author_id;

    const existing = db.follows.find(
      (f: any) => f.follower_id === userId && f.author_id === authorId,
    );
    if (!existing) {
      db.follows.push({
        follower_id: userId,
        author_id: authorId,
        created_at: new Date().toISOString(),
      });
      saveDb(db);
    }
    res.json({ success: true });
  });

  app.delete("/api/follows/:authorId", (req, res) => {
    const db = getDb();
    if (!db.follows) db.follows = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const authorId = req.params.authorId;

    db.follows = db.follows.filter(
      (f: any) => !(f.follower_id === userId && f.author_id === authorId),
    );
    saveDb(db);
    res.json({ success: true });
  });

  app.get("/api/follows/check/:authorId", (req, res) => {
    const db = getDb();
    const follows = db.follows || [];
    const userId = req.headers["x-user-id"] || "user_1";
    const existing = follows.find(
      (f: any) =>
        f.follower_id === userId && f.author_id === req.params.authorId,
    );
    res.json({ isFollowed: !!existing });
  });

  app.get("/api/users/:id/stats", (req, res) => {
    const db = getDb();
    const authorId = req.params.id;
    const articles = db.articles || [];
    const follows = db.follows || [];

    const totalArticles = articles.filter(
      (a: any) => a.author_id === authorId && a.status === "published",
    ).length;
    const followerCount = follows.filter(
      (f: any) => f.author_id === authorId,
    ).length;

    res.json({ totalArticles, followerCount });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
