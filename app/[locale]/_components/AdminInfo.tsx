export default function AdminInfo() {

    const style: React.CSSProperties = {
        position: 'fixed',
        bottom: 0,
        right: 0,
        padding: '1rem',
    }

    return(
        <div style={style}>
            <p>{"NEXT_PUBLIC_SUPABASE_URL: "}
                <code>{process.env.NEXT_PUBLIC_SUPABASE_URL}</code>
            </p>
            <p>{"NEXT_PUBLIC_SUPABASE_ANON_KEY: "}
                <code>{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0,10)}</code>
            </p>
        </div>
    )
}