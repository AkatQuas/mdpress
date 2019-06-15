import './index.less';
import './mark.less';

/**
 * Remove class name in the selectors
 * @param {string} selector
 * @param {string} classToRemove
 */
function removeClass(selector, classToRemove) {
  const els = document.querySelectorAll(selector);
  els.forEach(el => {
    el.classList.remove(classToRemove);
  });
}

const menuEl = document.querySelector('#menu-container');
menuEl.addEventListener('click', function (e) {
  e.stopPropagation();
  const target = e.target;
  const className = target.className;
  if (className.indexOf('link') === -1) {
    return;
  }
  removeClass('#menu-container .link-active', 'link-active');
  target.classList.add('link-active');

  removeClass('.sub-menu-container', 'sub-menu-container-active');
  const targetParent = target.parentNode;
  if (targetParent.className.indexOf('sub-menu') > -1) {
    const gp = targetParent.parentNode;
    gp.classList.add('sub-menu-container-active');
  }

  const anchor = target.dataset.anchor;
  removeClass('#content-container .content-active', 'content-active')
  const showEl = document.querySelector('#' + anchor);
  if (showEl) {
    showEl.classList.add('content-active');
  }
});


const first = document.querySelector('.link');
first.click();