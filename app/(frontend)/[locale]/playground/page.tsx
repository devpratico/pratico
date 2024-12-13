"use client";

export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const userLocale = typeof navigator !== 'undefined' ? navigator.language : 'fr-FR';

	const now = new Date();
	const usDate = new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/New_York',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).format(now);

	const userFormatter = new Intl.DateTimeFormat(userLocale, {
		timeZone: userTimeZone,
		dateStyle: 'long',
		timeStyle: 'long',
	});

	const formattedUserDate = userFormatter.format(now);

	return (
		<div style={{position: 'absolute', inset: 0 }}>
			<p>
				Hello
			</p>
			<p>
				{usDate} - {userTimeZone} - {userLocale} -  {formattedUserDate}
			</p>
		</div>
	)
};

