import { createDeviceTypeHeader, inMiniprogram } from '@/utils/ua-utils';
import Cookies from 'js-cookie';
import { sortBy } from 'lodash-es';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';

const {
  VITE_FANBOOK_SECRET: appSecret,
  VITE_FANBOOK_KEY: appKey,
  VITE_PLATFORM: platform,
} = import.meta.env;

interface CommonFields {
  Nonce: string;
  Timestamp: string;
  Authorization?: string;
  AppKey: string;
  RequestBody?: string;
  Platform: string;
}

interface SignHeader extends CommonFields {
  signature: string;
}

export type SignatureHeaders = SignHeader & HeadersInit;

function fixedEncodeURIComponent(str: string) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

export function getSignature(signatureMap: CommonFields): string {
  let chain = sortBy(Object.entries(signatureMap), ([k]) => k)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  chain = chain + '&' + appSecret;
  const signature = fixedEncodeURIComponent(chain);
  return md5(signature);
}

export default async function signatureHeaders(params: unknown | string = '') {
  const token = inMiniprogram
    ? await fb.getUserToken().then((e) => e.token)
    : Cookies.get('token');

  const RequestBody = params ? JSON.stringify(params) : '';

  const common: CommonFields = {
    Nonce: uuidv4(),
    Timestamp: `${Date.now()}`,
    Authorization: token ?? '',
    AppKey: appKey,
    Platform: platform,
  };
  return {
    ...common,
    signature: getSignature({
      ...common,
      RequestBody,
    }),
    ...createDeviceTypeHeader(),
  };
}
