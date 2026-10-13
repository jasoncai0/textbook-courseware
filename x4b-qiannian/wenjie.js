'use strict';
/* 提问—解决卡（四下第二单元“提出不懂的问题，并试着解决”通用工具；第 5～8 课各放一份相同的 wenjie.js / wenjie.css）
 * 页面：<div class="wj" data-wenjie="key" data-noswipe></div>
 * 数据：WenJie.init({ key: { items: [{ q, k, how: ['sx'], a }], placeholder? } })
 *   k   问题类型：ci 不懂的词 / nr 内容 / xf 写法
 *   how 可行的解决办法（可多个）：sx 联系上下文 / zl 查资料 / qj 请教别人
 *   a   参考解答（点对办法后出现）
 * 每张卡两步：先分类（这是哪一类问题？），再选办法（怎么解决？），选对了出现参考解答。学生自己写的问题没有标准答案，怎么选都行。
 */
const WenJie = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const KINDS = [['ci', '不懂的词'], ['nr', '内容'], ['xf', '写法']];
  const HOWS = [['sx', '联系上下文'], ['zl', '查资料'], ['qj', '请教别人']];
  const MAX_LEN = 60;
  const MINE_ANSWER = '先自己想一想，再把你的想法和同学说一说。';

  function cardHtml(item, i) {
    const btns = (list, attr) => list.map(([k, name]) => `<button type="button" class="wj-b" data-${attr}="${k}">${name}</button>`).join('');
    return `<div class="wj-card"${item.k ? '' : ' data-mine="1"'} data-i="${i}">
      <p class="wj-q">${esc(item.q)}</p>
      <div class="wj-row wj-kind"><span>这是哪一类问题？</span>${btns(KINDS, 'kind')}</div>
      <div class="wj-row wj-how"><span>怎么解决？</span>${btns(HOWS, 'how')}</div>
      <p class="wj-a"></p>
    </div>`;
  }

  function shake(el) {
    el.classList.remove('wrong');
    void el.offsetWidth; // 重新触发抖动动画
    el.classList.add('wrong');
  }

  function build(box, cfg) {
    const items = [...cfg.items];
    box.innerHTML = `<div class="wj-add">
        <input type="text" maxlength="${MAX_LEN}" placeholder="${esc(cfg.placeholder || '读课文时有不懂的地方？写下你的问题，按回车加入')}">
        <button type="button" class="btn solid">加入</button>
        <span class="wj-count">已解决 <b>0</b> / <i>${items.length}</i></span>
      </div>
      <div class="wj-cards">${items.map(cardHtml).join('')}</div>`;
    const list = box.querySelector('.wj-cards');
    const count = () => {
      box.querySelector('.wj-count b').textContent = box.querySelectorAll('.wj-card.solved').length;
      box.querySelector('.wj-count i').textContent = items.length;
    };

    const input = box.querySelector('input');
    const add = () => {
      const q = input.value.trim().slice(0, MAX_LEN);
      if (!q) return;
      items.push({ q });
      list.insertAdjacentHTML('afterbegin', cardHtml({ q }, items.length - 1));
      input.value = '';
      count();
    };
    box.querySelector('.wj-add .btn').addEventListener('click', add);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });

    box.addEventListener('click', (e) => {
      const b = e.target.closest('.wj-b');
      if (!b) return;
      const card = b.closest('.wj-card');
      const item = items[+card.dataset.i];
      if (b.dataset.kind) {
        if (card.classList.contains('kinded')) return;
        if (item.k && item.k !== b.dataset.kind) { shake(card); return; }
        b.classList.add('solid');
        card.classList.add('kinded');
        return;
      }
      if (!card.classList.contains('kinded') || card.classList.contains('solved')) return;
      if (item.how && !item.how.includes(b.dataset.how)) { shake(card); return; }
      b.classList.add('solid');
      card.classList.add('solved');
      card.querySelector('.wj-a').textContent = item.a || MINE_ANSWER;
      count();
    });
  }

  return {
    init(data) {
      document.querySelectorAll('[data-wenjie]').forEach((box) => {
        const cfg = data[box.dataset.wenjie];
        if (cfg) build(box, cfg);
      });
    },
  };
})();
