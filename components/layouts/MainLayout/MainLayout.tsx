import styles from "./MainLayout.module.css";


interface MainLayoutProps {
    banner?: React.ReactNode;
    menuBar?: React.ReactNode;
    leftBar?: React.ReactNode;
    content?: React.ReactNode;
    rightBar?: React.ReactNode;
    footer?: React.ReactNode;
};

/**
 * This component is a layout for the main page.
 * It is made of a grid with 6 areas.
 * @param props Objects containing the components to display in each area.
 */
export default function MainLayout({banner, menuBar, leftBar, content, rightBar, footer}: MainLayoutProps) {

    const layoutState = {
        bannerVisible: true,
        menuBarVisible: true,
        leftBarVisible: true,
        contentVisible: true,
        rightBarVisible: true,
        footerVisible: true,
    };

    const bannerStyle   = styles.banner   + (banner   && layoutState.bannerVisible   ? "" : " " + styles.collapsed);
    const menuBarStyle  = styles.menuBar  + (menuBar  && layoutState.menuBarVisible  ? "" : " " + styles.collapsed);
    const leftBarStyle  = styles.leftBar  + (leftBar  && layoutState.leftBarVisible  ? "" : " " + styles.collapsed);
    const contentStyle  = styles.content  + (content  && layoutState.contentVisible  ? "" : " " + styles.collapsed);
    const rightBarStyle = styles.rightBar + (rightBar && layoutState.rightBarVisible ? "" : " " + styles.collapsed);
    const footerStyle   = styles.footer   + (footer   && layoutState.footerVisible   ? "" : " " + styles.collapsed);

    return (
        <div className={styles.main}>

            <div className={bannerStyle}>{banner}</div>

            <div className={menuBarStyle}>{menuBar}</div>

            <div className={leftBarStyle}>
                <div className={styles.leftBarContent}>{leftBar}</div>
            </div>

            <div className={contentStyle}>{content}</div>

            <div className={rightBarStyle}>
                <div className={styles.rightBarContent}>{rightBar}</div>
            </div>

            <div className={footerStyle}>{footer}</div>
        </div>
    )
}