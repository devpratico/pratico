/**
 * 
 * @param date the date to format
 * @param language "fr-FR" or "en-US" or any other language or undefined
 * @param specify "date" or "time" or undefined
 * @param file if true, the date will be formatted for a filename
 * @returns 
 */
export const formatDate = (date: string | undefined, language?: string, specify?: string, file?: boolean) => {
	if (!date)
		return ;
	let formattedDate = null;
	const formatter = new Intl.DateTimeFormat(language, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	  });
	const parts = formatter.formatToParts(new Date(date));
	const day = parts.find(part => part.type === 'day')?.value;
	const month = parts.find(part => part.type === 'month')?.value;
	const year = parts.find(part => part.type === 'year')?.value;
	const hour = parts.find(part => part.type === 'hour')?.value;
	const minute = parts.find(part => part.type === 'minute')?.value;
	const second = parts.find(part => part.type === 'second')?.value;
	formattedDate = `${day}/${month}/${year} ${hour}:${minute}:${second}`;

	switch (specify)
	{
		case "date":
			formattedDate = (`${day}/${month}/${year}`);
			break ;
		case "time":
			formattedDate = (`${hour}:${minute}:${second}`);
			break ;
	}
	if (file)
		formattedDate = `${day}${month}${year}_${hour}-${minute}`;
	return (formattedDate);
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