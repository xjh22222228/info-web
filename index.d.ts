import { AxiosRequestConfig } from 'axios';

interface WebInfo {
  url: string;
  status: boolean;
  errorMsg: string;
  iconUrl: string;
  title: string;
  description: string;
}

declare function getWebInfo(
  url: string,
  axiosConf?: AxiosRequestConfig
): Promise<WebInfo>;

declare function getTitle(str: string): string;
declare function getDescription(str: string): string;
declare function getIconUrl(
  str: string,
  origin: string,
  protocol: string
): string;

declare const REGEX: {
  CONTENT_DOUBLE: RegExp;
  CONTENT_SINGLE: RegExp;
  HREF_DOUBLE: RegExp;
  HREF_SINGLE: RegExp;
  HTML_NOTE: RegExp;
  LINK_GLOBAL: RegExp;
  META_GLOBAL: RegExp;
  TITLE: RegExp;
  TITLE_GLOBAL: RegExp;
};

export default getWebInfo;

export { getTitle, getDescription, getIconUrl, REGEX };
