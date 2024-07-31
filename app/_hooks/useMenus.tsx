'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import logger from '@/app/_utils/logger';


//export type MenuBarMode = 'creation' | 'animation';
export type DeskMenu = 'polls' | 'participants' | 'defilement' | 'chat' | 'more' | 'add' | 'qr';

type MenusContextType = {

    // Desk menus
    openedDeskMenu: DeskMenu | undefined;
    setOpenDeskMenu: (menu: DeskMenu | undefined) => void;
    toggleDeskMenu: (menu: DeskMenu) => void;
};


const MenusContext = createContext<MenusContextType | undefined>(undefined);

export function MenusProvider({ children }: { children: React.ReactNode }) {

    const [openedDeskMenu, setOpenDeskMenu] = useState<DeskMenu | undefined>(undefined);
    const toggleDeskMenu = (menu: DeskMenu | undefined) => {
        setOpenDeskMenu((prev) => prev === menu ? undefined : menu);
    };

    useEffect(() => {
        logger.log('react:hook', 'Menu set to', openedDeskMenu)
    }, [openedDeskMenu]);

    return (
        <MenusContext.Provider value={{
            openedDeskMenu,
            setOpenDeskMenu,
            toggleDeskMenu,
        }}>
            {children}
        </MenusContext.Provider>
    );
}

export function useMenus() {
    const context = useContext(MenusContext);
    if (!context) throw new Error('useMenuContext must be used within a MenuContextProvider');
    return context;
}