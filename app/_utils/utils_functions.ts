
export const sanitizeUuid = (uuid: string | null | undefined) => {
	if (!uuid || !uuid.length)
		return ;
	const sanitizedUuid = uuid.replace(/[^a-fA-F0-9-]/g, '')
	return (sanitizedUuid);
}