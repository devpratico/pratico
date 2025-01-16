import { random } from "lodash";

export const sanitizeUuid = (uuid: string | null | undefined) => {
	if (!uuid || !uuid.length)
		return ;
	const sanitizedUuid = uuid.replace(/[^a-fA-F0-9-]/g, '')
	return (sanitizedUuid);
}

export function uniqueTimestampId(prefix: string): string {
    return prefix + Date.now().toString() + '-' + random(1000, 9999).toString();
}