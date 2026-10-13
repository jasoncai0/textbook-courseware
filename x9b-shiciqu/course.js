'use strict';
/* 诗词曲五首 · 本课数据与互动。诗文模板见 ../shared/poem.js；五首五种呈现：
 * 十五从军征“归家所见”镜头 / 白雪歌雪景时间滑块 / 南乡子问答体 / 过零丁洋人生两件大事对照 / 山坡羊“兴亡”翻转 */

const POEMS = {
  shiwu: {
    title: '十五从军征', author: '《乐府诗集》',
    // 半句一行（竖排放得下）；两行为一个镜头
    lines: [
      ['十五从军征，', '1.05 50% 50%'], ['八十始得归。', '1.05 50% 50%'], ['道逢乡里人：', '1.15 40% 55%'], ['“家中有阿谁？”', '1.15 40% 55%'],
      ['“遥看是君家，', '1.35 80% 30%'], ['松柏冢累累。”', '1.35 80% 30%'], ['兔从狗窦入，', '1.5 35% 45%'], ['雉从梁上飞。', '1.5 35% 45%'],
      ['中庭生旅谷，', '1.35 55% 70%'], ['井上生旅葵。', '1.35 55% 70%'], ['舂谷持作饭，', '1.4 60% 65%'], ['采葵持作羹。', '1.4 60% 65%'],
      ['羹饭一时熟，', '1.2 50% 60%'], ['不知饴阿谁。', '1.2 50% 60%'], ['出门东向看，', '1.03 50% 50%'], ['泪落沾我衣。', '1.03 50% 50%'],
    ].map(([t, f]) => ({ t, f })),
    notes: { 阿: '前缀，用在称谓或疑问代词前', 冢: '坟墓（读 zhǒng）', 累累: '众多的样子（读 lěi lěi）', 狗窦: '给狗出入的墙洞', 雉: '野鸡', 旅谷: '野生的谷子。旅，植物未经播种而生', 井: '这里指井台', 旅葵: '野生的葵菜', 舂谷: '用杵臼捣去谷物的皮壳', 持: '拿着', 羹: '用蔬菜煮的羹', 一时: '一会儿', 饴: '同“贻”，送给' },
  },
  baixue: {
    title: '白雪歌送武判官归京', author: '［唐］岑参',
    lines: ['北风卷地白草折，胡天八月即飞雪。', '忽如一夜春风来，千树万树梨花开。', '散入珠帘湿罗幕，狐裘不暖锦衾薄。', '将军角弓不得控，都护铁衣冷难着。', '瀚海阑干百丈冰，愁云惨淡万里凝。', '中军置酒饮归客，胡琴琵琶与羌笛。', '纷纷暮雪下辕门，风掣红旗冻不翻。', '轮台东门送君去，去时雪满天山路。', '山回路转不见君，雪上空留马行处。'].map((t) => ({ t })),
  },
  nanxiangzi: {
    title: '南乡子·登京口北固亭有怀', author: '［南宋］辛弃疾',
    lines: ['何处望神州？满眼风光北固楼。千古兴亡多少事？悠悠。不尽长江滚滚流。', '年少万兜鍪，坐断东南战未休。天下英雄谁敌手？曹刘。生子当如孙仲谋。'].map((t) => ({ t })),
  },
  lingding: {
    title: '过零丁洋', author: '［南宋］文天祥',
    lines: ['辛苦遭逢起一经，干戈寥落四周星。', '山河破碎风飘絮，身世浮沉雨打萍。', '惶恐滩头说惶恐，零丁洋里叹零丁。', '人生自古谁无死？留取丹心照汗青。'].map((t) => ({ t })),
  },
  shanpoyang: {
    title: '山坡羊·潼关怀古', author: '［元］张养浩',
    lines: ['峰峦如聚，波涛如怒，山河表里潼关路。', '望西都，意踌躇。', '伤心秦汉经行处，宫阙万间都做了土。', '兴，百姓苦；亡，百姓苦。'].map((t) => ({ t })),
  },
};
Poem.render(POEMS); // 必须在 deck.js 统计分步之前生成句子

