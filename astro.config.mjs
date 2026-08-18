// @ts-check
import { defineConfig } from "astro/config";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
	site: "https://works-with.home-assistant.io/",

	// Netlify is configured (in its UI, not in-repo) to run `npm run build` and
	// publish `dist`. Stated explicitly because it is deploy-critical, even
	// though it matches Astro's default.
	outDir: "./dist",

	// `/certified-products/` and friends keep their trailing slash.
	build: {
		format: "directory",
	},

	// Astro 7 defaults to `"jsx"`, which drops the whitespace between adjacent
	// inline elements ("in the<a>blog</a>"). This markup relies on HTML
	// whitespace rules, so keep collapsing rather than stripping.
	compressHTML: true,

	// `host: true` binds 0.0.0.0 instead of Astro's default localhost-only,
	// which is required for the devcontainer's port forwarding to reach the
	// server. Port stays at Astro's default (4321), matched in
	// .devcontainer.json.
	server: {
		host: true,
	},
});
