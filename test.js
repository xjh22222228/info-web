import getWebInfo from './index.js'

async function test() {
  console.log(
    await getWebInfo('https://www.xiejiahe.com/')
  )
}
test()
