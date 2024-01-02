import styles from './page.module.css'
import MainLayout from '../../components/Layouts/MainLayout'
import MenuBar from '../../components/MenuBar/MenuBar'
import SlideBar from '../../components/SlideBar/SlideBar'
import Desk from '../../components/Desk/Desk'
import Canvas from '../../components/Desk/Canvas/Canvas'

export default function CreationPage() {

  const propsForMainLayout = {
    menuBar:  <MenuBar mode="animation"/>,
    content:  <Canvas/>,
    footer:   <SlideBar/>,
  }


  return (
    <main className={styles.main}>
      <MainLayout {...propsForMainLayout} />
    </main>
  )
}
