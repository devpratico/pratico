export const formatDate = (date: string | undefined, language?: string) => {
	if (!date)
		return ;
	return (new Date(date).toLocaleString(language ? language : 'fr-FR'));
  }


export const sanitizeUuid = (uuid: string) => {
	if (!uuid || !uuid.length)
		return ;
	const sanitizedUuid = uuid.replace(/[^a-fA-F0-9-]/g, '')
	return (sanitizedUuid);
}