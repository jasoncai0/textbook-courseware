'use strict';
/* 宝葫芦的秘密（四下 26）· 本课数据与互动。记叙文模板见 ../shared/narrative.js，翻页引擎见 ../shared/deck.js
 * 本课独有：“如果我有宝葫芦”想象转盘；另有奶奶和小葆“讲条件”的对话气泡、四个宝葫芦故事连一连。 */

/* 连一连：四个宝葫芦故事（本课与《古诗三首》各用一次连线） */
const MATCH = [
  { l: '张三', r: '劈面撞见了一位神仙' },
  { l: '李四', r: '出去远足旅行，一游游到了龙宫' },
  { l: '王五', r: '是个好孩子，肯让奶奶给他换衣服' },
  { l: '赵六', r: '掘地掘出来的' },
];
const MATCH_ORDER = [2, 0, 3, 1];
function initMatch(box, pairs, order) {
  box.innerHTML = `<svg class="mt-lines"></svg>
    <div class="mt-col">${pairs.map((p, i) => `<button type="button" class="mt-item mt-l" data-i="${i}">${p.l}</button>`).join('')}</div>
    <div class="mt-col">${order.map((i) => `<button type="button" class="mt-item mt-r" data-i="${i}">${pairs[i].r}</button>`).join('')}</div>`;
  const svg = box.querySelector('.mt-lines');
  const done = [];
  let sel = null;
  const draw = () => {
    const b = box.getBoundingClientRect();
    if (!b.width) return;
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    svg.innerHTML = done.map((i) => {
      const l = box.querySelector(`.mt-l[data-i="${i}"]`).getBoundingClientRect();
      const r = box.querySelector(`.mt-r[data-i="${i}"]`).getBoundingClientRect();
      return `<line x1="${l.right - b.left}" y1="${l.top + l.height / 2 - b.top}" x2="${r.left - b.left}" y2="${r.top + r.height / 2 - b.top}"/>`;
    }).join('');
  };
  box.addEventListener('click', (e) => {
    const it = e.target.closest('.mt-item');
    if (!it || it.classList.contains('ok')) return;
    if (it.classList.contains('mt-l')) {
      sel = it;
      box.querySelectorAll('.mt-l').forEach((x) => x.classList.toggle('sel', x === it));
      return;
    }
    if (!sel) return;
    if (sel.dataset.i === it.dataset.i) {
      done.push(sel.dataset.i);
      sel.classList.add('ok'); it.classList.add('ok');
      sel.classList.remove('sel'); sel = null;
      draw();
    } else {
      it.classList.remove('no'); void it.offsetWidth; it.classList.add('no'); // 重新触发抖动动画
    }
  });
  new ResizeObserver(draw).observe(box);
}

