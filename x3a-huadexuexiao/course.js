'use strict';
/* 花的学校 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 连一连：[真实的花, 孩子眼里的花] */
const MATCH = [
  ['花还没开，藏在泥土里', '在地下的学校里上学，关了门做功课'],
  ['下雨了，花一下子开了', '雨一来，他们便放假了'],
  ['花在风雨里摇摆', '在绿草上跳舞，狂欢'],
  ['开出紫色、黄色、白色的花', '穿了紫的、黄的、白的衣裳'],
  ['花朵朝着天空开放', '对着天上的妈妈扬起双臂'],
];

/* 加点的部分：s 原句（<em> 是加点部分），plain 普通说法，feel 感觉 */
const FRESH = [
  { s: '湿润的东风<em>走过荒野</em>，在竹林中<em>吹着风笛</em>。', plain: '湿润的东风吹过荒野，竹林呜呜地响。', feel: '东风像一个人，迈着步子走过荒野，还会吹笛子！竹林的声音就是它的笛声。' },
  { s: '树枝在林中<em>互相碰触</em>着。', plain: '树枝在林中摇来摇去。', feel: '树枝像一群小伙伴，你碰碰我，我碰碰你，在打招呼。' },
  { s: '雷云<em>拍着大手</em>。', plain: '天上打着雷。', feel: '雷声是雷云在拍手，好像在为花孩子们放假鼓掌。' },
  { s: '雨一来，他们便<em>放假</em>了。', plain: '一下雨，花就开了。', feel: '把花开说成“放假”，花儿多像我们小学生！' },
];

const MOMENTS = [
  { name: '清风一吹', pic: 'tiaowu', prompt: '“清风一吹，他们……”花孩子们会做什么？', hint: '想想风吹花动的样子：点头、弯腰、摇摆……', example: '清风一吹，他们便摇头晃脑地唱起歌来，有的还弯下腰，向身边的小草问好。' },
  { name: '蝴蝶一来', pic: 'huijia', prompt: '“蝴蝶一来，他们……”花孩子们会怎样招待蝴蝶？', hint: '蝴蝶是花孩子的什么人？客人？好朋友？', example: '蝴蝶一来，他们便张开花瓣，把最香的花蜜捧出来，请这位好朋友尝一尝。' },
  { name: '太阳一出来', pic: 'leiyu', prompt: '“太阳一出来，他们……”', hint: '早晨的花，会像刚睡醒的孩子吗？', example: '太阳一出来，他们便揉揉眼睛，伸个懒腰，把花瓣一片一片地打开了。' },
];

/* 收集卡：点一下点亮，读一读，比一比普通说法，看感觉 */
function initFresh(box, items) {
  box.innerHTML = items.map((it, i) => `<button type="button" class="fresh-card" data-i="${i}">
    <span class="fc-star">★</span><span class="fc-s">${it.s}</span>
    ${it.plain ? `<span class="fc-plain"><b>普通说法：</b>${it.plain}</span>` : ''}
    <span class="fc-feel"><b>我的感觉：</b>${it.feel}</span></button>`).join('');
  document.getElementById('freshAll').textContent = items.length;
  box.addEventListener('click', (e) => {
    const card = e.target.closest('.fresh-card');
    if (!card) return;
    card.classList.toggle('lit');
    document.getElementById('freshN').textContent = box.querySelectorAll('.fresh-card.lit').length;
  });
}

/* 连一连：先点左边再点右边，配对成功两边编上同一个号 */
function initMatch(box, pairs) {
  const n = pairs.length;
  const order = pairs.map((_, i) => i).sort((a, b) => ((a * 3 + 2) % n) - ((b * 3 + 2) % n)); // 固定的打乱顺序
  box.innerHTML = `<div class="m-col">${pairs.map(([l], i) => `<button type="button" class="m-item m-l" data-i="${i}">${l}</button>`).join('')}</div>
    <div class="m-col">${order.map((i) => `<button type="button" class="m-item m-r" data-i="${i}">${pairs[i][1]}</button>`).join('')}</div>`;
  let sel = null;
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.m-item');
    if (!b || b.classList.contains('ok')) return;
    if (b.classList.contains('m-l')) {
      box.querySelectorAll('.m-l').forEach((x) => x.classList.toggle('sel', x === b));
      sel = b;
      return;
    }
    if (!sel) return;
    if (sel.dataset.i === b.dataset.i) {
      const no = box.querySelectorAll('.m-l.ok').length + 1;
      [sel, b].forEach((x) => { x.classList.remove('sel'); x.classList.add('ok'); x.dataset.n = no; });
      sel = null;
      document.getElementById('matchDone').hidden = box.querySelectorAll('.m-l.ok').length < n;
    } else {
      b.classList.remove('no');
      void b.offsetWidth; // 重新触发抖动动画
      b.classList.add('no');
    }
  });
}

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initFresh(document.getElementById('fresh'), FRESH);
    initMatch(document.getElementById('match'), MATCH);
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
