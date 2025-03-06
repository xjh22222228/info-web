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

export default getWebInfo;
