import { redirect } from "../../_intl/intlNavigation";


export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

    redirect('/form?' + new URLSearchParams({ nextUrl: '/playground' }).toString());

    console.log('Code after redirect');

	return (
        <div style={{position: 'absolute', inset: 0 }}>
            <p>Hello</p>
        </div>
    )
};

