import styles from './page.module.css'
import MainLayout from '@/components/layouts/MainLayout'
import MenuBar from '@/components/MenuBar/MenuBar'

export default function Home() {

  const propsForMainLayout = {
    menuBar:  <MenuBar mode="animation"/>,
    content:  <div>Content</div>,
    rightBar: <div>Right Bar</div>
  }


  return (
    <main className={styles.main}>
      <MainLayout {...propsForMainLayout} />
    </main>
  )
}
