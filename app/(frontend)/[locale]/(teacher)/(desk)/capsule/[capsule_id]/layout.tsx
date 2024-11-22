import { ActivityCreationStoreProvider } from "./store"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ActivityCreationStoreProvider>
            {children}
        </ActivityCreationStoreProvider>
    )
}