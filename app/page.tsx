import styles from './page.module.css'
import MainLayout from '@/components/layouts/MainLayout'

export default function Home() {

  const propsForMainLayout = {
    banner: {
      component: <div>banner</div>,
      collapsed: false,
    },
    navbar: {
      component: <div>navbarrrrrrr</div>,
      collapsed: false,
    },
    leftBar: {
      component: <div>Left</div>,
      collapsed: false,
    },
    content: {
      component: <div>content</div>,
      collapsed: false,
    },
    rightBar: {
      component: <div>rightBar</div>,
      collapsed: false,
    },
    footer: {
      component: <div>footer</div>,
      collapsed: false,
    },
  }


  return (
    <main className={styles.main}>
      <MainLayout {...propsForMainLayout} />
    </main>
  )
}
