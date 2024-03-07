import styles from './layout.module.css'
import MainLayout from '../../../components/layouts/MainLayout/MainLayout'
import DashboardMenuBar from '@/components/menu-bars/DasboardMenuBar/DashboardMenuBar'
import DashboardLeftBar from '../../../components/dashboard/left-bar/DashboardLeftBar/DashboardLeftBar'


interface RootLayoutProps {
    children: React.ReactNode
}

export default async function DashboardLayout({children }: RootLayoutProps) {
    return (
        <div className={styles.container}>
            <MainLayout
                menuBar={<DashboardMenuBar/>}
                content={children}
                leftBar={<DashboardLeftBar/>}
            />
        </div>
    )
}