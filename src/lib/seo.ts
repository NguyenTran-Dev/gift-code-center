const DEFAULT_SITE_URL = "https://giftcodecenter.thucnguyen74.com";

export function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  const rawUrl = envUrl || DEFAULT_SITE_URL;
  return rawUrl.replace(/\/+$/, "");
}
