// Copyright @ 2024-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/info-web
import axios from 'axios';
import jschardet from 'jschardet';
import url from 'node:url';

function getTitle(str) {
  const regex = /<title.*?>([^<]*)?<\/title>/i;
  const match = str.match(regex);
  return (match && match[1]) || '';
}

function getIconUrl(str, origin, protocol) {
  protocol = protocol.replace(':', '');
  const regexGlobal = /<link(.|\s)*?\/?>/gi;
  const regex = /href="((.|\s)*?)"/i;
  const regex2 = /href='((.|\s)*?)'/i;
  const match = str.match(regexGlobal);

  if (Array.isArray(match)) {
    for (const value of match) {
      const val = value.toLowerCase();
      if (
        val.includes('rel="icon"') ||
        val.includes('rel=icon') ||
        val.includes(`rel='icon'`) ||
        val.includes('rel="shortcut icon"') ||
        val.includes(`rel='shortcut icon'`) ||
        val.includes(`rel='icon shortcut'`) ||
        val.includes(`rel="icon shortcut"`) ||
        val.includes('rel="apple-touch-icon-precomposed"') ||
        val.includes(`rel='apple-touch-icon-precomposed'`) ||
        val.includes('rel="apple-touch-icon"') ||
        val.includes(`rel='apple-touch-icon'`)
      ) {
        const matchRes = value.match(regex);
        const matchRes2 = value.match(regex2);
        const hasMatch = matchRes || matchRes2;
        if (hasMatch && hasMatch[1]) {
          let href = hasMatch[1];

          if (href.startsWith('data:image')) {
            return href;
          }

          if (href.startsWith('://')) {
            return protocol + href;
          }
          // 合法路径 //example.com/favicon.ico
          if (href.startsWith('//')) {
            return protocol + ':' + href;
          }

          // 不完整路径
          if (!href.includes('://')) {
            if (href.startsWith('/')) {
              return origin + href;
            } else if (!href.startsWith('/')) {
              return url.resolve(origin, href);
            }
          } else {
            return href;
          }
          break;
        }
      }
    }
  }

  return '';
}

function getDescription(html) {
  let description = '';
  const regexGlobal = /<meta(.|\s)*?\/?>/gi;
  const regex = /content="((.|\s)*?)"/i;
  const regex2 = /content='((.|\s)*?)'/i;
  const match = html.match(regexGlobal);

  if (Array.isArray(match)) {
    for (const value of match) {
      const val = value.toLowerCase();
      if (
        val.includes('name="description"') ||
        val.includes('name=description') ||
        val.includes(`name='description'`) ||
        val.includes('name="og:description"') ||
        val.includes("name='og:description'")
      ) {
        const matchRes = value.match(regex);
        const matchRes2 = value.match(regex2);
        if (matchRes && matchRes[1]) {
          description = matchRes[1];
          break;
        } else if (matchRes2 && matchRes2[1]) {
          description = matchRes2[1];
          break;
        }
      }
    }
  }

  return description;
}

async function getWebInfo(url, axiosConf) {
  const params = {
    url,
    status: true,
    errorMsg: '',
    iconUrl: '',
    title: '',
    description: '',
  };

  if (!url) {
    params.status = false;
    params.errorMsg = 'no url';
    return params;
  }

  try {
    const { origin, protocol } = new URL(url);
    const res = await axios.get(url, {
      headers: {
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Content-Type': 'text/html;charset=utf-8',
      },
      responseType: 'arraybuffer',
      ...axiosConf,
    });

    const buffer = Buffer.from(res.data, 'binary');
    const charset = jschardet.detect(buffer).encoding || 'utf-8';
    let html = new TextDecoder(charset).decode(res.data);
    params.iconUrl = getIconUrl(html, origin, protocol).trim();
    params.title = getTitle(html).trim();
    params.description = getDescription(html).trim();

    try {
      await axios.get(params.iconUrl);
    } catch (error) {
      try {
        const favicon = `${origin}/favicon.ico`;
        await axios.get(favicon);
        params.iconUrl = favicon;
      } catch (error) {}
    }
  } catch (error) {
    params.errorMsg = error.message;
    params.status = false;
  }
  return params;
}

export default getWebInfo;
