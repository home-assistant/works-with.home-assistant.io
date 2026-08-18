// Filter option values are stored in slug form (lowercase, non-alphanumeric
// runs collapsed to a hyphen) so URLs and option values stay clean. Display
// text keeps the original casing.
//
// Shared by the pre-rendered markup and the client-side devices table so both
// sides agree on what a brand/protocol/region slug looks like.
export const slugify = (value) =>
	(value || "")
		.toString()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
