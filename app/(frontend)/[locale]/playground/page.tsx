'use client';

export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

	return (
        <div style={{position: 'absolute', inset: 0 }}>
        </div>
    )
};

