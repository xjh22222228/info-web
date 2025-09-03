// Copyright @ 2024-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/info-web

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
  HTML_NOTE: RegExp;
};

export default getWebInfo;

export { getTitle, getDescription, getIconUrl, REGEX };
