export default function AdminInfo() {

    const style: React.CSSProperties = {
        position: 'fixed',
        bottom: 0,
        right: 0,
        padding: '1rem',
        fontSize: '0.7rem',
    }

    /*
    return(
        <div style={style}>
            <p>{"NEXT_PUBLIC_SUPABASE_URL: "}
                <code>{process.env.NEXT_PUBLIC_SUPABASE_URL}</code>
            </p>
            <p>{"NEXT_PUBLIC_SUPABASE_ANON_KEY: "}
                <code>{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0,10)}</code>
            </p>
        </div>
    )*/

    return <code style={style}>{process.env.NEXT_PUBLIC_SUPABASE_URL}</code>
}