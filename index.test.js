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

describe('标题含有实体字符', () => {
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<title>Ti&#32;tle</title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta name="author" content="https://github.com/xjh22222228">
 <meta name=description content='Description'   /> 


<link rel=icon href='/logo.svg'  />

`;

  it('title', () => {
    expect(getTitle(html)).toBe('Ti tle');
  });
});
