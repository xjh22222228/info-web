import { getTitle, getIconUrl, getDescription, REGEX } from './index.js';

const origin = 'https://example.com';
const protocol = 'https:';

describe('正常情况', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title>Title</title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
<meta name="description" content="Description">
<link rel="icon" href="/logo.svg">
<link rel="apple-touch-icon" href="/favicon-128x128.png">
`;

  it('title', () => {
    expect(getTitle(html)).toBe('Title');
  });
  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(`${origin}/logo.svg`);
  });
  it('description', () => {
    expect(getDescription(html)).toBe('Description');
  });
});

describe('被注释，获取应该为空', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<!--<title>Title</title>-->
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
<!-- <meta name="description" content="Description"> -->
<!--

<link rel="icon" href="/logo.svg">
-->
`.replace(REGEX.HTML_NOTE, '');

  it('title', () => {
    expect(getTitle(html)).toBe('');
  });
  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(``);
  });
  it('description', () => {
    expect(getDescription(html)).toBe('');
  });
});

describe('有尾标签', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> Title </title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta name="description" content="Description"   /> 


<link rel="icon" href="/logo.svg"  />

`;

  it('title', () => {
    expect(getTitle(html)).toBe(' Title ');
  });
  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(`${origin}/logo.svg`);
  });
  it('description', () => {
    expect(getDescription(html)).toBe('Description');
  });
});

describe('单引号', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> Title </title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta name='description' content='Description'   /> 


<link rel='icon' href='/logo.svg'  />

`;

  it('title', () => {
    expect(getTitle(html)).toBe(' Title ');
  });
  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(`${origin}/logo.svg`);
  });
  it('description', () => {
    expect(getDescription(html)).toBe('Description');
  });
});

describe('没有单引号和双引号', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> Title </title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta name=description content='Description'   /> 


<link rel=icon href='/logo.svg'  />

`;

  it('title', () => {
    expect(getTitle(html)).toBe(' Title ');
  });
  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(`${origin}/logo.svg`);
  });
  it('description', () => {
    expect(getDescription(html)).toBe('Description');
  });
});

describe('图标没有http协议', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> Title </title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta name=description content='Description'   /> 


<link rel=icon href='//example.com/logo.svg'  />

`;

  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(`${origin}/logo.svg`);
  });

  const html2 = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> Title </title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta name=description content='Description'   /> 


<link rel=icon href='://example.com/logo.svg'  />

`;

  it('icon', () => {
    expect(getIconUrl(html2, origin, protocol)).toBe(`${origin}/logo.svg`);
  });
});

describe('图标是base64', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> Title </title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta name='description' content='Description'   /> 


<link rel='icon' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADlElEQVQ4jU2T'  />

`;
  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(
      `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADlElEQVQ4jU2T`
    );
  });
});

describe('属性换行', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> 

Title

</title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta
  name=description
  content='Description' 
/> 


<link 
  rel=icon 
  href='/logo.svg'  />

`;

  it('title', () => {
    expect(getTitle(html).trim()).toBe('Title');
  });
  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(`${origin}/logo.svg`);
  });
  it('description', () => {
    expect(getDescription(html)).toBe('Description');
  });
});

describe('shortcut icon', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> 

Title

</title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta
  name=description
  content='Description' 
/> 


<link 
  rel="shortcut icon"
  href='/logo.svg'  />

`;

  it('icon', () => {
    expect(getIconUrl(html, origin, protocol)).toBe(`${origin}/logo.svg`);
  });

  const html2 = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title> 

Title

</title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta
  name=description
  content='Description' 
/> 


<link 
  rel="icon shortcut"
  href='/logo.svg'  />

`;

  it('icon shortcut', () => {
    expect(getIconUrl(html2, origin, protocol)).toBe(`${origin}/logo.svg`);
  });
});

describe('标题、描述含有实体字符', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title>Ti&#32;tle</title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta name="description" content="&#x4f7f;&#x7528; WhatsApp Messenger &#x4e0e;&#x4eb2;&#x53cb;&#x4fdd;&#x6301;&#x8054;&#x7cfb;&#x3002;WhatsApp &#x5b8c;&#x5168;&#x514d;&#x8d39;&#xff0c;&#x53ef;&#x63d0;&#x4f9b;&#x7b80;&#x5355;&#x3001;&#x5b89;&#x5168;&#x3001;&#x53ef;&#x9760;&#x7684;&#x6d88;&#x606f;&#x4f20;&#x9001;&#x548c;&#x901a;&#x8bdd;&#x529f;&#x80fd;&#xff0c;&#x5728;&#x4e16;&#x754c;&#x5404;&#x5730;&#x7684;&#x667a;&#x80fd;&#x624b;&#x673a;&#x4e0a;&#x5747;&#x53ef;&#x4f7f;&#x7528;&#x3002;" />


<link rel=icon href='/logo.svg'  />

`;

  it('title', () => {
    expect(getTitle(html)).toBe('Ti tle');
  });

  it('description', () => {
    expect(getDescription(html)).toBe(
      '使用 WhatsApp Messenger 与亲友保持联系。WhatsApp 完全免费，可提供简单、安全、可靠的消息传送和通话功能，在世界各地的智能手机上均可使用。'
    );
  });
});
