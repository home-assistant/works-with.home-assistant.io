const modules = import.meta.glob("../data/devices/*.json", { eager: true });

/**
 * Every manufacturer file in `src/data/devices/`, ordered by filename so the
 * table and `devices.json` stay stable between builds.
 *
 * @type {Array<{
 *   companyName: string,
 *   brand: string,
 *   devices: Array<Record<string, any>>,
 * }>}
 */
export const deviceFiles = Object.keys(modules)
	.sort()
	.map((path) => modules[path].default);

/** Normalizes a field that may be a single value or a list into a list. */
export const toList = (value) => {
	if (Array.isArray(value)) return value;
	if (value === undefined || value === null || value === "") return [];
	return [value];
};
