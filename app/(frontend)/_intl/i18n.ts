import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import { IntlError, IntlErrorCode } from 'next-intl';
import config from './intl.config';
 

const locales = config.locales;
const defaultLocale = config.defaultLocale;
 
export default getRequestConfig(async ({locale}) => {

  // If locale is not in the list of supported locales, return a 404
  if (!locales.includes(locale as any)) {
    console.error(`Unsupported locale: ${locale}`);
    notFound();
  }

  // Try to load the file
  let messages;
  try {
    messages = (await import(`./messages/${locale}.json`)).default;
  } catch (e) {
    console.error(`Failed to load messages file for locale: ${locale}. Loading default locale (${defaultLocale}) instead.`);
    messages = (await import(`./messages/${defaultLocale}.json`)).default;
  }

  // On error
  const onError = (error: IntlError) => {
    // Missing translation
    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
      //console.warn(error);
    } else { // Other errors
      //console.error(error);
    }
  }

  // Fallback message
  const getMessageFallback = (info: {error: IntlError, key: string, namespace?: string | undefined}): string => {
    //const path = [info.namespace, info.key].filter((part) => part != null).join('.');
    if (info.error.code === IntlErrorCode.MISSING_MESSAGE) {
      //return path + ' is not yet translated';
      return info.key;
    } else {
      //return 'Dear developer, please fix this message: ' + path;
      return info.key;
    }
  }
 
  return {
    messages,
    onError,
    getMessageFallback,
  };
});