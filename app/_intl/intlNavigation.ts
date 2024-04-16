import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import config from './intl.config';
 
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({
    locales: config.locales,
    localePrefix: config.localePrefix,
});