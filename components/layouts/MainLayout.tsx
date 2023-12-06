import styles from "./MainLayout.module.css";

interface ComponentProp {
    component: React.ReactElement;
    collapsed?: boolean;
};

interface MainLayoutProps {
    banner?: ComponentProp;
    navbar?: ComponentProp;
    leftBar?: ComponentProp;
    content?: ComponentProp;
    rightBar?: ComponentProp;
    footer?: ComponentProp;
};

/**
 * This component is a layout for the main page.
 * It is made of a grid with 6 areas.
 * @param props Objects containing the components to display in each area.
 */
export default function MainLayout({banner, navbar, leftBar, content, rightBar, footer}: MainLayoutProps) {

    const bannerComponent =   banner?.component;
    const navbarComponent =   navbar?.component;
    const leftBarComponent =  leftBar?.component;
    const contentComponent =  content?.component;
    const rightBarComponent = rightBar?.component;
    const footerComponent =   footer?.component;

    const bannerStyle =   styles.banner +   (shouldCollapse(banner) ?   " " + styles.collapsed : "");
    const navbarStyle =   styles.navBar +   (shouldCollapse(navbar) ?   " " + styles.collapsed : "");
    const leftBarStyle =  styles.leftBar +  (shouldCollapse(leftBar) ?  " " + styles.collapsed : "");
    const contentStyle =  styles.content +  (shouldCollapse(content) ?  " " + styles.collapsed : "");
    const rightBarStyle = styles.rightBar + (shouldCollapse(rightBar) ? " " + styles.collapsed : "");
    const footerStyle =   styles.footer +   (shouldCollapse(footer) ?   " " + styles.collapsed : "");

    /**
     * This function checks if the props element should be collapsed.
     * It is needed because the `collapsed` property is optional (and undefined would mean `false`)
     * @param element : an element of the props like `banner?:   {component: React.ReactElement, collapsed?: boolean}`
     * @returns `true` if the element should be collapsed, `false` otherwise
     */
    function shouldCollapse(element: ComponentProp | undefined) {
        if (!element || !element.component) {
            return true;
        } else if (element.collapsed) {
            return true;
        }
        return false;
    }

    return (
        <div className={styles.main}>

            <div className={bannerStyle}>
                {bannerComponent}
            </div>

            <div className={navbarStyle}>
                {navbarComponent}
            </div>

            <div className={leftBarStyle}>
                <div className={styles.leftBarContent}>
                    {leftBarComponent}
                </div>
            </div>

            <div className={contentStyle}>
                {contentComponent}
            </div>

            <div className={rightBarStyle}>
                <div className={styles.rightBarContent}>
                    {rightBarComponent}
                </div>
            </div>

            <div className={footerStyle}>
                {footerComponent}
            </div>
        </div>
    )
}