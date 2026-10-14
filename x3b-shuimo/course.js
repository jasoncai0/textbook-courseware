'use strict';
/* 童年的水墨画 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js 与诗文模板 ../shared/poem.js，翻页引擎见 ../shared/deck.js */

/* 背诵《溪边》（必须在 deck.js 统计分步之前渲染） */
Poem.render({
  xibian: {
    title: '溪边', author: '张继楼',
    lines: [
      { t: '垂柳把溪水当作梳妆的镜子，' },
      { t: '山溪像绿玉带一样平静。' },
      { t: '人影给溪水染绿了，' },
      { t: '钓竿上立着一只红蜻蜓。' },
      { t: '忽然扑腾一声人影碎了，' },
      { t: '草地上蹦跳着鱼儿和笑声。' },
    ],
  },
});

/* 品读 · 连一连：诗句 ↔ 画面（右栏固定打乱顺序 LINK_ORDER） */
const LINKS = [
  { l: '钓竿上立着一只红蜻蜓。', r: '孩子一动不动，钓得又专心又安静。', how: '联系生活：蜻蜓怕人，人一动它就飞走。' },
  { l: '草地上蹦跳着鱼儿和笑声。', r: '鱼儿钓上来在草地上蹦，孩子乐得哈哈笑。', how: '想象画面。' },
  { l: '是哪个“水葫芦”一下钻入水中。', r: '一个孩子在水里一沉一浮，像个葫芦。', how: '抓住引号，联系上下文。' },
  { l: '出水时只见一阵水花两排银牙。', r: '孩子钻出水面，咧嘴笑，露出白白的牙。', how: '想象画面。' },
  { l: '松树刚洗过澡一身清清爽爽。', r: '刚下过雨，松树被冲得干干净净。', how: '联系下文“松针上一串串雨珠”。' },
  { l: '是谁一声欢叫把雨珠抖落。', r: '孩子采到蘑菇一声欢叫，碰得树枝一晃。', how: '想象画面、联系上下文。' },
];
const LINK_ORDER = [3, 0, 5, 1, 4, 2];

function initLink(box, links, order) {
  box.innerHTML = `<svg class="link-lines"></svg>
    <div class="link-col">${links.map((it, i) => `<button class="link-l" type="button" data-i="${i}">${it.l}<small></small></button>`).join('')}</div>
    <div class="link-col">${order.map((i) => `<button class="link-r" type="button" data-i="${i}">${links[i].r}</button>`).join('')}</div>`;
  const svg = box.querySelector('.link-lines');
  const draw = () => {
    const o = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${o.width} ${o.height}`);
    svg.innerHTML = [...box.querySelectorAll('.link-l.done')].map((l) => {
      const r = box.querySelector(`.link-r[data-i="${l.dataset.i}"]`).getBoundingClientRect();
      const a = l.getBoundingClientRect();
      return `<line x1="${a.right - o.left}" y1="${a.top + a.height / 2 - o.top}" x2="${r.left - o.left}" y2="${r.top + r.height / 2 - o.top}"/>`;
    }).join('');
  };
  let picked = null;
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.classList.contains('done')) return;
    if (btn.classList.contains('link-l')) {
      box.querySelectorAll('.link-l').forEach((b) => b.classList.toggle('sel', b === btn));
      picked = btn;
      return;
    }
    if (!picked) return;
    if (btn.dataset.i === picked.dataset.i) {
      picked.classList.add('done'); btn.classList.add('done'); picked.classList.remove('sel');
      picked.querySelector('small').textContent = `方法：${links[+picked.dataset.i].how}`;
      picked = null;
      box.closest('.slide').classList.toggle('link-all', !box.querySelector('.link-l:not(.done)'));
    } else {
      btn.classList.remove('no'); void btn.offsetWidth; btn.classList.add('no');
    }
    requestAnimationFrame(draw);
  });
  new ResizeObserver(draw).observe(box);
}

/* 读与写 · 我的童年水墨画 */
const MOMENTS = [
  {
    name: '放风筝', pic: 'jiangshang',
    prompt: '春天，你和小伙伴在田野上放风筝。学着课文，写几行小诗。',
    hint: '先写安静的景，再写一个热闹的瞬间；用一个“像……”。',
    example: '油菜花把田埂铺成金色的路，\n风筝像一只只鸟儿在天上休息。\n忽然哗啦一声线断了，\n田野里追跑着孩子和笑声。',
  },
  {
    name: '踩水坑', pic: 'linzhong',
    prompt: '雨停了，你穿着雨靴去踩水坑。学着课文，写几行小诗。',
    hint: '雨后的景物是什么样的？踩下去的那一刻发生了什么？',
    example: '雨停了，水坑把天空装进口袋，\n小雨靴站在白云上面。\n啪嗒一声天空碎了，\n巷子里溅满了水花和笑声。',
  },
  {
    name: '捉蜻蜓', pic: 'xibian',
    prompt: '夏天的草地上，你悄悄地去捉蜻蜓。学着课文，写几行小诗。',
    hint: '捉之前多安静？捉的那一下多热闹？',
    example: '荷叶把池塘撑成一把把绿伞，\n红蜻蜓落在伞尖上打盹。\n小手一扑它飞走了，\n草地上只剩下脚印和笑声。',
  },
  {
    name: '采蘑菇', pic: 'mogu',
    prompt: '你也像《林中》的孩子一样去采蘑菇。写写你看到、听到的。',
    hint: '可以学课文“蘑菇像斗笠，斗笠像蘑菇”的写法。',
    example: '雨后的山坡冒出许多小伞，\n小伞下躲着一只只蚂蚁。\n“我找到啦！”一声欢叫，\n草丛里的小伞和小脸一起笑了。',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initLink(document.getElementById('linkBox'), LINKS, LINK_ORDER);
    Poem.init();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
