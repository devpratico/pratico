import CanvasSwitcher from './_components/CanvasSwitcher';
import DeskLayout from '@/app/[locale]/_components/layouts/DeskLayout/DeskLayout';
import { getTranslations } from 'next-intl/server';
import DeskMenuBar from '@/app/[locale]/_components/menu-bars/DeskMenuBar/DeskMenuBar';
import TLToolbar from '@/app/[locale]/_components/desk/custom-ui/TLToolbar/TLToolbar';
import DeskMenus from '@/app/[locale]/_components/menus/DeskMenus/DeskMenus';
import Carousel from '@/app/[locale]/_components/desk/carousel/Carousel/Carousel';
import Controls from '@/app/[locale]/_components/desk/controls/Controls/Controls';


export default async function CapsulePage() {

    const t = await getTranslations('menu-bar')
    const messages = {
        play: t('play'),
        stop: t('stop session'),
        polls: t('polls'),
        chat: t('chat'),
        participants: t('participants'),
        more: t('more'),
        done: t('done'),
    }

    return (
            <DeskLayout
                canvas={<CanvasSwitcher />}
                menuBar={<DeskMenuBar messages={messages} />}
                carousel={<Carousel />}
                controls={<Controls />}
                toolBar={<TLToolbar />}
                menu={<DeskMenus />}
            />
    )
}