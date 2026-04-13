import type { APIRequestContext } from '@playwright/test';

type GetOptions = NonNullable<Parameters<APIRequestContext['get']>[1]>;
type PostOptions = NonNullable<Parameters<APIRequestContext['post']>[1]>;
type PutOptions = NonNullable<Parameters<APIRequestContext['put']>[1]>;
type PatchOptions = NonNullable<Parameters<APIRequestContext['patch']>[1]>;
type DeleteOptions = NonNullable<Parameters<APIRequestContext['delete']>[1]>;

function mergeHeaders<T extends { headers?: Record<string, string> }>(
  defaults: Record<string, string>,
  options?: T,
): T | undefined {
  if (!options && Object.keys(defaults).length === 0) {
    return options;
  }
  return {
    ...options,
    headers: { ...defaults, ...options?.headers },
  } as T;
}

/**
 * Thin wrapper around Playwright {@link APIRequestContext} with a configurable base URL
 * and default headers (e.g. `Authorization`, `Accept`).
 */
export class ApiClient {
  constructor(
    private readonly ctx: APIRequestContext,
    private readonly baseURL: string,
    private readonly defaultHeaders: Record<string, string> = {},
  ) {}

  /** Returns a new client with merged default headers. */
  withHeaders(headers: Record<string, string>): ApiClient {
    return new ApiClient(this.ctx, this.baseURL, {
      ...this.defaultHeaders,
      ...headers,
    });
  }

  private resolveUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }
    const base = this.baseURL.replace(/\/+$/, '');
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${base}${path}`;
  }

  get(path: string, options?: GetOptions) {
    return this.ctx.get(this.resolveUrl(path), mergeHeaders(this.defaultHeaders, options));
  }

  post(path: string, options?: PostOptions) {
    return this.ctx.post(this.resolveUrl(path), mergeHeaders(this.defaultHeaders, options));
  }

  put(path: string, options?: PutOptions) {
    return this.ctx.put(this.resolveUrl(path), mergeHeaders(this.defaultHeaders, options));
  }

  patch(path: string, options?: PatchOptions) {
    return this.ctx.patch(this.resolveUrl(path), mergeHeaders(this.defaultHeaders, options));
  }

  delete(path: string, options?: DeleteOptions) {
    return this.ctx.delete(this.resolveUrl(path), mergeHeaders(this.defaultHeaders, options));
  }

  /** Direct access when you need `fetch`, storage state, or options not exposed here. */
  get context(): APIRequestContext {
    return this.ctx;
  }
}
