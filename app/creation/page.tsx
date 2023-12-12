import styles from './page.module.css'
import MainLayout from '../../components/Layoutss/MainLayout'
import MenuBar from '../../components/MenuBar/MenuBar'
import SlideBar from '../../components/SlideBar/SlideBar'
import Desk from '../../components/Desk/Desk'

export default function CreationPage() {

  const propsForMainLayout = {
    menuBar:  <MenuBar mode="animation"/>,
    content:  <Desk/>,
    footer:   <SlideBar/>,
  }


  return (
    <main className={styles.main}>
      <MainLayout {...propsForMainLayout} />
    </main>
  )
}
