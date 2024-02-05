import styles from './page.module.css'
import MainLayout from '../components/layouts/MainLayout/MainLayout'
import MenuBar from '../components/menu-bar/MenuBar/MenuBar'
import DocumentsView from '../components/dashboard/DocumentsView/DocumentsView'
import DashboardLeftBar from '../components/dashboard/DashboardLeftBar/DashboardLeftBar'


export default function Dashboard() {

  const propsForMainLayout = {
    menuBar:  <MenuBar mode="dashboard"/>,
    content:  <DocumentsView/>,
    leftBar:  <DashboardLeftBar/>,
  }

  return (
    <main className={styles.main}>
      <MainLayout {...propsForMainLayout} />
    </main>
  )
}
