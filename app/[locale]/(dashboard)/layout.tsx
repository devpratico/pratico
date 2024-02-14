import styles from './layout.module.css'
import MainLayout from '../../../components/layouts/MainLayout/MainLayout'
import MenuBar from '../../../components/menu-bar/MenuBar/MenuBar'
import DashboardLeftBar from '../../../components/dashboard/left-bar/DashboardLeftBar/DashboardLeftBar'


interface RootLayoutProps {
    children: React.ReactNode
}

export default async function DashboardLayout({children }: RootLayoutProps) {
    return (
        <div className={styles.container}>
            <MainLayout
                menuBar={<MenuBar mode="dashboard"/>}
                content={children}
                leftBar={<DashboardLeftBar/>}
            />
        </div>
    )
}