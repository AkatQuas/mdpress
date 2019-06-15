# Markdown Press

A plain project to generate static website from markdown.

> This project provides a naive way to generate static html files from markdown, the robustness is still questionable.

## Installation

```bash
npm install
```

## Development

There are two parts. The template theme and the documentations style.

```bash
npm run dev
```

### Template

And you are good to modify the `src/index.less`, `src/index.js` and `templates/template.html`.

It's not so smart when you change the `template.html` file, the browser won't refresh. But the file does recompile, aka, rebuild.

Markdown style can be modified in `src/mark.less`. In case you do want to change the synatx style, the quickest way is to copy the them you like from [here](https://github.com/highlightjs/highlight.js/tree/master/src/styles). (I use [highlight.js](https://github.com/highlightjs/highlight.js) for highlighting code),

Once you have sort out the frame theme, you can put your markdown file in the directory `src/docs` like this.

```
src/docs
  ├── doc1
  |   ├── static -> static images such as jpg, png, and svg.
  |   ├── config.js -> the menu tree and other configuration
  |   ├── chapter1.md
  |   ├── chapter2.md
  |   └── chapter3.md
  |
  ├── doc2
  |   ├── static -> static images such as jpg, png, and svg.
  |   ├── config.js -> the menu tree and other configuration
  |   ├── chapter1.md
  |   ├── chapter2.md
  |   └── chapter3.md
  |
  ...
```

Each directory in `src/docs` will create one static html file, and you can config them using config.js, [example](src/docs/ios/config.js).

```js
const config = {
  title: 'iOS 文档',
  filename: 'ios.html',
  menus: [
    {
      label: '概述',
      children: [
        {
          label: '第一章',
          markdown: 'chapter1',
        }
      ]
    },
    {
      label: '第二章',
      markdown: 'chapter2',
    }
  ]
}

```

Currently the template supports one-level-sub-menu, so some `menu-item` has a property `children` which is an array.

The `markdown` property is used for retrieve markdown file it the same directory, without extension. **And that's why the markdown files are flattened in the above file tree.**

### Static assets

As for images, just put them in the `static` under the same directory, refered by relative path.

> Files under `static` directory would be copied to `dist/static` untouched. More on this later.

Also, you could specify the `deployUrl` property in the `package.json`, which behaves like `publicPath` in `webpack` but for relative path in markdown files, useful images.

## Build

```bash
npm run build
```

The output directory is `dist` under the root. Run `npm run serve` to check out.

The generated html files are put in the server root directory, along with `static` directory. This is why we put [static images beside the markdown files](#static-assets).

```bash
# sugar for short check out
# equivalent `npm run build && npm run serve`
npm run build:serve
```

## How it works

There is a property `templateParameters` in [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin), which helps to inject some `string` values into the template file.

```js
// html-webpack-plugin

const htmlPlugins = new HtmlWebpackPlugin({
  template: 'path/to/template.html',
  templateParameters: {
    title: 'new title',
    content: 'new content',
    footer: '<footer>this is an html footer</footer>'
  }
});
```

```html
<!-- template -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= title%></title>
</head>

<body>
  <section class="content">
    <%= content %>
  </section>
  <section class="footer">
    <%= footer %>
  </section>
</body>

</html>

<!-- output -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>new title</title>
</head>

<body>
  <section class="content">
    new content
  </section>
  <section class="footer">
    <footer>this is an html footer</footer>
  </section>
</body>

</html>
```

This helps to generate output html files dynamically.

I choose [marked](https://github.com/markedjs/marked) for parsing markdown files, which return a string. Perfect, isn't it?

Althought the original `markedjs` is powerful enough to handle most usage cases, it doesn't support:

- image size configuration, such as `![](src/to/image "100x200")` or `![](src/to/image "width=100px hegiht=200px")`.

- `baseUrl` applied on raw html tags, such as `<img src="path/to/image.png">`.

I tweak a little bit to the original project, [here are the changes](https://github.com/AkatQuas/marked#forked-changes), which is the markdown parser used in this project. You can choose either one as long as that meets your requirement.

