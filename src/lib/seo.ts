/**
 * Generates JSON-LD BreadcrumbList schema for SEO.
 * Usage: pass an array of { name, path } objects.
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://vitasignal.ai${item.path}`,
    })),
  };
}

/**
 * Common breadcrumb sets for reuse across pages.
 */
export const BREADCRUMBS = {
  solutions: (name: string, path: string) => [
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/for-leaders" },
    { name, path },
  ],
  blog: (title: string, slug: string) => [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: title, path: `/blog/${slug}` },
  ],
  legal: (name: string, path: string) => [
    { name: "Home", path: "/" },
    { name, path },
  ],
  company: (name: string, path: string) => [
    { name: "Home", path: "/" },
    { name, path },
  ],
};
