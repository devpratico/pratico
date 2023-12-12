import styles from './page.module.css'
import MainLayout from '../components/Layouts/MainLayout'
import MenuBar from '../components/MenuBar/MenuBar'
import DocumentsView from '../components/Dashboard/Documents/DocumentsView'

export default function Home() {

  const propsForMainLayout = {
    menuBar:  <MenuBar mode="dashboard"/>,
    leftBar:  <div>Left</div>,
    content:  <DocumentsView/>
  }


  return (
    <main className={styles.main}>
      <MainLayout {...propsForMainLayout} />
    </main>
  )
}
