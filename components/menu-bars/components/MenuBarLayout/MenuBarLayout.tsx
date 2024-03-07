import styles from './MenuBarLayout.module.css';


interface MenuBarLayoutProps {
    children: React.ReactNode[] | React.ReactNode;
    spacerPosition?: number;
}


/**
 * Renders a menu bar layout to which components can be added as children.
 * @param children - The children components to be rendered within the menu bar layout (buttons, logos...)
 * @param spacerPosition - If provided, a spacer that will take as much space as possible and push the other elements to the sides will be added at the specified position.
 */
export default function MenuBarLayout({ children, spacerPosition }: MenuBarLayoutProps) {

    // Make sure children is an array
    const childrenArray = Array.isArray(children) ? children : [children];

    // Add a div around each child to style them and add a key
    const styledChildren = childrenArray.map((child, index) => 
        <div className={styles.child} key={index}>{child}</div>
    );

    const spacer = <div className={styles.spacer} key={"spacer"}/>;

    if (spacerPosition) {
        // Add the spacer at the specified position
        styledChildren.splice(spacerPosition, 0, spacer);
    }

    const containerStyle = spacerPosition ? styles.container : styles.container + " " + styles.spaceBetween;

    return (
        <nav className={containerStyle}>
            {styledChildren}
        </nav>
    )
}