'use strict';
/* 提问清单（第二单元提问策略通用工具；四上第 5～8 课各放一份相同的 qlist.js，样式在各课 course.css 的“提问清单”一节）
 * 页面：<div class="qlist" data-qlist="key" data-noswipe></div>
 * 数据：QList.init({ key: { cats: [{ k, name, tip }], items: [{ q, k? }], star?: '最有价值', starMax?: 3, placeholder? } })
 *   items[].k 是参考分类：点对了归入该栏，点错了抖一下；学生自己写的问题没有 k，放到哪栏都行。
 *   star：给已分类的问题加星（选出最有价值 / 最值得思考的问题），最多 starMax 个。
 */
const QList = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MAX_LEN = 60;

  function cardHtml(item, cats) {
    return `<div class="qcard"${item.k ? ` data-k="${esc(item.k)}"` : ' data-mine="1"'}>
      <p class="qt">${esc(item.q)}</p>
      <div class="qbtns">${cats.map((c) => `<button type="button" class="qcat" data-to="${esc(c.k)}">${esc(c.name)}</button>`).join('')}</div>
      <div class="qtools"><button type="button" class="qstar" title="加星">☆</button><button type="button" class="qback" title="放回去">↩</button></div>
    </div>`;
  }

  function build(box, cfg) {
    const starMax = cfg.starMax || 3;
    box.classList.toggle('has-star', Boolean(cfg.star));
    box.innerHTML = `<div class="qadd">
        <input type="text" maxlength="${MAX_LEN}" placeholder="${esc(cfg.placeholder || '写下你自己的问题，按回车加入清单')}">
        <button type="button" class="btn solid qadd-btn">加入</button>
      </div>
      <div class="qboard" style="--cols:${cfg.cats.length}">
        <div class="qpool"><h4>问题卡 <small>点下面的按钮分一分</small></h4><div class="qcards">${cfg.items.map((it) => cardHtml(it, cfg.cats)).join('')}</div></div>
        ${cfg.cats.map((c) => `<div class="qcol" data-k="${esc(c.k)}"><h4>${esc(c.name)}${c.tip ? `<small>${esc(c.tip)}</small>` : ''}</h4><div class="qcards"></div></div>`).join('')}
      </div>
      ${cfg.star ? `<p class="qmsg">分好类，再给<b>${esc(cfg.star)}</b>的问题点 ☆（最多 ${starMax} 个）。</p>` : '<p class="qmsg"></p>'}`;

    const input = box.querySelector('.qadd input');
    const add = () => {
      const q = input.value.trim().slice(0, MAX_LEN);
      if (!q) return;
      box.querySelector('.qpool .qcards').insertAdjacentHTML('afterbegin', cardHtml({ q }, cfg.cats));
      input.value = '';
    };
    box.querySelector('.qadd-btn').addEventListener('click', add);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });

    const msg = box.querySelector('.qmsg');
    box.addEventListener('click', (e) => {
      const card = e.target.closest('.qcard');
      if (!card) return;
      const to = e.target.closest('.qcat');
      if (to) {
        card.classList.remove('wrong');
        void card.offsetWidth; // 重新触发抖动动画
        if (card.dataset.k && card.dataset.k !== to.dataset.to) { card.classList.add('wrong'); return; }
        box.querySelector(`.qcol[data-k="${to.dataset.to}"] .qcards`).appendChild(card);
        return;
      }
      if (e.target.closest('.qback')) {
        card.classList.remove('star');
        box.querySelector('.qpool .qcards').appendChild(card);
        return;
      }
      if (e.target.closest('.qstar')) {
        const on = !card.classList.contains('star');
        if (on && box.querySelectorAll('.qcard.star').length >= starMax) {
          msg.textContent = `最多选 ${starMax} 个，先取消一个再选。`;
          return;
        }
        card.classList.toggle('star', on);
        card.querySelector('.qstar').textContent = on ? '★' : '☆';
        if (cfg.star) msg.innerHTML = `已选 <b>${box.querySelectorAll('.qcard.star').length}</b> / ${starMax} 个${esc(cfg.star)}的问题。`;
      }
    });
  }

  return {
    init(data) {
      document.querySelectorAll('[data-qlist]').forEach((box) => {
        const cfg = data[box.dataset.qlist];
        if (cfg) build(box, cfg);
      });
    },
  };
})();
