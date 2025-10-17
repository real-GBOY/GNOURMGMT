/** @format */

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The string to validate
 * @returns true if valid, false otherwise
 */
export const isValidObjectId = (id: string): boolean => {
	if (!id || typeof id !== "string") {
		return false;
	}

	// MongoDB ObjectId must be exactly 24 characters
	if (id.length !== 24) {
		return false;
	}

	// MongoDB ObjectId must be a valid hex string
	const hexRegex = /^[0-9a-fA-F]{24}$/;
	return hexRegex.test(id);
};

/**
 * Safely extracts an ID from an object, trying multiple possible field names
 * @param obj - The object to extract ID from
 * @returns The ID if found and valid, null otherwise
 */
export const extractObjectId = (obj: any): string | null => {
	if (!obj) {
		console.warn("extractObjectId: Object is null or undefined");
		return null;
	}

	console.log("extractObjectId: Checking object:", obj);
	console.log("extractObjectId: Object keys:", Object.keys(obj));

	// Try _id first (MongoDB standard)
	if (obj._id) {
		console.log(
			"extractObjectId: Found _id:",
			obj._id,
			"Type:",
			typeof obj._id
		);
		if (isValidObjectId(obj._id)) {
			console.log("extractObjectId: _id is valid ObjectId");
			return obj._id;
		} else {
			console.warn("extractObjectId: _id is not a valid ObjectId:", obj._id);
		}
	}

	// Try id (alternative field name)
	if (obj.id) {
		console.log("extractObjectId: Found id:", obj.id, "Type:", typeof obj.id);
		if (isValidObjectId(obj.id)) {
			console.log("extractObjectId: id is valid ObjectId");
			return obj.id;
		} else {
			console.warn("extractObjectId: id is not a valid ObjectId:", obj.id);
		}
	}

	// Try other common variations
	const possibleFields = ["_id", "id", "Id", "ID"];
	for (const field of possibleFields) {
		if (obj[field]) {
			console.log(
				`extractObjectId: Found ${field}:`,
				obj[field],
				"Type:",
				typeof obj[field]
			);
			if (isValidObjectId(obj[field])) {
				console.log(`extractObjectId: ${field} is valid ObjectId`);
				return obj[field];
			} else {
				console.warn(
					`extractObjectId: ${field} is not a valid ObjectId:`,
					obj[field]
				);
			}
		}
	}

	console.warn("extractObjectId: No valid ObjectId found in object");
	return null;
};
