import getWebInfo from './index.js'

async function test() {
  console.log(
    await getWebInfo('https://qq.com')
  )
}
test()
