// Copyright @ 2024-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/web-info
import axios from 'axios'

function getIconUrl(str, origin) {
  const regexGlobal = /<link .*? href="(.*?)"/gi
  const regex = /<link .*? href="(.*?)"/i
  const match = str.match(regexGlobal)
  let iconUrl = ''

  if (Array.isArray(match)) {
    for (const value of match) {
      if (
        value.includes('rel="icon"') ||
        value.includes('rel="shortcut icon"') ||
        value.includes('rel="icon shortcut"') ||
        value.includes('rel="apple-touch-icon"')
      ) {
        const matchRes = value.match(regex)
        if (matchRes && matchRes[1]) {
          let href = matchRes[1]
          if (!href.includes('://')) {
            if (!href.startsWith('/')) {
              href = '/' + href
            }
            iconUrl = origin + href
          } else {
            iconUrl = href
          }
          break;
        }
        
      }
    }
  }

  return iconUrl
}


function getTitle(str) {
  const regex = /<title>(.*)?<\/title>/i
  const match = str.match(regex)
  let title = ''
  if (match && match[1]) {
    title = match[1]
  }
  return title
}

function getDescription(html) {
  const regexGlobal = /<meta .*? content="(.*?)"/gi
  const regex = /<meta .*? content="(.*?)"/i
  const match = html.match(regexGlobal)
  let description = ''

  if (Array.isArray(match)) {
    for (const value of match) {
      if (
        value.includes('name="description"')
      ) {
        const matchRes = value.match(regex)
        if (matchRes && matchRes[1]) {
          let describe = matchRes[1]
          description = describe
          break;
        }
      }
    }
  }

  return description
}

async function getWebInfo(url, axiosConf) {
  const params = {
    url,
    status: true,
    errorMsg: '',
    iconUrl: '',
    title: '',
    description: ''
  }
  
  if (!url) {
    return params
  }

  try {
    const { origin } = new URL(url)
    const res = await axios.get(url, {
      ...axiosConf
    })
    const html = res.data
    params.iconUrl = getIconUrl(html, origin)
    params.title = getTitle(html)
    params.description = getDescription(html)
  } catch (error) {
    params.errorMsg = error.message
    params.status = false
  }
  return params
}

export default getWebInfo
