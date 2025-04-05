// Copyright @ 2024-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/info-web

import getWebInfo from './index.js';

async function test() {
  console.log(await getWebInfo('https://xiejiahe.com'));
}
test();
