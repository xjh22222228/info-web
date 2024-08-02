import getWebInfo from './index.js';

// http://www.jacklmoore.com/autosize/
// 乱码：https://www.chinapyg.com/
// 乱码：http://www.qqyewu.com/
// 乱码：https://www.iqnew.com/
async function test() {
  console.log(await getWebInfo('https://github.com/star-history/star-history'));
}
test();
