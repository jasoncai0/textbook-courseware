'use strict';
/* 我要的是葫芦 · 本课数据与互动。低年级识字与注音见 ../shared/hanzi.js（顶层调用，deck.js 加载前渲染完）
 * 本课独有：四格连环画读课文、葫芦藤因果链（蚜虫→叶子坏→葫芦落）、“如果听了邻居的话”分支、捉蚜虫识字游戏 */

Hanzi.init({
  cards: [
    { z: '葫', py: 'hú', bs: '艹', bh: 12, words: [['葫芦', 'hú lu']] },
    { z: '芦', py: 'lú', bs: '艹', bh: 7, words: [['葫芦', 'hú lu'], ['芦苇', 'lú wěi']] },
    { z: '藤', py: 'téng', bs: '艹', bh: 18, words: [['葫芦藤', 'hú lu téng'], ['藤条', 'téng tiáo']] },
    { z: '谢', py: 'xiè', bs: '讠', bh: 12, words: [['花谢', 'huā xiè'], ['谢谢', 'xiè xie']] },
    { z: '啊', py: 'a', bs: '口', bh: 10, words: [['快长啊', 'kuài zhǎng a'], ['好啊', 'hǎo a']] },
    { z: '蚜', py: 'yá', bs: '虫', bh: 10, words: [['蚜虫', 'yá chóng']] },
    { z: '盯', py: 'dīng', bs: '目', bh: 7, words: [['盯着', 'dīng zhe'], ['紧盯', 'jǐn dīng']] },
    { z: '赛', py: 'sài', bs: '贝', bh: 14, words: [['赛过', 'sài guò'], ['比赛', 'bǐ sài']] },
    { z: '感', py: 'gǎn', bs: '心', bh: 13, words: [['感到', 'gǎn dào'], ['感谢', 'gǎn xiè']] },
    { z: '怪', py: 'guài', bs: '忄', bh: 8, words: [['奇怪', 'qí guài'], ['怪不得', 'guài bu de']] },
    { z: '慢', py: 'màn', bs: '忄', bh: 14, words: [['慢慢', 'màn màn'], ['快慢', 'kuài màn']] },
  ],
  write: [
    { z: '棵', py: 'kē', bs: '木', bh: 12 },
    { z: '谢', py: 'xiè', bs: '讠', bh: 12 },
    { z: '想', py: 'xiǎng', bs: '心', bh: 13 },
    { z: '盯', py: 'dīng', bs: '目', bh: 7 },
    { z: '言', py: 'yán', bs: '言', bh: 7 },
    { z: '邻', py: 'lín', bs: '阝', bh: 7 },
    { z: '治', py: 'zhì', bs: '氵', bh: 8 },
    { z: '怪', py: 'guài', bs: '忄', bh: 8 },
  ],
});

/* ---------- 葫芦藤（因果链、分支两页共用）：状态全靠容器上的 class ----------
 * aph1 少量蚜虫 / aph2 蚜虫更多 / yellow 叶子变黄 / gyellow 葫芦变黄 / fall 葫芦落了 / cured 蚜虫治好了 / big 葫芦长大 */
const LEAVES = [[90, 92], [150, 120], [205, 88], [265, 124], [320, 90], [380, 122], [435, 88], [495, 120], [540, 92]];
const GOURDS = [130, 245, 360, 470];
function leafPath([x, y], i) {
  const s = i % 2 ? 1 : -1;
  return `<path class="hl-leaf" d="M${x} ${y}c${-24 * s} -6 ${-30 * s} -34 -4 -40c${18 * s} 8 ${26 * s} 26 4 40z"/>`;
}
function aphids([x, y], i) {
  const few = i % 3 === 0 ? `<circle class="a1" cx="${x - 4}" cy="${y - 14}" r="3.4"/><circle class="a1" cx="${x + 3}" cy="${y - 20}" r="3"/>` : '';
  return `${few}<circle class="a2" cx="${x - 6}" cy="${y - 24}" r="3.2"/><circle class="a2" cx="${x + 2}" cy="${y - 9}" r="3.4"/><circle class="a2" cx="${x + 5}" cy="${y - 28}" r="2.8"/>`;
}
function gourd(x, i) {
  return `<g class="hl-gourd" style="--d:${i * 0.25}s">
    <line x1="${x}" y1="66" x2="${x}" y2="${150}" stroke="#4d7a2e" stroke-width="3"/>
    <g class="hl-gbody"><circle cx="${x}" cy="164" r="14"/><circle cx="${x}" cy="192" r="22"/></g></g>`;
}
const VINE_SVG = `<svg viewBox="0 0 620 300" aria-label="葫芦藤：叶子、蚜虫、葫芦">
  <rect x="0" y="0" width="620" height="300" rx="16" fill="#eef6e6"/>
  <rect x="0" y="262" width="620" height="38" fill="#cdb48a"/>
  <line x1="40" y1="60" x2="580" y2="60" stroke="#b08a52" stroke-width="9" stroke-linecap="round"/>
  <line x1="60" y1="60" x2="60" y2="270" stroke="#b08a52" stroke-width="8"/><line x1="560" y1="60" x2="560" y2="270" stroke="#b08a52" stroke-width="8"/>
  <path d="M60 250C70 160 40 120 80 70S200 40 260 70S380 50 440 70S540 50 560 66" fill="none" stroke="#4d7a2e" stroke-width="5"/>
  ${GOURDS.map(gourd).join('')}
  ${LEAVES.map(leafPath).join('')}
  <g class="hl-aph">${LEAVES.map(aphids).join('')}</g>
</svg>`;
document.querySelectorAll('[data-vine]').forEach((el) => { el.innerHTML = VINE_SVG; });

