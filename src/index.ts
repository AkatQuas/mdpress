import './index.less';
import './mark.less';

/**
 * check whether in qa env
 */
function isInQA(): boolean {
  return /\/\/qa-/.test(window.location.origin);
}

/**
 * Remove class name in the selectors
 * @param {string} selector
 * @param {string} classToRemove
 */
function removeClass(selector: string, classToRemove: string) {
  const els = document.querySelectorAll(selector);
  els.forEach(el => {
    el.classList.remove(classToRemove);
  });
}

{
  // init menu
  const menuEl = document.querySelector('#menu-container');
  menuEl.addEventListener('click', function (e) {
    e.stopPropagation();
    const target = (e.target as HTMLElement);
    const className = target.className;
    if (className.indexOf('link') === -1) {
      return;
    }
    removeClass('#menu-container .link-active', 'link-active');
    target.classList.add('link-active');

    removeClass('.sub-menu-container', 'sub-menu-container-active');
    const targetParent = (target.parentNode as HTMLElement);
    if (targetParent.className.indexOf('sub-menu') > -1) {
      const gp = (targetParent.parentNode as HTMLElement);
      gp.classList.add('sub-menu-container-active');
    }

    const anchor = target.dataset.anchor;
    removeClass('#content-container .content-active', 'content-active')
    const showEl = document.querySelector('#' + anchor);
    if (showEl) {
      showEl.classList.add('content-active');
    }
  });

  // trigger first menu content
  const first = (document.querySelector('.link') as HTMLElement);
  first.click();
}

/**
 * save a cookie
 * @param {string} name cookie name
 * @param {string} value cookie value
 * @param {number} days expiry in days
 */
function saveCookie(name: string, value: string, days: number) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

/**
 * read Cookie value from `name`
 * @param {string} name cookie name
 */
function readCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trimLeft();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

/**
 * After token cookie retrieved, get user info
 * @param {String} token jwt token
 * @param {Function} callback success callback
 */
function getUserInfo(token: string, callback: Function) {
  const xhr = new XMLHttpRequest();
  // todo url
  const url = 'https://'.concat(isInQA() ? 'qa-' : '', 'account.dangwu.com/v1/api/ucenter/user/expansive');
  xhr.open('GET', url);
  xhr.setRequestHeader('Authorization', 'Token '.concat(token));
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          callback(res);
        } catch (error) {
          // An error occurred during the parse.
          console.log('Error: response pares failed, %s', xhr.responseText);
        }
      } else {
        // An error occurred during the request.
        console.log('Error: ' + xhr.status);
      }
    }
  };
  xhr.send(null);
}

export interface UserInterface {
  phone_number: string;
}

/**
 * render top-right user
 * @param {UserInterface} user user info
 */
function renderUser(user: UserInterface) {
  const inner = '<div class="user">'.concat(
    user.phone_number,
    '</div>',
    '<ul class="dropdown">',
    '<li class="dropdown-item setting">账号设置</li>',
    '<li class="dropdown-item logout">退出登录</li>',
    '</ul>'
  );
  const container = document.getElementById('top-right');
  container.innerHTML = inner;
  on('.dropdown-item.setting', goSetting);
  on('.dropdown-item.logout', logout);
}

function goSetting() {
  const url = 'https://'.concat(isInQA() ? 'qa-' : '', 'console.dangwu.com/setting');
  window.location.assign(url);
}

function logout() {
  saveCookie('token', '', -1);
  window.location.reload();
}

function on(selector: string, func: Function) {
  const el = document.querySelector(selector);
  el.addEventListener('click', function () {
    func();
  });
}

{
  const token = readCookie('token');
  if (token !== null) {
    getUserInfo(token, renderUser);
  }
}