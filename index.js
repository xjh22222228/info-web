// Copyright @ 2024-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/web-info
import axios from 'axios';

function getTitle(str) {
  const regex = /<title>([^<]*)?<\/title>/i;
  const match = str.match(regex);
  let title = '';
  if (match && match[1]) {
    title = match[1];
  }
  return title;
}

function getIconUrl(str, origin, protocol) {
  protocol = protocol.replace(':', '');
  const regexGlobal = /<link(.|\s)*?\/?>/gi;
  const regex = /href="((.|\s)*?)"/i;
  let match
  try {
     match = str.match(regexGlobal);
  } catch (error) {
    console.log('getIconUrl', error.message)
  }
  

  if (Array.isArray(match)) {
    for (const value of match) {
      if (
        value.includes('rel="icon"') ||
        value.includes('rel=icon') ||
        value.includes(`rel='icon'`) ||
        value.includes('rel="shortcut icon"') ||
        value.includes(`rel='shortcut icon'`) ||
        value.includes(`rel='icon shortcut'`) ||
        value.includes(`rel="icon shortcut"`) ||
        value.includes('rel="apple-touch-icon-precomposed"') ||
        value.includes(`rel='apple-touch-icon-precomposed'`) ||
        value.includes('rel="apple-touch-icon"') ||
        value.includes(`rel='apple-touch-icon'`)
      ) {
        const matchRes = value.match(regex);
        if (matchRes && matchRes[1]) {
          let href = matchRes[1];

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
              return origin + '/' + href;
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
  let match
  try {
    match = html.match(regexGlobal);
  } catch (error) {
    console.log('getDescription：', error.message)
  }

  if (Array.isArray(match)) {
    for (const value of match) {
      if (
        value.includes('name="description"') ||
        value.includes('name=description') ||
        value.includes(`name='description'`)
      ) {
        const matchRes = value.match(regex);
        if (matchRes && matchRes[1]) {
          let describe = matchRes[1];
          description = describe;
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
    return params;
  }

  try {
    const { origin, protocol } = new URL(url);
    const res = await axios.get(origin, {
      headers:{
        'Content-Type': 'text/html;charset=utf-8'
      },
      responseType: 'arraybuffer',
      ...axiosConf,
    });
    const contentType = (res.headers['content-type'] || '').toLowerCase();
    // 中文编码
    const gbk = contentType.includes('gbk') || contentType.includes('gb2312')
    let html = new TextDecoder(gbk ? 'gbk' : 'utf-8').decode(res.data);
    params.iconUrl = getIconUrl(html, origin, protocol).trim();
    params.title = getTitle(html).trim();
    params.description = getDescription(html).trim();
  } catch (error) {
    params.errorMsg = error.message;
    params.status = false;
  }
  return params;
}

export default getWebInfo;
