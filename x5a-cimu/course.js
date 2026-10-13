'use strict';
/* 慈母情深 · 本课数据。页面逻辑见记叙文模板 ../shared/narrative.js，翻页引擎见 ../shared/deck.js */

/* 课后第 1 题 · 细节里的情 */
const CLUE_LABELS = ['细节', '藏着的感情'];
const CLUES = [
  { q: '看见一个极其瘦弱的脊背弯曲着，头凑到缝纫机板上。周围几只灯泡烤着我的脸。', a: '母亲<b>瘦弱、劳累</b>，在闷热的角落里一干就是一整天。' },
  { q: '母亲掏衣兜，掏出一卷揉得皱皱的毛票，用皲裂的手指数着。', a: '钱是一毛一毛<b>辛苦挣来</b>的；“我”看着这双手，<b>羞愧、自责</b>。' },
  { q: '母亲却已将钱塞在我手里了，大声回答那个女人：“谁叫我们是当妈的呀！我挺高兴他爱看书的！”', a: '<b>毫不犹豫</b>，再难也支持孩子读书——这就是“慈母情深”。' },
  { q: '那一天母亲数落了我一顿。数落完，又给我凑足了买《青年近卫军》的钱。', a: '自己<b>舍不得</b>吃一听罐头，却一定要<b>成全</b>孩子的心愿。' },
];

/* 小练笔 · 鼻子一酸 */
const MOMENTS = [
  { name: '“我”为什么鼻子一酸', pic: 'paochu',
    prompt: '联系上下文，说说为什么“我”拿到钱时“鼻子一酸”。',
    hint: '想一想“我”看到了什么：闷热嘈杂的厂房、瘦弱弯曲的脊背、疲惫的眼睛、皲裂的手指；听到了什么：旁边那个女人的话、母亲的回答。',
    example: '“我”第一次看到母亲挣钱的地方，那么低矮闷热、震耳欲聋；第一次看到母亲那么瘦小、那么疲惫。这一元五角钱，是母亲用皲裂的手一针一线挣来的，她却毫不犹豫地塞给了“我”。“我”心疼母亲，又为自己向母亲要钱感到羞愧，所以鼻子一酸。' },
  { name: '我的“鼻子一酸”', pic: 'shuqian',
    prompt: '你有过“鼻子一酸”的经历吗？试着写一写。',
    hint: '学课文：写清当时的场景，抓住一两个细节（一个动作、一双手、一句话），让感情藏在里面。',
    example: '那天晚上我起来喝水，看见厨房的灯还亮着。妈妈坐在小板凳上，正在给我缝明天要穿的校服。她把针在头发上蹭了蹭，眯着眼睛穿线，穿了好几次才穿过去。我看见她手背上贴着两块创可贴，鼻子一酸，悄悄地回到了床上。' },
  { name: '我的“第一次”', pic: 'zhuanshen',
    prompt: '语文园地：仿照“那一天我第一次发现……那一天我第一次觉得……”，写一写你成长中的“第一次”。',
    hint: '写清是哪一天、发生了什么，再写你第一次发现或明白了什么。',
    example: '那一天我第一次发现，爸爸的头上有了白头发。那一天我第一次觉得，我应该帮爸爸分担一些了。' },
];

/* 场景页：七八十只灯泡 */
const LAMP_COUNT = 80;
function initLamps(box) {
  box.innerHTML = Array.from({ length: LAMP_COUNT }, () => '<i></i>').join('');
}

/* 对比原句和普通说法 */
function initRepeat() {
  document.querySelectorAll('.rep-btn').forEach((btn) => btn.addEventListener('click', () => {
    const on = btn.closest('.rep').classList.toggle('plain');
    btn.textContent = on ? '换回原文' : '换成普通说法比一比';
  }));
}

/* 慢镜头：显示第几帧 */
function updateFrameNo(slide, step) {
  const el = slide.querySelector('#frameNo');
  if (el) el.textContent = step ? `慢镜头 · 第 ${step} 帧` : '慢镜头';
}

window.LESSON = {
  init() {
    Narrative.init({ clues: CLUES, clueLabels: CLUE_LABELS, moments: MOMENTS });
    initLamps(document.getElementById('lamps'));
    initRepeat();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateFrameNo(slide, step);
  },
};
