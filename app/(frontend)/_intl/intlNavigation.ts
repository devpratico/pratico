import {createNavigation} from 'next-intl/navigation';
import config from './intl.config';
 
export const {Link, redirect, usePathname, useRouter} =
  createNavigation({
    locales: config.locales,
    localePrefix: config.localePrefix,
});