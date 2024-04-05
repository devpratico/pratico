import Link from "next/link"

// TODO: Put all folders inside app directory (with private folders) https://nextjs.org/docs/app/building-your-application/routing/colocation
// Or use a src directory.

export default function HomePage() {
    return (
        <div style={{ backgroundColor: 'var(--secondary)', display:'flex', flexDirection:'column', alignItems:'center', height: '100dvh', justifyContent:'center'}}>
            <h1>👋</h1>
            <h1>Bonjour</h1>
            <p>Je suis la landing page de pratico. (Bientôt).</p>
            <Link href="/capsules">Capsules</Link>
        </div>
    )
}