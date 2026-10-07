// Pages that should not show up in the sitemap.
const EXCLUDED = new Set([
	"./404.astro",
	"./resources/badge-and-brand-guidelines.astro",
]);

const pageToRoute = (path) => {
	const route = path.replace(/^\.\//, "").replace(/\.astro$/, "");
	return route === "index" ? "/" : `/${route}/`;
};

export function GET({ site }) {
	const lastmod = new Date().toISOString().slice(0, 10);

	const routes = Object.keys(import.meta.glob("./**/*.astro"))
		.filter((path) => !EXCLUDED.has(path))
		.map(pageToRoute)
		.sort();

	const urls = routes
		.map(
			(route) => `	<url>
		<loc>${new URL(route, site).href}</loc>
		<lastmod>${lastmod}</lastmod>
	</url>`,
		)
		.join("\n");

	return new Response(
		`<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
		{ headers: { "Content-Type": "application/xml" } },
	);
}
