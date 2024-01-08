import styles from './page.module.css'
import MainLayout from '../../components/layouts/MainLayout/MainLayout'
import MenuBar from '../../components/menu-bar/MenuBar/MenuBar'
import SlideBar from '../../components/slide-bar/SlideBar/SlideBar'
import Desk from '../../components/desk/Desk/Desk'
import Canvas from '../../components/desk/canvas/Canvas/Canvas'

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