/* 十五从军征：每一联配一个镜头说明，随诗句推进 */
const SHOTS = ['远景 · 白发老兵走在归乡路上', '中景 · 路遇乡人，急切一问', '远景 · 镜头摇向山坡，松柏下坟冢累累', '近景 · 狗洞里钻进野兔，梁上飞起野鸡', '中景 · 庭院长满野谷，井台长满野葵', '特写 · 一双老手舂谷、采葵', '特写 · 羹饭冒着热气，却无人可送', '全景 · 出门东望，泪落沾衣'];
function updateShot(slide) {
  const tag = slide.querySelector('.shot-tag');
  if (!tag) return;
  const n = slide.querySelectorAll('.poem-v .pl.on').length;
  tag.textContent = n ? SHOTS[Math.ceil(n / 2) - 1] : '镜头跟着老兵回家';
}

/* 白雪歌：时间滑块，从八月飞雪的清晨到雪上空留马行处 */
const SNOW = [
  { time: '清晨 · 塞外', lines: [0, 1], scene: '景', sky: '#9fb3c4', note: '北风、白草、八月飞雪——奇寒；“忽如一夜春风来，千树万树梨花开”——以春花喻冬雪，奇丽' },
  { time: '白天 · 帐中', lines: [2, 3], scene: '景', sky: '#b5c3cd', note: '珠帘、罗幕、狐裘、锦衾、角弓、铁衣——从帐内到帐外，写人的感受，侧面写奇寒' },
  { time: '白天 · 远望', lines: [4], scene: '景', sky: '#8d9aa6', note: '瀚海百丈冰、愁云万里凝——视野一下子拉开，雄浑壮阔，“愁”字为送别铺垫' },
  { time: '傍晚 · 饯别', lines: [5], scene: '事', sky: '#c9a77d', note: '中军置酒，胡琴、琵琶、羌笛——热闹的饯别宴，乐器越多越见情深' },
  { time: '黄昏 · 辕门', lines: [6], scene: '景', sky: '#7d6a73', note: '纷纷暮雪，红旗冻不翻——白中一点红，冷中一点暖，动中有静' },
  { time: '黄昏 · 东门', lines: [7], scene: '事', sky: '#5f6b80', note: '轮台东门送君去，雪满天山路——送别，雪路漫漫' },
  { time: '入夜 · 山路', lines: [8], scene: '情', sky: '#3b4459', note: '山回路转不见君，雪上空留马行处——人已远去，只剩蹄印，惜别之情悠悠不尽' },
];
function initSnow() {
  const range = document.getElementById('snowRange');
  const lines = POEMS.baixue.lines.map((l) => l.t);
  const render = () => {
    const s = SNOW[+range.value];
    document.getElementById('snowSky').style.background = `linear-gradient(180deg, ${s.sky}, #f4f2ee)`;
    document.getElementById('snowTime').textContent = s.time;
    document.getElementById('snowLines').innerHTML = s.lines.map((i) => `<p>${lines[i]}</p>`).join('');
    document.getElementById('snowNote').innerHTML = `<b>${s.scene === '景' ? '写景' : s.scene === '事' ? '叙事' : '抒情'}：</b>${s.note}`;
    document.querySelectorAll('#snowDots i').forEach((d, i) => d.classList.toggle('on', i <= +range.value));
  };
  document.getElementById('snowDots').innerHTML = SNOW.map(() => '<i></i>').join('');
  range.max = SNOW.length - 1;
  range.addEventListener('input', render);
  render();
}

/* 山坡羊：点“兴”或“亡”，答案都一样 */
function initFlip() {
  const out = document.getElementById('flipOut');
  document.getElementById('flipBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    document.querySelectorAll('#flipBtns .flip').forEach((x) => x.classList.toggle('sel', x === b));
    out.classList.remove('show');
    void out.offsetWidth; // 重新触发动画
    out.querySelector('span').textContent = b.dataset.f === 'xing'
      ? '兴：大兴土木，宫阙万间——征徭赋税压在百姓身上'
      : '亡：战火连年，宫阙成土——家破人亡的还是百姓';
    out.classList.add('show');
  });
}

/* 背诵：五首切换 */
function initRecite() {
  const boxes = [...document.querySelectorAll('.s-recite .recite')];
  document.getElementById('rcTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b) return;
    document.querySelectorAll('#rcTabs .btn').forEach((x) => x.classList.toggle('solid', x === b));
    boxes.forEach((x, i) => { x.hidden = i !== +b.dataset.r; });
  });
}

window.LESSON = {
  init() {
    Narrative.init({});
    Poem.init();
    initSnow();
    initFlip();
    initRecite();
  },
  onRender(slide, step) {
    Narrative.onRender(slide, step);
    updateShot(slide);
  },
};
