'use strict';
/* 大自然的声音 · 本课数据与示意音。页面逻辑见 ../shared/narrative.js、../shared/poem.js，翻页引擎见 ../shared/deck.js */

/* 背诵第 2～3 自然段（挖空用 poem.js 的背诵模块） */
const POEMS = {
  feng: {
    title: '第 2 自然段', author: '风',
    lines: [
      { t: '风，是大自然的音乐家。他会在森林里演奏他的手风琴。' },
      { t: '当他翻动树叶，树叶便像歌手一样，唱出各种不同的歌曲。' },
      { t: '不一样的树叶，有不一样的声音；不一样的季节，有不一样的音乐。' },
      { t: '当微风拂过，那声音轻轻柔柔的，好像呢喃细语，让人感受到大自然的温柔；' },
      { t: '当狂风吹起，整座森林都激动起来，合奏出一首雄伟的乐曲，那声音充满力量，令人感受到大自然的威力。' },
    ],
  },
  shui: {
    title: '第 3 自然段', author: '水',
    lines: [
      { t: '水，也是大自然的音乐家。下雨的时候，他喜欢玩打击乐器。' },
      { t: '小雨滴敲敲打打，一场热闹的音乐会便开始了。' },
      { t: '滴滴答答……叮叮咚咚……所有的树林，树林里的每片树叶；所有的房子，房子的屋顶和窗户，都发出不同的声音。' },
      { t: '当小雨滴汇聚起来，他们便一起唱着歌：小溪淙淙，流向河流；河流潺潺，流向大海；大海哗哗，汹涌澎湃。' },
      { t: '从一首轻快的山中小曲，唱到波澜壮阔的海洋大合唱。' },
    ],
  },
};
Poem.render(POEMS);

/* 课后第 3 题：描写声音的词语 → 谁的声音 */
const KINDS = ['微风', '狂风', '雨滴', '小溪', '大海'];
const SORT_ITEMS = [
  { s: '轻轻柔柔的呢喃细语', ok: ['微风'], q: '微风拂过，温柔' },
  { s: '雄伟的乐曲', ok: ['狂风'], q: '整座森林都激动起来' },
  { s: '充满力量的声音', ok: ['狂风'], q: '大自然的威力' },
  { s: '热闹的音乐会', ok: ['雨滴'], q: '小雨滴敲敲打打' },
  { s: '轻快的山中小曲', ok: ['小溪'], q: '小溪淙淙，流向河流' },
  { s: '波澜壮阔的海洋大合唱', ok: ['大海'], q: '大海哗哗，汹涌澎湃' },
];

/* 小练笔 */
const MOMENTS = [
  {
    name: '鸟儿是大自然的歌手', pic: 'dongwu',
    prompt: '以“鸟儿是大自然的歌手……”开头，写写你听到过的鸟叫声。',
    hint: '先写第一句，再写在哪里听到、是什么样的声音。可以用上“叽叽喳喳”这样的词，也可以说说它像什么。',
    example: '鸟儿是大自然的歌手。清晨，麻雀在窗外的电线上叽叽喳喳，好像在商量今天去哪儿玩；傍晚，燕子在屋檐下呢呢喃喃，像妈妈在哄宝宝睡觉。',
  },
  {
    name: '厨房是一个音乐厅', pic: 'yu',
    prompt: '以“厨房是一个音乐厅……”开头，写写厨房里的声音。',
    hint: '想一想：切菜、炒菜、烧水、洗碗，各是什么声音？谁像在打鼓，谁像在唱歌？',
    example: '厨房是一个音乐厅。妈妈切菜，菜刀在案板上笃笃笃地打着拍子；油锅里滋啦一声，像拉开了大幕；水壶呜呜地吹起了口哨，一场热闹的音乐会开始了。',
  },
  {
    name: '下课铃响了……', pic: 'xiliu',
    prompt: '校园里有哪些声音？以“校园是一个大音乐厅……”开头写几句话。',
    hint: '早读、课间、操场、风吹树叶……选两三种声音写，每种声音写清楚在哪里、像什么。',
    example: '校园是一个大音乐厅。早上，琅琅的读书声像小溪一样从每间教室流出来；下课铃一响，操场上的欢笑声就像大海一样哗哗地涌了起来。',
  },
];

