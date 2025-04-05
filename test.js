import getWebInfo from './index.js';

async function test() {
  console.log(
    await getWebInfo(
      'https://www.xfyun.cn/doc/nlp/xftrans_new/API.html#%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E'
    )
  );
}
test();
