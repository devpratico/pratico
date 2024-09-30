export const formatDate = (date: string | undefined, language?: string, specify?: string) => {
	if (!date)
		return ;
	if (specify === "hour")
		return (new Date(date).toLocaleString(language ? language : 'fr-FR', { hour: '2-digit', minute: '2-digit', hour12: true }));
	return (new Date(date).toLocaleString(language ? language : 'fr-FR'));
  }


export const sanitizeUuid = (uuid: string | null | undefined) => {
	if (!uuid || !uuid.length)
		return ;
	const sanitizedUuid = uuid.replace(/[^a-fA-F0-9-]/g, '')
	return (sanitizedUuid);
}