/* ================= 示意音：Web Audio 现场合成，不下载音频文件 ================= */
const Sound = (() => {
  let ctx = null;
  let master = null;
  let active = null;
  const rand = (a, b) => a + Math.random() * (b - a);

  function audio() {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function noise(c, dur) {
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i += 1) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    return src;
  }

  // 一段风声 / 水声：白噪声 → 滤波（可被慢速 LFO 摆动） → 音量包络 [时间, 音量]
  function wash(c, out, t0, { dur, type, freq, q = 1, lfo = 0, lfoDepth = 0, env }) {
    const src = noise(c, dur);
    const f = c.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t0);
    env.forEach(([t, v]) => g.gain.linearRampToValueAtTime(v, t0 + t));
    if (lfo) {
      const osc = c.createOscillator();
      const depth = c.createGain();
      osc.frequency.value = lfo; depth.gain.value = lfoDepth;
      osc.connect(depth).connect(f.frequency);
      osc.start(t0); osc.stop(t0 + dur);
    }
    src.connect(f).connect(g).connect(out);
    src.start(t0); src.stop(t0 + dur);
  }

  // 一个短促的音：频率从 f1 滑到 f2，dur 秒内衰减
  function blip(c, out, t, { f1, f2 = f1, dur = .08, vol = .2, wave = 'sine' }) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = wave;
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g).connect(out);
    o.start(t); o.stop(t + dur + .02);
  }

  const RECIPES = {
    weifeng: (c, o, t) => wash(c, o, t, { dur: 4, type: 'lowpass', freq: 500, lfo: .35, lfoDepth: 200, env: [[1.2, .35], [2.2, .22], [3, .32], [4, 0]] }),
    kuangfeng: (c, o, t) => wash(c, o, t, { dur: 4, type: 'bandpass', freq: 900, q: .7, lfo: 1.1, lfoDepth: 600, env: [[.6, .9], [1.6, 1.2], [2.6, .8], [3.3, 1.2], [4, 0]] }),
    yudi: (c, o, t) => {
      for (let i = 0; i < 46; i += 1) blip(c, o, t + rand(0, 3.2), { f1: rand(900, 2600), f2: rand(500, 800), dur: rand(.04, .09), vol: rand(.08, .25) });
      [523, 659, 784, 880, 1047].forEach((f, i) => blip(c, o, t + .4 + i * .55, { f1: f, dur: .35, vol: .12, wave: 'triangle' }));
    },
    xiaoxi: (c, o, t) => {
      wash(c, o, t, { dur: 3.6, type: 'bandpass', freq: 2600, q: .6, lfo: 2.5, lfoDepth: 700, env: [[.3, .25], [3.2, .25], [3.6, 0]] });
      for (let i = 0; i < 30; i += 1) blip(c, o, t + rand(.1, 3.3), { f1: rand(450, 900), f2: rand(1000, 1500), dur: .05, vol: .12 });
    },
    heliu: (c, o, t) => {
      wash(c, o, t, { dur: 4, type: 'lowpass', freq: 1100, lfo: .4, lfoDepth: 300, env: [[.5, .45], [3.5, .45], [4, 0]] });
      for (let i = 0; i < 14; i += 1) blip(c, o, t + rand(.2, 3.6), { f1: rand(250, 450), f2: rand(500, 700), dur: .07, vol: .1 });
    },
    dahai: (c, o, t) => wash(c, o, t, { dur: 5.4, type: 'lowpass', freq: 750, q: .5, env: [[1.3, 1.1], [2.6, .08], [3.9, 1.2], [5.4, 0]] }),
    niao: (c, o, t) => {
      let k = t;
      for (let i = 0; i < 16; i += 1) {
        k += i % 4 === 3 ? .35 : rand(.08, .14);
        blip(c, o, k, { f1: rand(2600, 3200), f2: rand(3800, 4800), dur: .06, vol: .18 });
      }
    },
    chong: (c, o, t) => {
      for (let r = 0; r < 4; r += 1) {
        const base = t + r * .8;
        [[0, .16], [.22, .07], [.33, .07]].forEach(([d, len]) => {
          for (let p = 0; p < len; p += .025) blip(c, o, base + d + p, { f1: 4700, dur: .018, vol: .12 });
        });
      }
    },
    qingwa: (c, o, t) => {
      for (let r = 0; r < 3; r += 1) {
        [0, .28].forEach((d) => blip(c, o, t + r * 1.1 + d, { f1: 190, f2: 140, dur: .2, vol: .35, wave: 'sawtooth' }));
      }
    },
  };
  const LENGTH = { weifeng: 4, kuangfeng: 4, yudi: 3.6, xiaoxi: 3.6, heliu: 4, dahai: 5.4, niao: 3, chong: 3.4, qingwa: 3.4 };

  function stop() {
    if (master) {
      const old = master;
      old.gain.setTargetAtTime(0, ctx.currentTime, .05);
      setTimeout(() => old.disconnect(), 300);
      master = null;
    }
    if (active) { clearTimeout(active.timer); document.querySelectorAll('.playing').forEach((b) => b.classList.remove('playing')); active = null; }
  }

  function play(name, btn) {
    const wasSame = active && active.name === name;
    stop();
    if (wasSame || !RECIPES[name]) return;
    const c = audio();
    master = c.createGain();
    master.gain.value = .7;
    // 青蛙的声音要再过一道滤波，听起来更像“呱”
    if (name === 'qingwa') {
      const f = c.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 3;
      f.connect(master);
      RECIPES[name](c, f, c.currentTime + .05);
    } else {
      RECIPES[name](c, master, c.currentTime + .05);
    }
    master.connect(c.destination);
    btn.classList.add('playing');
    active = { name, timer: setTimeout(stop, LENGTH[name] * 1000 + 200) };
  }

  return { play, stop };
})();

/* 课后第 2 题：点空格揭晓 */
function initTree() {
  document.querySelectorAll('.tree-head.blank').forEach((b) => b.addEventListener('click', () => {
    b.textContent = b.dataset.ans;
    b.classList.add('filled');
  }));
}

let lastSlide = null;
window.LESSON = {
  init() {
    Narrative.init({ kinds: KINDS, sort: SORT_ITEMS, moments: MOMENTS });
    Poem.init();
    initTree();
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-snd]');
      if (b) Sound.play(b.dataset.snd, b);
    });
  },
  onRender(slide, step) {
    if (slide !== lastSlide) { Sound.stop(); lastSlide = slide; }
    Narrative.onRender(slide, step);
  },
};
