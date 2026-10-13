'use strict';
/* 济南的冬天 · 本课数据与互动。画面、字幕、朗读符号、小练笔见 ../shared/narrative.js */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* 拟人：原句里 [ ] 标出拟人词；flat 是去掉拟人的平实说法 */
const NIREN = [
  { s: '一个老城，有山有水，全在蓝天下很[暖和安适地睡着]，只等春风来把他们[唤醒]，这是不是个理想的境界？',
    flat: '一个老城，有山有水，在蓝天下很暖和，没有一点儿风，冬天快过去了，春天就要来了，这是不是个理想的境界？',
    why: '老城像一个安睡的人，“睡着”写出安静、温暖、舒适；“唤醒”写出对春天的期待。' },
  { s: '这一圈小山在冬天特别可爱，好像是把济南放在一个小摇篮里，他们全[安静不动地低声地说]：“[你们放心吧，这儿准保暖和]。”',
    flat: '这一圈小山在冬天特别可爱，把济南围在中间，挡住了北风，所以济南很暖和。',
    why: '小山像慈爱的母亲，轻声安慰摇篮里的孩子。写出了小山的可爱，也写出了济南冬天的“温”。' },
  { s: '等到快日落的时候，微黄的阳光斜射在山腰上，那点儿薄雪好像[忽然害了羞]，[微微露出点儿粉色]。',
    flat: '等到快日落的时候，微黄的阳光斜射在山腰上，照在薄雪上，雪就显出一点儿粉色。',
    why: '夕阳映雪本是光的颜色，作者却写成少女害羞脸红，薄雪变得娇美可爱，透出作者的喜爱。' },
];

function initNiren() {
  const list = document.getElementById('nrList');
  list.innerHTML = NIREN.map((n, i) => `<div class="nr-row" data-i="${i}">
    <p class="nr-s">${i + 1}. <span class="nr-orig">${esc(n.s).replace(/\[([^\]]+)\]/g, '<em>$1</em>')}</span><span class="nr-flat">${esc(n.flat)}</span></p>
    <div class="nr-foot"><button type="button" class="btn nr-btn">去掉拟人</button><span class="nr-why">${esc(n.why)}</span></div></div>`).join('');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.nr-btn');
    if (!b) return;
    const row = b.closest('.nr-row');
    const flat = row.classList.toggle('flat');
    row.classList.add('seen');
    b.textContent = flat ? '换回原句' : '去掉拟人';
  });
}

const MOMENTS = [
  { name: '一个词点特点', pic: 'xiaoshan', prompt: '先用一个词概括家乡冬天的特点，再选两三样景物来“作证”。',
    hint: '老舍用“温晴”统领全文，小山、薄雪、水色都在写“温晴”。你家乡的冬天呢？干冷？湿冷？银白？暖绿？',
    example: '我家乡的冬天，一个字：白。一场雪下来，屋顶白了，田野白了，连村口那棵老槐树也白了头。早上推开门，雪没过脚踝，踩上去咯吱咯吱响……' },
  { name: '用对比突出', pic: 'shuise', prompt: '学第 1 段，拿别处的冬天和家乡的冬天比一比。',
    hint: '北平的风、伦敦的雾、热带的毒日头，一比，济南的温晴就格外珍贵。你可以拿书上读到的、电视里看到的冬天来比。',
    example: '电视里，北方的冬天是“千里冰封”；可在我的家乡，冬天的河照样哗哗地流，山上的竹子照样绿着，只有早晨的薄霜，悄悄告诉你：冬天来了。' },
  { name: '让景物有人情味', pic: 'boxue', prompt: '学小山、薄雪，用拟人写一样冬天的景物。',
    hint: '小山会“低声地说”，薄雪会“害了羞”。想一想：家乡冬天的太阳、风、树、河，会做什么，会说什么？',
    example: '冬天的太阳是个懒孩子，早上七点多才慢吞吞地爬上山头，下午四点多，又急急忙忙地躲回山后去了。' },
];

window.LESSON = {
  init() {
    Narrative.init({ moments: MOMENTS });
    initNiren();
  },
  onRender: (slide, step) => Narrative.onRender(slide, step),
};
