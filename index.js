// Copyright @ 2024-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/info-web
import axios from 'axios';
import jschardet from 'jschardet';
import url from 'node:url';
import he from 'he';

export const REGEX = {
  TITLE_GLOBAL: /<title.*?>([^<]*)?<\/title>/gi,
  TITLE: /<title.*?>([^<]*)?<\/title>/i,
  META_GLOBAL: /<meta(.|\s)*?\/?>/gi,
  LINK_GLOBAL: /<link(.|\s)*?\/?>/gi,
  CONTENT_DOUBLE: /content="((.|\s)*?)"/i,
  CONTENT_SINGLE: /content='((.|\s)*?)'/i,
  HREF_DOUBLE: /href="((.|\s)*?)"/i,
  HREF_SINGLE: /href='((.|\s)*?)'/i,
  HTML_NOTE: /<!--(.|\s)*?-->/gm,
};

const getContent = (str, regexDouble, regexSingle) => {
  const matchDouble = str.match(regexDouble);
  const matchSingle = str.match(regexSingle);
  return (
    (matchDouble && matchDouble[1]) || (matchSingle && matchSingle[1]) || ''
  );
};

export function getTitle(str) {
  const match = str.match(REGEX.TITLE_GLOBAL);
  if (!match) {
    return '';
  }
  let title = '';
  for (const value of match) {
    const result = value.match(REGEX.TITLE);
    const data = result?.[1];
    if (data) {
      title = data;
    }
  }
  return he.decode(title);
}

export function getIconUrl(str, origin, protocol) {
  const iconRelations = [
    'rel="icon"',
    'rel=icon',
    `rel='icon'`,
    'rel="shortcut icon"',
    `rel='shortcut icon'`,
    `rel='icon shortcut'`,
    `rel="icon shortcut"`,
    'rel="apple-touch-icon-precomposed"',
    `rel='apple-touch-icon-precomposed'`,
    'rel="apple-touch-icon"',
    `rel='apple-touch-icon'`,
  ];

  const match = str.match(REGEX.LINK_GLOBAL);
  if (!Array.isArray(match)) return '';

  for (const value of match) {
    const val = value.toLowerCase();
    if (!iconRelations.some((rel) => val.includes(rel))) continue;
    const href = getContent(value, REGEX.HREF_DOUBLE, REGEX.HREF_SINGLE);

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
  return '';
}

export function getDescription(html) {
  const match = html.match(REGEX.META_GLOBAL);
  if (!Array.isArray(match)) return '';

  for (const value of match) {
    const val = value.toLowerCase();
    if (
      !(
        val.includes('name="description"') ||
        val.includes('name=description') ||
        val.includes(`name='description'`) ||
        val.includes('name="og:description"') ||
        val.includes("name='og:description'")
      )
    )
      continue;

    const description = getContent(
      value,
      REGEX.CONTENT_DOUBLE,
      REGEX.CONTENT_SINGLE
    );
    if (description) return description;
  }
  return '';
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
      title: getTitle(html).trim(),
      description: getDescription(html).trim(),
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
