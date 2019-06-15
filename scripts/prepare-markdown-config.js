const marked = require('marked');
const { resolveRoot, fs } = require('./utils');
const pkg = require('../package.json');

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  },
  baseUrl: pkg.deployUrl || '',
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

const resolveDocs = (...dir) => resolveRoot('src', 'docs', ...dir);
const wrapIntoSubMenuContainer = (label, submenu) => `<li class="sub-menu-container">${label}${submenu}</li>`
const wrapIntoSubMenu = (child) => `<ul class="sub-menu">${child}</ul>`;
const createLabel = (label) => `<div class="label">${label}</div>`;
const createLi = (anchor, label) => `<li class="link" data-anchor="${anchor}">${label}</li>`
const createContent = (anchor, content) => `<div id="${anchor}" class="content">${content}</div>`

const parseMarkdown = (folder, markdown) => {
  const markpath = resolveDocs(folder, markdown + '.md');
  try {
    const raw = fs.readFileSync(markpath).toString();
    return marked.parse(raw);
  } catch (error) {
    return error + '\nFile markdown parse error, path: ' + markpath;
  }
}

const parseMenuItem = (menuList, contentList, menu, folder) => {
  const { label, markdown } = menu;
  menuList.push(createLi(markdown, label));
  contentList.push(createContent(markdown, parseMarkdown(folder, markdown)));
}

module.exports = () => {
  const folders = fs.readdirSync(resolveDocs());
  return folders.reduce((acc, folder) => {
    const { title, filename, menus } = require(resolveDocs(folder, 'config.js'));

    const menuEl = [];
    const contentEl = [];
    menus.forEach(menu => {
      if (menu.children) {
        const label = createLabel(menu.label);
        const list = [];
        menu.children.forEach(child => {
          parseMenuItem(list, contentEl, child, folder);
        });
        const submenu = wrapIntoSubMenu(list.join(''));
        menuEl.push(wrapIntoSubMenuContainer(label, submenu));
      } else {
        parseMenuItem(menuEl, contentEl, menu, folder);
      }
    });

    const markConfig = {
      dir: resolveDocs(folder),
      filename: filename,
      title: title,
      menu: menuEl.join(''),
      content: contentEl.join(''),
    }

    acc.push(markConfig);
    return acc;
  }, []);

}