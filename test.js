// Copyright @ 2024-present liuzi6612. All rights reserved. MIT license.
// See https://github.com/liuzi6612/info-web

import getWebInfo from './index.js';

async function test() {
  console.log(await getWebInfo('https://example.com'));
}
test();
