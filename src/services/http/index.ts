import FbApi from '../FbApi';
import signatureHeaders, { type SignatureHeaders } from './signature_headers';

export async function post<T>(
  path: string,
  data?: unknown,
): Promise<HttpResp<T>> {
  const signHeader = await signatureHeaders(data);
  const headers: SignatureHeaders = {
    'Content-Type': 'application/json',
    ...signHeader,
  };
  return fetch(`${import.meta.env.VITE_API_HOST}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export async function postWithErrorToast<T>(path: string, data: unknown) {
  const res = (await post(path, data)) as HttpResp<T>;
  if (!res.status && res.desc) {
    FbApi.toast(res.desc);
    throw new Error(res.desc);
  }
  return res.data;
}

export async function get<T>(path: string): Promise<HttpResp<T>> {
  const signHeader = await signatureHeaders();
  const headers: SignatureHeaders = {
    'Content-Type': 'application/json',
    ...signHeader,
  };

  return fetch(`${import.meta.env.VITE_API_HOST}${path}`, {
    headers,
  }).then((res) => res.json());
}

export async function getWithNotSign<T>(path: string): Promise<HttpResp<T>> {
  const headers = {
    'Content-Type': 'application/json',
  };

  return fetch(`${import.meta.env.VITE_API_HOST}${path}`, {
    headers,
  }).then((res) => res.json());
}

export interface HttpResp<T> {
  desc?: string;
  status: boolean;
  code: number;
  data: T;
}
