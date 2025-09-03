// Copyright @ 2024-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/info-web
import axios from 'axios';
import jschardet from 'jschardet';
import url from 'node:url';
import he from 'he';
import https from 'node:https';
import { JSDOM } from 'jsdom';

const agent = new https.Agent({
  // https://www.tlsbooks.com/ 证书错误
  rejectUnauthorized: false, // 忽略证书错误
});

export const REGEX = {
  HTML_NOTE: /<!--(.|\s)*?-->/gm,
};

export function getTitle(html) {
  const dom = new JSDOM(html);
  const titles = dom.window.document.querySelectorAll('title');
  for (const title of titles) {
    const content = title?.textContent?.trim();
    if (content) {
      return he.decode(content);
    }
  }
  return '';
}

export function getIconUrl(html, origin, protocol) {
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="icon shortcut"]',
    'link[rel="apple-touch-icon-precomposed"]',
    'link[rel="apple-touch-icon"]',
  ];
  const dom = new JSDOM(html);
  for (const selector of selectors) {
    const links = dom.window.document.querySelectorAll(selector);
    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href) continue;
      if (href.startsWith('data:image')) return href;
      if (href.startsWith('://')) return protocol + href.slice(1);
      if (href.startsWith('//')) {
        return protocol + href;
      }
      if (!href.includes('://')) {
        return href.startsWith('/') ? origin + href : url.resolve(origin, href);
      }
      return href;
    }
  }
  return '';
}

export function getDescription(html) {
  const selectors = [
    'meta[name="description"]',
    'meta[name="og:description"]',
    'meta[name="twitter:description"]',
    'meta[property="og:description"]',
    'meta[property="twitter:description"]',
  ];
  let description = '';
  const dom = new JSDOM(html);
  go: for (const selector of selectors) {
    const metas = dom.window.document.querySelectorAll(selector);
    for (const meta of metas) {
      if (meta?.content) {
        description = meta.content;
        break go;
      }
    }
  }
  return he.decode(description);
}

async function getWebInfo(url, axiosConf) {
  if (!url) {
    return {
      url,
      status: false,
      errorMsg: 'No url',
      iconUrl: '',
      title: '',
      description: '',
    };
  }

  try {
    const { origin, protocol } = new URL(url);
    const { data } = await axios.get(url, {
      httpsAgent: agent,
      ...axiosConf,
      headers: {
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Content-Type': 'text/html;charset=utf-8',
        ...axiosConf?.headers,
      },
      responseType: axiosConf?.responseType ?? 'arraybuffer',
    });

    const buffer = Buffer.from(data, 'binary');
    const charset = jschardet.detect(buffer).encoding || 'utf-8';
    const html = new TextDecoder(charset)
      .decode(data)
      .replace(REGEX.HTML_NOTE, '');

    const iconUrl = getIconUrl(html, origin, protocol).trim();
    const finalIconUrl = await validateIconUrl(iconUrl, origin);

    return {
      url,
      status: true,
      errorMsg: '',
      iconUrl: finalIconUrl,
      title: getTitle(html),
      description: getDescription(html),
    };
  } catch (error) {
    return {
      url,
      status: false,
      errorMsg: error.message,
      iconUrl: '',
      title: '',
      description: '',
    };
  }
}

async function validateIconUrl(iconUrl, origin) {
  if (iconUrl) {
    return iconUrl;
  }
  try {
    const favicon = `${origin}/favicon.ico`;
    await axios.get(favicon);
    return favicon;
  } catch {
    return '';
  }
}

export default getWebInfo;
