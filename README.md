
抓取网站信息

## 使用

```bash
$ npm i info-web
or
$ yarn add info-web
or
$ pnpm add info-web
```

#### view

#### js
```js
import getInfoWeb from 'info-web';

const { iconUrl, title, description, status, errorMsg } = await getInfoWeb('https://example.com', axiosConfig)
```

## License

[LICENSE](./LICENSE)

