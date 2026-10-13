'use strict';
/* 刘姥姥进大观园 · 本课数据与互动：“笑”的群像图（座次图点人物）、雅俗对照。通用部分见 ../shared/narrative.js */

/* 群像：x / y 为在厅堂里的位置（%），t 课本原文，how 笑法，why 合乎身份性格 */
const PEOPLE = [
  { n: '贾母', x: 22, y: 30, t: '贾母笑的搂着叫“心肝”', how: '搂着叫', why: '老祖宗疼爱孙子，笑中带慈爱。' },
  { n: '宝玉', x: 34, y: 18, t: '宝玉滚到贾母怀里', how: '滚', why: '最受宠的孙子，撒娇放任。' },
  { n: '湘云', x: 10, y: 18, t: '湘云掌不住，一口茶都喷出来。', how: '喷茶', why: '性格豪爽，憋不住就喷出来。' },
  { n: '黛玉', x: 10, y: 42, t: '黛玉笑岔了气，伏着桌子只叫“嗳哟！”', how: '笑岔气', why: '身子娇弱，笑得伏在桌上。' },
  { n: '宝钗', x: 34, y: 42, t: '（课文没写宝钗怎么笑）', how: '没写', why: '端庄稳重的宝钗，作者不写，留给读者想象。' },
  { n: '王夫人', x: 70, y: 18, t: '王夫人笑的用手指着凤姐儿，却说不出话来。', how: '指着凤姐', why: '一眼看出是凤姐导演的，长辈的笑也有分寸。' },
  { n: '薛姨妈', x: 92, y: 30, t: '薛姨妈也掌不住，口里的茶喷了探春一裙子。', how: '喷茶', why: '连坐在一边吃茶的客人也忍不住。' },
  { n: '探春', x: 62, y: 42, t: '探春的茶碗都合在迎春身上。', how: '茶碗翻倒', why: '笑得手里的茶碗都扣到旁人身上。' },
  { n: '惜春', x: 80, y: 42, t: '惜春离了坐位，拉着他奶母，叫“揉揉肠子”。', how: '揉肠子', why: '年纪最小，孩子气。' },
  { n: '地下众人', x: 52, y: 88, t: '地下无一个不弯腰屈背，也有躲出去蹲着笑去的，也有忍着笑上来替他姐妹换衣裳的。', how: '弯腰 · 躲 · 忍', why: '丫鬟婆子不敢放肆，笑也要躲着、忍着。' },
  { n: '凤姐 · 鸳鸯', x: 50, y: 62, t: '独有凤姐鸳鸯二人掌着，还只管让刘姥姥。', how: '不笑（掌着）', why: '她们是“导演”，戏还要往下演。' },
  { n: '刘姥姥', x: 22, y: 62, t: '说完，却鼓着腮帮子，两眼直视，一声不语。', how: '不笑', why: '主角一本正经，才最好笑。' },
];

function initHall() {
  const hall = document.getElementById('hall');
  const card = document.getElementById('lgCard');
  const seen = new Set();
  document.getElementById('lgT').textContent = PEOPLE.length;
  hall.insertAdjacentHTML('beforeend', PEOPLE.map((p, i) =>
    `<button type="button" class="pp${p.n === '刘姥姥' ? ' liu' : ''}" data-i="${i}" style="left:${p.x}%;top:${p.y}%">${p.n}</button>`).join(''));
  hall.addEventListener('click', (e) => {
    const b = e.target.closest('.pp');
    if (!b) return;
    const p = PEOPLE[+b.dataset.i];
    seen.add(p.n);
    b.classList.add('seen');
    hall.querySelectorAll('.pp').forEach((x) => x.classList.toggle('cur', x === b));
    card.innerHTML = `<p class="lg-who">${p.n}<i>${p.how}</i></p><p class="lg-t">${p.t}</p><p class="lg-why">${p.why}</p>`;
    document.getElementById('lgN').textContent = seen.size;
    document.getElementById('lgSum').hidden = seen.size < PEOPLE.length;
  });
}

/* 雅与俗：贾府之物 → 刘姥姥的话（课本原文） */
const PAIRS = [
  { ya: '老太太正房的大箱、大柜', su: '“那柜子比我们一间房子还大，还高。”' },
  { ya: '老年四楞象牙镶金的筷子', su: '“这个叉巴子，比我们那里的铁锨还沉，那里拿的动他？”' },
  { ya: '一碗鸽子蛋', su: '“这里的鸡儿也俊，下的这蛋也小巧，怪俊的。我且得一个儿！”' },
  { ya: '“一两银子一个呢！”', su: '“一两银子也没听见个响声儿就没了！”' },
  { ya: '乌木镶银的筷子：“菜里要有毒，这银子下去了就试的出来。”', su: '“这个菜里有毒，我们那些都成了砒霜了！那怕毒死了，也要吃尽了。”' },
  { ya: '李纨与凤姐儿对坐着吃饭', su: '“别的罢了，我只爱你们家这行事！怪道说，‘礼出大家’。”' },
];

function initPairs() {
  const box = document.getElementById('pairs');
  box.innerHTML = PAIRS.map((p) => `<button type="button" class="pair"><span class="ya">${p.ya}</span><span class="su">${p.su}</span></button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.pair');
    if (b) b.classList.add('open');
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    initHall();
    initPairs();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
