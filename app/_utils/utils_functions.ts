export const formatDate = (date: string | undefined, language?: string, specify?: string) => {
	if (!date)
		return ;
	let formatedDate = null;
	const formatter = new Intl.DateTimeFormat('fr-FR', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	  });
	formatedDate = formatter.format(new Date(date)).split(" ").join("-");
	return (formatedDate);
  }


export const sanitizeUuid = (uuid: string | null | undefined) => {
	if (!uuid || !uuid.length)
		return ;
	const sanitizedUuid = uuid.replace(/[^a-fA-F0-9-]/g, '')
	return (sanitizedUuid);
}