const CHAIN_STATE = ['', 'aph1', 'aph1 aph2 yellow', 'aph1 aph2 yellow gyellow', 'aph1 aph2 yellow gyellow fall'];
const setVine = (el, cls) => { el.className = `hl-vine ${cls}`; };

/* ---------- 如果他听了邻居的话 ---------- */
const OUTCOME = {
  yes: { state: ['cured', 'cured big'], text: ['蚜虫没了，叶子绿油油的。', 'yá chóng méi le yè zi lǜ yóu yóu de'], text2: ['葫芦一天天长大，赛过大南瓜！', 'hú lu yì tiān tiān zhǎng dà sài guò dà nán guā'] },
  no: { state: ['aph1 aph2 yellow', 'aph1 aph2 yellow gyellow fall'], text: ['蚜虫更多了，叶子变黄了。', 'yá chóng gèng duō le yè zi biàn huáng le'], text2: ['小葫芦一个一个都落了。', 'xiǎo hú lu yí gè yí gè dōu luò le'] },
};
const BRANCH_DELAY = 1600;
function initBranch() {
  const vine = document.getElementById('hlBranch');
  const box = vine.closest('.hl-branch');
  const out = document.getElementById('hlResult');
  let timer = 0;
  const reset = () => { clearTimeout(timer); setVine(vine, 'aph1'); out.innerHTML = ''; box.querySelectorAll('[data-way]').forEach((b) => b.classList.remove('solid')); };
  box.addEventListener('click', (e) => {
    if (e.target.closest('.hl-reset')) { reset(); return; }
    const b = e.target.closest('[data-way]');
    if (!b) return;
    reset();
    b.classList.add('solid');
    const o = OUTCOME[b.dataset.way];
    setVine(vine, o.state[0]);
    out.innerHTML = Hanzi.ruby(...o.text);
    timer = setTimeout(() => { setVine(vine, o.state[1]); out.innerHTML += `<br>${Hanzi.ruby(...o.text2)}`; }, BRANCH_DELAY);
  });
  reset();
}

/* ---------- 识字游戏：捉蚜虫 ---------- */
const BUGS = [['葫', 'hú'], ['芦', 'lú'], ['藤', 'téng'], ['谢', 'xiè'], ['啊', 'a'], ['蚜', 'yá'], ['盯', 'dīng'], ['赛', 'sài'], ['感', 'gǎn'], ['怪', 'guài'], ['慢', 'màn']];
function initBugs() {
  const box = document.getElementById('hlBugs');
  box.innerHTML = `<div class="hl-leaves">${BUGS.map(([z, p], i) => `<button type="button" class="hl-bleaf" data-i="${i}" style="--r:${(i % 4) * 8 - 12}deg"><span class="hl-bug">${Hanzi.ruby(z, p)}</span></button>`).join('')}</div>
    <div class="hl-grow"><svg viewBox="0 0 120 150" aria-hidden="true"><line x1="60" y1="0" x2="60" y2="30" stroke="#4d7a2e" stroke-width="4"/><g class="hl-ggrow"><circle cx="60" cy="48" r="18" fill="#8cc152"/><circle cx="60" cy="96" r="34" fill="#8cc152"/></g></svg>
      <p id="hlBugMsg"></p><button type="button" class="btn" id="hlBugReset">再来一次</button></div>`;
  const msg = box.querySelector('#hlBugMsg');
  const update = () => {
    const n = box.querySelectorAll('.hl-bleaf.clean').length;
    box.style.setProperty('--g', 0.4 + 0.6 * (n / BUGS.length));
    box.classList.toggle('done', n === BUGS.length);
    msg.textContent = n === BUGS.length ? '蚜虫捉完了，葫芦长大啦！' : `捉走了 ${n} 只蚜虫`;
  };
  box.addEventListener('click', (e) => {
    if (e.target.closest('#hlBugReset')) { box.querySelectorAll('.hl-bleaf').forEach((l) => l.classList.remove('clean')); update(); return; }
    const l = e.target.closest('.hl-bleaf:not(.clean)');
    if (!l) return;
    l.classList.add('clean');
    update();
  });
  update();
}

window.LESSON = {
  init() {
    Narrative.init({});
    initBranch();
    initBugs();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    const chain = slide.querySelector('#hlChain');
    if (chain) setVine(chain, CHAIN_STATE[Math.min(step, CHAIN_STATE.length - 1)]);
  },
};
