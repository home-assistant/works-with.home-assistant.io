// Downloads the shared referrer allow list once per build (or dev start) and
// writes it to src/data/allowed-referrers.json, which PlausibleAnalytics.astro
// inlines into every page.
//
// Wired up as the prebuild/predev/prestart hooks in package.json so it runs
// exactly once, rather than being fetched per page render.
import { writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SOURCE_URL = "https://www.openhomefoundation.org/allowed-referrers.json";
const OUTPUT = fileURLToPath(
	new URL("../src/data/allowed-referrers.json", import.meta.url),
);

const write = (referrers) =>
	writeFile(OUTPUT, JSON.stringify(referrers, null, 2) + "\n");

async function main() {
	const response = await fetch(SOURCE_URL, {
		headers: { "User-Agent": "works-with.home-assistant.io-build" },
	});
	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	if (!Array.isArray(data) || !data.every((d) => typeof d === "string")) {
		throw new Error("payload is not an array of strings");
	}

	const referrers = data
		.map((d) => d.trim().toLowerCase().replace(/\.$/, ""))
		.filter((d) => d.length > 0);

	await write(referrers);
	console.log(`[allowed-referrers] wrote ${referrers.length} domains`);
}

// A failed fetch must never break the build: fall back to whatever copy is
// already on disk, and only seed an empty list if there is nothing at all
// (a fresh clone with no network) so the import in the component still resolves.
main().catch(async (error) => {
	console.warn(
		`[allowed-referrers] fetch failed, keeping existing file. ${error}`,
	);
	try {
		await access(OUTPUT);
	} catch {
		await write([]);
		console.warn("[allowed-referrers] no existing file, seeded an empty list");
	}
});
