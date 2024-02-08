import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import config from './intl.config';
 
// Can be imported from a shared config
const locales = config.locales;
 
export default getRequestConfig(async ({locale}) => {

  if (!locales.includes(locale as any)) {
    console.error(`Unsupported locale: ${locale}`);
    notFound();
  }
 
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});