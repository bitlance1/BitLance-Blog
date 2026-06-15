import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  articleBody?: string;
}

export function SEO({
  title = "Bitlance - Remote Work & Bitcoin Freelancing",
  description = "Guides, tutorials, industry insights, freelancing tips, and Bitcoin career resources.",
  image = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
  url = "https://bitlance.com",
  type = "website",
  publishedTime,
  modifiedTime,
  authorName = "Bitlance Team",
  articleBody
}: SEOProps) {
  
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://bitlance.com",
    "name": "Bitlance",
    "description": "Guides, tutorials, industry insights, freelancing tips, and Bitcoin career resources.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bitlance.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const articleSchema = type === "article" ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": title,
    "description": description,
    "image": [image],
    "datePublished": publishedTime || new Date().toISOString(),
    "dateModified": modifiedTime || publishedTime || new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": authorName,
      "url": `https://bitlance.com/author/${authorName.replace(/\s+/g, '-').toLowerCase()}`
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Bitlance",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bitlance.com/logo.png"
      }
    },
    ...(articleBody ? { "articleBody": articleBody } : {})
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && authorName && (
        <meta property="article:author" content={authorName} />
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>
      
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
}
