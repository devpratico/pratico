export const formatDate = (date: string | undefined, language?: string, specify?: string) => {
	if (!date)
		return ;
	let formatedDate = null;
	switch (specify)
	{
		case "hour":
			formatedDate = new Date(date).toLocaleString(language ? language : 'fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
			break ;
		case "date":
			formatedDate = new Date(date).toLocaleString(language ? language : 'fr-FR', { day: '2-digit', month: '2-digit', year: "numeric" });
			break ;
		default:
			formatedDate = new Date(date).toLocaleString(language ? language : 'fr-FR');
	}
	return (formatedDate);
  }


export const sanitizeUuid = (uuid: string | null | undefined) => {
	if (!uuid || !uuid.length)
		return ;
	const sanitizedUuid = uuid.replace(/[^a-fA-F0-9-]/g, '')
	return (sanitizedUuid);
}

export function uniqueTimestampId(prefix: string): string {
    return prefix + Date.now().toString()
}