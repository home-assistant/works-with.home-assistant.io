import { deviceFiles } from "../lib/devices.js";

// Machine-readable copy of the certified device list, consumed by other
// Home Assistant properties.
export function GET() {
	return new Response(JSON.stringify(deviceFiles), {
		headers: { "Content-Type": "application/json" },
	});
}
