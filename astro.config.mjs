// @ts-check
import { defineConfig } from "astro/config";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
	site: "https://works-with.home-assistant.io/",

	// Netlify is configured (in its UI, not in-repo) to run `npm run build` and
	// publish `_site`, so the build has to keep landing there.
	outDir: "./_site",

	// `/certified-products/` and friends keep their trailing slash.
	build: {
		format: "directory",
	},

	// Astro 7 defaults to `"jsx"`, which drops the whitespace between adjacent
	// inline elements ("in the<a>blog</a>"). This markup relies on HTML
	// whitespace rules, so keep collapsing rather than stripping.
	compressHTML: true,

	// Matches the port forwarded by .devcontainer.json.
	server: {
		port: 8080,
	},
});
