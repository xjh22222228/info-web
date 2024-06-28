import getWebInfo from './index.js'

async function test() {
  console.log(
    await getWebInfo('https://www.xiejiahe.com/?from=nav2')
  )

  Promise.allSettled
}
test()
