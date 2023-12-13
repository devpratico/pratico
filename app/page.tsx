import styles from './page.module.css'
import '@fortawesome/fontawesome-svg-core/styles.css' // import Font Awesome CSS to fix icon bug
import MainLayout from '../components/Layouts/MainLayout'
import MenuBar from '../components/MenuBar/MenuBar'
import DocumentsView from '../components/Dashboard/DocumentsView/DocumentsView'
import DashboardLeftBar from '../components/Dashboard/DashboardLeftBar/DashboardLeftBar'

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
