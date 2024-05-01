'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import logger from '@/app/_utils/logger';


//export type MenuBarMode = 'creation' | 'animation';
export type DeskMenu = 'polls' | 'participants' | 'chat' | 'more' | 'add';

type MenuContextType = {

    // Desk menus
    openedDeskMenu: DeskMenu | undefined;
    setOpenDeskMenu: (menu: DeskMenu | undefined) => void;
    toggleDeskMenu: (menu: DeskMenu) => void;
};


const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {

    const [openedDeskMenu, setOpenDeskMenu] = useState<DeskMenu | undefined>(undefined);
    const toggleDeskMenu = (menu: DeskMenu | undefined) => {
        setOpenDeskMenu((prev) => prev === menu ? undefined : menu);
    };

    useEffect(() => {
        logger.log('react:hook', 'Menu set to', openedDeskMenu)
    }, [openedDeskMenu]);

    return (
        <MenuContext.Provider value={{
            openedDeskMenu,
            setOpenDeskMenu,
            toggleDeskMenu,
        }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (!context) throw new Error('useMenuContext must be used within a MenuContextProvider');
    return context;
}