/* 想象转盘：前三格来自课文，后三格是我们的生活 */
const SECTORS = [
  { k: '算术题', c: '#f2c14e', text: '我有几次对着一道算术题发愣，不知道要怎么列式子，就由“8”字想到了宝葫芦——假如我有这么一个，那可就省心了。', ask: '王葆想要宝葫芦帮他做出算术题。如果是你，会怎么办？' },
  { k: '向日葵', c: '#9cc56b', pic: 'kui', text: '我家里的那几棵长得又瘦又长……比谁的也比不上。我就又想到了那个宝贝：“那，我得要一棵最好最好的向日葵，长得不能再棒的向日葵。”', ask: '变出来的向日葵，算不算王葆自己种的？' },
  { k: '科学小组', c: '#6fb1d6', text: '那一天我和科学小组的同学闹翻了，我又想到了它。“要是我有那么一个葫芦，那……”', ask: '课文没说完——王葆会让宝葫芦做什么？这样能和同学和好吗？' },
  { k: '考试前', c: '#e58a6b', text: '明天就要考试了，可是我还没复习……', ask: '如果我有宝葫芦，我会要什么？那样的“一百分”，我开心吗？' },
  { k: '新玩具', c: '#c39bd3', text: '同学有一个新玩具，我也特别想要……', ask: '如果我有宝葫芦，马上就能有。可是，靠攒零花钱得到的玩具，会不会更珍贵？' },
  { k: '值日', c: '#7fc8b2', text: '今天轮到我值日，教室那么大，要扫好久……', ask: '让宝葫芦一下子变干净？想一想，同学们会怎么看我？' },
];
const SPIN_TURNS = 5;
const SECTOR_DEG = 360 / SECTORS.length;
function arc(i) {
  const a0 = ((i * SECTOR_DEG - 90) * Math.PI) / 180;
  const a1 = (((i + 1) * SECTOR_DEG - 90) * Math.PI) / 180;
  const R = 150;
  return `M0 0 L${(R * Math.cos(a0)).toFixed(1)} ${(R * Math.sin(a0)).toFixed(1)} A${R} ${R} 0 0 1 ${(R * Math.cos(a1)).toFixed(1)} ${(R * Math.sin(a1)).toFixed(1)} Z`;
}
function initWheel() {
  const wheel = document.getElementById('wheel');
  const wish = document.getElementById('wish');
  wheel.innerHTML = `<g id="wheelRot">${SECTORS.map((s, i) => {
    const mid = ((i + .5) * SECTOR_DEG - 90) * Math.PI / 180;
    return `<path d="${arc(i)}" fill="${s.c}" stroke="#fff" stroke-width="3"/>
      <text x="${(95 * Math.cos(mid)).toFixed(1)}" y="${(95 * Math.sin(mid)).toFixed(1)}" class="wk" transform="rotate(${(((i + .5) * SECTOR_DEG) + (((i + .5) * SECTOR_DEG) > 100 && ((i + .5) * SECTOR_DEG) < 260 ? 180 : 0)).toFixed(0)} ${(95 * Math.cos(mid)).toFixed(1)} ${(95 * Math.sin(mid)).toFixed(1)})">${s.k}</text>`;
  }).join('')}<circle r="38" fill="#fff8e1" stroke="#c99a3c" stroke-width="4"/></g>`;
  const rot = document.getElementById('wheelRot');
  let angle = 0;
  let last = -1;
  document.getElementById('wheelGo').addEventListener('click', () => {
    let idx = Math.floor(Math.random() * SECTORS.length);
    if (idx === last) idx = (idx + 1) % SECTORS.length; // 连着两次别转到同一格
    last = idx;
    const target = 360 - (idx + .5) * SECTOR_DEG;
    angle += SPIN_TURNS * 360 + ((target - (angle % 360)) + 360) % 360;
    rot.style.transform = `rotate(${angle}deg)`;
    wish.classList.remove('show');
    setTimeout(() => {
      const s = SECTORS[idx];
      const fromText = idx < 3;
      wish.innerHTML = `<p class="wish-k" style="border-color:${s.c}">${fromText ? '课文里' : '我的生活'} · ${s.k}</p>
        ${s.pic ? `<div class="wish-img" style="background-image:url(assets/${s.pic}.jpg)"></div>` : ''}
        <p class="wish-t">${s.text}</p><p class="wish-a">${s.ask}</p>`;
      wish.classList.add('show');
    }, 3200);
  });
}

/* 读与写：创编故事 */
const MOMENTS = [
  {
    name: '张三', pic: 'hulu',
    prompt: '张三劈面撞见了一位神仙，得了一个宝葫芦……',
    hint: '神仙是什么样的？为什么把宝葫芦给张三？张三要了什么？后来呢？',
    example: '张三在山路上走着，劈面撞见一位白胡子神仙。神仙说：“你天天帮村里人挑水，这个宝葫芦送给你。”张三想：“我要吃水蜜桃。”立刻就有一盘水蜜桃。他把桃子分给了全村的孩子。可是第二天，他又想要一盘、两盘、十盘……桃子堆成了山，烂掉了也吃不完。张三这才明白：东西不是越多越好。',
  },
  {
    name: '李四', pic: 'longgong',
    prompt: '李四出去远足旅行，一游游到了龙宫，得到了一个宝葫芦……',
    hint: '龙宫里有什么奇妙的东西？龙王为什么送他宝葫芦？李四回到家以后发生了什么？',
    example: '李四一游游到了龙宫，看见珊瑚做的墙、珍珠铺的路。龙王说：“你是第一个游到这里的人，送你一个宝葫芦。”李四回到家，希望有一条大花狗，马上就冒出了一条，冲着他摇尾巴，舔他的手……',
  },
  {
    name: '王五', pic: 'xijiao',
    prompt: '王五因为是一个好孩子，肯让奶奶给他换衣服，所以得到了一个宝葫芦……',
    hint: '想一想，为什么“肯让奶奶换衣服”就能得到宝葫芦？宝葫芦会怎样奖励他、考验他？',
    example: '王五乖乖地让奶奶换衣服，衣服口袋里竟然滚出一个亮闪闪的宝葫芦。宝葫芦说：“好孩子，你要什么？”王五想了想说：“我要奶奶的腰不再疼。”第二天，奶奶果然又能弯腰种菜了……',
  },
  {
    name: '赵六', pic: 'kui',
    prompt: '赵六得的一个宝葫芦——那是掘地掘出来的……',
    hint: '赵六为什么掘地？掘出宝葫芦时是什么情景？他用宝葫芦要了什么？结局可以和别人不一样。',
    example: '赵六在院子里挖坑种向日葵，一锄头下去，“当”的一声，掘出一个金光闪闪的宝葫芦。他想：“我要一棵最高的向日葵！”向日葵一下子长得比房子还高。可是赵六一点也不高兴——他更想看自己种的小苗一天天长大……',
  },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initMatch(document.getElementById('matchHulu'), MATCH, MATCH_ORDER);
    initWheel();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
