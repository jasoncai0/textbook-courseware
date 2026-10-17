'use strict';
/* 课本插件 · 课程目录数据。新做好一课：给该课补上 dir（课件目录名）、cover（封面图）、desc（一句话亮点）即可上线到目录页。
 * genre 决定用哪套模板：说明 → 说明文模板（信息图），叙事 → 记叙文模板（画面 + 字幕），诗文 → 诗词文言（待做）
 */
window.CATALOG = [
  {
    subject: '语文',
    books: [
      {
        name: '一年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '识字（一）', motto: '', goals: [],
            lessons: [
              { no: '识字 1', title: '天地人', genre: '识字', kind: '识字',
                dir: 'x1a-tiandiren', cover: 'x1a-tiandiren/assets/tiandi.jpg', pages: 11,
                desc: '看图识字 · 人大天字理 · 拖字配图',
              },
              { no: '识字 2', title: '金木水火土', genre: '识字', kind: '识字',
                dir: 'x1a-jinmushui', cover: 'x1a-jinmushui/assets/tiandi.jpg', pages: 13,
                desc: '五行小动画 · 数小棒认一二三 · 开火车读',
              },
              { no: '识字 3', title: '口耳目', genre: '识字', kind: '识字',
                dir: 'x1a-kouermu', cover: 'x1a-kouermu/assets/huayuan.jpg', pages: 13,
                desc: '指一指身体部位 · 古字翻翻乐 · 站如松做动作',
              },
              { no: '识字 4', title: '日月水火', genre: '识字', kind: '识字',
                dir: 'x1a-riyueshui', cover: 'x1a-riyueshui/assets/shanshui.jpg', pages: 13,
                desc: '象形字演变 · 画里找藏字 · 猜一猜连一连',
              },
              { no: '识字 5', title: '对韵歌', genre: '识字', kind: '识字',
                dir: 'x1a-duiyunge', cover: 'x1a-duiyunge/assets/shanshui.jpg', pages: 14,
                desc: '拍手打节拍读对子 · 对对子游戏 · 背诵挖空',
              },
            ],
          },
          {
            no: '汉语拼音（一）', motto: '', goals: [],
            lessons: [
              { no: '拼音 1', title: 'a o e', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-aoe', cover: 'x1a-aoe/assets/qingjing.jpg', pages: 7,
                desc: '情境图找字母 · 小汽车走声调',
              },
              { no: '拼音 2', title: 'i u ü y w', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-iuv', cover: 'x1a-iuv/assets/qingjing.jpg', pages: 9,
                desc: 'ü 两点飘走演示 · 大 y 小 i 整体认读',
              },
              { no: '拼音 3', title: 'b p m f', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-bpmf', cover: 'x1a-bpmf/assets/qingjing.jpg', pages: 9,
                desc: '四线三格音节表开火车 · 首学两拼',
              },
              { no: '拼音 4', title: 'd t n l', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-dtnl', cover: 'x1a-dtnl/assets/qingjing.jpg', pages: 9,
                desc: '拍手读《轻轻跳》· n l 见 ü 不去点',
              },
              { no: '拼音 5', title: 'g k h', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-gkh', cover: 'x1a-gkh/assets/qingjing.jpg', pages: 10,
                desc: '三拼音节专页 · 儿歌里找 g k h',
              },
              { no: '拼音 6', title: 'j q x', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-jqx', cover: 'x1a-jqx/assets/qingjing.jpg', pages: 10,
                desc: 'j q x 见 ü 摘帽演示 · 拍手读儿歌',
              },
              { no: '拼音 7', title: 'z c s', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-zcs', cover: 'x1a-zcs/assets/qingjing.jpg', pages: 10,
                desc: '字→词语→句子 · 开火车读音节',
              },
              { no: '拼音 8', title: 'zh ch sh r', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-zhchshr', cover: 'x1a-zhchshr/assets/qingjing.jpg', pages: 10,
                desc: '平翘舌对比 · 拍手读绕口令',
              },
            ],
          },
          {
            no: '汉语拼音（二）', motto: '', goals: [],
            lessons: [
              { no: '拼音 9', title: 'ai ei ui', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-aieiui', cover: 'x1a-aieiui/assets/qingjing.jpg', pages: 10,
                desc: '标调口诀逐行演示 · 洗手歌找韵母',
              },
              { no: '拼音 10', title: 'ao ou iu', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-aoouiu', cover: 'x1a-aoouiu/assets/qingjing.jpg', pages: 10,
                desc: 'iu ui 标调对比 · 开火车读音节',
              },
              { no: '拼音 11', title: 'ie üe er', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-ieueer', cover: 'x1a-ieueer/assets/qingjing.jpg', pages: 10,
                desc: 'ü 遇 y/j q x 去点、遇 n l 不去 · 找一找',
              },
              { no: '拼音 12', title: 'an en in un ün', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-anen', cover: 'x1a-anen/assets/qingjing.jpg', pages: 10,
                desc: '五个前鼻韵母 + yuan yin yun · 拍手读',
              },
              { no: '拼音 13', title: 'ang eng ing ong', genre: '拼音', kind: '汉语拼音',
                dir: 'x1a-angeng', cover: 'x1a-angeng/assets/qingjing.jpg', pages: 10,
                desc: '前后鼻韵母对比 · 16 个整体认读汇总',
              },
            ],
          },
          {
            no: '课文（一）', motto: '', goals: [],
            lessons: [
              { no: 1, title: '秋天', genre: '叙事', kind: '散文',
                dir: 'x1a-qiutian', cover: 'x1a-qiutian/assets/luoye.jpg', pages: 13,
                desc: '大雁排队字幕 · 一的变调 · 背诵挖空',
              },
              { no: 2, title: '小小的船', genre: '诗文', kind: '儿童诗',
                dir: 'x1a-xiaochuan', cover: 'x1a-xiaochuan/assets/chuanli.jpg', pages: 13,
                desc: '弯月加帆变小船 · 月相会变样',
              },
              { no: 3, title: '江南', genre: '诗文', kind: '古诗',
                dir: 'x1a-jiangnan', cover: 'x1a-jiangnan/assets/yuxi.jpg', pages: 11,
                desc: '注音诗板 · 点方向小鱼游东西南北',
              },
              { no: 4, title: '四季', genre: '诗文', kind: '儿童诗',
                dir: 'x1a-siji', cover: 'x1a-siji/assets/xia.jpg', pages: 11,
                desc: '四季轮盘读四季 · 景物季节连一连',
              },
            ],
          },
          {
            no: '识字（二）', motto: '', goals: [],
            lessons: [
              { no: '识字 6', title: '画', genre: '识字', kind: '识字',
                dir: 'x1a-hua', cover: 'x1a-hua/assets/zhenshan.jpg', pages: 13,
                desc: '谜语诗 · 真山水视频对比画 · 钓鱼识字',
              },
              { no: '识字 7', title: '大小多少', genre: '识字', kind: '识字',
                dir: 'x1a-daxiao', cover: 'x1a-daxiao/assets/niumao.jpg', pages: 14,
                desc: '跟着画面读儿歌 · 选量词 · 看图比一比',
              },
              { no: '识字 8', title: '小书包', genre: '识字', kind: '识字',
                dir: 'x1a-shubao', cover: 'x1a-shubao/assets/zaoqi.jpg', pages: 13,
                desc: '认文具词语 · 整理书包游戏 · 背儿歌',
              },
              { no: '识字 9', title: '日月明', genre: '识字', kind: '识字',
                dir: 'x1a-riyueming', cover: 'x1a-riyueming/assets/zhishu.jpg', pages: 15,
                desc: '字的加法：会意字拼一拼 · 猜泪休歪',
              },
              { no: '识字 10', title: '升国旗', genre: '识字', kind: '识字',
                dir: 'x1a-shengguoqi', cover: 'x1a-shengguoqi/assets/tiankong.jpg', pages: 13,
                desc: '标准国旗 SVG 徐徐升起 · 数五星 · 开火车读',
              },
            ],
          },
          {
            no: '课文（二）', motto: '', goals: [],
            lessons: [
              { no: 5, title: '影子', genre: '诗文', kind: '儿童诗',
                dir: 'x1a-yingzi', cover: 'x1a-yingzi/assets/qianhou.jpg', pages: 13,
                desc: '太阳在哪影子在哪 · 看影子猜字',
              },
              { no: 6, title: '比尾巴', genre: '诗文', kind: '儿童诗',
                dir: 'x1a-biweiba', cover: 'x1a-biweiba/assets/wanbian.jpg', pages: 13,
                desc: '对歌舞台问答气泡 · 大会图上找动物',
              },
              { no: 7, title: '青蛙写诗', genre: '诗文', kind: '儿童诗',
                dir: 'x1a-qingwa', cover: 'x1a-qingwa/assets/xiayu.jpg', pages: 14,
                desc: '小伙伴变标点 · 帮青蛙补全诗',
              },
              { no: 8, title: '雨点儿', genre: '叙事', kind: '童话',
                dir: 'x1a-yudianer', cover: 'x1a-yudianer/assets/huangdi.jpg', pages: 12,
                desc: '连环画读课文 · 雨点落地花草变',
              },
            ],
          },
          {
            no: '课文（三）', motto: '', goals: [],
            lessons: [
              { no: 9, title: '明天要远足', genre: '诗文', kind: '儿童诗',
                dir: 'x1a-yuanzu', cover: 'x1a-yuanzu/assets/shuibuzhao.jpg', pages: 13,
                desc: '睡不着的想象泡泡 · 读出盼望心情',
              },
              { no: 10, title: '大还是小', genre: '诗文', kind: '儿童诗',
                dir: 'x1a-dahaishixiao', cover: 'x1a-dahaishixiao/assets/da.jpg', pages: 12,
                desc: '很大还是很小分一分 · 读懂成长心情',
              },
              { no: 11, title: '项链', genre: '叙事', kind: '散文',
                dir: 'x1a-xianglian', cover: 'x1a-xianglian/assets/dahai.jpg', pages: 13,
                desc: '颜色词连一连 · 说说大海的项链',
              },
            ],
          },
          {
            no: '课文（四）', motto: '', goals: [],
            lessons: [
              { no: 12, title: '雪地里的小画家', genre: '诗文', kind: '儿童诗',
                dir: 'x1a-xuedi', cover: 'x1a-xuedi/assets/xuedi.jpg', pages: 14,
                desc: '脚印配对找画家 · 冬眠揭秘 · 挖空背诵',
              },
              { no: 13, title: '乌鸦喝水', genre: '叙事', kind: '寓言',
                dir: 'x1a-wuya', cover: 'x1a-wuya/assets/heshui.jpg', pages: 14,
                desc: '逐颗放石子看水上升 · 看图讲故事',
              },
              { no: 14, title: '小蜗牛', genre: '叙事', kind: '童话',
                dir: 'x1a-xiaowoniu', cover: 'x1a-xiaowoniu/assets/qiu.jpg', pages: 14,
                desc: '四季变化排一排 · 看图猜字',
              },
            ],
          },
        ],
      },
      {
        name: '一年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '识字（一）', motto: '', goals: [],
            lessons: [
              { no: '识字 1', title: '春夏秋冬', genre: '识字', kind: '识字',
                dir: 'x1b-chunxia', cover: 'x1b-chunxia/assets/siji.jpg', pages: 14,
                desc: '拖滑块四季变 · 风雨霜雪动起来',
              },
              { no: '识字 2', title: '姓氏歌', genre: '识字', kind: '识字',
                dir: 'x1b-xingshi', cover: 'x1b-xingshi/assets/wenxing.jpg', pages: 15,
                desc: '点姓问答气泡 · 拆字合成说姓',
              },
              { no: '识字 3', title: '小青蛙', genre: '识字', kind: '识字',
                dir: 'x1b-xiaoqingwa', cover: 'x1b-xiaoqingwa/assets/zhuochong.jpg', pages: 12,
                desc: '青字族换偏旁 · 偏旁飞来合新字',
              },
              { no: '识字 4', title: '猜字谜', genre: '识字', kind: '识字',
                dir: 'x1b-caizimi', cover: 'x1b-caizimi/assets/dengmi.jpg', pages: 11,
                desc: '谜面线索逐条亮 · 部件合字揭谜底',
              },
            ],
          },
          {
            no: '课文（一）', motto: '', goals: [],
            lessons: [
              { no: 1, title: '吃水不忘挖井人', genre: '叙事', kind: '记叙文',
                dir: 'x1b-wajing', cover: 'x1b-wajing/assets/shibei.jpg', pages: 13,
                desc: '时间轴三站读故事 · 刻碑文 · 开火车读生字',
              },
              { no: 2, title: '我多想去看看', genre: '诗文', kind: '儿童诗',
                dir: 'x1b-duoxiang', cover: 'x1b-duoxiang/assets/shengqi.jpg', pages: 12,
                desc: '两条路线图读愿望 · 感叹号音量条 · 连一连',
              },
              { no: 3, title: '一个接一个', genre: '诗文', kind: '儿童诗',
                dir: 'x1b-yigejie', cover: 'x1b-yigejie/assets/tiaofangzi.jpg', pages: 14,
                desc: '“唉→不过”心情翻牌 · 字宝宝开花 · 图中找字',
              },
              { no: 4, title: '四个太阳', genre: '诗文', kind: '儿童诗',
                dir: 'x1b-sigetaiyang', cover: 'x1b-sigetaiyang/assets/qiutian.jpg', pages: 14,
                desc: '画板上画太阳 · 点季节换色 · 词语贴纸',
              },
            ],
          },
          {
            no: '课文（二）', motto: '', goals: [],
            lessons: [
              { no: 5, title: '小公鸡和小鸭子', genre: '叙事', kind: '童话',
                dir: 'x1b-gongji', cover: 'x1b-gongji/assets/tuo.jpg', pages: 14,
                desc: '连环画加小剧场 · 动作词配图 · 钓鱼识字',
              },
              { no: 6, title: '树和喜鹊', genre: '叙事', kind: '童话',
                dir: 'x1b-xique', cover: 'x1b-xique/assets/haoduoshu.jpg', pages: 14,
                desc: '种树数一数（只有→好多）· 拍手读 AABB 词',
              },
              { no: 7, title: '怎么都快乐', genre: '诗文', kind: '儿童诗',
                dir: 'x1b-kuaile', cover: 'x1b-kuaile/assets/xuduo.jpg', pages: 13,
                desc: '人数计逐节读诗 · 游戏按人数分一分',
              },
            ],
          },
          {
            no: '课文（三）', motto: '', goals: [],
            lessons: [
              { no: 8, title: '静夜思', genre: '诗文', kind: '古诗',
                dir: 'x1b-jingyesi', cover: 'x1b-jingyesi/assets/chuangqian.jpg', pages: 11,
                desc: '竖排注音诗板 · 举头低头动作演示',
              },
              { no: 9, title: '夜色', genre: '诗文', kind: '儿童诗',
                dir: 'x1b-yese', cover: 'x1b-yese/assets/sanbu.jpg', pages: 12,
                desc: '关灯到月光明暗变化 · 以前/后来开关对比',
              },
              { no: 10, title: '端午粽', genre: '叙事', kind: '散文',
                dir: 'x1b-duanwu', cover: 'x1b-duanwu/assets/zhuzongzi.jpg', pages: 12,
                desc: '剥粽子一层层看 · 端午习俗卡 · 赛龙舟识字',
              },
              { no: 11, title: '彩虹', genre: '诗文', kind: '儿童诗',
                dir: 'x1b-caihong', cover: 'x1b-caihong/assets/qiuqian.jpg', pages: 14,
                desc: '彩虹七色 · 彩虹桥变变变（三个愿望）',
              },
            ],
          },
          {
            no: '识字（二）', motto: '', goals: [],
            lessons: [
              { no: '识字 5', title: '动物儿歌', genre: '识字', kind: '识字',
                dir: 'x1b-dongwu', cover: 'x1b-dongwu/assets/huajian.jpg', pages: 14,
                desc: '点卡片小动物动一动 · 虫字旁归类',
              },
              { no: '识字 6', title: '古对今', genre: '识字', kind: '识字',
                dir: 'x1b-gudujin', cover: 'x1b-gudujin/assets/yingyan.jpg', pages: 13,
                desc: '拍手一拍读一拍 · 对对子找朋友',
              },
              { no: '识字 7', title: '操场上', genre: '识字', kind: '识字',
                dir: 'x1b-caochang', cover: 'x1b-caochang/assets/bahe.jpg', pages: 14,
                desc: '点字小人做动作 · 用手扌用脚足',
              },
              { no: '识字 8', title: '人之初', genre: '识字', kind: '识字',
                dir: 'x1b-renzhichu', cover: 'x1b-renzhichu/assets/sishu.jpg', pages: 14,
                desc: '古今对读一句句 · 三字一句背一背',
              },
            ],
          },
          {
            no: '课文（四）', motto: '', goals: [],
            lessons: [
              { no: 12, title: '古诗二首', genre: '诗文', kind: '古诗',
                dir: 'x1b-gushi', cover: 'x1b-gushi/assets/chishang.jpg', pages: 13,
                desc: '两幅夏日小景找一找 · 撑小艇分浮萍',
              },
              { no: 13, title: '荷叶圆圆', genre: '诗文', kind: '儿童诗',
                dir: 'x1b-heye', cover: 'x1b-heye/assets/qingwa.jpg', pages: 14,
                desc: '荷叶小舞台分角色演 · 句子拼一拼',
              },
              { no: 14, title: '要下雨了', genre: '叙事', kind: '科学童话',
                dir: 'x1b-xiayu', cover: 'x1b-xiayu/assets/shanpo.jpg', pages: 14,
                desc: '小白兔回家路线图 · 天气侦探判断',
              },
            ],
          },
          {
            no: '课文（五）', motto: '', goals: [],
            lessons: [
              { no: 15, title: '文具的家', genre: '叙事', kind: '记叙文',
                dir: 'x1b-wenju', cover: 'x1b-wenju/assets/jiancha.jpg', pages: 12,
                desc: '帮文具回家 · 拖文具进铅笔盒 · 放学点名',
              },
              { no: 16, title: '一分钟', genre: '叙事', kind: '记叙文',
                dir: 'x1b-yifenzhong', cover: 'x1b-yifenzhong/assets/chezhan.jpg', pages: 12,
                desc: '时间线因果链 · 真计时一分钟',
              },
              { no: 17, title: '动物王国开大会', genre: '叙事', kind: '童话',
                dir: 'x1b-dahui', cover: 'x1b-dahui/assets/dahui.jpg', pages: 13,
                desc: '通知卡随台词补全 · 三关通知闯关',
              },
              { no: 18, title: '小猴子下山', genre: '叙事', kind: '童话',
                dir: 'x1b-xiaohouzi', cover: 'x1b-xiaohouzi/assets/xigua.jpg', pages: 13,
                desc: '地图上走故事 · 拿一样丢一样',
              },
            ],
          },
          {
            no: '课文（六）', motto: '', goals: [],
            lessons: [
              { no: 19, title: '棉花姑娘', genre: '叙事', kind: '童话',
                dir: 'x1b-mianhua', cover: 'x1b-mianhua/assets/piaochong.jpg', pages: 12,
                desc: '舞台剧医生轮流上场 · 捉蚜虫',
              },
              { no: 20, title: '咕咚', genre: '叙事', kind: '童话',
                dir: 'x1b-gudong', cover: 'x1b-gudong/assets/paoqilai.jpg', pages: 13,
                desc: '“咕咚”越传越响的跑步队伍',
              },
              { no: 21, title: '小壁虎借尾巴', genre: '叙事', kind: '童话',
                dir: 'x1b-bihu', cover: 'x1b-bihu/assets/xinwei.jpg', pages: 13,
                desc: '借尾巴路线 · 断尾再生科学卡',
              },
            ],
          },
        ],
      },
      {
        name: '二年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '课文（一）', motto: '', goals: [],
            lessons: [
              { no: 1, title: '小蝌蚪找妈妈', genre: '叙事', kind: '科学童话',
                dir: 'x2a-kedou', cover: 'x2a-kedou/assets/liyu.jpg', pages: 19,
                desc: '成长小卡随故事长大 · 池塘路线讲故事',
              },
              { no: 2, title: '我是什么', genre: '叙事', kind: '科学童话',
                dir: 'x2a-woshishenme', cover: 'x2a-woshishenme/assets/liuchuan.jpg', pages: 15,
                desc: '猜谜导入 · 变化舞台看水变汽云雨雹雪',
              },
              { no: 3, title: '植物妈妈有办法', genre: '诗文', kind: '儿童诗',
                dir: 'x2a-zhiwu', cover: 'x2a-zhiwu/assets/pugongying.jpg', pages: 15,
                desc: '吹一吹晒一晒小实验 · 植物传播拓展卡',
              },
            ],
          },
          {
            no: '识字（一）', motto: '', goals: [],
            lessons: [
              { no: '识字 1', title: '场景歌', genre: '识字', kind: '识字',
                dir: 'x2a-changjing', cover: 'x2a-changjing/assets/haigang.jpg', pages: 14,
                desc: '景物贴纸拼场景 · 先选对数量词再贴',
              },
              { no: '识字 2', title: '树之歌', genre: '识字', kind: '识字',
                dir: 'x2a-shuzhige', cover: 'x2a-shuzhige/assets/shulin.jpg', pages: 16,
                desc: '树叶形状配对 · 树木名片翻卡',
              },
              { no: '识字 3', title: '拍手歌', genre: '识字', kind: '识字',
                dir: 'x2a-paishou', cover: 'x2a-paishou/assets/conglin.jpg', pages: 14,
                desc: '点按节拍拍手读 · 隹鸟字理 · 护动物判一判',
              },
              { no: '识字 4', title: '田家四季歌', genre: '识字', kind: '识字',
                dir: 'x2a-tianjia', cover: 'x2a-tianjia/assets/chun.jpg', pages: 12,
                desc: '四季农事轮盘转一季读一季',
              },
            ],
          },
          {
            no: '课文（二）', motto: '', goals: [],
            lessons: [
              { no: 4, title: '曹冲称象', genre: '叙事', kind: '历史故事',
                dir: 'x2a-caochong', cover: 'x2a-caochong/assets/chuan.jpg', pages: 15,
                desc: '动手称象五步实验 · 排序讲过程',
              },
              { no: 5, title: '玲玲的画', genre: '叙事', kind: '记叙文',
                dir: 'x2a-lingling', cover: 'x2a-lingling/assets/deyi.jpg', pages: 13,
                desc: '心情牌加心情曲线 · 补画小花狗',
              },
              { no: 6, title: '一封信', genre: '叙事', kind: '记叙文',
                dir: 'x2a-yifengxin', cover: 'x2a-yifengxin/assets/xibixi.jpg', pages: 14,
                desc: '两封信摊开比 · 帮露西改一句',
              },
              { no: 7, title: '妈妈睡了', genre: '叙事', kind: '散文',
                dir: 'x2a-mamashuile', cover: 'x2a-mamashuile/assets/shuile.jpg', pages: 13,
                desc: '细节聚光灯 · 美丽温柔好累画像卡',
              },
            ],
          },
          {
            no: '课文（三）', motto: '', goals: [],
            lessons: [
              { no: 8, title: '古诗二首', genre: '诗文', kind: '古诗',
                dir: 'x2a-gushi', cover: 'x2a-gushi/assets/pubu.jpg', pages: 13,
                desc: '登楼一层层看远 · 诗句如瀑布流下',
              },
              { no: 9, title: '黄山奇石', genre: '叙事', kind: '写景',
                dir: 'x2a-huangshan', cover: 'x2a-huangshan/assets/qishi.jpg', pages: 13,
                desc: '看剪影猜奇石 · 给奇石起名字',
              },
              { no: 10, title: '日月潭', genre: '叙事', kind: '写景',
                dir: 'x2a-riyuetan', cover: 'x2a-riyuetan/assets/qingchen.jpg', pages: 13,
                desc: '日潭月潭示意 · 清晨中午雨天滑块',
              },
              { no: 11, title: '葡萄沟', genre: '叙事', kind: '写景',
                dir: 'x2a-putaogou', cover: 'x2a-putaogou/assets/putaojia.jpg', pages: 14,
                desc: '葡萄色板五光十色 · 晾房做葡萄干',
              },
            ],
          },
          {
            no: '课文（四）', motto: '', goals: [],
            lessons: [
              { no: 12, title: '坐井观天', genre: '叙事', kind: '寓言',
                dir: 'x2a-zuojing', cover: 'x2a-zuojing/assets/tiaochu.jpg', pages: 13,
                desc: '井口看天↔跳出井口全景 · 对话舞台分角色读',
              },
              { no: 13, title: '寒号鸟', genre: '叙事', kind: '寓言',
                dir: 'x2a-hanhao', cover: 'x2a-hanhao/assets/handong.jpg', pages: 14,
                desc: '时间轴温度计越来越冷 · 双线对比',
              },
              { no: 14, title: '我要的是葫芦', genre: '叙事', kind: '寓言',
                dir: 'x2a-hulu', cover: 'x2a-hulu/assets/huateng.jpg', pages: 12,
                desc: '四格连环画 · 藤上因果链 · “如果听劝”分支',
              },
            ],
          },
          {
            no: '课文（五）', motto: '', goals: [],
            lessons: [
              { no: 15, title: '八角楼上', genre: '叙事', kind: '记叙文',
                dir: 'x2a-bajiaolou', cover: 'x2a-bajiaolou/assets/youdeng.jpg', pages: 11,
                desc: '拨灯芯光圈变亮 · 细节聚光灯体会词语',
              },
              { no: 16, title: '朱德的扁担', genre: '叙事', kind: '记叙文',
                dir: 'x2a-biandan', cover: 'x2a-biandan/assets/shanlu.jpg', pages: 13,
                desc: '挑粮路线图 · 扁担上逐字写出五个字',
              },
              { no: 17, title: '难忘的泼水节', genre: '叙事', kind: '记叙文',
                dir: 'x2a-poshui', cover: 'x2a-poshui/assets/poshui.jpg', pages: 13,
                desc: '敲象脚鼓导入 · 花瓣地毯 · 点画面泼水',
              },
              { no: 18, title: '刘胡兰', genre: '叙事', kind: '记叙文',
                dir: 'x2a-liuhulan', cover: 'x2a-liuhulan/assets/songbai.jpg', pages: 14,
                desc: '挽词逐字出现 · 三次回答台阶 · 克制空镜',
              },
            ],
          },
          {
            no: '课文（六）', motto: '', goals: [],
            lessons: [
              { no: 19, title: '古诗二首', genre: '诗文', kind: '古诗',
                dir: 'x2a-gushi2', cover: 'x2a-gushi2/assets/chile.jpg', pages: 15,
                desc: '危楼镜头上升摘星 · 敕勒川长卷吹草',
              },
              { no: 20, title: '雾在哪里', genre: '叙事', kind: '童话',
                dir: 'x2a-wu', cover: 'x2a-wu/assets/haishang.jpg', pages: 16,
                desc: '海边小城被雾一样样藏起再露出',
              },
              { no: 21, title: '雪孩子', genre: '叙事', kind: '童话',
                dir: 'x2a-xuehaizi', cover: 'x2a-xuehaizi/assets/baiyun.jpg', pages: 18,
                desc: '连环画 12 格读故事 · 雪→水→水汽→白云',
              },
            ],
          },
          {
            no: '课文（七）', motto: '', goals: [],
            lessons: [
              { no: 22, title: '狐假虎威', genre: '叙事', kind: '寓言',
                dir: 'x2a-hujia', cover: 'x2a-hujia/assets/tongxing.jpg', pages: 14,
                desc: '舞台剧分角色 · 狐狸神气老虎半信半疑',
              },
              { no: 23, title: '纸船和风筝', genre: '叙事', kind: '童话',
                dir: 'x2a-zhichuan', cover: 'x2a-zhichuan/assets/zhichuan.jpg', pages: 16,
                desc: '山间路线图：纸船顺流下、风筝飞上山',
              },
              { no: 24, title: '风娃娃', genre: '叙事', kind: '童话',
                dir: 'x2a-fengwawa', cover: 'x2a-fengwawa/assets/fengche.jpg', pages: 15,
                desc: '风车转帆船跑 · 帮忙还是帮倒忙举手表决',
              },
            ],
          },
        ],
      },
      {
        name: '二年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '课文（一）', motto: '', goals: [],
            lessons: [
              { no: 1, title: '古诗二首', genre: '诗文', kind: '古诗',
                dir: 'x2b-gushi1', cover: 'x2b-gushi1/assets/yongliu.jpg', pages: 14,
                desc: '村居贴纸拼春景 · 咏柳春风剪柳叶',
              },
              { no: 2, title: '找春天', genre: '叙事', kind: '散文',
                dir: 'x2b-zhaochuntian', cover: 'x2b-zhaochuntian/assets/tianye.jpg', pages: 14,
                desc: '田野寻宝找春天 · 小溪会叮咚响',
              },
              { no: 3, title: '开满鲜花的小路', genre: '叙事', kind: '童话',
                dir: 'x2b-xiaolu', cover: 'x2b-xiaolu/assets/xiaolu.jpg', pages: 13,
                desc: '连环画读故事 · 种子旅行因果链',
              },
              { no: 4, title: '邓小平爷爷植树', genre: '叙事', kind: '记叙文',
                dir: 'x2b-zhishu', cover: 'x2b-zhishu/assets/shumiao.jpg', pages: 13,
                desc: '植树动作慢镜头 · 排一排说情景',
              },
            ],
          },
          {
            no: '课文（二）', motto: '', goals: [],
            lessons: [
              { no: 5, title: '雷锋叔叔，你在哪里', genre: '诗文', kind: '儿童诗',
                dir: 'x2b-leifeng', cover: 'x2b-leifeng/assets/xiaoxi.jpg', pages: 13,
                desc: '跟着足迹路线读问答诗',
              },
              { no: 6, title: '千人糕', genre: '叙事', kind: '记叙文',
                dir: 'x2b-qianrengao', cover: 'x2b-qianrengao/assets/daotian.jpg', pages: 13,
                desc: '对话剧场 · 一块米糕层层展开劳动链',
              },
              { no: 7, title: '一匹出色的马', genre: '叙事', kind: '记叙文',
                dir: 'x2b-chuseima', cover: 'x2b-chuseima/assets/qima.jpg', pages: 14,
                desc: '柳枝变马 · 妹妹前后心情对比',
              },
            ],
          },
          {
            no: '识字（一）', motto: '', goals: [],
            lessons: [
              { no: '识字 1', title: '神州谣', genre: '识字', kind: '识字',
                dir: 'x2b-shenzhou', cover: 'x2b-shenzhou/assets/shanchuan.jpg', pages: 13,
                desc: '拍手读加山河意象卡 · 神州拼图',
              },
              { no: '识字 2', title: '传统节日', genre: '识字', kind: '识字',
                dir: 'x2b-jieri', cover: 'x2b-jieri/assets/duanwu.jpg', pages: 14,
                desc: '节日年轮转一圈 · 挂灯笼配习俗',
              },
              { no: '识字 3', title: '“贝”的故事', genre: '识字', kind: '识字',
                dir: 'x2b-bei', cover: 'x2b-bei/assets/haibei.jpg', pages: 13,
                desc: '“贝”字变变变 · 贝币小商店',
              },
              { no: '识字 4', title: '中国美食', genre: '识字', kind: '识字',
                dir: 'x2b-meishi', cover: 'x2b-meishi/assets/chufang.jpg', pages: 11,
                desc: '菜名里藏做法 · 火字旁/四点底两口锅',
              },
            ],
          },
          {
            no: '课文（三）', motto: '', goals: [],
            lessons: [
              { no: 8, title: '彩色的梦', genre: '诗文', kind: '儿童诗',
                dir: 'x2b-caisemeng', cover: 'x2b-caisemeng/assets/caoping.jpg', pages: 14,
                desc: '彩铅一句一笔画梦境 · 仿写机',
              },
              { no: 9, title: '枫树上的喜鹊', genre: '叙事', kind: '童话',
                dir: 'x2b-xique', cover: 'x2b-xique/assets/richu.jpg', pages: 13,
                desc: '鹊语翻译机 · 鹊语课堂',
              },
              { no: 10, title: '沙滩上的童话', genre: '叙事', kind: '童话',
                dir: 'x2b-shatan', cover: 'x2b-shatan/assets/chengbao.jpg', pages: 14,
                desc: '堆城堡 · 攻城计划选分支 · 抽词编故事',
              },
              { no: 11, title: '我是一只小虫子', genre: '叙事', kind: '童话',
                dir: 'x2b-chongzi', cover: 'x2b-chongzi/assets/zaoshang.jpg', pages: 12,
                desc: '小虫子一天路线图 · 好/不好分类罐',
              },
            ],
          },
          {
            no: '课文（四）', motto: '', goals: [],
            lessons: [
              { no: 12, title: '寓言二则', genre: '叙事', kind: '寓言',
                dir: 'x2b-yuyan', cover: 'x2b-yuyan/assets/bamiao.jpg', pages: 15,
                desc: '数羊看窟窿 · 拔苗前后三格对比',
              },
              { no: 13, title: '画杨桃', genre: '叙事', kind: '记叙文',
                dir: 'x2b-yangtao', cover: 'x2b-yangtao/assets/yangtao.jpg', pages: 15,
                desc: '换座位转动 3D 杨桃 · 侧面变五角星',
              },
              { no: 14, title: '小马过河', genre: '叙事', kind: '寓言',
                dir: 'x2b-xiaoma', cover: 'x2b-xiaoma/assets/guohe.jpg', pages: 14,
                desc: '水深尺：老牛浅松鼠深小马自己试',
              },
            ],
          },
          {
            no: '课文（五）', motto: '', goals: [],
            lessons: [
              { no: 15, title: '古诗二首', genre: '诗文', kind: '古诗',
                dir: 'x2b-gushi2', cover: 'x2b-gushi2/assets/xihu.jpg', pages: 13,
                desc: '西湖荷花长卷展开 · 绝句四景拼窗',
              },
              { no: 16, title: '雷雨', genre: '叙事', kind: '写景',
                dir: 'x2b-leiyu', cover: 'x2b-leiyu/assets/leizhong.jpg', pages: 13,
                desc: '天气时间滑块：画面声音课文同步变',
              },
              { no: 17, title: '要是你在野外迷了路', genre: '诗文', kind: '儿童诗',
                dir: 'x2b-milu', cover: 'x2b-milu/assets/beiji.jpg', pages: 13,
                desc: '四位“指南针”名片 · 转动地图找北方',
              },
              { no: 18, title: '太空生活趣事多', genre: '说明', kind: '科普',
                dir: 'x2b-taikong', cover: 'x2b-taikong/assets/heshui.jpg', pages: 14,
                desc: '地面↔太空对比卡 · 洗澡四步试验图',
              },
            ],
          },
          {
            no: '课文（六）', motto: '', goals: [],
            lessons: [
              { no: 19, title: '大象的耳朵', genre: '叙事', kind: '童话',
                dir: 'x2b-erduo', cover: 'x2b-erduo/assets/shan.jpg', pages: 15,
                desc: '对话舞台问耳朵 · 竖起与耷拉对比',
              },
              { no: 20, title: '蜘蛛开店', genre: '叙事', kind: '童话',
                dir: 'x2b-zhizhu', cover: 'x2b-zhizhu/assets/wugong.jpg', pages: 13,
                desc: '招牌一换再换 · 开店路线图续编',
              },
              { no: 21, title: '青蛙卖泥塘', genre: '叙事', kind: '童话',
                dir: 'x2b-nitang', cover: 'x2b-nitang/assets/meili.jpg', pages: 14,
                desc: '泥塘一步步建设 · 动物角色卡学吆喝',
              },
              { no: 22, title: '小毛虫', genre: '叙事', kind: '童话',
                dir: 'x2b-maomao', cover: 'x2b-maomao/assets/hudie.jpg', pages: 13,
                desc: '蜕变时间线：毛虫织茧破茧飞',
              },
            ],
          },
          {
            no: '课文（七）', motto: '', goals: [],
            lessons: [
              { no: 23, title: '祖先的摇篮', genre: '诗文', kind: '儿童诗',
                dir: 'x2b-yaolan', cover: 'x2b-yaolan/assets/senlin.jpg', pages: 14,
                desc: '一句“可曾”贴一张想象贴纸',
              },
              { no: 24, title: '当世界年纪还小的时候', genre: '叙事', kind: '童话',
                dir: 'x2b-niandai', cover: 'x2b-niandai/assets/shui.jpg', pages: 14,
                desc: '万物第一次被叫名字',
              },
              { no: 25, title: '羿射九日', genre: '叙事', kind: '神话',
                dir: 'x2b-yishe', cover: 'x2b-yishe/assets/sheri.jpg', pages: 14,
                desc: '射日动画 · 射九留一 · 起因经过结果',
              },
            ],
          },
        ],
      },
      {
        name: '三年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '美丽的校园，成长的摇篮，梦想启航的地方。',
            goals: ['阅读时，关注有新鲜感的词语和句子', '体会习作的乐趣'],
            lessons: [
              { no: 1, title: '大青树下的小学', genre: '叙事', kind: '散文',
                dir: 'x3a-dashushu', cover: 'x3a-dashushu/assets/kexia.jpg', pages: 12,
                desc: '跟着画面上学去 · 点亮新鲜感词句',
              },
              { no: 2, title: '花的学校', genre: '诗文', kind: '现代诗',
                dir: 'x3a-huadexuexiao', cover: 'x3a-huadexuexiao/assets/tiaowu.jpg', pages: 12,
                desc: '一节一幅画 · 连一连花朵和花孩子',
              },
              { no: 3, title: '不懂就要问', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'x3a-budong', cover: 'x3a-budong/assets/tiwen.jpg', pages: 9,
                desc: '看连环画读故事 · 按图讲一讲',
              },
            ],
          },
          {
            no: '第二单元', motto: '金秋的阳光，洒在树叶上，洒在花瓣上，也洒在我们的心上。',
            goals: ['运用多种方法理解难懂的词语', '学习写日记'],
            lessons: [
              { no: 4, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x3a-gushi', cover: 'x3a-gushi/assets/shanxing.jpg', pages: 11,
                desc: '竖排吟诗看注释 · 找秋天 · 挖空背诵',
              },
              { no: 5, title: '铺满金色巴掌的水泥道', genre: '叙事', kind: '散文',
                dir: 'x3a-bazhang', cover: 'x3a-bazhang/assets/yuxue.jpg', pages: 8,
                desc: '跟着长卷走上学路 · 发现身边的美',
              },
              { no: 6, title: '秋天的雨', genre: '叙事', kind: '散文',
                dir: 'x3a-qiutiandeyu', cover: 'x3a-qiutiandeyu/assets/yanliao.jpg', pages: 12,
                desc: '帮秋雨分颜料 · 看懂总分结构',
              },
              { no: 7, title: '听听，秋的声音', genre: '诗文', kind: '现代诗', skim: true,
                dir: 'x3a-qiudeshengyin', cover: 'x3a-qiudeshengyin/assets/dayan.jpg', pages: 11,
                desc: '走进秋的音乐厅 · 听声音写小诗',
              },
            ],
          },
          {
            no: '第三单元', motto: '乘着想象的翅膀，游历奇妙的童话王国，看花儿跳舞，听星星歌唱。',
            goals: ['感受童话丰富的想象', '试着自己编童话，写童话'],
            lessons: [
              { no: 8, title: '卖火柴的小女孩', genre: '叙事', kind: '童话',
                dir: 'x3a-maihuochai', cover: 'x3a-maihuochai/assets/jiejiao.jpg', pages: 16,
                desc: '五根火柴亮灭 · 现实与幻象对照',
              },
              { no: 9, title: '那一定会很好', genre: '叙事', kind: '童话', skim: true,
                dir: 'x3a-hendehao', cover: 'x3a-hendehao/assets/tuiche.jpg', pages: 12,
                desc: '变身圆环读童话 · 心愿推着故事走',
              },
              { no: 10, title: '在牛肚子里旅行', genre: '叙事', kind: '科学童话',
                dir: 'x3a-niudu', cover: 'x3a-niudu/assets/zhuomicang.jpg', pages: 13,
                desc: '点对一站画一段 · 红头牛肚旅行路线',
              },
              { no: 11, title: '一块奶酪', genre: '叙事', kind: '童话', skim: true,
                dir: 'x3a-nailao', cover: 'x3a-nailao/assets/nailao.jpg', pages: 12,
                desc: '草丛小剧场分角色 · 理由天平说看法',
              },
            ],
          },
          {
            no: '第四单元', motto: '猜测与推想，使我们的阅读之旅充满了乐趣。',
            goals: ['一边读一边预测，顺着故事情节去猜想', '学习预测的一些基本方法', '尝试续编故事'],
            lessons: [
              { no: 12, title: '总也倒不了的老屋', genre: '叙事', kind: '童话',
                dir: 'x3a-laowu', cover: 'x3a-laowu/assets/xiaomao.jpg', pages: 17,
                desc: '五次停下来预测 · 七条旁批同步出现',
              },
              { no: 13, title: '胡萝卜先生的长胡子', genre: '叙事', kind: '童话', skim: true,
                dir: 'x3a-huzi', cover: 'x3a-huzi/assets/huzi.jpg', pages: 12,
                desc: '跟着胡子越长越长 · 书架抽书猜题目',
              },
              { no: 14, title: '小狗学叫', genre: '叙事', kind: '童话', skim: true,
                dir: 'x3a-xiaogou', cover: 'x3a-xiaogou/assets/huli.jpg', pages: 13,
                desc: '三条结局分支 · 选停顿处读给人听',
              },
            ],
          },
          {
            no: '第五单元', motto: '生活中不缺少美，只是缺少发现美的眼睛。',
            goals: ['体会作者是怎样留心观察周围事物的', '仔细观察，把观察所得写下来'],
            lessons: [
              { no: 15, title: '搭船的鸟', genre: '叙事', kind: '记叙文',
                dir: 'x3a-dachuan', cover: 'x3a-dachuan/assets/cuiniao.jpg', pages: 11,
                desc: '听雨看翠鸟 · 涂色观察卡 · 排序演捕鱼',
              },
              { no: 16, title: '金色的草地', genre: '叙事', kind: '散文',
                dir: 'x3a-caodi', cover: 'x3a-caodi/assets/chui.jpg', pages: 11,
                desc: '四格连环画演游戏 · 观察三步卡学发现',
              },
            ],
          },
          {
            no: '第六单元', motto: '祖国，我爱你。我爱你每一寸土地，我爱你壮美的山河。',
            goals: ['借助关键语句理解一段话的意思', '习作的时候，试着围绕一个意思写'],
            lessons: [
              { no: 17, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x3a-gushi2', cover: 'x3a-gushi2/assets/tianmen.jpg', pages: 10,
                desc: '坐船看青山“出” · 晴雨西湖 · 银盘青螺',
              },
              { no: 18, title: '富饶的西沙群岛', genre: '叙事', kind: '写景散文',
                dir: 'x3a-xisha', cover: 'x3a-xisha/assets/haidi.jpg', pages: 13,
                desc: '分区域游西沙 · 点海面看深浅 · 找关键句',
              },
              { no: 19, title: '海滨小城', genre: '叙事', kind: '写景散文',
                dir: 'x3a-haibin', cover: 'x3a-haibin/assets/haibin.jpg', pages: 10,
                desc: '镜头长卷走海滨小城 · 找每段关键句',
              },
              { no: 20, title: '美丽的小兴安岭', genre: '叙事', kind: '写景散文',
                dir: 'x3a-xinganling', cover: 'x3a-xinganling/assets/chun.jpg', pages: 11,
                desc: '四季轮盘 · 比一比抽出与浸 · 读好长句',
              },
            ],
          },
          {
            no: '第七单元', motto: '大自然赐给我们许多珍贵的礼物，你发现了吗？',
            goals: ['感受课文生动的语言，积累喜欢的语句', '留心生活，把自己的想法记录下来'],
            lessons: [
              { no: 21, title: '大自然的声音', genre: '叙事', kind: '散文',
                dir: 'x3a-shengyin', cover: 'x3a-shengyin/assets/feng.jpg', pages: 13,
                desc: '听风声水声虫鸣 · 理清总分结构',
              },
              { no: 22, title: '读不完的大书', genre: '叙事', kind: '散文',
                dir: 'x3a-dashu', cover: 'x3a-dashu/assets/zonglv.jpg', pages: 11,
                desc: '翻开大自然这本书 · 品生动的语言',
              },
              { no: 23, title: '父亲、树林和鸟', genre: '叙事', kind: '散文',
                dir: 'x3a-fuqin', cover: 'x3a-fuqin/assets/niaochang.jpg', pages: 10,
                desc: '林边对话雾渐散 · 品父亲看闻听',
              },
            ],
          },
          {
            no: '第八单元', motto: '美好的品质，犹如温暖的阳光，带给我们希望和力量。',
            goals: ['学习带着问题默读，理解课文的意思', '学写一件简单的事'],
            lessons: [
              { no: 24, title: '司马光', genre: '诗文', kind: '文言文',
                dir: 'x3a-simaguang', cover: 'x3a-simaguang/assets/jiweng.jpg', pages: 13,
                desc: '读停顿借注释 · 看图讲司马光故事',
              },
              { no: 25, title: '灰雀', genre: '叙事', kind: '记叙文',
                dir: 'x3a-huique', cover: 'x3a-huique/assets/baihua.jpg', pages: 11,
                desc: '小舞台分角色读 · 点出人物心里话',
              },
              { no: 26, title: '手术台就是阵地', genre: '叙事', kind: '记叙文',
                dir: 'x3a-shoushutai', cover: 'x3a-shoushutai/assets/shoushu.jpg', pages: 13,
                desc: '危险温度计对照白求恩的镇定',
              },
              { no: 27, title: '一个粗瓷大碗', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'x3a-dawan', cover: 'x3a-dawan/assets/chuishi.jpg', pages: 10,
                desc: '跟着碗走读故事 · 碗的旅程与默读画批',
              },
            ],
          },
        ],
      },
      {
        name: '三年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '飞鸟在空中翱翔，虫儿在花间嬉戏。大自然中，处处有可爱的生灵。',
            goals: ['试着一边读一边想象画面', '体会优美生动的语句', '试着把观察到的事物写清楚'],
            lessons: [
              { no: 1, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x3b-gushi1', cover: 'x3b-gushi1/assets/chunjiang.jpg', pages: 11,
                desc: '读一句画面亮一处 · 跟诗人走山路',
              },
              { no: 2, title: '燕子', genre: '叙事', kind: '散文',
                dir: 'x3b-yanzi', cover: 'x3b-yanzi/assets/hengluo.jpg', pages: 15,
                desc: '拼一只燕子 · 点电线停“音符”',
              },
              { no: 3, title: '荷花', genre: '叙事', kind: '散文',
                dir: 'x3b-hehua', cover: 'x3b-hehua/assets/wudao.jpg', pages: 11,
                desc: '读一句添一笔 · 点句子让画活起来',
              },
              { no: 4, title: '昆虫备忘录', genre: '说明', kind: '科普小品', skim: true,
                dir: 'x3b-kunchong', cover: 'x3b-kunchong/assets/piaochong.jpg', pages: 9,
                desc: '翻昆虫卡 · 复眼两种猜想看一看',
              },
            ],
          },
          {
            no: '第二单元', motto: '寓言是生活的一面镜子。',
            goals: ['读寓言故事，明白其中的道理', '把图画的内容写清楚'],
            lessons: [
              { no: 5, title: '守株待兔', genre: '诗文', kind: '文言寓言',
                dir: 'x3b-shouzhu', cover: 'x3b-shouzhu/assets/shouzhu.jpg', pages: 14,
                desc: '陪农夫等兔子 · 南辕北辙越走越远',
              },
              { no: 6, title: '陶罐和铁罐', genre: '叙事', kind: '寓言',
                dir: 'x3b-taoguan', cover: 'x3b-taoguan/assets/feixu.jpg', pages: 13,
                desc: '橱柜小舞台剧 · 长处短处摆一摆',
              },
              { no: 7, title: '鹿角和鹿腿', genre: '叙事', kind: '寓言',
                dir: 'x3b-lujiao', cover: 'x3b-lujiao/assets/taopao.jpg', pages: 13,
                desc: '心里的天平翻过来 · 读出心情变化',
              },
              { no: 8, title: '池子与河流', genre: '诗文', kind: '寓言诗', skim: true,
                dir: 'x3b-chizi', cover: 'x3b-chizi/assets/heliu.jpg', pages: 7,
                desc: '左池右河分屏对话 · 水与才能对照',
              },
            ],
          },
          {
            no: '第三单元', motto: '深厚的传统文化，中国人的根。',
            goals: ['了解课文是怎么围绕一个意思把一段话写清楚的', '收集传统节日的资料，写一写过节的过程'],
            lessons: [
              { no: 9, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x3b-gushi2', cover: 'x3b-gushi2/assets/qingming.jpg', pages: 12,
                desc: '三首诗三个节日 · 习俗卡与背诵挖空',
              },
              { no: 10, title: '纸的发明', genre: '说明', kind: '说明文',
                dir: 'x3b-zhi', cover: 'x3b-zhi/assets/zaozhi.jpg', pages: 11,
                desc: '从甲骨到蔡伦纸 · 造纸工序动画',
              },
              { no: 11, title: '赵州桥', genre: '说明', kind: '说明文',
                dir: 'x3b-zhaozhou', cover: 'x3b-zhaozhou/assets/qiao.jpg', pages: 9,
                desc: '原文圈词填名片 · 拨水看桥洞',
              },
              { no: 12, title: '一幅名扬中外的画', genre: '说明', kind: '说明文', skim: true,
                dir: 'x3b-qingming', cover: 'x3b-qingming/assets/jieshi.jpg', pages: 8,
                desc: '展开长卷读课文 · 当小讲解员',
              },
            ],
          },
          {
            no: '第四单元', motto: '看，花儿在悄悄绽放。听，蜜蜂在窃窃私语……留心观察，会有新的发现。',
            goals: ['借助关键语句概括一段话的大意', '观察事物的变化，把实验过程写清楚'],
            lessons: [
              { no: 13, title: '花钟', genre: '说明', kind: '科普文',
                dir: 'x3b-huazhong', cover: 'x3b-huazhong/assets/tanhua.jpg', pages: 11,
                desc: '拨时针看花开 · 找关键句说段意',
              },
              { no: 14, title: '蜜蜂', genre: '叙事', kind: '实验记录',
                dir: 'x3b-mifeng', cover: 'x3b-mifeng/assets/fangfei.jpg', pages: 12,
                desc: '跟着法布尔做实验 · 目的过程结论',
              },
              { no: 15, title: '小虾', genre: '叙事', kind: '观察记', skim: true,
                dir: 'x3b-xiaoxia', cover: 'x3b-xiaoxia/assets/xiaxia.jpg', pages: 10,
                desc: '观察笔记放大镜 · 写观察记录卡',
              },
            ],
          },
          {
            no: '第五单元', motto: '想象力比知识更重要。',
            goals: ['走进想象的世界，感受想象的神奇', '发挥想象写故事，创造自己的想象世界'],
            lessons: [
              { no: 16, title: '宇宙的另一边', genre: '叙事', kind: '想象散文',
                dir: 'x3b-yuzhou', cover: 'x3b-yuzhou/assets/feng.jpg', pages: 13,
                desc: '这一边·另一边镜像翻转 · 猜秘密写秘密',
              },
              { no: 17, title: '我变成了一棵树', genre: '叙事', kind: '童话',
                dir: 'x3b-shu', cover: 'x3b-shu/assets/niaowo.jpg', pages: 14,
                desc: '气泡读故事 · 树只能在心里说话',
              },
            ],
          },
          {
            no: '第六单元', motto: '在童年的百花园里，我们看到了真善美。',
            goals: ['运用多种方法理解难懂的句子', '写一个身边的人，尝试写出他的特点'],
            lessons: [
              { no: 18, title: '童年的水墨画', genre: '诗文', kind: '儿童诗',
                dir: 'x3b-shuimo', cover: 'x3b-shuimo/assets/jiangshang.jpg', pages: 12,
                desc: '一节诗一幅画 · 连一连诗句和画面',
              },
              { no: 19, title: '剃头大师', genre: '叙事', kind: '记叙文',
                dir: 'x3b-titou', cover: 'x3b-titou/assets/jiandao.jpg', pages: 15,
                desc: '跟着画面读 · 理发店闯关边读边想',
              },
              { no: 20, title: '肥皂泡', genre: '叙事', kind: '散文',
                dir: 'x3b-feizao', cover: 'x3b-feizao/assets/feiqi.jpg', pages: 11,
                desc: '泡泡里读课文 · 小讲解员说过程',
              },
              { no: 21, title: '我不能失信', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'x3b-shixin', cover: 'x3b-shixin/assets/dengdai.jpg', pages: 11,
                desc: '心里的天平 · 联系生活说守信',
              },
            ],
          },
          {
            no: '第七单元', motto: '天地间隐藏着无穷无尽的奥秘，等待我们去寻找。',
            goals: ['了解课文是从哪几个方面把事物写清楚的', '初步学习整合信息，介绍一种事物'],
            lessons: [
              { no: 22, title: '我们奇妙的世界', genre: '叙事', kind: '散文',
                dir: 'x3b-qimiao', cover: 'x3b-qimiao/assets/qingchen.jpg', pages: 14,
                desc: '天空的一天 · 平常话变“活”句子',
              },
              { no: 23, title: '海底世界', genre: '说明', kind: '说明文',
                dir: 'x3b-haidi', cover: 'x3b-haidi/assets/shenhai.jpg', pages: 13,
                desc: '潜到海底看信息图 · 换词比一比',
              },
              { no: 24, title: '火烧云', genre: '叙事', kind: '写景散文',
                dir: 'x3b-huoshaoyun', cover: 'x3b-huoshaoyun/assets/yunma.jpg', pages: 14,
                desc: '天空调色盘 · 颜色词工坊造新词',
              },
            ],
          },
          {
            no: '第八单元', motto: '有趣的故事，留下的不仅是开心的笑声，还有许多的思考。',
            goals: ['了解故事的主要内容，复述故事', '根据提示，展开想象，尝试编童话故事'],
            lessons: [
              { no: 25, title: '慢性子裁缝和急性子顾客', genre: '叙事', kind: '童话',
                dir: 'x3b-caifeng', cover: 'x3b-caifeng/assets/jindian.jpg', pages: 12,
                desc: '四次改主意时间表 · 排一排复述',
              },
              { no: 26, title: '方帽子店', genre: '叙事', kind: '童话', skim: true,
                dir: 'x3b-maozi', cover: 'x3b-maozi/assets/liangjia.jpg', pages: 10,
                desc: '连环画读故事 · 猜猜哪里意想不到',
              },
              { no: 27, title: '漏', genre: '叙事', kind: '民间故事',
                dir: 'x3b-lou', cover: 'x3b-lou/assets/tuozei.jpg', pages: 12,
                desc: '一个“漏”三种想法 · 笑声计投票',
              },
              { no: 28, title: '枣核', genre: '叙事', kind: '民间故事', skim: true,
                dir: 'x3b-zaohe', cover: 'x3b-zaohe/assets/benling.jpg', pages: 9,
                desc: '跟着地图走故事 · 收集小枣核本领',
              },
            ],
          },
        ],
      },
      {
        name: '四年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '江流天地外，山色有无中。',
            goals: ['边读边想象画面，感受自然之美', '推荐一个好地方，写清楚推荐理由'],
            lessons: [
              { no: 1, title: '观潮', genre: '叙事', kind: '写景散文',
                dir: 'x4a-guanchao', cover: 'x4a-guanchao/assets/baixian.jpg', pages: 12,
                desc: '跟着大潮听声看形 · 潮来前中后',
              },
              { no: 2, title: '走月亮', genre: '叙事', kind: '散文',
                dir: 'x4a-zouyueliang', cover: 'x4a-zouyueliang/assets/yuesheng.jpg', pages: 10,
                desc: '跟着月光长卷边读边走 · 想象画面',
              },
              { no: 3, title: '现代诗二首', genre: '诗文', kind: '现代诗', skim: true,
                dir: 'x4a-xiandaishi', cover: 'x4a-xiandaishi/assets/qiuwan.jpg', pages: 10,
                desc: '斜阳掉江上 · 花牛的一天边演边读',
              },
              { no: 4, title: '繁星', genre: '叙事', kind: '散文', skim: true,
                dir: 'x4a-fanxing', cover: 'x4a-fanxing/assets/haishang.jpg', pages: 8,
                desc: '读一句星空变一变 · 三次看星',
              },
            ],
          },
          {
            no: '第二单元', motto: '为学患无疑，疑则有进。',
            goals: ['阅读时尝试从不同角度去思考，提出自己的问题', '写一个人，注意把印象最深的地方写出来'],
            lessons: [
              { no: 5, title: '一个豆荚里的五粒豆', genre: '叙事', kind: '童话',
                dir: 'x4a-doujia', cover: 'x4a-doujia/assets/dingge.jpg', pages: 16,
                desc: '豌豆飞行图 · 边读边问',
              },
              { no: 6, title: '夜间飞行的秘密', genre: '说明', kind: '科普文',
                dir: 'x4a-yejian', cover: 'x4a-yejian/assets/bianfu.jpg', pages: 13,
                desc: '三次实验动起来 · 蝙蝠雷达对照',
              },
              { no: 7, title: '呼风唤雨的世纪', genre: '说明', kind: '科普文',
                dir: 'x4a-hufeng', cover: 'x4a-hufeng/assets/diqiucun.jpg', pages: 13,
                desc: '神话变现实 · 科技时间线与问题筛选',
              },
              { no: 8, title: '蝴蝶的家', genre: '叙事', kind: '散文', skim: true,
                dir: 'x4a-hudie', cover: 'x4a-hudie/assets/baoyu.jpg', pages: 11,
                desc: '寻家地图读一句找一处 · 提问解决',
              },
            ],
          },
          {
            no: '第三单元', motto: '处处留心皆学问。',
            goals: ['体会文章准确生动的表达，感受作者连续细致的观察', '进行连续观察，学写观察日记'],
            lessons: [
              { no: 9, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x4a-gushi', cover: 'x4a-gushi/assets/mujiang.jpg', pages: 11,
                desc: '换角度看庐山 · 梅雪比两场 · 残阳铺水',
              },
              { no: 10, title: '爬山虎的脚', genre: '说明', kind: '观察文',
                dir: 'x4a-pashanhu', cover: 'x4a-pashanhu/assets/qiang.jpg', pages: 13,
                desc: '放大镜找脚 · 触巴拉贴爬墙动画',
              },
              { no: 11, title: '蟋蟀的住宅', genre: '说明', kind: '观察文',
                dir: 'x4a-xishuai', cover: 'x4a-xishuai/assets/wadong.jpg', pages: 11,
                desc: '剖面图边点边读 · 法布尔观察记录本',
              },
            ],
          },
          {
            no: '第四单元', motto: '神话，永久的魅力，人类童年时代飞腾的幻想。',
            goals: ['了解故事的起因、经过、结果，学习把握文章的主要内容', '感受神话中神奇的想象和鲜明的人物形象'],
            lessons: [
              { no: 12, title: '盘古开天地', genre: '叙事', kind: '神话',
                dir: 'x4a-pangu', cover: 'x4a-pangu/assets/pikai.jpg', pages: 12,
                desc: '拖时间轴撑开天地 · 身体化万物连线',
              },
              { no: 13, title: '精卫填海', genre: '诗文', kind: '文言神话',
                dir: 'x4a-jingwei', cover: 'x4a-jingwei/assets/tianhai.jpg', pages: 10,
                desc: '连环画四格讲故事 · 陪精卫衔石飞',
              },
              { no: 14, title: '普罗米修斯', genre: '叙事', kind: '神话',
                dir: 'x4a-puluo', cover: 'x4a-puluo/assets/daohuo.jpg', pages: 14,
                desc: '舞台剧分角色读 · 地图走盗火情节',
              },
              { no: 15, title: '女娲补天', genre: '叙事', kind: '神话', skim: true,
                dir: 'x4a-nvwa', cover: 'x4a-nvwa/assets/butian.jpg', pages: 11,
                desc: '修补天地读一句修一处 · 五彩石',
              },
            ],
          },
          {
            no: '第五单元', motto: '我手写我心，彩笔绘生活。',
            goals: ['了解作者是怎样把事情写清楚的', '写一件事，把事情写清楚'],
            lessons: [
              { no: 16, title: '麻雀', genre: '叙事', kind: '小说',
                dir: 'x4a-maque', cover: 'x4a-maque/assets/luoxia.jpg', pages: 13,
                desc: '看清听清想清 · 像石头似的落下',
              },
              { no: 17, title: '爬天都峰', genre: '叙事', kind: '记叙文',
                dir: 'x4a-tiandu', cover: 'x4a-tiandu/assets/panpa.jpg', pages: 12,
                desc: '对话气泡读爬山 · 高度计看顺序',
              },
            ],
          },
          {
            no: '第六单元', motto: '童年啊！是梦中的真，是真中的梦，是回忆时含泪的微笑。',
            goals: ['学习用批注的方法阅读', '通过人物的动作、语言、神态体会人物的心情'],
            lessons: [
              { no: 18, title: '牛和鹅', genre: '叙事', kind: '记叙文',
                dir: 'x4a-niuhee', cover: 'x4a-niuhee/assets/ezhui.jpg', pages: 14,
                desc: '读旁批学批注 · 怕鹅到不怕鹅',
              },
              { no: 19, title: '一只窝囊的大老虎', genre: '叙事', kind: '记叙文',
                dir: 'x4a-laohu', cover: 'x4a-laohu/assets/yanchu.jpg', pages: 13,
                desc: '舞台剧读故事 · 批注心情曲线',
              },
              { no: 20, title: '陀螺', genre: '叙事', kind: '记叙文',
                dir: 'x4a-tuoluo', cover: 'x4a-tuoluo/assets/shengli.jpg', pages: 14,
                desc: '心情起起落落 · 丑鸭蛋陀螺逆袭',
              },
            ],
          },
          {
            no: '第七单元', motto: '天下兴亡，匹夫有责。',
            goals: ['关注主要人物和事件，学习把握文章的主要内容', '学习写书信'],
            lessons: [
              { no: 21, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x4a-gushi2', cover: 'x4a-gushi2/assets/chusai.jpg', pages: 11,
                desc: '关山明月读边塞 · 借注释品家国情怀',
              },
              { no: 22, title: '为中华之崛起而读书', genre: '叙事', kind: '记叙文',
                dir: 'x4a-jueqi', cover: 'x4a-jueqi/assets/ketang.jpg', pages: 14,
                desc: '三件事排一排 · 理清顺序说主要内容',
              },
              { no: 23, title: '梅兰芳蓄须', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'x4a-meilanfang', cover: 'x4a-meilanfang/assets/dengtai.jpg', pages: 10,
                desc: '胡须时间轴读故事 · 连办法困难',
              },
              { no: 24, title: '延安，我把你追寻', genre: '诗文', kind: '现代诗', skim: true,
                dir: 'x4a-yanan', cover: 'x4a-yanan/assets/baota.jpg', pages: 12,
                desc: '诗节朗读 · 地图上找延安',
              },
            ],
          },
          {
            no: '第八单元', motto: '时光如川浪淘沙，青史留名多俊杰。',
            goals: ['了解故事情节，简要复述课文', '写一件事，能写出自己的感受'],
            lessons: [
              { no: 25, title: '王戎不取道旁李', genre: '诗文', kind: '文言文',
                dir: 'x4a-wangrong', cover: 'x4a-wangrong/assets/jingzou.jpg', pages: 13,
                desc: '假如是甜李子 · 道边多子推出必苦李',
              },
              { no: 26, title: '西门豹治邺', genre: '叙事', kind: '历史故事',
                dir: 'x4a-ximenbao', cover: 'x4a-ximenbao/assets/shuili.jpg', pages: 13,
                desc: '小人书连环画 · 抓情节简要复述',
              },
              { no: 27, title: '故事二则', genre: '叙事', kind: '历史故事', skim: true,
                dir: 'x4a-gushi3', cover: 'x4a-gushi3/assets/zhibu.jpg', pages: 12,
                desc: '病情一层层往里走 · 顺序词助简要复述',
              },
            ],
          },
        ],
      },
      {
        name: '四年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '纯朴的乡村，一道独特的风景，一幅和谐的画卷。',
            goals: ['抓住关键语句，初步体会课文表达的思想感情', '写喜爱的某个地方，表达出自己的感受'],
            lessons: [
              { no: 1, title: '古诗词三首', genre: '诗文', kind: '古诗词',
                dir: 'x4b-gushici', cover: 'x4b-gushici/assets/xinshi.jpg', pages: 11,
                desc: '竖排诗画 · 菜花丛里找黄蝶 · 点人物品词',
              },
              { no: 2, title: '乡下人家', genre: '叙事', kind: '散文',
                dir: 'x4b-xiaxiang', cover: 'x4b-xiaxiang/assets/jiya.jpg', pages: 8,
                desc: '横向长卷读画面 · 关键句点时令',
              },
              { no: 3, title: '天窗', genre: '叙事', kind: '散文',
                dir: 'x4b-tianchuang', cover: 'x4b-tianchuang/assets/qihuan.jpg', pages: 13,
                desc: '天窗里的遮罩想象 · 从“无”中看出“有”',
              },
              { no: 4, title: '三月桃花水', genre: '叙事', kind: '散文诗', skim: true,
                dir: 'x4b-taohuashui', cover: 'x4b-taohuashui/assets/taohua.jpg', pages: 10,
                desc: '听铃铛导入 · 拨竖琴听水声 · 照明镜',
              },
            ],
          },
          {
            no: '第二单元', motto: '蓝天、森林、大海，蕴藏着自然的奥秘；过去、现在、未来，述说着科技的精彩……',
            goals: ['阅读时能提出不懂的问题，并试着解决', '展开奇思妙想，写一写自己想发明的东西'],
            lessons: [
              { no: 5, title: '琥珀', genre: '说明', kind: '科学小品',
                dir: 'x4b-hupo', cover: 'x4b-hupo/assets/songzhi.jpg', pages: 13,
                desc: '拖时间看琥珀形成 · 推测找依据',
              },
              { no: 6, title: '飞向蓝天的恐龙', genre: '说明', kind: '科普文',
                dir: 'x4b-konglong', cover: 'x4b-konglong/assets/shuqi.jpg', pages: 11,
                desc: '演化变形器 · 讲解员提词卡 · 去掉试试',
              },
              { no: 7, title: '纳米技术就在我们身边', genre: '说明', kind: '科普文',
                dir: 'x4b-nami', cover: 'x4b-nami/assets/tianti.jpg', pages: 11,
                desc: '尺度缩放镜头 · 米到纳米每级放大千倍',
              },
              { no: 8, title: '千年梦圆在今朝', genre: '说明', kind: '科普文', skim: true,
                dir: 'x4b-qiannian', cover: 'x4b-qiannian/assets/huojian.jpg', pages: 10,
                desc: '火箭时间线 · 一站比一站飞得高',
              },
            ],
          },
          {
            no: '第三单元', motto: '诗歌，让我们用美丽的眼睛看世界。',
            goals: ['初步了解现代诗的一些特点，体会诗歌表达的情感', '合作编小诗集，举办诗歌朗诵会'],
            lessons: [
              { no: 9, title: '短诗三首', genre: '诗文', kind: '现代诗',
                dir: 'x4b-duanshi', cover: 'x4b-duanshi/assets/dahai.jpg', pages: 13,
                desc: '大字诗报读冰心 · 一句话排成诗 · 风雨分一分',
              },
              { no: 10, title: '绿', genre: '诗文', kind: '现代诗',
                dir: 'x4b-lv', cover: 'x4b-lv/assets/lv4.jpg', pages: 13,
                desc: '八种绿色板 · 绿叶集中—交叉—随风齐舞动画',
              },
              { no: 11, title: '白桦', genre: '诗文', kind: '现代诗',
                dir: 'x4b-baihua', cover: 'x4b-baihua/assets/zhaoxia.jpg', pages: 11,
                desc: '清晨时间滑块 · 比喻拟人分一分 · 押 a 韵',
              },
              { no: 12, title: '在天晴了的时候', genre: '诗文', kind: '现代诗', skim: true,
                dir: 'x4b-tianqing', cover: 'x4b-tianqing/assets/xiliu.jpg', pages: 8,
                desc: '诗画长卷走小径 · ou 韵回环 · 仿写填词机',
              },
            ],
          },
          {
            no: '第四单元', motto: '奔跑，飞舞；驻足，凝望。可爱的动物，我们的好朋友。',
            goals: ['体会作家是如何表达对动物的感情的', '写自己喜欢的动物，试着写出特点'],
            lessons: [
              { no: 13, title: '猫', genre: '叙事', kind: '散文',
                dir: 'x4b-mao', cover: 'x4b-mao/assets/xiaomao.jpg', pages: 14,
                desc: '性格天平称“古怪” · 翻卡找藏着的喜爱',
              },
              { no: 14, title: '母鸡', genre: '叙事', kind: '散文',
                dir: 'x4b-muji', cover: 'x4b-muji/assets/jingjie.jpg', pages: 14,
                desc: '态度计跟读 · 讨厌→敬佩转变曲线',
              },
              { no: 15, title: '白鹅', genre: '叙事', kind: '散文',
                dir: 'x4b-baie', cover: 'x4b-baie/assets/chifan.jpg', pages: 16,
                desc: '高傲三联漫画 · 鸭鹅步调动画 · 直接夸对明贬实褒',
              },
            ],
          },
          {
            no: '第五单元', motto: '妙笔写美景，巧手著奇观。',
            goals: ['了解课文按一定顺序写景物的方法', '学习按游览的顺序写景物'],
            lessons: [
              { no: 16, title: '海上日出', genre: '叙事', kind: '写景散文',
                dir: 'x4b-richu', cover: 'x4b-richu/assets/xiaobian.jpg', pages: 10,
                desc: '拖滑块看日出 · 按变化顺序写景',
              },
              { no: 17, title: '记金华的双龙洞', genre: '叙事', kind: '游记',
                dir: 'x4b-shuanglong', cover: 'x4b-shuanglong/assets/kongxi.jpg', pages: 11,
                desc: '路线图上走一遍 · 躺进小船过孔隙',
              },
            ],
          },
          {
            no: '第六单元', motto: '深深浅浅的脚印，写满成长的故事。',
            goals: ['学习把握长文章的主要内容', '按一定顺序把事情的过程写清楚'],
            lessons: [
              { no: 18, title: '文言文二则', genre: '诗文', kind: '文言文',
                dir: 'x4b-wenyan', cover: 'x4b-wenyan/assets/yedu.jpg', pages: 10,
                desc: '捉萤照书 · 磨杵成针 · 一字变一词',
              },
              { no: 19, title: '小英雄雨来（节选）', genre: '叙事', kind: '小说节选',
                dir: 'x4b-yulai', cover: 'x4b-yulai/assets/luhua.jpg', pages: 12,
                desc: '小标题拼图把握长文章 · 情节曲线',
              },
              { no: 20, title: '我们家的男子汉', genre: '叙事', kind: '散文', skim: true,
                dir: 'x4b-nanzihan', cover: 'x4b-nanzihan/assets/chechuang.jpg', pages: 8,
                desc: '翻成长相册 · 读懂小小男子汉',
              },
              { no: 21, title: '芦花鞋', genre: '叙事', kind: '小说节选', skim: true,
                dir: 'x4b-luhuaxie', cover: 'x4b-luhuaxie/assets/xueshou.jpg', pages: 9,
                desc: '卖鞋路线与心情曲线 · 自己列小标题',
              },
            ],
          },
          {
            no: '第七单元', motto: '没有伟大的品格，就没有伟大的人，甚至也没有伟大的艺术家，伟大的行动者。',
            goals: ['从人物的语言、动作等描写中感受人物的品质', '学习从多个方面写出人物的特点'],
            lessons: [
              { no: 22, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x4b-gushi', cover: 'x4b-gushi/assets/saixia.jpg', pages: 11,
                desc: '卷轴 · 雪夜 · 点墨，三首三种呈现',
              },
              { no: 23, title: '“诺曼底号”遇难记', genre: '叙事', kind: '小说',
                dir: 'x4b-nuomandi', cover: 'x4b-nuomandi/assets/zhihui.jpg', pages: 11,
                desc: '沉船二十分钟倒计时 · 船长对话',
              },
              { no: 24, title: '黄继光', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'x4b-huangjiguang', cover: 'x4b-huangjiguang/assets/shanpo.jpg', pages: 8,
                desc: '夜色山坡动作慢镜头 · 天色时间条',
              },
              { no: 25, title: '挑山工', genre: '叙事', kind: '散文', skim: true,
                dir: 'x4b-tiaoshangong', cover: 'x4b-tiaoshangong/assets/tiaoshan.jpg', pages: 8,
                desc: '折尺形 vs 直线登山比赛动画',
              },
            ],
          },
          {
            no: '第八单元', motto: '奇妙的童话，点燃缤纷的焰火，照亮我们五彩的梦。',
            goals: ['感受童话的奇妙，体会人物真善美的形象', '按自己的想法新编故事'],
            lessons: [
              { no: 26, title: '宝葫芦的秘密（节选）', genre: '叙事', kind: '童话节选',
                dir: 'x4b-baohulu', cover: 'x4b-baohulu/assets/hulu.jpg', pages: 9,
                desc: '“如果我有宝葫芦”想象转盘',
              },
              { no: 27, title: '巨人的花园', genre: '叙事', kind: '童话',
                dir: 'x4b-huayuan', cover: 'x4b-huayuan/assets/baoqi.jpg', pages: 10,
                desc: '花园四季开关：砌墙变冬、拆墙回春',
              },
              { no: 28, title: '海的女儿', genre: '叙事', kind: '童话', skim: true,
                dir: 'x4b-haidenver', cover: 'x4b-haidenver/assets/chuangqian.jpg', pages: 8,
                desc: '下潜深度尺 · 童话人物形象卡',
              },
            ],
          },
        ],
      },
      {
        name: '五年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '一花一鸟总关情。',
            goals: ['初步了解课文借助具体事物抒发感情的方法', '写一种事物，表达自己的感情'],
            lessons: [
              { no: 1, title: '白鹭', genre: '叙事', kind: '散文',
                dir: 'x5a-bailu', cover: 'x5a-bailu/assets/difei.jpg', pages: 13,
                desc: '读一首精巧的诗 · 增减互动品“恰到好处”',
              },
              { no: 2, title: '落花生', genre: '叙事', kind: '散文',
                dir: 'x5a-luohuasheng', cover: 'x5a-luohuasheng/assets/huasheng.jpg', pages: 13,
                desc: '种收尝议 · 挖花生悟借物喻人',
              },
              { no: 3, title: '桂花雨', genre: '叙事', kind: '散文',
                dir: 'x5a-guihuayu', cover: 'x5a-guihuayu/assets/yaohua.jpg', pages: 13,
                desc: '摇一场桂花雨 · 天平称出思乡情',
              },
              { no: 4, title: '珍珠鸟', genre: '叙事', kind: '散文', skim: true,
                dir: 'x5a-zhenzhuniao', cover: 'x5a-zhenzhuniao/assets/shuzhuo.jpg', pages: 11,
                desc: '小鸟一步步靠近 · 看信赖怎样建立',
              },
            ],
          },
          {
            no: '第二单元', motto: '阅读要有一定的速度。',
            goals: ['学习提高阅读速度的方法', '结合具体事例写出人物的特点'],
            lessons: [
              { no: 5, title: '搭石', genre: '叙事', kind: '散文',
                dir: 'x5a-dashi', cover: 'x5a-dashi/assets/yixing.jpg', pages: 14,
                desc: '计时默读 · 看搭石画面 · 品景美人美',
              },
              { no: 6, title: '将相和', genre: '叙事', kind: '历史故事',
                dir: 'x5a-jiangxianghe', cover: 'x5a-jiangxianghe/assets/wanbi.jpg', pages: 16,
                desc: '连词成句读 · 三个故事因果链 · 品将相',
              },
              { no: 7, title: '什么比猎豹的速度更快', genre: '说明', kind: '说明文',
                dir: 'x5a-liebao', cover: 'x5a-liebao/assets/liebao.jpg', pages: 15,
                desc: '借助关键句 · 速度阶梯条形图 · 带问题读',
              },
              { no: 8, title: '冀中的地道战', genre: '说明', kind: '说明性记叙文', skim: true,
                dir: 'x5a-didaozhan', cover: 'x5a-didaozhan/assets/dadong.jpg', pages: 14,
                desc: '带着问题读 · 地道剖面图解 · 当讲解员',
              },
            ],
          },
          {
            no: '第三单元', motto: '民间故事，口耳相传的经典，老百姓智慧的结晶。',
            goals: ['了解课文内容，创造性地复述故事', '提取主要信息，缩写故事'],
            lessons: [
              { no: 9, title: '猎人海力布', genre: '叙事', kind: '民间故事',
                dir: 'x5a-hailibu', cover: 'x5a-hailibu/assets/shitou.jpg', pages: 15,
                desc: '五件事情节图 · 三种讲法创造性复述',
              },
              { no: 10, title: '牛郎织女（一）', genre: '叙事', kind: '民间故事',
                dir: 'x5a-niulang1', cover: 'x5a-niulang1/assets/hubian.jpg', pages: 18,
                desc: '牛郎老牛相依为命 · 把简略情节讲具体',
              },
              { no: 11, title: '牛郎织女（二）', genre: '叙事', kind: '民间故事', skim: true,
                dir: 'x5a-niulang2', cover: 'x5a-niulang2/assets/queqiao.jpg', pages: 13,
                desc: '快速默读计时 · 两课画面排成连环画',
              },
            ],
          },
          {
            no: '第四单元', motto: '为什么我的眼里常含泪水？因为我对这土地爱得深沉……',
            goals: ['结合资料，体会课文表达的思想感情', '学习列提纲，分段叙述'],
            lessons: [
              { no: 12, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x5a-gushi', cover: 'x5a-gushi/assets/jihai.jpg', pages: 12,
                desc: '读题知背景 · 资料袋品三种爱国情',
              },
              { no: 13, title: '少年中国说（节选）', genre: '诗文', kind: '文言 · 节选',
                dir: 'x5a-shaonian', cover: 'x5a-shaonian/assets/hongri.jpg', pages: 14,
                desc: '意象画卷读气势 · 少年强则国强',
              },
              { no: 14, title: '圆明园的毁灭', genre: '叙事', kind: '散文',
                dir: 'x5a-yuanmingyuan', cover: 'x5a-yuanmingyuan/assets/buju.jpg', pages: 15,
                desc: '昔日辉煌对比毁灭 · 滑块看废墟',
              },
              { no: 15, title: '小岛', genre: '叙事', kind: '小说', skim: true,
                dir: 'x5a-xiaodao', cover: 'x5a-xiaodao/assets/jingli.jpg', pages: 12,
                desc: '跟着将军读故事 · 换个口吻讲',
              },
            ],
          },
          {
            no: '第五单元', motto: '说明文以“说明白了”为成功。',
            goals: ['阅读简单的说明性文章，了解基本的说明方法', '搜集资料，用恰当的说明方法，把某一种事物介绍清楚'],
            lessons: [
              { no: 16, title: '太阳', genre: '说明', kind: '说明文',
                dir: 'x5a-taiyang', cover: 'x5a-taiyang/assets/taiyang.jpg', pages: 12,
                desc: '远大热信息图 · 认识列数字作比较',
              },
              { no: 17, title: '松鼠', genre: '说明', kind: '说明文',
                dir: 'x5a-songshu', cover: 'x5a-songshu/assets/tiaoyue.jpg', pages: 12,
                desc: '搭窝动画 · 比一比平实与活泼',
              },
            ],
          },
          {
            no: '第六单元', motto: '舐犊之情，流淌在血液里的爱和温暖。',
            goals: ['体会作者描写的场景、细节中蕴含的感情', '用恰当的语言表达自己的看法和感受'],
            lessons: [
              { no: 18, title: '慈母情深', genre: '叙事', kind: '小说节选',
                dir: 'x5a-cimu', cover: 'x5a-cimu/assets/chejian.jpg', pages: 16,
                desc: '慢镜头逐帧看母亲 · 场景细节品深情',
              },
              { no: 19, title: '父爱之舟', genre: '叙事', kind: '散文',
                dir: 'x5a-fuai', cover: 'x5a-fuai/assets/xiaochuan.jpg', pages: 16,
                desc: '小船串起梦中场景 · 细节里的父爱',
              },
              { no: 20, title: '“精彩极了”和“糟糕透了”', genre: '叙事', kind: '散文', skim: true,
                dir: 'x5a-jingcai', cover: 'x5a-jingcai/assets/dengdai.jpg', pages: 14,
                desc: '两种声音天平 · 巴迪的成长时间线',
              },
            ],
          },
          {
            no: '第七单元', motto: '四时景物皆成趣。',
            goals: ['初步体会课文中的静态描写和动态描写', '学习描写景物的变化'],
            lessons: [
              { no: 21, title: '古诗词三首', genre: '诗文', kind: '古诗词',
                dir: 'x5a-gushici', cover: 'x5a-gushici/assets/shanju.jpg', pages: 11,
                desc: '竖排吟诗词 · 辨动静 · 品羁旅乡愁',
              },
              { no: 22, title: '四季之美', genre: '叙事', kind: '散文',
                dir: 'x5a-sijizhimei', cover: 'x5a-sijizhimei/assets/xia.jpg', pages: 12,
                desc: '四季四幅画 · 萤火归鸦大雁动起来',
              },
              { no: 23, title: '鸟的天堂', genre: '叙事', kind: '散文',
                dir: 'x5a-niaodetiantang', cover: 'x5a-niaodetiantang/assets/qunniao.jpg', pages: 13,
                desc: '两次经过 · 静看榕树动看群鸟',
              },
              { no: 24, title: '月迹', genre: '叙事', kind: '散文', skim: true,
                dir: 'x5a-yueji', cover: 'x5a-yueji/assets/jingzi.jpg', pages: 12,
                desc: '寻月亮的足迹 · 品童真童趣',
              },
            ],
          },
          {
            no: '第八单元', motto: '旧书不厌百回读，熟读深思子自知。',
            goals: ['根据要求梳理信息，把握内容要点', '根据表达的需要，分段表述，突出重点'],
            lessons: [
              { no: 25, title: '古人谈读书', genre: '诗文', kind: '文言文',
                dir: 'x5a-gurentan', cover: 'x5a-gurentan/assets/xingtan.jpg', pages: 11,
                desc: '态度方法分一分 · 图解读书三到',
              },
              { no: 26, title: '忆读书', genre: '叙事', kind: '散文',
                dir: 'x5a-yidushu', cover: 'x5a-yidushu/assets/jiangshu.jpg', pages: 12,
                desc: '读书时间线 · 比出好书 · 九个字',
              },
              { no: 27, title: '我的“长生果”', genre: '叙事', kind: '散文', skim: true,
                dir: 'x5a-changshengguo', cover: 'x5a-changshengguo/assets/xiannv.jpg', pages: 11,
                desc: '读书台阶五级 · 两次作文悟道理',
              },
            ],
          },
        ],
      },
      {
        name: '五年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '每一个人都有他自己的童年往事，快乐也好，辛酸也好，对于他都是心动神移的最深刻的记忆。',
            goals: ['体会课文表达的思想感情', '把一件事的重点部分写具体'],
            lessons: [
              { no: 1, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x5b-gushi1', cover: 'x5b-gushi1/assets/cunwan.jpg', pages: 11,
                desc: '竖排吟三诗 · 脱穿敲碎 · 改写短文',
              },
              { no: 2, title: '祖父的园子', genre: '叙事', kind: '小说节选',
                dir: 'x5b-zufu', cover: 'x5b-zufu/assets/jiaoshui.jpg', pages: 16,
                desc: '跟祖父逛园子 · 一切都活了 · 读出怀念',
              },
              { no: 3, title: '月是故乡明', genre: '叙事', kind: '散文', skim: true,
                dir: 'x5b-yueguxiang', cover: 'x5b-yueguxiang/assets/shuangyue.jpg', pages: 10,
                desc: '三段人生三个月亮 · 大月亮比不上小月亮',
              },
              { no: 4, title: '梅花魂', genre: '叙事', kind: '散文', skim: true,
                dir: 'x5b-meihuahun', cover: 'x5b-meihuahun/assets/matou.jpg', pages: 10,
                desc: '五件事翻卡 · 梅花魂三层理解',
              },
            ],
          },
          {
            no: '第二单元', motto: '观三国烽烟，识梁山好汉，叹取经艰难，惜红楼梦断。',
            goals: ['初步学习阅读古典名著的方法', '学习写读后感'],
            lessons: [
              { no: 5, title: '草船借箭', genre: '叙事', kind: '名著节选',
                dir: 'x5b-caochuan', cover: 'x5b-caochuan/assets/jianyu.jpg', pages: 18,
                desc: '三天时间线 · 神算天地人 · 原著对照',
              },
              { no: 6, title: '景阳冈', genre: '叙事', kind: '名著节选',
                dir: 'x5b-jingyanggang', cover: 'x5b-jingyanggang/assets/hupu.jpg', pages: 18,
                desc: '十八碗 · 十二时辰钟 · 打虎动作分解',
              },
              { no: 7, title: '猴王出世', genre: '叙事', kind: '名著节选', skim: true,
                dir: 'x5b-houwang', cover: 'x5b-houwang/assets/pubu.jpg', pages: 13,
                desc: '猜大意往下读 · 出世—发现—称王',
              },
              { no: 8, title: '红楼春趣', genre: '叙事', kind: '名著节选', skim: true,
                dir: 'x5b-honglou', cover: 'x5b-honglou/assets/suifeng.jpg', pages: 12,
                desc: '先认人 · 风筝各是谁的 · 说宝玉',
              },
            ],
          },
          {
            no: '第四单元', motto: '苟利国家生死以，岂因祸福避趋之。',
            goals: ['通过课文中动作、语言、神态的描写，体会人物的内心', '尝试运用动作、语言、神态描写，表现人物的内心'],
            lessons: [
              { no: 9, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x5b-gushi2', cover: 'x5b-gushi2/assets/congjun.jpg', pages: 13,
                desc: '竖排吟诗 · 抓字眼品家国情 · 还乡路线图',
              },
              { no: 10, title: '青山处处埋忠骨', genre: '叙事', kind: '纪实',
                dir: 'x5b-qingshan', cover: 'x5b-qingshan/assets/qingshan.jpg', pages: 17,
                desc: '空镜读噩耗 · 父亲与主席 · 读懂忠骨',
              },
              { no: 11, title: '军神', genre: '叙事', kind: '纪实',
                dir: 'x5b-junshen', cover: 'x5b-junshen/assets/hanzhu.jpg', pages: 16,
                desc: '从军人到军神 · 72 刀 · 沃克心情曲线',
              },
              { no: 12, title: '清贫', genre: '叙事', kind: '散文', skim: true,
                dir: 'x5b-qingpin', cover: 'x5b-qingpin/assets/qiushi.jpg', pages: 13,
                desc: '两种神态 · 传世宝 · 读懂清贫',
              },
            ],
          },
          {
            no: '第五单元', motto: '字里行间众生相，大千世界你我他。',
            goals: ['学习描写人物的基本方法', '初步运用描写人物的基本方法，具体地表现一个人的特点'],
            lessons: [
              { no: 13, title: '人物描写一组', genre: '叙事', kind: '名著片段',
                dir: 'x5b-renwu', cover: 'x5b-renwu/assets/duizhen.jpg', pages: 14,
                desc: '动作外貌细节归类 · 四人猜两个指头',
              },
              { no: 14, title: '刷子李', genre: '叙事', kind: '小说',
                dir: 'x5b-shuazili', cover: 'x5b-shuazili/assets/shuajiang.jpg', pages: 12,
                desc: '正面侧面分一分 · 曹小三心理曲线',
              },
            ],
          },
          {
            no: '第六单元', motto: '思维的火花跨越时空，照亮昨天、今天和明天。',
            goals: ['了解人物的思维过程，加深对课文内容的理解', '根据情境编故事，把事情发展变化的过程写具体'],
            lessons: [
              { no: 15, title: '自相矛盾', genre: '诗文', kind: '文言文',
                dir: 'x5b-zixiang', cover: 'x5b-zixiang/assets/shichang.jpg', pages: 9,
                desc: '矛刺盾图解 · 猜字义 · 找生活中的矛盾',
              },
              { no: 16, title: '田忌赛马', genre: '叙事', kind: '历史故事',
                dir: 'x5b-tianji', cover: 'x5b-tianji/assets/saima.jpg', pages: 12,
                desc: '拖线连对阵 · 自动判胜负 · 孙膑的思路',
              },
              { no: 17, title: '跳水', genre: '叙事', kind: '小说',
                dir: 'x5b-tiaoshui', cover: 'x5b-tiaoshui/assets/hengmu.jpg', pages: 15,
                desc: '紧张曲线 · 水手的笑 · 船长三步想',
              },
            ],
          },
          {
            no: '第七单元', motto: '足下万里，移步换景，寰宇纷呈万花筒。',
            goals: ['体会静态描写和动态描写的表达效果', '搜集资料，介绍一个地方'],
            lessons: [
              { no: 18, title: '威尼斯的小艇', genre: '叙事', kind: '散文',
                dir: 'x5b-weinisi', cover: 'x5b-weinisi/assets/chuanfu.jpg', pages: 14,
                desc: '画小艇看比喻 · 船夫路线图 · 动静对照',
              },
              { no: 19, title: '牧场之国', genre: '叙事', kind: '散文',
                dir: 'x5b-muchang', cover: 'x5b-muchang/assets/bangwan.jpg', pages: 13,
                desc: '四幅画面四次反复 · 声音渐消读宁静',
              },
              { no: 20, title: '金字塔', genre: '说明', kind: '非连续性文本', skim: true,
                dir: 'x5b-jinzita', cover: 'x5b-jinzita/assets/xizhao.jpg', pages: 10,
                desc: '满眼是金 · 胡夫数据图 · 大胆推测',
              },
            ],
          },
          {
            no: '第八单元', motto: '风趣和幽默是智慧的闪现。',
            goals: ['感受课文风趣的语言', '看漫画，写出自己的想法'],
            lessons: [
              { no: 21, title: '杨氏之子', genre: '诗文', kind: '文言文',
                dir: 'x5b-yangshi', cover: 'x5b-yangshi/assets/sheguo.jpg', pages: 10,
                desc: '杨梅对孔雀 · 巧答小游戏 · 背诵',
              },
              { no: 22, title: '手指', genre: '叙事', kind: '散文',
                dir: 'x5b-shouzhi', cover: 'x5b-shouzhi/assets/zhangkai.jpg', pages: 13,
                desc: '手掌图认五兄弟 · 对照卡 · 仿写五官',
              },
              { no: 23, title: '童年的发现', genre: '叙事', kind: '散文', skim: true,
                dir: 'x5b-tongnian', cover: 'x5b-tongnian/assets/feixing.jpg', pages: 12,
                desc: '梦中飞行 · 探究台阶 · 九个月推算图',
              },
            ],
          },
        ],
      },
      {
        name: '六年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '背起行装出发吧，去触摸山川湖海的心跳。',
            goals: ['阅读时能从所读的内容想开去', '习作时发挥想象，把重点部分写得详细一些'],
            lessons: [
              { no: 1, title: '草原', genre: '叙事', kind: '散文',
                dir: 'caoyuan', cover: 'caoyuan/assets/caoyuan.jpg', pages: 17,
                desc: '跟着游踪看草原 · 品景中情 · 想开去',
              },
              { no: 2, title: '丁香结', genre: '叙事', kind: '散文',
                dir: 'dingxiang', cover: 'dingxiang/assets/chuangqian.jpg', pages: 17,
                desc: '赏丁香 · 解丁香结 · 想人生的结',
              },
              { no: 3, title: '古诗词三首', genre: '诗文', kind: '古诗词',
                dir: 'gushici', cover: 'gushici/assets/jiande.jpg', pages: 12,
                desc: '竖排吟诗词 · 比月夜之情 · 诗变画',
              },
              { no: 4, title: '花之歌', genre: '叙事', kind: '散文诗', skim: true,
                dir: 'huazhige', cover: 'huazhige/assets/xingxing.jpg', pages: 13,
                desc: '哪里看出我是花 · 找奇特想象 · 写变形记',
              },
            ],
          },
          {
            no: '第二单元', motto: '重温革命岁月，把历史的声音留在心里。',
            goals: ['了解文章是怎样点面结合写场面的', '尝试运用点面结合的写法记一次活动'],
            lessons: [
              { no: 5, title: '七律·长征', genre: '诗文', kind: '诗词',
                dir: 'changzheng', cover: 'changzheng/assets/wuling.jpg', pages: 11,
                desc: '看长征路线读诗 · 品四联 · 读出磅礴气势',
              },
              { no: 6, title: '狼牙山五壮士', genre: '叙事', kind: '记叙文',
                dir: 'langyashan', cover: 'langyashan/assets/renwu.jpg', pages: 14,
                desc: '跟着画面读故事 · 品点与面 · 学写场面',
              },
              { no: 7, title: '开国大典', genre: '叙事', kind: '记叙文',
                dir: 'kaiguo', cover: 'kaiguo/assets/ruchang.jpg', pages: 18,
                desc: '跟着典礼程序读 · 阅兵点面结合 · 学写场面',
              },
              { no: 8, title: '灯光', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'dengguang', cover: 'dengguang/assets/huadeng.jpg', pages: 12,
                desc: '三种光的联系 · 三声“多好啊”',
              },
              { no: 9, title: '我的战友邱少云', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'qiushaoyun', cover: 'qiushaoyun/assets/qianfu.jpg', pages: 12,
                desc: '找“我”的心理 · 环境与纹丝不动',
              },
            ],
          },
          {
            no: '第三单元', motto: '读书好比串门儿——隐身的串门儿。（杨绛）',
            goals: ['根据阅读目的，选用恰当的阅读方法', '写生活体验，试着表达自己的看法'],
            lessons: [
              { no: 10, title: '竹节人', genre: '叙事', kind: '记叙文',
                dir: 'zhujieren', cover: 'zhujieren/assets/zhizuo.jpg', pages: 18,
                desc: '带着三个任务读 · 拼竹节人 · 讲老师的故事',
              },
              { no: 11, title: '宇宙生命之谜', genre: '说明', kind: '说明文',
                dir: 'yuzhou', cover: 'yuzhou/assets/yinhe.jpg', pages: 15,
                desc: '带着问题读 · 拉远看宇宙 · 逐一排除行星',
              },
              {
                no: 12, title: '故宫博物院', genre: '说明', kind: '非连续性文本', skim: true,
                dir: 'gugong', cover: 'gugong/assets/taihedian.jpg', pages: 21,
                desc: '沿中轴线游七站 · 画参观路线 · 当小讲解员',
              },
            ],
          },
          {
            no: '第四单元', motto: '小说大多是虚构的，却又有生活的影子。',
            goals: ['读小说，关注情节、环境，感受人物形象', '发挥想象，创编生活故事'],
            lessons: [
              {
                no: 13, title: '桥', genre: '叙事', kind: '小说',
                dir: 'qiao', cover: 'qiao/assets/shanhong.jpg', pages: 18,
                desc: '跟着画面读故事 · 品情节人物环境 · 朗读与小练笔',
              },
              {
                no: 14, title: '穷人', genre: '叙事', kind: '小说',
                dir: 'qiongren', cover: 'qiongren/assets/xiaowu.jpg', pages: 16,
                desc: '风暴夜里的一个决定 · 读省略号里的心 · 他们真的穷吗',
              },
              {
                no: 15, title: '金色的鱼钩', genre: '叙事', kind: '小说', skim: true,
                dir: 'yugou', cover: 'yugou/assets/yugou.jpg', pages: 15,
                desc: '跟着老班长过草地 · 红锈鱼钩为何金光闪闪',
              },
            ],
          },
          {
            no: '第五单元', motto: '以立意为宗，不以能文为本。（萧统）',
            goals: ['体会文章是怎样围绕中心意思来写的', '从不同方面或选取不同事例，表达中心意思'],
            lessons: [
              {
                no: 16, title: '夏天里的成长', genre: '叙事', kind: '散文',
                dir: 'xiatian', cover: 'xiatian/assets/xiaye.jpg', pages: 11,
                desc: '延时摄影看“看得见的长” · 中心句怎样长出全文',
              },
              {
                no: 17, title: '盼', genre: '叙事', kind: '记叙文',
                dir: 'pan', cover: 'pan/assets/zoujie.jpg', pages: 16,
                desc: '跟着蕾蕾盼一场雨 · 重要部分怎样写具体 · 围绕一个字写',
              },
            ],
          },
          {
            no: '第六单元', motto: '我们是大地的一部分，大地也是我们的一部分。',
            goals: ['抓住关键句，把握文章的主要观点', '学写倡议书'],
            lessons: [
              {
                no: 18, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'gushi', cover: 'gushi/assets/jiangnan.jpg', pages: 10,
                desc: '竖排诗配山水画 · 节奏与注释点读 · 挖空背诵',
              },
              {
                no: 19, title: '只有一个地球', genre: '说明', kind: '说明文',
                dir: 'diqiu', cover: 'diqiu/assets/diqiu.jpg', pages: 13,
                desc: '关键句串成推理链 · 说明方法与用词准确 · 学写倡议书',
              },
              {
                no: 20, title: '青山不老', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'qingshan', cover: 'qingshan/assets/lvlang.jpg', pages: 13,
                desc: '风沙之地的绿洲 · 奇迹与条件 · 为什么青山不老',
              },
              {
                no: 21, title: '三黑和土地', genre: '诗文', kind: '诗歌', skim: true,
                dir: 'sanhei', cover: 'sanhei/assets/tudi.jpg', pages: 12,
                desc: '一节诗一幅画 · 比喻和想象里的爱 · 小时候与现在',
              },
            ],
          },
          {
            no: '第七单元', motto: '一首歌，一幅画，一件小工艺品……一段美好的艺术之旅。',
            goals: ['借助语言文字展开想象，体会艺术之美', '写自己的拿手好戏，把重点部分写具体'],
            lessons: [
              {
                no: 22, title: '文言文二则', genre: '诗文', kind: '文言文',
                dir: 'wenyan', cover: 'wenyan/assets/gaoshan.jpg', pages: 10,
                desc: '原文译文对照 · 高山流水觅知音 · 牧童笑画牛',
              },
              {
                no: 23, title: '月光曲', genre: '叙事', kind: '记叙文',
                dir: 'yueguang', cover: 'yueguang/assets/yueguang.jpg', pages: 11,
                desc: '烛光到月光 · 琴声里的大海 · 背诵第 9 自然段',
              },
              {
                no: 24, title: '京剧趣谈', genre: '说明', kind: '说明性文章', skim: true,
                dir: 'jingju', cover: 'jingju/assets/lianpu.jpg', pages: 7,
                desc: '一根马鞭代一匹马 · 锣鼓一停亮个相 · 戏曲词语',
              },
            ],
          },
          {
            no: '第八单元', motto: '有的人活着，他已经死了；有的人死了，他还活着。（臧克家）',
            goals: ['借助相关资料，理解课文主要内容', '通过事情写一个人，表达出自己的情感'],
            lessons: [
              { no: 25, title: '少年闰土', genre: '叙事', kind: '小说节选',
                dir: 'runtu', cover: 'runtu/assets/chazha.jpg', pages: 19,
                desc: '月下刺猹入画 · 四件新鲜事 · 两个世界',
              },
              { no: 26, title: '好的故事', genre: '叙事', kind: '散文',
                dir: 'haogushi', cover: 'haogushi/assets/dengxia.jpg', pages: 16,
                desc: '跟着倒影入梦 · 景物拼贴 · 读懂昏沉的夜',
              },
              { no: 27, title: '我的伯父鲁迅先生', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'luxun', cover: 'luxun/assets/lingtang.jpg', pages: 14,
                desc: '五件事加小标题 · 用资料读懂碰壁',
              },
              { no: 28, title: '有的人', genre: '诗文', kind: '诗歌', skim: true,
                dir: 'youderen', cover: 'youderen/assets/yecao.jpg', pages: 12,
                desc: '两种人对照表 · 解开第 1 节的谜',
              },
            ],
          },
        ],
      },
      {
        name: '六年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '百里不同风，千里不同俗。',
            goals: ['分清内容的主次，体会作者是如何详写主要部分的', '习作时注意抓住重点，写出特点'],
            lessons: [
              { no: 1, title: '北京的春节', genre: '叙事', kind: '散文',
                dir: 'x6-chunjie', cover: 'x6-chunjie/assets/laba.jpg', pages: 17,
                desc: '跟着日子过春节 · 看详略 · 品京味儿',
              },
              { no: 2, title: '腊八粥', genre: '叙事', kind: '散文',
                dir: 'x6-labazhou', cover: 'x6-labazhou/assets/guo.jpg', pages: 15,
                desc: '跟八儿等粥 · 品详略心情 · 写美食',
              },
              { no: 3, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x6-gushi1', cover: 'x6-gushi1/assets/hanshi.jpg', pages: 12,
                desc: '竖排吟三诗 · 连节日习俗 · 背诵挖空',
              },
              { no: 4, title: '藏戏', genre: '说明', kind: '说明性散文', skim: true,
                dir: 'x6-zangxi', cover: 'x6-zangxi/assets/jiangliu.jpg', pages: 11,
                desc: '三问引特色 · 面具连一连 · 天地作舞台',
              },
            ],
          },
          {
            no: '第二单元', motto: '跟随外国文学名著的脚步，去发现更广阔的世界。',
            goals: ['借助作品梗概，了解名著的主要内容', '就印象深刻的人物和情节交流感受', '学习写作品梗概'],
            lessons: [
              { no: 5, title: '鲁滨逊漂流记（节选）', genre: '叙事', kind: '小说节选',
                dir: 'x6-lubinxun', cover: 'x6-lubinxun/assets/chuanpo.jpg', pages: 22,
                desc: '梗概读全书 · 荒岛时间线 · 坏处好处对照',
              },
              { no: 6, title: '骑鹅旅行记（节选）', genre: '叙事', kind: '小说节选', skim: true,
                dir: 'x6-qie', cover: 'x6-qie/assets/jingzi.jpg', pages: 14,
                desc: '跟尼尔斯变小骑鹅 · 看他的世界怎样变',
              },
              { no: 7, title: '汤姆·索亚历险记（节选）', genre: '叙事', kind: '小说节选', skim: true,
                dir: 'x6-tangmu', cover: 'x6-tangmu/assets/shandong.jpg', pages: 15,
                desc: '洞口一线光 · 投票选情节 · 比读译本',
              },
            ],
          },
          {
            no: '第三单元', motto: '让真情在笔尖流露。',
            goals: ['体会文章是怎样表达情感的', '选择合适的内容写出真情实感'],
            lessons: [
              { no: 8, title: '匆匆', genre: '叙事', kind: '散文',
                dir: 'x6-congcong', cover: 'x6-congcong/assets/yanzi.jpg', pages: 15,
                desc: '日子从水盆里过去 · 问句里的惋惜',
              },
              { no: 9, title: '那个星期天', genre: '叙事', kind: '记叙文',
                dir: 'x6-xingqitian', cover: 'x6-xingqitian/assets/zaochen.jpg', pages: 17,
                desc: '盼—焦急—失望 · 光线里的心情',
              },
            ],
          },
          {
            no: '第四单元', motto: '人生自古谁无死？留取丹心照汗青。（文天祥）',
            goals: ['关注外貌、神态、言行的描写，体会人物品质', '查阅相关资料，加深对课文的理解', '习作时选择适合的方式进行表达'],
            lessons: [
              { no: 10, title: '古诗三首', genre: '诗文', kind: '古诗',
                dir: 'x6-gushi2', cover: 'x6-gushi2/assets/mashi.jpg', pages: 13,
                desc: '吟诗看画 · 物志对照 · 托物言志',
              },
              { no: 11, title: '十六年前的回忆', genre: '叙事', kind: '记叙文',
                dir: 'x6-huiyi', cover: 'x6-huiyi/assets/chunri.jpg', pages: 18,
                desc: '四段时间线读回忆 · 品外貌神态言行 · 首尾照应',
              },
              { no: 12, title: '为人民服务', genre: '说明', kind: '议论文',
                dir: 'x6-fuwu', cover: 'x6-fuwu/assets/huangtu.jpg', pages: 12,
                desc: '论证结构树 · 泰山鸿毛天平 · 关联词推进',
              },
              { no: 13, title: '董存瑞舍身炸暗堡', genre: '叙事', kind: '记叙文', skim: true,
                dir: 'x6-dongcunrui', cover: 'x6-dongcunrui/assets/gongcheng.jpg', pages: 13,
                desc: '远景读战斗 · 炸堡留白 · 暗堡结构试一试',
              },
            ],
          },
          {
            no: '第五单元', motto: '科学发现的机遇，总是等着好奇而又爱思考的人。',
            goals: ['体会文章是怎样用具体事例说明观点的', '展开想象，写科幻故事'],
            lessons: [
              { no: 14, title: '文言文二则', genre: '诗文', kind: '文言文',
                dir: 'x6-wenyan', cover: 'x6-wenyan/assets/xueyi.jpg', pages: 12,
                desc: '对比学弈两学生 · 图解两小儿辩日',
              },
              { no: 15, title: '真理诞生于一百个问号之后', genre: '说明', kind: '议论文',
                dir: 'x6-zhenli', cover: 'x6-zhenli/assets/kexue.jpg', pages: 12,
                desc: '拆观点—事例—结论 · 把？拉直成！',
              },
              { no: 16, title: '表里的生物', genre: '叙事', kind: '记叙文',
                dir: 'x6-biaoli', cover: 'x6-biaoli/assets/xiaocheng.jpg', pages: 15,
                desc: '跟着画面读故事 · 图解表里的“小蝎子”',
              },
              { no: 17, title: '他们那时候多有趣啊', genre: '叙事', kind: '科幻小说', skim: true,
                dir: 'x6-youqu', cover: 'x6-youqu/assets/jiushu.jpg', pages: 11,
                desc: '对照过去与未来 · 插上科学的翅膀',
              },
            ],
          },
          {
            no: '古诗词诵读', motto: '十首古诗词，读一读，背一背。',
            goals: ['诵读古诗词，积累名句'],
            lessons: [
              { no: '诵读 1–5', title: '采薇 · 送元二使安西 · 春夜喜雨 · 早春呈水部张十八员外 · 江上渔者', genre: '诗文', kind: '古诗词',
                dir: 'x6-songdu1', cover: 'x6-songdu1/assets/yangliu.jpg', pages: 12,
                desc: '一首一画读诗 · 归类品名句 · 分级背',
              },
              { no: '诵读 6–10', title: '泊船瓜洲 · 游园不值 · 卜算子 · 浣溪沙 · 清平乐', genre: '诗文', kind: '古诗词',
                dir: 'x6-songdu2', cover: 'x6-songdu2/assets/guazhou.jpg', pages: 11,
                desc: '五个春天读诗词 · “绿”字推敲',
              },
            ],
          },
        ],
      },
      {
        name: '七年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '', goals: [],
            lessons: [
              { no: 1, title: '春', genre: '叙事', kind: '写景散文',
                dir: 'x7a-chun', cover: 'x7a-chun/assets/chunyu.jpg', pages: 9,
                desc: '盼春绘春赞春长卷 · 点词标重音停连',
              },
              { no: 2, title: '济南的冬天', genre: '叙事', kind: '写景散文',
                dir: 'x7a-jinan', cover: 'x7a-jinan/assets/shuise.jpg', pages: 13,
                desc: '抓“温晴” · 小山薄雪水色三层叠画',
              },
              { no: 3, title: '雨的四季', genre: '叙事', kind: '写景散文', skim: true,
                dir: 'x7a-yudesiji', cover: 'x7a-yudesiji/assets/xiayu.jpg', pages: 8,
                desc: '四季雨名片 · 冬雨木刻 · 她它你称呼',
              },
              { no: 4, title: '古代诗歌四首', genre: '诗文', kind: '古诗',
                dir: 'x7a-gushi', cover: 'x7a-gushi/assets/canghai.jpg', pages: 13,
                desc: '击节读沧海 · 明月送愁 · 拼秋思意象',
              },
            ],
          },
          {
            no: '第二单元', motto: '', goals: [],
            lessons: [
              { no: 5, title: '秋天的怀念', genre: '叙事', kind: '散文',
                dir: 'x7a-qiutian', cover: 'x7a-qiutian/assets/juhua.jpg', pages: 13,
                desc: '“好好儿活”情感线 · 细节聚光灯',
              },
              { no: 6, title: '散步', genre: '叙事', kind: '散文',
                dir: 'x7a-sanbu', cover: 'x7a-sanbu/assets/beiqi.jpg', pages: 11,
                desc: '分歧人物关系图 · 背起整个世界',
              },
              { no: 7, title: '散文诗二首', genre: '诗文', kind: '散文诗', skim: true,
                dir: 'x7a-sanwenshi', cover: 'x7a-sanwenshi/assets/heye.jpg', pages: 8,
                desc: '金色花一日躲猫猫 · 意象卡连一连',
              },
              { no: 8, title: '《世说新语》二则', genre: '诗文', kind: '文言文',
                dir: 'x7a-shishuo', cover: 'x7a-shishuo/assets/liuxu.jpg', pages: 10,
                desc: '撒盐柳絮比高下 · 对话夹批评方正',
              },
            ],
          },
          {
            no: '第三单元', motto: '', goals: [],
            lessons: [
              { no: 9, title: '从百草园到三味书屋', genre: '叙事', kind: '回忆性散文',
                dir: 'x7a-baicao', cover: 'x7a-baicao/assets/baicao.jpg', pages: 13,
                desc: '园屋双空间地图 · 不必说/单是分层动画',
              },
              { no: 10, title: '再塑生命的人', genre: '叙事', kind: '散文', skim: true,
                dir: 'x7a-zaisu', cover: 'x7a-zaisu/assets/jingfang.jpg', pages: 10,
                desc: '黑暗—触觉—语言：井房 water 顿悟体验',
              },
              { no: 11, title: '《论语》十二章', genre: '诗文', kind: '文言文',
                dir: 'x7a-lunyu', cover: 'x7a-lunyu/assets/chuanshang.jpg', pages: 11,
                desc: '十二语录卡归档 · 孔子人生阶梯',
              },
            ],
          },
          {
            no: '第四单元', motto: '', goals: [],
            lessons: [
              { no: 12, title: '纪念白求恩', genre: '说明', kind: '议论性悼文',
                dir: 'x7a-baiqiuen', cover: 'x7a-baiqiuen/assets/shanqu.jpg', pages: 12,
                desc: '叙—议结构图 · 白求恩与不少的人对比表',
              },
              { no: 13, title: '植树的牧羊人', genre: '叙事', kind: '小说',
                dir: 'x7a-muyangren', cover: 'x7a-muyangren/assets/senlin.jpg', pages: 10,
                desc: '1913/1920/1945 高原荒地变森林年份切换',
              },
              { no: 14, title: '走一步，再走一步', genre: '叙事', kind: '叙事散文', skim: true,
                dir: 'x7a-zouyibu', cover: 'x7a-zouyibu/assets/shoudian.jpg', pages: 9,
                desc: '悬崖“一小步”分解 · 心情变化曲线',
              },
              { no: 15, title: '诫子书', genre: '诗文', kind: '文言文',
                dir: 'x7a-jiezishu', cover: 'x7a-jiezishu/assets/deng.jpg', pages: 9,
                desc: '静—俭—志—学关系链 · 点字缝划节奏',
              },
            ],
          },
          {
            no: '第五单元', motto: '', goals: [],
            lessons: [
              { no: 16, title: '猫', genre: '叙事', kind: '散文',
                dir: 'x7a-mao', cover: 'x7a-mao/assets/maoyi.jpg', pages: 14,
                desc: '三猫对比表 · 冤案复盘 · 情感曲线读主旨',
              },
              { no: 17, title: '动物笑谈', genre: '叙事', kind: '科普散文', skim: true,
                dir: 'x7a-dongwu', cover: 'x7a-dongwu/assets/xiaoya.jpg', pages: 8,
                desc: '观察趣事卡 · 实验记录单 · 两种视角品笑点',
              },
              { no: 18, title: '狼', genre: '诗文', kind: '文言小说',
                dir: 'x7a-lang', cover: 'x7a-lang/assets/yulang.jpg', pages: 10,
                desc: '情节四台阶 · 屠狼动作链 · 字词分类梳理',
              },
            ],
          },
          {
            no: '第六单元', motto: '', goals: [],
            lessons: [
              { no: 19, title: '皇帝的新装', genre: '叙事', kind: '童话',
                dir: 'x7a-xinzhuang', cover: 'x7a-xinzhuang/assets/youxing.jpg', pages: 11,
                desc: '快读计时 · 三幕舞台剧 · 谎言传递链',
              },
              { no: 20, title: '天上的街市', genre: '诗文', kind: '现代诗',
                dir: 'x7a-jieshi', cover: 'x7a-jieshi/assets/jiedeng.jpg', pages: 12,
                desc: '一节一屏 · 地上天上对照图 · 传说与诗对比',
              },
              { no: 21, title: '女娲造人', genre: '叙事', kind: '神话', skim: true,
                dir: 'x7a-nvwa', cover: 'x7a-nvwa/assets/nieren.jpg', pages: 9,
                desc: '古书枝干长成大树 · 神性人性分类',
              },
              { no: 22, title: '寓言四则', genre: '叙事', kind: '寓言',
                dir: 'x7a-yuyan', cover: 'x7a-yuyan/assets/qiren.jpg', pages: 11,
                desc: '对话气泡 · 比赛记分 · 传话链 · 担忧气泡',
              },
            ],
          },
        ],
      },
      {
        name: '七年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '', goals: [],
            lessons: [
              { no: 1, title: '邓稼先', genre: '叙事', kind: '传记',
                dir: 'x7b-dengjiaxian', cover: 'x7b-dengjiaxian/assets/xingkong.jpg', pages: 12,
                desc: '六个小标题结构导图 · 两弹元勋时间轴',
              },
              { no: 2, title: '说和做——记闻一多先生言行片段', genre: '叙事', kind: '传记',
                dir: 'x7b-shuohezuo', cover: 'x7b-shuohezuo/assets/denghuo.jpg', pages: 9,
                desc: '说与做天平 · 学者与战士两面称一称',
              },
              { no: 3, title: '回忆鲁迅先生（节选）', genre: '叙事', kind: '回忆录', skim: true,
                dir: 'x7b-luxun', cover: 'x7b-luxun/assets/liming.jpg', pages: 7,
                desc: '生活细节卡片墙 · 按起居朋友家人分类',
              },
              { no: 4, title: '孙权劝学', genre: '诗文', kind: '文言文',
                dir: 'x7b-sunquan', cover: 'x7b-sunquan/assets/lunyi.jpg', pages: 11,
                desc: '三人对话舞台 · 读出语气与劝学之道',
              },
            ],
          },
          {
            no: '第二单元', motto: '', goals: [],
            lessons: [
              { no: 5, title: '黄河颂', genre: '诗文', kind: '现代诗',
                dir: 'x7b-huanghe', cover: 'x7b-huanghe/assets/gaoshan.jpg', pages: 11,
                desc: '朗诵版式三声呼告 · 批注工作台',
              },
              { no: 6, title: '老山界', genre: '叙事', kind: '纪实散文',
                dir: 'x7b-laoshanjie', cover: 'x7b-laoshanjie/assets/huoba.jpg', pages: 10,
                desc: '行军路线时空图 · 声音坐标赏析',
              },
              { no: 7, title: '谁是最可爱的人', genre: '叙事', kind: '通讯',
                dir: 'x7b-keai', cover: 'x7b-keai/assets/xueling.jpg', pages: 9,
                desc: '三事例与抒情议论结构图 · 抒情工具高亮',
              },
              { no: 8, title: '土地的誓言', genre: '叙事', kind: '抒情散文', skim: true,
                dir: 'x7b-shiyan', cover: 'x7b-shiyan/assets/gaoliang.jpg', pages: 6,
                desc: '东北意象胶片叠现 · 她与它对读',
              },
              { no: 9, title: '木兰诗', genre: '诗文', kind: '乐府诗',
                dir: 'x7b-mulan', cover: 'x7b-mulan/assets/guanshan.jpg', pages: 12,
                desc: '从军征战还乡情节图 · 详略字数条与互文',
              },
            ],
          },
          {
            no: '第三单元', motto: '', goals: [],
            lessons: [
              { no: 10, title: '阿长与《山海经》', genre: '叙事', kind: '回忆性散文',
                dir: 'x7b-azhang', cover: 'x7b-azhang/assets/sanheng.jpg', pages: 15,
                desc: '情感曲线 · 先抑后扬读小人物',
              },
              { no: 11, title: '老王', genre: '叙事', kind: '散文',
                dir: 'x7b-laowang', cover: 'x7b-laowang/assets/sanlun.jpg', pages: 10,
                desc: '细节聚光灯 · 照亮老王与“我”',
              },
              { no: 12, title: '台阶', genre: '叙事', kind: '小说', skim: true,
                dir: 'x7b-taijie', cover: 'x7b-taijie/assets/nihuang.jpg', pages: 7,
                desc: '台阶时间线 · 三级到九级的父亲',
              },
              { no: 13, title: '卖油翁', genre: '诗文', kind: '文言文',
                dir: 'x7b-maiyou', cover: 'x7b-maiyou/assets/zhuoyou.jpg', pages: 9,
                desc: '射箭对酌油 · 一个“熟”字',
              },
            ],
          },
          {
            no: '第四单元', motto: '', goals: [],
            lessons: [
              { no: 14, title: '叶圣陶先生二三事', genre: '叙事', kind: '回忆散文',
                dir: 'x7b-yeshengtao', cover: 'x7b-yeshengtao/assets/songke.jpg', pages: 10,
                desc: '品质卡片 · 删废字 · 略读计时',
              },
              { no: 15, title: '驿路梨花', genre: '叙事', kind: '小说',
                dir: 'x7b-yilu', cover: 'x7b-yilu/assets/lihua.jpg', pages: 11,
                desc: '“谁是主人”悬念链 · 误会层层揭开',
              },
              { no: 16, title: '最苦与最乐', genre: '说明', kind: '议论文', skim: true,
                dir: 'x7b-zuiku', cover: 'x7b-zuiku/assets/shifu.jpg', pages: 8,
                desc: '论证结构图 · 苦—乐—结论',
              },
              { no: 17, title: '短文两篇', genre: '诗文', kind: '文言文',
                dir: 'x7b-duanwen', cover: 'x7b-duanwen/assets/lian.jpg', pages: 11,
                desc: '陋→馨反转 · 莲花物—志图谱',
              },
            ],
          },
          {
            no: '第五单元', motto: '', goals: [],
            lessons: [
              { no: 18, title: '紫藤萝瀑布', genre: '叙事', kind: '散文',
                dir: 'x7b-ziteng', cover: 'x7b-ziteng/assets/pubu.jpg', pages: 13,
                desc: '花穗色阶分物情理 · 今昔两种脚步',
              },
              { no: 19, title: '一棵小桃树', genre: '叙事', kind: '散文', skim: true,
                dir: 'x7b-taoshu', cover: 'x7b-taoshu/assets/fengyu.jpg', pages: 9,
                desc: '桃树与我双线命运 · 数七次“我的小桃树”',
              },
              { no: 20, title: '外国诗二首', genre: '诗文', kind: '外国诗', skim: true,
                dir: 'x7b-waiguoshi', cover: 'x7b-waiguoshi/assets/lukou.jpg', pages: 8,
                desc: '走一遍分岔路 · 劝说语气与三个时间',
              },
              { no: 21, title: '古代诗歌五首', genre: '诗文', kind: '古诗',
                dir: 'x7b-gushi', cover: 'x7b-gushi/assets/taishan.jpg', pages: 13,
                desc: '五首五法：时空坐标/镜头/高度/路线/落红',
              },
            ],
          },
          {
            no: '第六单元', motto: '', goals: [],
            lessons: [
              { no: 22, title: '伟大的悲剧', genre: '叙事', kind: '传记',
                dir: 'x7b-beiju', cover: 'x7b-beiju/assets/zhangpeng.jpg', pages: 12,
                desc: '南极往返时间轴 5→4→3 人 · 悲与伟大天平',
              },
              { no: 23, title: '太空一日', genre: '叙事', kind: '纪实',
                dir: 'x7b-taikong', cover: 'x7b-taikong/assets/fanhui.jpg', pages: 12,
                desc: '飞行剖面意外表 · 共振 26 秒倒计时',
              },
              { no: 24, title: '带上她的眼睛', genre: '叙事', kind: '科幻小说', skim: true,
                dir: 'x7b-yanjing', cover: 'x7b-yanjing/assets/caoyuan.jpg', pages: 8,
                desc: '七张悬念卡 · 拖滑块沉到地心',
              },
              { no: 25, title: '活板', genre: '诗文', kind: '文言说明文',
                dir: 'x7b-huoban', cover: 'x7b-huoban/assets/yinshua.jpg', pages: 12,
                desc: '刻字排版印刷拆版工序动画 · 说明顺序',
              },
            ],
          },
        ],
      },
      {
        name: '八年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '', goals: [],
            lessons: [
              { no: 1, title: '消息二则', genre: '说明', kind: '新闻',
                dir: 'x8a-xiaoxi', cover: 'x8a-xiaoxi/assets/duchuan.jpg', pages: 11,
                desc: '拆倒金字塔 · 六要素表 · 找作者态度',
              },
              { no: 2, title: '首届诺贝尔奖颁发', genre: '说明', kind: '新闻',
                dir: 'x8a-nuobeier', cover: 'x8a-nuobeier/assets/xuejing.jpg', pages: 9,
                desc: '电报稿逐段吐出 · 获奖者连线 · 编辑删评价词',
              },
              { no: 3, title: '“飞天”凌空', genre: '叙事', kind: '新闻特写',
                dir: 'x8a-feitian', cover: 'x8a-feitian/assets/rushui.jpg', pages: 9,
                desc: '时间滑块慢放 1.7 秒 · 特写与消息对比',
              },
              { no: 4, title: '一着惊海天', genre: '叙事', kind: '新闻特写',
                dir: 'x8a-zhuojian', cover: 'x8a-zhuojian/assets/jianjin.jpg', pages: 9,
                desc: '目击者时间轴（看/听/感）· “V”字阻拦索图解',
              },
              { no: 5, title: '国行公祭，为佑世界和平', genre: '说明', kind: '新闻评论',
                dir: 'x8a-gongji', cover: 'x8a-gongji/assets/gezi.jpg', pages: 10,
                desc: '论点—论据结构图 · 庄重朗读 · 采访提纲与写消息',
              },
            ],
          },
          {
            no: '第二单元', motto: '', goals: [],
            lessons: [
              { no: 6, title: '藤野先生', genre: '叙事', kind: '回忆性散文',
                dir: 'x8a-tengye', cover: 'x8a-tengye/assets/zhaopian.jpg', pages: 10,
                desc: '“我”的心路曲线 · 讲义里的四件事 · 原稿改定稿对比',
              },
              { no: 7, title: '回忆我的母亲', genre: '叙事', kind: '回忆录',
                dir: 'x8a-muqin', cover: 'x8a-muqin/assets/tianjian.jpg', pages: 10,
                desc: '母亲品质卡 · 母子双轨时间轴 · 平实句品读',
              },
              { no: 8, title: '列夫·托尔斯泰', genre: '叙事', kind: '传记', skim: true,
                dir: 'x8a-tuoersitai', cover: 'x8a-tuoersitai/assets/zhuangyuan.jpg', pages: 7,
                desc: '抑扬柱看欲扬先抑 · 聚光灯照亮那双眼睛',
              },
              { no: 9, title: '美丽的颜色', genre: '叙事', kind: '传记', skim: true,
                dir: 'x8a-yanse', cover: 'x8a-yanse/assets/yingguang.jpg', pages: 8,
                desc: '镭的提炼七步流程 · 两种声音 · 色板解“美丽的颜色”',
              },
            ],
          },
          {
            no: '第三单元', motto: '', goals: [],
            lessons: [
              { no: 10, title: '三峡', genre: '诗文', kind: '文言文',
                dir: 'x8a-sanxia', cover: 'x8a-sanxia/assets/xiashui.jpg', pages: 11,
                desc: '四季分层长卷 · 抓特征品写景手法',
              },
              { no: 11, title: '短文二篇', genre: '诗文', kind: '文言文',
                dir: 'x8a-duanwen', cover: 'x8a-duanwen/assets/tingyue.jpg', pages: 13,
                desc: '山水色彩拼贴 · 积水空明滑块 · 品闲人',
              },
              { no: 12, title: '与朱元思书', genre: '诗文', kind: '文言文', skim: true,
                dir: 'x8a-zhuyuansi', cover: 'x8a-zhuyuansi/assets/shui.jpg', pages: 8,
                desc: '一总两分结构树 · 名利山水一杆秤',
              },
              { no: 13, title: '唐诗五首', genre: '诗文', kind: '古诗',
                dir: 'x8a-tangshi', cover: 'x8a-tangshi/assets/saishang.jpg', pages: 12,
                desc: '五首五读法：拼意象登楼量构图走水路',
              },
            ],
          },
          {
            no: '第四单元', motto: '', goals: [],
            lessons: [
              { no: 14, title: '背影', genre: '叙事', kind: '散文',
                dir: 'x8a-beiying', cover: 'x8a-beiying/assets/panpa.jpg', pages: 10,
                desc: '背影四现线索图 · 买橘子九帧慢镜头',
              },
              { no: 15, title: '白杨礼赞', genre: '叙事', kind: '托物言志散文',
                dir: 'x8a-baiyang', cover: 'x8a-baiyang/assets/baiyang.jpg', pages: 11,
                desc: '扬抑感情曲线 · 树到人象征对照',
              },
              { no: 16, title: '散文二篇', genre: '叙事', kind: '散文', skim: true,
                dir: 'x8a-sanwen', cover: 'x8a-sanwen/assets/xiaocao.jpg', pages: 8,
                desc: '生命意象卡 · 三种激情云霄尘世图',
              },
              { no: 17, title: '昆明的雨', genre: '叙事', kind: '散文', skim: true,
                dir: 'x8a-kunming', cover: 'x8a-kunming/assets/muxiang.jpg', pages: 8,
                desc: '雨丝串意象情感线 · 菌子好吃好看坐标',
              },
            ],
          },
          {
            no: '第五单元', motto: '', goals: [],
            lessons: [
              { no: 18, title: '中国石拱桥', genre: '说明', kind: '说明文',
                dir: 'x8a-shigongqiao', cover: 'x8a-shigongqiao/assets/zhaozhou.jpg', pages: 10,
                desc: '十段砌成一座拱 · 两桥数据信息图 · 删字比较',
              },
              { no: 19, title: '苏州园林', genre: '说明', kind: '说明文',
                dir: 'x8a-suzhou', cover: 'x8a-suzhou/assets/chizhao.jpg', pages: 9,
                desc: '“画框”总分图 · 换一道墙看隔而不隔',
              },
              { no: 20, title: '人民英雄永垂不朽', genre: '说明', kind: '说明文',
                dir: 'x8a-jinianbei', cover: 'x8a-jinianbei/assets/bei.jpg', pages: 9,
                desc: '碑体瞻仰路线 · 绕碑一周的浮雕时间轴',
              },
              { no: 21, title: '蝉', genre: '说明', kind: '科学小品', skim: true,
                dir: 'x8a-chan', cover: 'x8a-chan/assets/tuopi.jpg', pages: 6,
                desc: '蝉的一生地上地下循环 · 四年对五星期',
              },
              { no: 22, title: '梦回繁华', genre: '说明', kind: '说明文', skim: true,
                dir: 'x8a-fanhua', cover: 'x8a-fanhua/assets/hongqiao.jpg', pages: 6,
                desc: '滑块展开长卷 · 乐章节奏条',
              },
            ],
          },
          {
            no: '第六单元', motto: '', goals: [],
            lessons: [
              { no: 23, title: '《孟子》三章', genre: '诗文', kind: '文言文',
                dir: 'x8a-mengzi', cover: 'x8a-mengzi/assets/chengchi.jpg', pages: 12,
                desc: '三章论证链逐环展开 · 排比读出气势',
              },
              { no: 24, title: '愚公移山', genre: '诗文', kind: '文言寓言',
                dir: 'x8a-yugong', cover: 'x8a-yugong/assets/yishan.jpg', pages: 11,
                desc: '对话舞台台词亮起 · 人物态度谱',
              },
              { no: 25, title: '周亚夫军细柳', genre: '诗文', kind: '文言文', skim: true,
                dir: 'x8a-xiliu', cover: 'x8a-xiliu/assets/anpei.jpg', pages: 7,
                desc: '三军对比表 · 天子进营过六道关',
              },
              { no: 26, title: '诗词五首', genre: '诗文', kind: '古诗词',
                dir: 'x8a-shici', cover: 'x8a-shici/assets/yujiaao.jpg', pages: 11,
                desc: '五首五法：见望换字、愁的阶梯、色板、假如东风、梦游路线',
              },
            ],
          },
        ],
      },
      {
        name: '八年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '', goals: [],
            lessons: [
              { no: 1, title: '社戏', genre: '叙事', kind: '小说',
                dir: 'x8b-sheixi', cover: 'x8b-sheixi/assets/yehang.jpg', pages: 12,
                desc: '情节心情曲线 · 月夜行船感官读 · 品好豆好戏',
              },
              { no: 2, title: '回延安', genre: '诗文', kind: '现代诗',
                dir: 'x8b-huiyanan', cover: 'x8b-huiyanan/assets/baota.jpg', pages: 12,
                desc: '信天游打拍子押韵 · 比兴拆解 · 分部分背诵',
              },
              { no: 3, title: '安塞腰鼓', genre: '叙事', kind: '散文', skim: true,
                dir: 'x8b-yaogu', cover: 'x8b-yaogu/assets/qunwu.jpg', pages: 9,
                desc: '击鼓朗读鼓点加速 · 四个“好一个” · 喻体前置仿写',
              },
              { no: 4, title: '灯笼', genre: '叙事', kind: '散文', skim: true,
                dir: 'x8b-denglong', cover: 'x8b-denglong/assets/jiezufu.jpg', pages: 8,
                desc: '灯笼记忆串点亮 · 情感文化家国三层 · 结尾升华',
              },
            ],
          },
          {
            no: '第二单元', motto: '', goals: [],
            lessons: [
              { no: 5, title: '大自然的语言', genre: '说明', kind: '科普文',
                dir: 'x8b-yuyan', cover: 'x8b-yuyan/assets/chun.jpg', pages: 9,
                desc: '四季物候翻卡 · 四因素交互图 · 生动与准确对读',
              },
              { no: 6, title: '阿西莫夫短文两篇', genre: '说明', kind: '科普文',
                dir: 'x8b-asimofu', cover: 'x8b-asimofu/assets/zhuangji.jpg', pages: 9,
                desc: '板块漂移推理链 · 证据天平定灭绝之因 · 括号插话',
              },
              { no: 7, title: '大雁归来', genre: '叙事', kind: '科学小品', skim: true,
                dir: 'x8b-dayan', cover: 'x8b-dayan/assets/guilai.jpg', pages: 8,
                desc: '大雁春归时间线 · 拟人词点亮 · 孤雁观察推理',
              },
              { no: 8, title: '时间的脚印', genre: '说明', kind: '科普文', skim: true,
                dir: 'x8b-jiaoyin', cover: 'x8b-jiaoyin/assets/yanceng.jpg', pages: 7,
                desc: '地层剖面“时间书页” · 岩层计时器 · 单句路标',
              },
            ],
          },
          {
            no: '第三单元', motto: '', goals: [],
            lessons: [
              { no: 9, title: '桃花源记', genre: '诗文', kind: '文言文',
                dir: 'x8b-taohuayuan', cover: 'x8b-taohuayuan/assets/tianyuan.jpg', pages: 12,
                desc: '渔人行踪路线图 · 桃源长卷对比景象',
              },
              { no: 10, title: '小石潭记', genre: '诗文', kind: '文言文',
                dir: 'x8b-xiaoshitan', cover: 'x8b-xiaoshitan/assets/yu.jpg', pages: 10,
                desc: '移步换景游踪 · 景—情曲线 · 小鱼演动静',
              },
              { no: 11, title: '核舟记', genre: '诗文', kind: '文言说明文', skim: true,
                dir: 'x8b-hezhou', cover: 'x8b-hezhou/assets/hezhou.jpg', pages: 8,
                desc: '核舟结构图点部位看人物 · 数刻字三十四',
              },
              { no: 12, title: '《诗经》二首', genre: '诗文', kind: '古诗',
                dir: 'x8b-shijing', cover: 'x8b-shijing/assets/jianjia.jpg', pages: 11,
                desc: '蒹葭三章换字高亮 · 关雎比兴对照 · 打拍子',
              },
            ],
          },
          {
            no: '第四单元', motto: '', goals: [],
            lessons: [
              { no: 13, title: '最后一次讲演', genre: '说明', kind: '演讲词',
                dir: 'x8b-jiangyan', cover: 'x8b-jiangyan/assets/liming.jpg', pages: 10,
                desc: '分段朗读情绪温度计 · 句式与现场标注',
              },
              { no: 14, title: '应有格物致知精神', genre: '说明', kind: '演讲词',
                dir: 'x8b-gewu', cover: 'x8b-gewu/assets/shiyan.jpg', pages: 10,
                desc: '破—立—推广结构图 · 两次“格竹”对比',
              },
              { no: 15, title: '我一生中的重要抉择', genre: '说明', kind: '演讲词',
                dir: 'x8b-jueze', cover: 'x8b-jueze/assets/taiyang.jpg', pages: 9,
                desc: '王选人生时间轴 · 段落卡提炼观点',
              },
              { no: 16, title: '庆祝奥林匹克运动复兴25周年', genre: '说明', kind: '演讲词',
                dir: 'x8b-aoyun', cover: 'x8b-aoyun/assets/maisui.jpg', pages: 9,
                desc: '结构带回顾—阐释—展望—呼吁 · 关键词点亮',
              },
            ],
          },
          {
            no: '第五单元', motto: '', goals: [],
            lessons: [
              { no: 17, title: '壶口瀑布', genre: '叙事', kind: '游记',
                dir: 'x8b-hukou', cover: 'x8b-hukou/assets/longcao.jpg', pages: 10,
                desc: '两次观瀑对比 · 水形宽窄跌溢散 · 提炼黄河性格',
              },
              { no: 18, title: '在长江源头各拉丹冬', genre: '叙事', kind: '游记',
                dir: 'x8b-geladandong', cover: 'x8b-geladandong/assets/bingtalin.jpg', pages: 9,
                desc: '冰塔林七站路线 · 视听触感官分层 · 身体与风景双曲线',
              },
              { no: 19, title: '登勃朗峰', genre: '叙事', kind: '游记', skim: true,
                dir: 'x8b-bolangfeng', cover: 'x8b-bolangfeng/assets/mache.jpg', pages: 7,
                desc: '移步换景胶片条 + 速度表 · 车夫之王的幽默',
              },
              { no: 20, title: '一滴水经过丽江', genre: '叙事', kind: '游记', skim: true,
                dir: 'x8b-lijiang', cover: 'x8b-lijiang/assets/gucheng.jpg', pages: 7,
                desc: '拖动水滴走 12 站 · 自然/历史/人文分色',
              },
            ],
          },
          {
            no: '第六单元', motto: '', goals: [],
            lessons: [
              { no: 21, title: '《庄子》二则', genre: '诗文', kind: '文言文',
                dir: 'x8b-zhuangzi', cover: 'x8b-zhuangzi/assets/peng.jpg', pages: 10,
                desc: '鲲鹏尺度放大缩小 · 濠梁五回合拔河对阵',
              },
              { no: 22, title: '《礼记》二则', genre: '诗文', kind: '文言文',
                dir: 'x8b-liji', cover: 'x8b-liji/assets/datong.jpg', pages: 10,
                desc: '教学相长推理链 · 大同社会四区拼图',
              },
              { no: 23, title: '马说', genre: '诗文', kind: '文言文', skim: true,
                dir: 'x8b-mashuo', cover: 'x8b-mashuo/assets/qianli.jpg', pages: 9,
                desc: '千里马—伯乐—食马者泳道论证链 · 称谓高亮',
              },
              { no: 24, title: '唐诗三首', genre: '诗文', kind: '古诗',
                dir: 'x8b-tangshi', cover: 'x8b-tangshi/assets/maowu.jpg', pages: 12,
                desc: '石壕吏分镜 · 茅屋现实愿景滑杆 · 卖炭时间线',
              },
            ],
          },
        ],
      },
      {
        name: '九年级上册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '', goals: [],
            lessons: [
              { no: 1, title: '沁园春·雪', genre: '诗文', kind: '词',
                dir: 'x9a-qinyuanchun', cover: 'x9a-qinyuanchun/assets/beiguo.jpg', pages: 9,
                desc: '“望”字取景框推镜头 · “惜”字链评五帝',
              },
              { no: 2, title: '周总理，你在哪里', genre: '诗文', kind: '现代诗',
                dir: 'x9a-zongli', cover: 'x9a-zongli/assets/dahai.jpg', pages: 9,
                desc: '对山河呼唤、山河回声作答的问答地图',
              },
              { no: 3, title: '我爱这土地', genre: '诗文', kind: '现代诗',
                dir: 'x9a-tudi', cover: 'x9a-tudi/assets/niao.jpg', pages: 9,
                desc: '鸟的一生意象链 + 四意象修饰语卡',
              },
              { no: 4, title: '乡愁', genre: '诗文', kind: '现代诗',
                dir: 'x9a-xiangchou', cover: 'x9a-xiangchou/assets/haixia.jpg', pages: 8,
                desc: '四节时间轴 · 意象由小到大递进动画',
              },
              { no: 5, title: '你是人间的四月天', genre: '诗文', kind: '现代诗',
                dir: 'x9a-siyuetian', cover: 'x9a-siyuetian/assets/huakai.jpg', pages: 7,
                desc: '比喻意象调色盘，把喻体调进“你”',
              },
              { no: 6, title: '我看', genre: '诗文', kind: '现代诗',
                dir: 'x9a-wokan', cover: 'x9a-wokan/assets/chunfeng.jpg', pages: 7,
                desc: '“我看”取景器四机位 · 看—思—愿阶梯',
              },
            ],
          },
          {
            no: '第二单元', motto: '', goals: [],
            lessons: [
              { no: 7, title: '敬业与乐业', genre: '说明', kind: '议论文',
                dir: 'x9a-jingye', cover: 'x9a-jingye/assets/muqiang.jpg', pages: 8,
                desc: '总分总论证结构图，点论据看类型',
              },
              { no: 8, title: '就英法联军远征中国致巴特勒上尉的信', genre: '说明', kind: '书信·议论',
                dir: 'x9a-yuanmingyuan', cover: 'x9a-yuanmingyuan/assets/feixu.jpg', pages: 9,
                desc: '反语卡看字面与实指 · 雨果与强盗立场对照',
              },
              { no: 9, title: '论教养', genre: '说明', kind: '议论文', skim: true,
                dir: 'x9a-jiaoyang', cover: 'x9a-jiaoyang/assets/jiating.jpg', pages: 6,
                desc: '教养表现归档进四个抽屉 + 自查清单',
              },
              { no: 10, title: '精神的三间小屋', genre: '说明', kind: '议论性散文', skim: true,
                dir: 'x9a-xiaowu', cover: 'x9a-xiaowu/assets/sanjian.jpg', pages: 6,
                desc: '布置三间小屋：爱恨滑块、事业与自我的两种布置',
              },
            ],
          },
          {
            no: '第三单元', motto: '', goals: [],
            lessons: [
              { no: 11, title: '岳阳楼记', genre: '诗文', kind: '文言文',
                dir: 'x9a-yueyanglou', cover: 'x9a-yueyanglou/assets/yeyue.jpg', pages: 10,
                desc: '拖天气滑块看悲喜 · 境界金字塔升华先忧后乐',
              },
              { no: 12, title: '醉翁亭记', genre: '诗文', kind: '文言文',
                dir: 'x9a-zuiweng', cover: 'x9a-zuiweng/assets/ting.jpg', pages: 11,
                desc: '一个乐字串全文 · 21个也字节奏朗读',
              },
              { no: 13, title: '湖心亭看雪', genre: '诗文', kind: '文言文', skim: true,
                dir: 'x9a-huxinting', cover: 'x9a-huxinting/assets/xuehu.jpg', pages: 8,
                desc: '痕点芥粒镜头推近 · 品白描与痴',
              },
              { no: 14, title: '诗词三首', genre: '诗文', kind: '古诗词',
                dir: 'x9a-shici', cover: 'x9a-shici/assets/chenzhou.jpg', pages: 11,
                desc: '折线·天平·月相：三首三种读法',
              },
            ],
          },
          {
            no: '第四单元', motto: '', goals: [],
            lessons: [
              { no: 15, title: '故乡', genre: '叙事', kind: '小说',
                dir: 'x9a-guxiang', cover: 'x9a-guxiang/assets/huixiang.jpg', pages: 13,
                desc: '回乡在乡离乡结构图 · 闰土杨二嫂今昔对比',
              },
              { no: 16, title: '我的叔叔于勒', genre: '叙事', kind: '小说',
                dir: 'x9a-yule', cover: 'x9a-yule/assets/zhanqiao.jpg', pages: 13,
                desc: '骂赞盼骂躲态度曲线 · 叠加金钱线看人情',
              },
              { no: 17, title: '孤独之旅', genre: '叙事', kind: '小说', skim: true,
                dir: 'x9a-gudu', cover: 'x9a-gudu/assets/chufa.jpg', pages: 9,
                desc: '心理阶梯一级级上 · 环境与心情配对',
              },
            ],
          },
          {
            no: '第五单元', motto: '', goals: [],
            lessons: [
              { no: 18, title: '中国人失掉自信力了吗', genre: '说明', kind: '驳论文',
                dir: 'x9a-zixinli', cover: 'x9a-zixinli/assets/jiliang.jpg', pages: 8,
                desc: '驳论文结构图 · 点段落判断破与立',
              },
              { no: 19, title: '怀疑与学问', genre: '说明', kind: '议论文',
                dir: 'x9a-huaiyi', cover: 'x9a-huaiyi/assets/yinghuo.jpg', pages: 8,
                desc: '论证链 · 给论据盖论证方法印章',
              },
              { no: 20, title: '谈创造性思维', genre: '说明', kind: '议论文', skim: true,
                dir: 'x9a-chuangzao', cover: 'x9a-chuangzao/assets/dengpao.jpg', pages: 7,
                desc: '图形小实验 + 问题链 · 答案不止一个',
              },
              { no: 21, title: '创造宣言', genre: '说明', kind: '议论文', skim: true,
                dir: 'x9a-xuanyan', cover: 'x9a-xuanyan/assets/yanshui.jpg', pages: 7,
                desc: '五种借口辩论台 · 一一驳倒',
              },
            ],
          },
          {
            no: '第六单元', motto: '', goals: [],
            lessons: [
              { no: 22, title: '智取生辰纲', genre: '叙事', kind: '古典小说',
                dir: 'x9a-shengchengang', cover: 'x9a-shengchengang/assets/tiaojiu.jpg', pages: 10,
                desc: '明暗双线情节图 · 天时地利人和',
              },
              { no: 23, title: '范进中举', genre: '叙事', kind: '古典小说',
                dir: 'x9a-fanjin', cover: 'x9a-fanjin/assets/fengpao.jpg', pages: 9,
                desc: '喜极而疯慢镜头 · 中举前后对比开关',
              },
              { no: 24, title: '三顾茅庐', genre: '叙事', kind: '古典小说', skim: true,
                dir: 'x9a-sangu', cover: 'x9a-sangu/assets/caolu.jpg', pages: 6,
                desc: '三顾层层铺垫阶梯 · 刘关张言行对照',
              },
              { no: 25, title: '刘姥姥进大观园', genre: '叙事', kind: '古典小说', skim: true,
                dir: 'x9a-daguanyuan', cover: 'x9a-daguanyuan/assets/daxiao.jpg', pages: 6,
                desc: '“笑”的群像座次图 · 雅俗对照',
              },
            ],
          },
        ],
      },
      {
        name: '九年级下册',
        edition: '义务教育教科书 · 人民教育出版社',
        units: [
          {
            no: '第一单元', motto: '', goals: [],
            lessons: [
              { no: 1, title: '祖国啊，我亲爱的祖国', genre: '诗文', kind: '现代诗',
                dir: 'x9b-zuguo', cover: 'x9b-zuguo/assets/liming.jpg', pages: 10,
                desc: '破旧→新生意象墙 · “我是”朗读 · 情感台阶',
              },
              { no: 2, title: '梅岭三章', genre: '诗文', kind: '诗', skim: true,
                dir: 'x9b-meiling', cover: 'x9b-meiling/assets/hanmei.jpg', pages: 8,
                desc: '三章竖排吟诵 · 情感三层 · 意象卡归类',
              },
              { no: 3, title: '短诗五首', genre: '诗文', kind: '现代诗', skim: true,
                dir: 'x9b-duanshi', cover: 'x9b-duanshi/assets/fengyu.jpg', pages: 9,
                desc: '五首五法：叠化 · 看与被看 · 一与多',
              },
              { no: 4, title: '海燕', genre: '诗文', kind: '散文诗',
                dir: 'x9b-haiyan', cover: 'x9b-haiyan/assets/baofengyu.jpg', pages: 10,
                desc: '暴风雨三阶段渐变 · 勇敢—怯懦象征轴',
              },
            ],
          },
          {
            no: '第二单元', motto: '', goals: [],
            lessons: [
              { no: 5, title: '孔乙己', genre: '叙事', kind: '小说',
                dir: 'x9b-kongyiji', cover: 'x9b-kongyiji/assets/zuolai.jpg', pages: 10,
                desc: '“笑”声串联 · 排摸前后对比 · 大约的确证据链',
              },
              { no: 6, title: '变色龙', genre: '叙事', kind: '小说',
                dir: 'x9b-bianselong', cover: 'x9b-bianselong/assets/dayi.jpg', pages: 12,
                desc: '态度翻转器：点“狗是谁的”看五次变色',
              },
              { no: 7, title: '溜索', genre: '叙事', kind: '小说', skim: true,
                dir: 'x9b-liusuo', cover: 'x9b-liusuo/assets/liusuo.jpg', pages: 10,
                desc: '惊险分镜慢放 · 三写鹰 · 补上“我”字对比',
              },
              { no: 8, title: '蒲柳人家（节选）', genre: '叙事', kind: '小说', skim: true,
                dir: 'x9b-puliu', cover: 'x9b-puliu/assets/daxuewen.jpg', pages: 9,
                desc: '人物群像名片 · 关系图 · 口语俗语评书腔',
              },
            ],
          },
          {
            no: '第三单元', motto: '', goals: [],
            lessons: [
              { no: 9, title: '鱼我所欲也', genre: '诗文', kind: '文言文',
                dir: 'x9b-yuwosuoyu', cover: 'x9b-yuwosuoyu/assets/zhuyi.jpg', pages: 10,
                desc: '类比天平+论证图 · 品箪食与万钟对比',
              },
              { no: 10, title: '唐雎不辱使命', genre: '诗文', kind: '文言文',
                dir: 'x9b-tangju', cover: 'x9b-tangju/assets/tingjian.jpg', pages: 9,
                desc: '对阵态度曲线 · 皮影戏台品人物语言',
              },
              { no: 11, title: '送东阳马生序', genre: '诗文', kind: '文言文', skim: true,
                dir: 'x9b-dongyang', cover: 'x9b-dongyang/assets/xingshan.jpg', pages: 8,
                desc: '求学四场景 · 余与诸生对比表',
              },
              { no: 12, title: '词四首', genre: '诗文', kind: '词',
                dir: 'x9b-cisishou', cover: 'x9b-cisishou/assets/chulie.jpg', pages: 11,
                desc: '四首四读法：色调·镜头·虚实·层次',
              },
            ],
          },
          {
            no: '第四单元', motto: '', goals: [],
            lessons: [
              { no: 13, title: '短文两篇', genre: '说明', kind: '议论文',
                dir: 'x9b-duanwen', cover: 'x9b-duanwen/assets/shufang.jpg', pages: 10,
                desc: '格言卡分类 · 只读半句的驳立证图',
              },
              { no: 14, title: '山水画的意境', genre: '说明', kind: '文艺论文',
                dir: 'x9b-shanshui', cover: 'x9b-shanshui/assets/gufan.jpg', pages: 9,
                desc: '意境＝景＋情算式 · 留白意匠试验台',
              },
              { no: 15, title: '无言之美', genre: '说明', kind: '文艺论文', skim: true,
                dir: 'x9b-wuyan', cover: 'x9b-wuyan/assets/shuqing.jpg', pages: 7,
                desc: '说尽vs无言例证卡 · 删字器',
              },
              { no: 16, title: '驱遣我们的想象', genre: '说明', kind: '文艺论文', skim: true,
                dir: 'x9b-xiangxiang', cover: 'x9b-xiangxiang/assets/damo.jpg', pages: 7,
                desc: '想象工作台：逐词搭出诗中画面',
              },
            ],
          },
          {
            no: '第五单元', motto: '', goals: [],
            lessons: [
              { no: 17, title: '屈原（节选）', genre: '叙事', kind: '戏剧',
                dir: 'x9b-quyuan', cover: 'x9b-quyuan/assets/leidian.jpg', pages: 10,
                desc: '雷电颂情感曲线 · 分角色读 · 舞台说明归类',
              },
              { no: 18, title: '天下第一楼（节选）', genre: '叙事', kind: '戏剧',
                dir: 'x9b-tianxia', cover: 'x9b-tianxia/assets/kaolu.jpg', pages: 10,
                desc: '三方关系图 · 点台词看潜台词 · 衰因层层追问',
              },
              { no: 19, title: '枣儿', genre: '叙事', kind: '戏剧',
                dir: 'x9b-zaoer', cover: 'x9b-zaoer/assets/wangyuan.jpg', pages: 9,
                desc: '老人男孩双声部对话 · “枣儿”象征层层剥开',
              },
            ],
          },
          {
            no: '第六单元', motto: '', goals: [],
            lessons: [
              { no: 20, title: '曹刿论战', genre: '诗文', kind: '文言文',
                dir: 'x9b-caogui', cover: 'x9b-caogui/assets/zhengu.jpg', pages: 10,
                desc: '战前战中战后 · 两人对照表 · 一鼓作气士气曲线',
              },
              { no: 21, title: '邹忌讽齐王纳谏', genre: '诗文', kind: '文言文', skim: true,
                dir: 'x9b-zouji', cover: 'x9b-zouji/assets/menting.jpg', pages: 8,
                desc: '三问三答排比 → 家事到国事类比推理图',
              },
              { no: 22, title: '陈涉世家', genre: '诗文', kind: '文言文', skim: true,
                dir: 'x9b-chenshe', cover: 'x9b-chenshe/assets/yuye.jpg', pages: 8,
                desc: '起义前因后果情节链 · 陈胜言行卡',
              },
              { no: 23, title: '出师表', genre: '诗文', kind: '文言文',
                dir: 'x9b-chushibiao', cover: 'x9b-chushibiao/assets/linbiao.jpg', pages: 11,
                desc: '十三次“先帝”叙议标注 · 三条建议投票 · 点字断句',
              },
              { no: 24, title: '诗词曲五首', genre: '诗文', kind: '古诗词曲',
                dir: 'x9b-shiciqu', cover: 'x9b-shiciqu/assets/xueying.jpg', pages: 11,
                desc: '五首五呈现：归家镜头/雪景时间轴/问答/人生对照/兴亡翻转',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    "subject": "数学",
    "books": [
      {
        "name": "五年级上册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰教育出版社（苏教版）",
        "units": [
          {
            "no": "一 负数的初步认识",
            "motto": "零下也能记：正负表相反",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "认识正数和负数",
                "genre": "概念",
                "kind": "负数",
                "dir": "mp5a-zhengfushu",
                "pages": 10,
                "desc": "拖温度计液柱，按任务调零上零下",
                "cover": "mp5a-zhengfushu/assets/wendu.jpg"
              },
              {
                "no": "例3–4",
                "title": "用正负数表示相反意义的量",
                "genre": "概念",
                "kind": "负数",
                "dir": "mp5a-xiangfanyiyi",
                "pages": 11,
                "desc": "东西走一走，再把小路变成数轴",
                "cover": "mp5a-xiangfanyiyi/assets/dongxi.jpg"
              }
            ]
          },
          {
            "no": "二 多边形的面积",
            "motto": "剪一剪拼一拼，转化求面积",
            "goals": [],
            "lessons": [
              {
                "no": "例1–3",
                "title": "平行四边形的面积",
                "genre": "推导",
                "kind": "图形面积",
                "dir": "mp5a-pingxingmianji",
                "pages": 11,
                "desc": "拖剪刀线沿高剪开，平移拼成长方形",
                "cover": "mp5a-pingxingmianji/assets/shougong.jpg"
              },
              {
                "no": "例4–5",
                "title": "三角形的面积",
                "genre": "推导",
                "kind": "图形面积",
                "dir": "mp5a-sanjiaoxingmianji",
                "pages": 11,
                "desc": "复制三角形绕中点转 180° 拼成平行四边形",
                "cover": "mp5a-sanjiaoxingmianji/assets/lukou.jpg"
              },
              {
                "no": "例6–7",
                "title": "梯形的面积",
                "genre": "推导",
                "kind": "图形面积",
                "dir": "mp5a-tixingmianji",
                "pages": 11,
                "desc": "拖上底滑块，梯形在三角形和平行四边形之间变化",
                "cover": "mp5a-tixingmianji/assets/maitian.jpg"
              },
              {
                "no": "例8–9",
                "title": "公顷和平方千米",
                "genre": "概念",
                "kind": "面积单位",
                "dir": "mp5a-gongqing",
                "pages": 11,
                "desc": "正方形逐层放大：1 米到 1000 米",
                "cover": "mp5a-gongqing/assets/hupan.jpg"
              },
              {
                "no": "例10–11",
                "title": "组合图形与不规则图形的面积",
                "genre": "推导",
                "kind": "图形面积",
                "dir": "mp5a-zuhetuxing",
                "pages": 10,
                "desc": "三种割补；湖泊数方格，格子越小越准",
                "cover": "mp5a-zuhetuxing/assets/caoping.jpg"
              },
              {
                "no": "综合与实践",
                "title": "校园绿地面积",
                "genre": "推导",
                "kind": "图形面积",
                "optional": true
              }
            ]
          },
          {
            "no": "三 小数的意义和性质",
            "motto": "十进分数，换个写法",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "小数的意义",
                "genre": "概念",
                "kind": "小数",
                "dir": "mp5a-xiaoshuyiyi",
                "pages": 11,
                "desc": "米尺放大镜看厘米毫米，百格千格涂色",
                "cover": "mp5a-xiaoshuyiyi/assets/celiang.jpg"
              },
              {
                "no": "例3",
                "title": "小数的计数单位和数位顺序",
                "genre": "概念",
                "kind": "小数",
                "dir": "mp5a-jishudanwei",
                "pages": 11,
                "desc": "点数位表数字自动读数，计数器满十进一",
                "cover": "mp5a-jishudanwei/assets/feichuan.jpg"
              },
              {
                "no": "例4–5",
                "title": "小数的性质",
                "genre": "推导",
                "kind": "小数",
                "dir": "mp5a-xiaoshuxingzhi",
                "pages": 11,
                "desc": "方格叠一叠，末尾添0去0实验台",
                "cover": "mp5a-xiaoshuxingzhi/assets/wenju.jpg"
              },
              {
                "no": "例6–7",
                "title": "小数的大小比较",
                "genre": "推导",
                "kind": "小数",
                "dir": "mp5a-daxiaobijiao",
                "pages": 11,
                "desc": "数轴放大镜逐层比位，□里能填几",
                "cover": "mp5a-daxiaobijiao/assets/shengao.jpg"
              },
              {
                "no": "例8–9",
                "title": "改写和求近似数",
                "genre": "概念",
                "kind": "小数",
                "dir": "mp5a-gaixiejinsi",
                "pages": 11,
                "desc": "小数点搬家改写万亿，四舍五入数轴",
                "cover": "mp5a-gaixiejinsi/assets/xingkong.jpg"
              }
            ]
          },
          {
            "no": "四 小数加法和减法",
            "motto": "小数点对齐，就是数位对齐",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "小数加法和减法",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-jiajianfa",
                "pages": 10,
                "desc": "末尾对齐与小数点对齐实验，竖式逐列算",
                "cover": "mp5a-jiajianfa/assets/guitai.jpg"
              },
              {
                "no": "例3",
                "title": "小数加减混合运算",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-jiajianhunhe",
                "pages": 10,
                "desc": "课堂计算器连加，水位边算边画折线",
                "cover": "mp5a-jiajianhunhe/assets/chaoshi.jpg"
              }
            ]
          },
          {
            "no": "五 小数乘法和除法",
            "motto": "小数点一移，大小就变",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "小数乘整数",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-xiaoshuchengzhengshu",
                "pages": 11,
                "desc": "钱币板摆硬币满十换一，竖式逐步点小数点",
                "cover": "mp5a-xiaoshuchengzhengshu/assets/xigua.jpg"
              },
              {
                "no": "例2–3",
                "title": "小数点向右移动引起的变化",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-xiaoshudianyouyi",
                "pages": 11,
                "desc": "小数点滑轨：×10/100/1000 逐格右滑补0",
                "cover": "mp5a-xiaoshudianyouyi/assets/danbaizhi.jpg"
              },
              {
                "no": "例4",
                "title": "小数除以整数",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-xiaoshuchuyizhengshu",
                "pages": 11,
                "desc": "分钱板：不够分换小一级，配除法竖式演示",
                "cover": "mp5a-xiaoshuchuyizhengshu/assets/shuiguo.jpg"
              },
              {
                "no": "例5–6",
                "title": "小数点向左移动引起的变化",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-xiaoshudianzuoyi",
                "pages": 11,
                "desc": "拖小数点先猜后查，左补0，与右移对照",
                "cover": "mp5a-xiaoshudianzuoyi/assets/dongwu.jpg"
              },
              {
                "no": "例7",
                "title": "小数乘小数",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-xiaoshuchengxiaoshu",
                "pages": 11,
                "desc": "面积图数0.01小方格、分块看，点小数点",
                "cover": "mp5a-xiaoshuchengxiaoshu/assets/fangjian.jpg"
              },
              {
                "no": "例8–9",
                "title": "积的位数与积的近似值",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-jiweishu",
                "pages": 10,
                "desc": "小数点跳跳：从右数位数、不够补0",
                "cover": "mp5a-jiweishu/assets/huajia.jpg"
              },
              {
                "no": "例10–11",
                "title": "除数是小数的除法",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-chushuxiaoshu",
                "pages": 11,
                "desc": "商不变滑轨：两个小数点同时右移",
                "cover": "mp5a-chushuxiaoshu/assets/jidan.jpg"
              },
              {
                "no": "例12–13",
                "title": "商的近似值",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-shangjinsi",
                "pages": 10,
                "desc": "再除一位：余数重复→找循环节",
                "cover": "mp5a-shangjinsi/assets/youyong.jpg"
              },
              {
                "no": "例14",
                "title": "小数四则混合运算和简便计算",
                "genre": "推导",
                "kind": "小数运算",
                "dir": "mp5a-sizehunhe",
                "pages": 10,
                "desc": "比例菜地分合＋运算顺序逐步算",
                "cover": "mp5a-sizehunhe/assets/caidi.jpg"
              },
              {
                "no": "综合与实践",
                "title": "班级联欢会",
                "genre": "推导",
                "kind": "小数运算",
                "optional": true
              }
            ]
          },
          {
            "no": "六 统计表和条形统计图（二）",
            "motto": "两组数据，一图对比",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "复式统计表",
                "genre": "概念",
                "kind": "统计",
                "dir": "mp5a-fushitongjibiao",
                "pages": 10,
                "desc": "四张小表搬进复式表＋点格读行列",
                "cover": "mp5a-fushitongjibiao/assets/yueqi.jpg"
              },
              {
                "no": "例2",
                "title": "复式条形统计图",
                "genre": "概念",
                "kind": "统计",
                "dir": "mp5a-fushitiaoxingtu",
                "pages": 11,
                "desc": "两图合一动画＋拖直条画图自动检查",
                "cover": "mp5a-fushitiaoxingtu/assets/tiaosheng.jpg"
              }
            ]
          },
          {
            "no": "七 解决问题的策略",
            "motto": "有序列举，不重不漏",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "用列举的策略解决问题（一）",
                "genre": "推导",
                "kind": "策略",
                "dir": "mp5a-liejuyi",
                "pages": 11,
                "desc": "22 根木条围花圃，拖卡片有序列举，自动查重查漏",
                "cover": "mp5a-liejuyi/assets/huapu.jpg"
              },
              {
                "no": "例2",
                "title": "用列举的策略解决问题（二）",
                "genre": "推导",
                "kind": "策略",
                "dir": "mp5a-liejuer",
                "pages": 11,
                "desc": "点两队连线列举比赛，重复连线即时提醒",
                "cover": "mp5a-liejuer/assets/zuqiu.jpg"
              }
            ]
          },
          {
            "no": "八 用字母表示数",
            "motto": "一个字母，代表一类数",
            "goals": [],
            "lessons": [
              {
                "no": "例1–3",
                "title": "用字母表示数",
                "genre": "概念",
                "kind": "代数式",
                "dir": "mp5a-zimubiaoshishu",
                "pages": 10,
                "desc": "摆三角形从具体数到 a×3，年龄条差 28 岁不变",
                "cover": "mp5a-zimubiaoshishu/assets/gonglu.jpg"
              },
              {
                "no": "例4–5",
                "title": "含有字母的式子的化简",
                "genre": "推导",
                "kind": "代数式",
                "dir": "mp5a-zimushihuajian",
                "pages": 10,
                "desc": "倒橙汁让式子随倒随长，连着摆三角形分色计数",
                "cover": "mp5a-zimushihuajian/assets/chengzhi.jpg"
              },
              {
                "no": "例6–7",
                "title": "求含有字母的式子的值",
                "genre": "推导",
                "kind": "代数式",
                "dir": "mp5a-zimushiqiuzhi",
                "pages": 10,
                "desc": "小棒两种分组数法，验证 3a+4a=7a",
                "cover": "mp5a-zimushiqiuzhi/assets/baibang.jpg"
              },
              {
                "no": "综合与实践",
                "title": "钉子板上的多边形",
                "genre": "推导",
                "kind": "代数式",
                "optional": true,
                "dir": "mp5a-dingziban",
                "pages": 10,
                "desc": "可点击钉子板，自动算面积和边上、内部钉子数",
                "cover": "mp5a-dingziban/assets/hezuo.jpg"
              }
            ]
          }
        ]
      },
      {
        "name": "五年级下册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰教育出版社（苏教版）",
        "units": [
          {
            "no": "一 简易方程",
            "motto": "天平平衡，等式不变",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "等式与方程",
                "genre": "概念",
                "kind": "方程",
                "dir": "mp5b-dengshifangcheng",
                "pages": 10,
                "desc": "放砝码称神秘木块，平衡才是等式",
                "cover": "mp5b-dengshifangcheng/assets/tianping.jpg"
              },
              {
                "no": "例3–4",
                "title": "等式的性质（一）与解方程",
                "genre": "推导",
                "kind": "方程",
                "dir": "mp5b-dengshixingzhiyi",
                "pages": 10,
                "desc": "天平两边加减砝码，看平衡怎么变",
                "cover": "mp5b-dengshixingzhiyi/assets/jiama.jpg"
              },
              {
                "no": "例5–6",
                "title": "等式的性质（二）与解方程",
                "genre": "推导",
                "kind": "方程",
                "dir": "mp5b-dengshixingzhier",
                "pages": 10,
                "desc": "倍数天平：两边同乘同除仍平衡",
                "cover": "mp5b-dengshixingzhier/assets/shiyantian.jpg"
              },
              {
                "no": "例7–8",
                "title": "列方程解决实际问题",
                "genre": "推导",
                "kind": "方程",
                "dir": "mp5b-liefangcheng",
                "pages": 11,
                "desc": "拖动线段图，看清“2倍少22米”",
                "cover": "mp5b-liefangcheng/assets/dayanta.jpg"
              },
              {
                "no": "例9–10",
                "title": "列方程解决稍复杂的实际问题",
                "genre": "推导",
                "kind": "方程",
                "dir": "mp5b-fuzaliefangcheng",
                "pages": 10,
                "desc": "调货车速度，看相遇动画",
                "cover": "mp5b-fuzaliefangcheng/assets/yiheyuan.jpg"
              }
            ]
          },
          {
            "no": "二 折线统计图",
            "motto": "折线起伏，看出变化",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "单式折线统计图",
                "genre": "概念",
                "kind": "统计",
                "dir": "mp5b-danshizhexian",
                "pages": 9,
                "desc": "照表描点连线，即时判对错",
                "cover": "mp5b-danshizhexian/assets/shengao.jpg"
              },
              {
                "no": "例2",
                "title": "复式折线统计图",
                "genre": "概念",
                "kind": "统计",
                "dir": "mp5b-fushizhexian",
                "pages": 10,
                "desc": "接着描点补全两条折线",
                "cover": "mp5b-fushizhexian/assets/baowenbei.jpg"
              },
              {
                "no": "综合与实践",
                "title": "蒜叶的生长",
                "genre": "推导",
                "kind": "统计",
                "optional": true,
                "dir": "mp5b-suanye",
                "pages": 9,
                "desc": "录入记录表，统计图随填随画并显示差",
                "cover": "mp5b-suanye/assets/suanye.jpg"
              }
            ]
          },
          {
            "no": "三 因数与倍数",
            "motto": "数与数之间的亲缘关系",
            "goals": [],
            "lessons": [
              {
                "no": "例1–3",
                "title": "因数和倍数",
                "genre": "概念",
                "kind": "数论",
                "dir": "mp5b-yinshubeishu",
                "pages": 11,
                "desc": "正方形拼长方形，一对一对连弧找因数",
                "cover": "mp5b-yinshubeishu/assets/ticao.jpg"
              },
              {
                "no": "例4",
                "title": "2和5的倍数的特征",
                "genre": "推导",
                "kind": "数论",
                "dir": "mp5b-erwubeishu",
                "pages": 10,
                "desc": "百数表画△○，看个位整列，大数检验器",
                "cover": "mp5b-erwubeishu/assets/jieban.jpg"
              },
              {
                "no": "例5",
                "title": "3的倍数的特征",
                "genre": "推导",
                "kind": "数论",
                "dir": "mp5b-sanbeishu",
                "pages": 10,
                "desc": "计数器拨珠数珠，□里填数字找全填法",
                "cover": "mp5b-sanbeishu/assets/jishuqi.jpg"
              },
              {
                "no": "例6",
                "title": "质数和合数",
                "genre": "概念",
                "kind": "数论",
                "dir": "mp5b-zhishuheshu",
                "pages": 10,
                "desc": "1～20因数个数柱状图，埃氏筛2～100动画",
                "cover": "mp5b-zhishuheshu/assets/shaizi.jpg"
              },
              {
                "no": "例7–8",
                "title": "分解质因数",
                "genre": "推导",
                "kind": "数论",
                "dir": "mp5b-fenjiezhiyinshu",
                "pages": 10,
                "desc": "自选分法长因数树，短除法逐步演示",
                "cover": "mp5b-fenjiezhiyinshu/assets/dashu.jpg"
              },
              {
                "no": "例9–10",
                "title": "公因数和最大公因数",
                "genre": "概念",
                "kind": "数论",
                "dir": "mp5b-gongyinshu",
                "pages": 10,
                "desc": "按真实比例铺正方形砖，维恩图分类",
                "cover": "mp5b-gongyinshu/assets/pudizhuan.jpg"
              },
              {
                "no": "例11–12",
                "title": "公倍数和最小公倍数",
                "genre": "概念",
                "kind": "数论",
                "dir": "mp5b-gongbeishu",
                "pages": 10,
                "desc": "两只青蛙数轴跳出公倍数，公交时刻表",
                "cover": "mp5b-gongbeishu/assets/gongjiao.jpg"
              },
              {
                "no": "综合与实践",
                "title": "和与积的奇偶性",
                "genre": "推导",
                "kind": "数论",
                "optional": true,
                "dir": "mp5b-heyujiqiou",
                "pages": 10,
                "desc": "配对点子合并看奇偶，点阵积配对",
                "cover": "mp5b-heyujiqiou/assets/fanshu.jpg"
              }
            ]
          },
          {
            "no": "四 分数的意义和性质",
            "motto": "平均分出来的新数",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "分数的意义",
                "genre": "概念",
                "kind": "分数",
                "dir": "mp5b-fenshuyiyi",
                "pages": 11,
                "desc": "单位“1”工作台：选整体、平均分、点涂色",
                "cover": "mp5b-fenshuyiyi/assets/yuebing.jpg"
              },
              {
                "no": "例2–3",
                "title": "分数与除法",
                "genre": "推导",
                "kind": "分数",
                "dir": "mp5b-fenshuyuchufa",
                "pages": 11,
                "desc": "分饼动画两种分法，饼数、人数可调",
                "cover": "mp5b-fenshuyuchufa/assets/fenbing.jpg"
              },
              {
                "no": "例4",
                "title": "求一个数是另一个数的几分之几",
                "genre": "推导",
                "kind": "分数",
                "dir": "mp5b-jifenzhiji",
                "pages": 11,
                "desc": "拖动蓝彩带，改红彩带长，读几分之几",
                "cover": "mp5b-jifenzhiji/assets/caidai.jpg"
              },
              {
                "no": "例5–8",
                "title": "真分数和假分数",
                "genre": "概念",
                "kind": "分数",
                "dir": "mp5b-zhenjiafenshu",
                "pages": 12,
                "desc": "分数单位累加器，圆和数轴同步",
                "cover": "mp5b-zhenjiafenshu/assets/bisa.jpg"
              },
              {
                "no": "例9–10",
                "title": "分数和小数的互化",
                "genre": "推导",
                "kind": "分数",
                "dir": "mp5b-fenshuxiaoshu",
                "pages": 11,
                "desc": "双刻度数轴拖点，看出能否除尽",
                "cover": "mp5b-fenshuxiaoshu/assets/zhongguojie.jpg"
              },
              {
                "no": "例11–12",
                "title": "分数的基本性质",
                "genre": "推导",
                "kind": "分数",
                "dir": "mp5b-fenshuxingzhi",
                "pages": 11,
                "desc": "同一张纸连续对折，涂色不变；分数墙",
                "cover": "mp5b-fenshuxingzhi/assets/zhezhi.jpg"
              },
              {
                "no": "例13",
                "title": "约分",
                "genre": "推导",
                "kind": "分数",
                "dir": "mp5b-yuefen",
                "pages": 11,
                "desc": "同时除以公因数，小格合成大格",
                "cover": "mp5b-yuefen/assets/youpiao.jpg"
              },
              {
                "no": "例14–15",
                "title": "通分与分数大小比较",
                "genre": "推导",
                "kind": "分数",
                "dir": "mp5b-tongfen",
                "pages": 11,
                "desc": "两纸条切同份数，粗线对齐才可通分",
                "cover": "mp5b-tongfen/assets/gushishu.jpg"
              },
              {
                "no": "综合与实践",
                "title": "球的反弹高度",
                "genre": "推导",
                "kind": "分数",
                "optional": true,
                "dir": "mp5b-qiufantan",
                "pages": 8,
                "desc": "模拟落球加课堂实验记录表自动算分数",
                "cover": "mp5b-qiufantan/assets/fantan.jpg"
              }
            ]
          },
          {
            "no": "五 分数加法和减法",
            "motto": "先通分，再加减",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "异分母分数加减法",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp5b-yifenmujiajian",
                "pages": 11,
                "desc": "拖滑块等分分数条，找公分母",
                "cover": "mp5b-yifenmujiajian/assets/shiyantian.jpg"
              },
              {
                "no": "例2",
                "title": "分数加减混合运算",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp5b-fenshihunhe",
                "pages": 10,
                "desc": "点运算符选先算哪步，判运算律",
                "cover": "mp5b-fenshihunhe/assets/huayuan.jpg"
              }
            ]
          },
          {
            "no": "六 圆",
            "motto": "化曲为直，转化出新公式",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "圆的认识",
                "genre": "概念",
                "kind": "圆",
                "dir": "mp5b-yuanderenshi",
                "pages": 11,
                "desc": "拖圆规画圆，改两脚距离不成圆",
                "cover": "mp5b-yuanderenshi/assets/bowen.jpg"
              },
              {
                "no": "例3",
                "title": "扇形的认识",
                "genre": "概念",
                "kind": "圆",
                "dir": "mp5b-shanxing",
                "pages": 10,
                "desc": "拖A、B两点调圆心角看扇形",
                "cover": "mp5b-shanxing/assets/zheshan.jpg"
              },
              {
                "no": "例4–6",
                "title": "圆的周长",
                "genre": "推导",
                "kind": "圆",
                "dir": "mp5b-yuanzhouchang",
                "pages": 11,
                "desc": "圆片在直尺上滚一周测π",
                "cover": "mp5b-yuanzhouchang/assets/zixingche.jpg"
              },
              {
                "no": "例7–9",
                "title": "圆的面积",
                "genre": "推导",
                "kind": "圆",
                "dir": "mp5b-yuanmianji",
                "cover": "mp5b-yuanmianji/assets/penshui.jpg",
                "pages": 11,
                "desc": "切拼成近似长方形 · 8→64 份越分越像"
              },
              {
                "no": "例10–11",
                "title": "已知周长求面积与圆环的面积",
                "genre": "推导",
                "kind": "圆",
                "dir": "mp5b-yuanhuan",
                "pages": 10,
                "desc": "抠掉内圆、圆环剪开拼成平行四边形",
                "cover": "mp5b-yuanhuan/assets/shuichi.jpg"
              }
            ]
          },
          {
            "no": "七 解决问题的策略",
            "motto": "化新为旧，化繁为简",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "用转化的策略解决问题（图形）",
                "genre": "推导",
                "kind": "策略",
                "dir": "mp5b-zhuanhuatuxing",
                "pages": 10,
                "desc": "拖半圆平移8格、旋转180°拼长方形"
              },
              {
                "no": "例2",
                "title": "用转化的策略解决问题（计算）",
                "genre": "推导",
                "kind": "策略",
                "dir": "mp5b-zhuanhuajisuan",
                "pages": 11,
                "desc": "正方形逐次涂一半、铅笔架倒放拼"
              }
            ]
          }
        ]
      },
      {
        "name": "六年级上册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰教育出版社（苏教版）",
        "units": [
          {
            "no": "一 长方体和正方体",
            "motto": "面、棱、顶点里藏着体积",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "长方体和正方体的认识",
                "genre": "概念",
                "kind": "立体图形",
                "dir": "mp6a-changfangtirenshi",
                "pages": 11,
                "desc": "转纸盒实时数看得见的面，滑块变成正方体",
                "cover": "mp6a-changfangtirenshi/assets/hezi.jpg"
              },
              {
                "no": "例3",
                "title": "长方体和正方体的展开图",
                "genre": "概念",
                "kind": "立体图形",
                "dir": "mp6a-zhankaitu",
                "pages": 10,
                "desc": "逐步折叠：11 种展开图，选纸片围盒子",
                "cover": "mp6a-zhankaitu/assets/jianhezi.jpg"
              },
              {
                "no": "例4–5",
                "title": "长方体和正方体的表面积",
                "genre": "推导",
                "kind": "立体图形",
                "dir": "mp6a-biaomianji",
                "pages": 10,
                "desc": "展开图相对面高亮，无盖鱼缸拆装玻璃",
                "cover": "mp6a-biaomianji/assets/yugang.jpg"
              },
              {
                "no": "例6–8",
                "title": "体积和体积单位",
                "genre": "概念",
                "kind": "立体图形",
                "dir": "mp6a-tijidanwei",
                "pages": 10,
                "desc": "放桃倒水按体积精确计算，切小正方体比大小",
                "cover": "mp6a-tijidanwei/assets/taozi.jpg"
              },
              {
                "no": "例9–11",
                "title": "长方体和正方体的体积",
                "genre": "推导",
                "kind": "立体图形",
                "dir": "mp6a-changfangtitiji",
                "pages": 11,
                "desc": "一排一层摞小正方体记表，底面积一层层升高",
                "cover": "mp6a-changfangtitiji/assets/jimu.jpg"
              },
              {
                "no": "例12",
                "title": "相邻体积单位间的进率",
                "genre": "推导",
                "kind": "立体图形",
                "dir": "mp6a-jinlv",
                "pages": 10,
                "desc": "1dm³ 拆成一排、一层、10 层共 1000 个",
                "cover": "mp6a-jinlv/assets/jiaoju.jpg"
              },
              {
                "no": "综合与实践",
                "title": "表面涂色的正方体",
                "genre": "推导",
                "kind": "立体图形",
                "optional": true
              }
            ]
          },
          {
            "no": "二 分数乘法",
            "motto": "求几分之几，就用乘法",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "分数与整数相乘",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp6a-fenshuchengzhengshu",
                "pages": 11,
                "desc": "绸带逐朵涂色，长方形涂色器算几个几分之几",
                "cover": "mp6a-fenshuchengzhengshu/assets/chouhua.jpg"
              },
              {
                "no": "例3",
                "title": "求一个数的几分之几是多少",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp6a-qiujifenzhiji",
                "pages": 11,
                "desc": "可调线段图：分几份、多/少几份对上原句",
                "cover": "mp6a-qiujifenzhiji/assets/luohua.jpg"
              },
              {
                "no": "例4–6",
                "title": "分数与分数相乘",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp6a-fenshuchengfenshu",
                "pages": 11,
                "desc": "面积模型：先横分涂色再竖分，数重叠格子",
                "cover": "mp6a-fenshuchengfenshu/assets/zhezhi.jpg"
              },
              {
                "no": "例7",
                "title": "倒数的认识",
                "genre": "概念",
                "kind": "分数运算",
                "dir": "mp6a-daoshu",
                "pages": 11,
                "desc": "翻牌求倒数，可自己出题；思考题填圆圈",
                "cover": "mp6a-daoshu/assets/fanpai.jpg"
              }
            ]
          },
          {
            "no": "三 分数除法",
            "motto": "除以一个数，乘它的倒数",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "分数除以整数",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp6a-fenshuchuzhengshu",
                "pages": 11,
                "desc": "面积模型把4/5升按人数竖切，看出÷n=×1/n",
                "cover": "mp6a-fenshuchuzhengshu/assets/guozhi.jpg"
              },
              {
                "no": "例2–4",
                "title": "一个数除以分数",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp6a-chuyifenshu",
                "pages": 12,
                "desc": "切橙子数块数、按2/3米剪彩带",
                "cover": "mp6a-chuyifenshu/assets/juzi.jpg"
              },
              {
                "no": "例5–6",
                "title": "分数除法解决实际问题",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp6a-fenshuchufawenti",
                "pages": 11,
                "desc": "线段图五步倒推单位1，可换题",
                "cover": "mp6a-fenshuchufawenti/assets/pingzhi.jpg"
              },
              {
                "no": "例7–8",
                "title": "比的意义",
                "genre": "概念",
                "kind": "比",
                "dir": "mp6a-bideyiyi",
                "cover": "mp6a-bideyiyi/assets/zaocan.jpg",
                "pages": 11,
                "desc": "配比滑块：比相同，味道就相同"
              },
              {
                "no": "例9–10",
                "title": "比的基本性质",
                "genre": "推导",
                "kind": "比",
                "dir": "mp6a-bidexingzhi",
                "pages": 11,
                "desc": "配比滑块同乘同除看颜色，加化简工作台",
                "cover": "mp6a-bidexingzhi/assets/fengmishui.jpg"
              },
              {
                "no": "例11",
                "title": "按比分配",
                "genre": "推导",
                "kind": "比",
                "dir": "mp6a-anbifenpei",
                "pages": 11,
                "desc": "30格涂色，加可调各项的分段线段图",
                "cover": "mp6a-anbifenpei/assets/zhishu.jpg"
              },
              {
                "no": "综合与实践",
                "title": "树叶中的比",
                "genre": "推导",
                "kind": "比",
                "optional": true
              }
            ]
          },
          {
            "no": "四 解决问题的策略",
            "motto": "先假设，再调整",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "用假设的策略解决问题（一）",
                "genre": "推导",
                "kind": "策略",
                "dir": "mp6a-jiasheyi",
                "pages": 11,
                "desc": "换杯子假设表：大杯⇄3小杯，总量不变",
                "cover": "mp6a-jiasheyi/assets/guozhi.jpg"
              },
              {
                "no": "例2",
                "title": "用假设的策略解决问题（二）",
                "genre": "推导",
                "kind": "策略",
                "dir": "mp6a-jiasheer",
                "pages": 11,
                "desc": "猜小盒个数再调整；大盒换小盒总数变化",
                "cover": "mp6a-jiasheer/assets/qiuhe.jpg"
              }
            ]
          },
          {
            "no": "五 分数四则混合运算",
            "motto": "运算顺序，分数同样适用",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "分数四则混合运算",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp6a-fenshusize",
                "pages": 10,
                "desc": "点运算符按顺序算，18竖条图看分配律",
                "cover": "mp6a-fenshusize/assets/zhongguojie.jpg"
              },
              {
                "no": "例2–3",
                "title": "稍复杂的分数实际问题",
                "genre": "推导",
                "kind": "分数运算",
                "dir": "mp6a-fuzafenshuwenti",
                "pages": 11,
                "desc": "部分与其余、比多少几分之几的比较线段图",
                "cover": "mp6a-fuzafenshuwenti/assets/yundonghui.jpg"
              }
            ]
          },
          {
            "no": "六 百分数",
            "motto": "以一百为分母来比较",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "百分数的意义和读写",
                "genre": "概念",
                "kind": "百分数",
                "dir": "mp6a-baifenshuyiyi",
                "pages": 11,
                "desc": "百格图拖动涂色，三场命中率同屏对比",
                "cover": "mp6a-baifenshuyiyi/assets/toulan.jpg"
              },
              {
                "no": "例2–3",
                "title": "百分数与分数、小数的互化",
                "genre": "推导",
                "kind": "百分数",
                "dir": "mp6a-baifenshuhuhua",
                "pages": 11,
                "desc": "三联转换器联动，小数点逐位搬家",
                "cover": "mp6a-baifenshuhuhua/assets/yangwoqizuo.jpg"
              },
              {
                "no": "例4–5",
                "title": "求百分率",
                "genre": "推导",
                "kind": "百分数",
                "dir": "mp6a-qiubaifenlv",
                "pages": 11,
                "desc": "点名册点人改出勤，发芽率随调随算",
                "cover": "mp6a-qiubaifenlv/assets/chenpao.jpg"
              },
              {
                "no": "例6",
                "title": "求一个数比另一个数多（少）百分之几",
                "genre": "推导",
                "kind": "百分数",
                "dir": "mp6a-duoshaobaifenzhiji",
                "pages": 11,
                "desc": "拖两条线段，看多几%与少几%不同",
                "cover": "mp6a-duoshaobaifenzhiji/assets/zaolin.jpg"
              },
              {
                "no": "例7–9",
                "title": "纳税、利息和折扣",
                "genre": "概念",
                "kind": "百分数",
                "dir": "mp6a-nashuilixi",
                "pages": 11,
                "desc": "纳税/利息/折扣生活计算器精确出小票",
                "cover": "mp6a-nashuilixi/assets/shudian.jpg"
              },
              {
                "no": "例10–11",
                "title": "列方程解决百分数问题",
                "genre": "推导",
                "kind": "百分数",
                "dir": "mp6a-baifenshufangcheng",
                "pages": 11,
                "desc": "十份线段图滑块调，方程与份数对照",
                "cover": "mp6a-baifenshufangcheng/assets/liangku.jpg"
              },
              {
                "no": "综合与实践",
                "title": "互联网的普及",
                "genre": "推导",
                "kind": "百分数",
                "optional": true,
                "dir": "mp6a-hulianwang",
                "pages": 9,
                "desc": "课本数据逐年描点折线图，班级调查表实时算比",
                "cover": "mp6a-hulianwang/assets/shangwang.jpg"
              }
            ]
          }
        ]
      },
      {
        "name": "六年级下册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰教育出版社（苏教版）",
        "units": [
          {
            "no": "一 扇形统计图",
            "motto": "部分占整体，一圆看清",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "扇形统计图",
                "genre": "概念",
                "kind": "统计"
              },
              {
                "no": "例2",
                "title": "选择合适的统计图",
                "genre": "概念",
                "kind": "统计"
              }
            ]
          },
          {
            "no": "二 圆柱和圆锥",
            "motto": "旋转出来的立体图形",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "圆柱和圆锥的认识",
                "genre": "概念",
                "kind": "立体图形"
              },
              {
                "no": "例2–3",
                "title": "圆柱的表面积",
                "genre": "推导",
                "kind": "立体图形"
              },
              {
                "no": "例4",
                "title": "圆柱的体积",
                "genre": "推导",
                "kind": "立体图形"
              },
              {
                "no": "例5",
                "title": "圆锥的体积",
                "genre": "推导",
                "kind": "立体图形"
              }
            ]
          },
          {
            "no": "三 解决问题的策略",
            "motto": "画图列表，择优而用",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "选择画图的策略解决问题",
                "genre": "推导",
                "kind": "策略"
              },
              {
                "no": "例2",
                "title": "选择列表、假设等策略解决问题",
                "genre": "推导",
                "kind": "策略"
              }
            ]
          },
          {
            "no": "四 比例",
            "motto": "两个比相等，就成比例",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "图形的放大与缩小",
                "genre": "概念",
                "kind": "比例"
              },
              {
                "no": "例3",
                "title": "比例的意义",
                "genre": "概念",
                "kind": "比例"
              },
              {
                "no": "例4",
                "title": "比例的基本性质",
                "genre": "推导",
                "kind": "比例"
              },
              {
                "no": "例5",
                "title": "解比例",
                "genre": "推导",
                "kind": "比例"
              },
              {
                "no": "例6–7",
                "title": "比例尺",
                "genre": "概念",
                "kind": "比例"
              },
              {
                "no": "综合与实践",
                "title": "面积的变化",
                "genre": "推导",
                "kind": "比例",
                "optional": true
              }
            ]
          },
          {
            "no": "五 确定位置",
            "motto": "方向加距离，定位置",
            "goals": [],
            "lessons": [
              {
                "no": "例1–2",
                "title": "用方向和距离确定位置",
                "genre": "概念",
                "kind": "位置"
              },
              {
                "no": "例3",
                "title": "描述简单的路线图",
                "genre": "概念",
                "kind": "位置"
              }
            ]
          },
          {
            "no": "六 正比例和反比例",
            "motto": "商一定还是积一定",
            "goals": [],
            "lessons": [
              {
                "no": "例1",
                "title": "正比例的意义",
                "genre": "概念",
                "kind": "比例"
              },
              {
                "no": "例2",
                "title": "正比例的图像",
                "genre": "概念",
                "kind": "比例"
              },
              {
                "no": "例3",
                "title": "反比例的意义",
                "genre": "概念",
                "kind": "比例"
              },
              {
                "no": "综合与实践",
                "title": "大树有多高",
                "genre": "推导",
                "kind": "比例",
                "optional": true
              }
            ]
          }
        ]
      },
      {
        "name": "七年级上册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰科学技术出版社（苏科版）",
        "units": [
          {
            "no": "第1章 数学与我们同行",
            "motto": "数学就在身边",
            "goals": [],
            "lessons": [
              {
                "no": "1.1",
                "title": "生活 数学",
                "genre": "概念",
                "kind": "数学与生活",
                "dir": "mj7a-shenghuoshuxue",
                "pages": 10,
                "desc": "拖角点围篱笆，比圆轮方轮滚动",
                "cover": "mj7a-shenghuoshuxue/assets/chengshi.jpg"
              },
              {
                "no": "1.2",
                "title": "活动 思考",
                "genre": "推导",
                "kind": "数学与生活",
                "dir": "mj7a-huodongsikao",
                "pages": 12,
                "desc": "月历上拖方框，折纸动画，火柴棒",
                "cover": "mj7a-huodongsikao/assets/zhezhi.jpg"
              }
            ]
          },
          {
            "no": "第2章 有理数",
            "motto": "数的家庭添了新成员",
            "goals": [],
            "lessons": [
              {
                "no": "2.1",
                "title": "正数与负数",
                "genre": "概念",
                "kind": "有理数",
                "dir": "mj7a-zhengshufushu",
                "pages": 12,
                "desc": "拖温度计液柱与海拔，数字分类",
                "cover": "mj7a-zhengshufushu/assets/xuefeng.jpg"
              },
              {
                "no": "2.2",
                "title": "有理数与无理数",
                "genre": "概念",
                "kind": "有理数",
                "dir": "mj7a-youlishu",
                "pages": 13,
                "desc": "逐位放大逼近√2，剪拼正方形",
                "cover": "mj7a-youlishu/assets/yueduj.jpg"
              },
              {
                "no": "2.3",
                "title": "数轴",
                "genre": "概念",
                "kind": "有理数",
                "dir": "mj7a-shuzhou",
                "pages": 13,
                "desc": "三要素画数轴，滚圆得π",
                "cover": "mj7a-shuzhou/assets/gonglu.jpg"
              },
              {
                "no": "2.4",
                "title": "绝对值与相反数",
                "genre": "概念",
                "kind": "有理数",
                "dir": "mj7a-jueduizhi",
                "pages": 15,
                "desc": "沿原点对折数轴，相反数重合",
                "cover": "mj7a-jueduizhi/assets/shangxue.jpg"
              },
              {
                "no": "2.5",
                "title": "有理数的加法与减法",
                "genre": "推导",
                "kind": "有理数",
                "dir": "mj7a-jiajianfa",
                "pages": 18,
                "desc": "数轴加法机走两步，减法化加法",
                "cover": "mj7a-jiajianfa/assets/zuqiu.jpg"
              },
              {
                "no": "2.6",
                "title": "有理数的乘法与除法",
                "genre": "推导",
                "kind": "有理数",
                "dir": "mj7a-chengchufa",
                "pages": 17,
                "desc": "水位标尺推乘法法则，翻符号，乘法迷宫",
                "cover": "mj7a-chengchufa/assets/shuiwen.jpg"
              },
              {
                "no": "2.7",
                "title": "有理数的乘方",
                "genre": "推导",
                "kind": "有理数",
                "dir": "mj7a-chengfang",
                "pages": 13,
                "desc": "拉面根数翻倍，负因数配对，小数点移位器",
                "cover": "mj7a-chengfang/assets/lamian.jpg"
              },
              {
                "no": "2.8",
                "title": "有理数的混合运算",
                "genre": "推导",
                "kind": "有理数",
                "dir": "mj7a-hunheyunsuan",
                "pages": 12,
                "desc": "点运算符逐步计算，点错说明原因",
                "cover": "mj7a-hunheyunsuan/assets/heiban.jpg"
              }
            ]
          },
          {
            "no": "第3章 代数式",
            "motto": "用字母代替数",
            "goals": [],
            "lessons": [
              {
                "no": "3.1",
                "title": "字母表示数",
                "genre": "概念",
                "kind": "代数式",
                "dir": "mj7a-zimubiaoshishu",
                "pages": 10,
                "desc": "拖滑块拼正方形，L 形 2n−1 规律",
                "cover": "mj7a-zimubiaoshishu/assets/lvdao.jpg"
              },
              {
                "no": "3.2",
                "title": "代数式",
                "genre": "概念",
                "kind": "代数式",
                "dir": "mj7a-daishushi",
                "pages": 13,
                "desc": "月历 2×2 方框，a 换格同步验证",
                "cover": "mj7a-daishushi/assets/xingli.jpg"
              },
              {
                "no": "3.3",
                "title": "代数式的值",
                "genre": "推导",
                "kind": "代数式",
                "dir": "mj7a-daishushizhi",
                "pages": 12,
                "desc": "数值转换机：搭程序自动写代数式",
                "cover": "mj7a-daishushizhi/assets/huochai.jpg"
              },
              {
                "no": "3.4",
                "title": "合并同类项",
                "genre": "推导",
                "kind": "代数式",
                "dir": "mj7a-hebingtongleixiang",
                "pages": 14,
                "desc": "点选同类项一键合并，选错指出原因",
                "cover": "mj7a-hebingtongleixiang/assets/xiaoyuan.jpg"
              },
              {
                "no": "3.5",
                "title": "去括号",
                "genre": "推导",
                "kind": "代数式",
                "dir": "mj7a-qukuohao",
                "pages": 10,
                "desc": "去括号逐项变号演示，含代入检验",
                "cover": "mj7a-qukuohao/assets/maibao.jpg"
              },
              {
                "no": "3.6",
                "title": "整式的加减",
                "genre": "推导",
                "kind": "代数式",
                "dir": "mj7a-zhengshijiajian",
                "pages": 10,
                "desc": "卡片旋转拼成四种四边形求周长",
                "cover": "mj7a-zhengshijiajian/assets/shougong.jpg"
              }
            ]
          },
          {
            "no": "第4章 一元一次方程",
            "motto": "设未知数，列方程",
            "goals": [],
            "lessons": [
              {
                "no": "4.1",
                "title": "从问题到方程",
                "genre": "概念",
                "kind": "方程",
                "dir": "mj7a-wentidaofangcheng",
                "pages": 11,
                "desc": "以绳测井：调绳长比两种量法的井深",
                "cover": "mj7a-wentidaofangcheng/assets/shengjing.jpg"
              },
              {
                "no": "4.2",
                "title": "解一元一次方程",
                "genre": "推导",
                "kind": "方程",
                "dir": "mj7a-jieyiyuanyici",
                "pages": 17,
                "desc": "天平变形器：两边同时操作仍平衡",
                "cover": "mj7a-jieyiyuanyici/assets/tianping.jpg"
              },
              {
                "no": "4.3",
                "title": "用一元一次方程解决问题",
                "genre": "推导",
                "kind": "方程",
                "dir": "mj7a-fangchengjiejuewenti",
                "pages": 18,
                "desc": "环形跑道追及动画，与线形图同步",
                "cover": "mj7a-fangchengjiejuewenti/assets/paobu.jpg"
              }
            ]
          },
          {
            "no": "第5章 走进图形世界",
            "motto": "点线面体，展开折叠",
            "goals": [],
            "lessons": [
              {
                "no": "5.1",
                "title": "丰富的图形世界",
                "genre": "概念",
                "kind": "立体图形",
                "dir": "mj7a-fengfutuxing",
                "pages": 12,
                "desc": "旋转几何体，数切角正方体，七巧板自动判对",
                "cover": "mj7a-fengfutuxing/assets/chengshi.jpg"
              },
              {
                "no": "5.2",
                "title": "图形的运动",
                "genre": "概念",
                "kind": "立体图形",
                "dir": "mj7a-tuxingyundong",
                "pages": 12,
                "desc": "拖滑块看平面图形转一周扫出几何体",
                "cover": "mj7a-tuxingyundong/assets/yushua.jpg"
              },
              {
                "no": "5.3",
                "title": "展开与折叠",
                "genre": "概念",
                "kind": "立体图形",
                "dir": "mj7a-zhankaizhedie",
                "pages": 12,
                "desc": "展开图逐步折叠，自动判断能否围成",
                "cover": "mj7a-zhankaizhedie/assets/shougong.jpg"
              },
              {
                "no": "5.4",
                "title": "主视图、左视图、俯视图",
                "genre": "概念",
                "kind": "立体图形",
                "dir": "mj7a-sanshitu",
                "pages": 16,
                "desc": "转到正前/左/上得视图；搭积木出三视图",
                "cover": "mj7a-sanshitu/assets/lushan.jpg"
              }
            ]
          },
          {
            "no": "第6章 平面图形的认识（一）",
            "motto": "线与角，图形的基石",
            "goals": [],
            "lessons": [
              {
                "no": "6.1",
                "title": "线段、射线、直线",
                "genre": "概念",
                "kind": "平面图形",
                "dir": "mj7a-xianduan",
                "pages": 14,
                "desc": "拉直小路看两点间线段最短；抽水站选址",
                "cover": "mj7a-xianduan/assets/caoping.jpg"
              },
              {
                "no": "6.2",
                "title": "角",
                "genre": "概念",
                "kind": "平面图形",
                "dir": "mj7a-jiao",
                "pages": 15,
                "desc": "拖射门点比角，旋转量角器量角，尺规作角",
                "cover": "mj7a-jiao/assets/shemen.jpg"
              },
              {
                "no": "6.3",
                "title": "余角、补角、对顶角",
                "genre": "推导",
                "kind": "平面图形",
                "dir": "mj7a-yujiaobujiao",
                "pages": 15,
                "desc": "三角尺拼角，三组角连线，转木条看对顶角",
                "cover": "mj7a-yujiaobujiao/assets/xiaokong.jpg"
              },
              {
                "no": "6.4",
                "title": "平行",
                "genre": "概念",
                "kind": "平面图形",
                "dir": "mj7a-pingxing",
                "pages": 9,
                "desc": "推三角尺画平行线，方格纸点格点画平行线",
                "cover": "mj7a-pingxing/assets/paodao.jpg"
              },
              {
                "no": "6.5",
                "title": "垂直",
                "genre": "概念",
                "kind": "平面图形",
                "dir": "mj7a-chuizhi",
                "pages": 13,
                "desc": "拖动点看长度曲线，翻折说明垂线段最短",
                "cover": "mj7a-chuizhi/assets/daqiao.jpg"
              }
            ]
          },
          {
            "no": "课题学习",
            "motto": "动手做，用数学",
            "goals": [],
            "lessons": [
              {
                "no": "课题学习",
                "title": "制作无盖的长方体纸盒",
                "genre": "推导",
                "kind": "课题学习",
                "optional": true
              }
            ]
          }
        ]
      },
      {
        "name": "七年级下册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰科学技术出版社（苏科版）",
        "units": [
          {
            "no": "第7章 平面图形的认识（二）",
            "motto": "平行、平移与三角形",
            "goals": [],
            "lessons": [
              {
                "no": "7.1",
                "title": "探索直线平行的条件",
                "genre": "推导",
                "kind": "平面图形",
                "dir": "mj7b-pingxingtiaojian",
                "pages": 14,
                "desc": "拖动直线看同位角相等时两线平行",
                "cover": "mj7b-pingxingtiaojian/assets/mugong.jpg"
              },
              {
                "no": "7.2",
                "title": "探索平行线的性质",
                "genre": "推导",
                "kind": "平面图形",
                "dir": "mj7b-pingxingxingzhi",
                "pages": 12,
                "desc": "平行线截出的同位角、内错角同步变化",
                "cover": "mj7b-pingxingxingzhi/assets/tiegui.jpg"
              },
              {
                "no": "7.3",
                "title": "图形的平移",
                "genre": "概念",
                "kind": "平面图形",
                "dir": "mj7b-pingyi",
                "pages": 11,
                "desc": "方格纸上一步步平移，对应点连线平行且相等",
                "cover": "mj7b-pingyi/assets/futi.jpg"
              },
              {
                "no": "7.4",
                "title": "认识三角形",
                "genre": "概念",
                "kind": "平面图形",
                "dir": "mj7b-sanjiaoxing",
                "pages": 12,
                "desc": "拖顶点看三边关系与三条重要线段",
                "cover": "mj7b-sanjiaoxing/assets/jinzita.jpg"
              },
              {
                "no": "7.5",
                "title": "多边形的内角和与外角和",
                "genre": "推导",
                "kind": "平面图形",
                "dir": "mj7b-neijiaohe",
                "pages": 16,
                "desc": "剪拼三角形内角，多边形分三角形求内角和",
                "cover": "mj7b-neijiaohe/assets/caodi.jpg"
              }
            ]
          },
          {
            "no": "第8章 幂的运算",
            "motto": "指数相加，幂相乘",
            "goals": [],
            "lessons": [
              {
                "no": "8.1",
                "title": "同底数幂的乘法",
                "genre": "推导",
                "kind": "幂",
                "dir": "mj7b-tongdishumicheng",
                "pages": 11,
                "desc": "因数串拼接：m个a连n个a，可换底数核对数值",
                "cover": "mj7b-tongdishumicheng/assets/yangguang.jpg"
              },
              {
                "no": "8.2",
                "title": "幂的乘方与积的乘方",
                "genre": "推导",
                "kind": "幂",
                "dir": "mj7b-midechengfang",
                "pages": 16,
                "desc": "因数方阵＋积的乘方“重新排队”动画",
                "cover": "mj7b-midechengfang/assets/youguan.jpg"
              },
              {
                "no": "8.3",
                "title": "同底数幂的除法",
                "genre": "推导",
                "kind": "幂",
                "dir": "mj7b-tongdishumichu",
                "pages": 17,
                "desc": "分数约分器引出 a⁰、a⁻ⁿ；按比例画的 2ⁿ 阶梯",
                "cover": "mj7b-tongdishumichu/assets/shuiziyuan.jpg"
              }
            ]
          },
          {
            "no": "第9章 整式乘法与因式分解",
            "motto": "面积里看乘法公式",
            "goals": [],
            "lessons": [
              {
                "no": "9.1",
                "title": "单项式乘单项式",
                "genre": "推导",
                "kind": "整式",
                "dir": "mj7b-danchengdan",
                "pages": 9,
                "desc": "可拖动电视墙 pa·qb＝pq·ab，带数值检验",
                "cover": "mj7b-danchengdan/assets/huaduo.jpg"
              },
              {
                "no": "9.2",
                "title": "单项式乘多项式",
                "genre": "推导",
                "kind": "整式",
                "dir": "mj7b-danchengduo",
                "pages": 10,
                "desc": "拖分隔点分条求面积；按比例画的地块",
                "cover": "mj7b-danchengduo/assets/xiaoqu.jpg"
              },
              {
                "no": "9.3",
                "title": "多项式乘多项式",
                "genre": "推导",
                "kind": "整式",
                "dir": "mj7b-duochengduo",
                "pages": 11,
                "desc": "“切两刀”面积模型＋带负号的格子表合并",
                "cover": "mj7b-duochengduo/assets/taiyangneng.jpg"
              },
              {
                "no": "9.4",
                "title": "乘法公式",
                "genre": "推导",
                "kind": "整式",
                "dir": "mj7b-chengfagongshi",
                "pages": 16,
                "desc": "面积拼图看2ab，剪拼平方差",
                "cover": "mj7b-chengfagongshi/assets/shoujian.jpg"
              },
              {
                "no": "9.5",
                "title": "多项式的因式分解",
                "genre": "推导",
                "kind": "整式",
                "dir": "mj7b-yinshifenjie",
                "pages": 17,
                "desc": "公因式提取器：调系数指数验能否提净",
                "cover": "mj7b-yinshifenjie/assets/lvdi.jpg"
              }
            ]
          },
          {
            "no": "第10章 二元一次方程组",
            "motto": "消元：二元化一元",
            "goals": [],
            "lessons": [
              {
                "no": "10.1",
                "title": "二元一次方程",
                "genre": "概念",
                "kind": "方程",
                "dir": "mj7b-eryuanyici",
                "pages": 9,
                "desc": "计分板列表与格点拖点找全部解",
                "cover": "mj7b-eryuanyici/assets/lanqiu.jpg"
              },
              {
                "no": "10.2",
                "title": "二元一次方程组",
                "genre": "概念",
                "kind": "方程",
                "dir": "mj7b-fangchengzu",
                "pages": 9,
                "desc": "鸡兔笼按只数画足，公共解对照表",
                "cover": "mj7b-fangchengzu/assets/jitu.jpg"
              },
              {
                "no": "10.3",
                "title": "解二元一次方程组",
                "genre": "推导",
                "kind": "方程",
                "dir": "mj7b-jiefangchengzu",
                "pages": 13,
                "desc": "消元操作台：选乘数加减即见消元",
                "cover": "mj7b-jiefangchengzu/assets/qiuchang.jpg"
              },
              {
                "no": "10.4",
                "title": "三元一次方程组",
                "genre": "推导",
                "kind": "方程",
                "optional": true
              },
              {
                "no": "10.5",
                "title": "用二元一次方程组解决问题",
                "genre": "推导",
                "kind": "方程",
                "dir": "mj7b-fangchengzuwenti",
                "pages": 14,
                "desc": "火车过桥模拟器：调速度车长对时间",
                "cover": "mj7b-fangchengzuwenti/assets/qiao.jpg"
              }
            ]
          },
          {
            "no": "第11章 一元一次不等式",
            "motto": "不相等也有规律",
            "goals": [],
            "lessons": [
              {
                "no": "11.1",
                "title": "生活中的不等式",
                "genre": "概念",
                "kind": "不等式",
                "dir": "mj7b-shenghuobudengshi",
                "pages": 10,
                "desc": "关键词分拣台：把说法放进不等号盒",
                "cover": "mj7b-shenghuobudengshi/assets/gaosu.jpg"
              },
              {
                "no": "11.2",
                "title": "不等式的解集",
                "genre": "概念",
                "kind": "不等式",
                "dir": "mj7b-jieji",
                "pages": 10,
                "desc": "解的探测器＋拖端点画解集",
                "cover": "mj7b-jieji/assets/suidao.jpg"
              },
              {
                "no": "11.3",
                "title": "不等式的基本性质",
                "genre": "推导",
                "kind": "不等式",
                "dir": "mj7b-budengshixingzhi",
                "pages": 12,
                "desc": "上下数轴连线：乘负数连线交叉",
                "cover": "mj7b-budengshixingzhi/assets/xiongmei.jpg"
              },
              {
                "no": "11.4",
                "title": "解一元一次不等式",
                "genre": "推导",
                "kind": "不等式",
                "dir": "mj7b-jiebudengshi",
                "pages": 13,
                "desc": "同解流水线：选错一步数轴现红线",
                "cover": "mj7b-jiebudengshi/assets/shuzhuo.jpg"
              },
              {
                "no": "11.5",
                "title": "用一元一次不等式解决问题",
                "genre": "推导",
                "kind": "不等式",
                "dir": "mj7b-budengshijiejuewenti",
                "pages": 13,
                "desc": "按课本搭法画火柴小鱼并计数",
                "cover": "mj7b-budengshijiejuewenti/assets/dujuan.jpg"
              },
              {
                "no": "11.6",
                "title": "一元一次不等式组",
                "genre": "推导",
                "kind": "不等式",
                "dir": "mj7b-budengshizu",
                "pages": 16,
                "desc": "公共部分探测器：四种情况自动写解集",
                "cover": "mj7b-budengshizu/assets/qiche.jpg"
              }
            ]
          },
          {
            "no": "第12章 证明",
            "motto": "言必有据，步步有理",
            "goals": [],
            "lessons": [
              {
                "no": "12.1",
                "title": "定义与命题",
                "genre": "概念",
                "kind": "证明",
                "dir": "mj7b-dingyimingti",
                "pages": 10,
                "desc": "命题拆解台：切出条件｜结论再判真假",
                "cover": "mj7b-dingyimingti/assets/taolun.jpg"
              },
              {
                "no": "12.2",
                "title": "证明",
                "genre": "推导",
                "kind": "证明",
                "dir": "mj7b-zhengming",
                "pages": 17,
                "desc": "证明搭积木：拖依据进∵∴空槽，可点开依据卡",
                "cover": "mj7b-zhengming/assets/qujing.jpg"
              },
              {
                "no": "12.3",
                "title": "互逆命题",
                "genre": "概念",
                "kind": "证明",
                "dir": "mj7b-hunimingti",
                "pages": 14,
                "desc": "交换机：条件卡⇄结论卡，再用反例判真假",
                "cover": "mj7b-hunimingti/assets/huanka.jpg"
              }
            ]
          },
          {
            "no": "课题学习",
            "motto": "分类、想象、找规律",
            "goals": [],
            "lessons": [
              {
                "no": "课题学习",
                "title": "分类 想象 找规律",
                "genre": "推导",
                "kind": "课题学习",
                "optional": true
              }
            ]
          }
        ]
      },
      {
        "name": "八年级上册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰科学技术出版社（苏科版）",
        "units": [
          {
            "no": "第1章 全等三角形",
            "motto": "形状大小都相同",
            "goals": [],
            "lessons": [
              {
                "no": "1.1",
                "title": "全等图形",
                "genre": "概念",
                "kind": "全等",
                "dir": "mj8a-quandengtuxing",
                "pages": 9,
                "desc": "点两图自动叠合验证；点阵上平移、翻折、旋转",
                "cover": "mj8a-quandengtuxing/assets/fengye.jpg"
              },
              {
                "no": "1.2",
                "title": "全等三角形",
                "genre": "概念",
                "kind": "全等",
                "dir": "mj8a-quandengsanjiaoxing",
                "pages": 10,
                "desc": "点边或顶点，对应元素同时亮；拖动实时量边角",
                "cover": "mj8a-quandengsanjiaoxing/assets/xinfeng.jpg"
              },
              {
                "no": "1.3",
                "title": "探索三角形全等的条件",
                "genre": "推导",
                "kind": "全等",
                "dir": "mj8a-quandengtiaojian",
                "pages": 18,
                "desc": "反例机；SAS/ASA/SSS 作图叠合；SSA 两解",
                "cover": "mj8a-quandengtiaojian/assets/taidiao.jpg"
              }
            ]
          },
          {
            "no": "第2章 轴对称图形",
            "motto": "对折重合的美",
            "goals": [],
            "lessons": [
              {
                "no": "2.1",
                "title": "轴对称与轴对称图形",
                "genre": "概念",
                "kind": "轴对称",
                "dir": "mj8a-zhouduicheng",
                "pages": 9,
                "desc": "墨水折纸；拖折痕翻折检验对称轴",
                "cover": "mj8a-zhouduicheng/assets/paifang.jpg"
              },
              {
                "no": "2.2",
                "title": "轴对称的性质",
                "genre": "推导",
                "kind": "轴对称",
                "dir": "mj8a-zhouduichengxingzhi",
                "pages": 12,
                "desc": "扎孔展开测垂直平分；拖动对称轴验证性质",
                "cover": "mj8a-zhouduichengxingzhi/assets/daoying.jpg"
              },
              {
                "no": "2.3",
                "title": "设计轴对称图案",
                "genre": "概念",
                "kind": "轴对称",
                "dir": "mj8a-duichengtuan",
                "pages": 9,
                "desc": "画一半自动对称；剪纸展开；琴键检验",
                "cover": "mj8a-duichengtuan/assets/jianzhi.jpg"
              },
              {
                "no": "2.4",
                "title": "线段、角的轴对称性",
                "genre": "推导",
                "kind": "轴对称",
                "dir": "mj8a-xianduanjiao",
                "pages": 17,
                "desc": "拖点找等距点留轨迹；尺规作垂直平分线",
                "cover": "mj8a-xianduanjiao/assets/cunlu.jpg"
              },
              {
                "no": "2.5",
                "title": "等腰三角形的轴对称性",
                "genre": "推导",
                "kind": "轴对称",
                "dir": "mj8a-dengyao",
                "pages": 16,
                "desc": "拖顶点看三线合一；斜边中线",
                "cover": "mj8a-dengyao/assets/liangjia.jpg"
              }
            ]
          },
          {
            "no": "第3章 勾股定理",
            "motto": "两直角边的平方和",
            "goals": [],
            "lessons": [
              {
                "no": "3.1",
                "title": "勾股定理",
                "genre": "推导",
                "kind": "勾股定理",
                "dir": "mj8a-gougudingli",
                "cover": "mj8a-gougudingli/assets/xiantu.jpg",
                "pages": 12,
                "desc": "格点板拖出直角 · 拼图与赵爽弦图证明"
              },
              {
                "no": "3.2",
                "title": "勾股定理的逆定理",
                "genre": "推导",
                "kind": "勾股定理",
                "dir": "mj8a-gougunidingli",
                "pages": 12,
                "desc": "三边搭三角形判直角；勾股数生成器",
                "cover": "mj8a-gougunidingli/assets/shengjie.jpg"
              },
              {
                "no": "3.3",
                "title": "勾股定理的简单应用",
                "genre": "推导",
                "kind": "勾股定理",
                "dir": "mj8a-gouguyingyong",
                "pages": 11,
                "desc": "拖折断高度解折竹题；点拉索算长",
                "cover": "mj8a-gouguyingyong/assets/xielaqiao.jpg"
              }
            ]
          },
          {
            "no": "第4章 实数",
            "motto": "数轴上没有空隙了",
            "goals": [],
            "lessons": [
              {
                "no": "4.1",
                "title": "平方根",
                "genre": "概念",
                "kind": "实数",
                "dir": "mj8a-pingfanggen",
                "pages": 13,
                "desc": "数轴上拖 x 画正方形，找 x²=a 的两个根",
                "cover": "mj8a-pingfanggen/assets/haibian.jpg"
              },
              {
                "no": "4.2",
                "title": "立方根",
                "genre": "概念",
                "kind": "实数",
                "dir": "mj8a-lifanggen",
                "pages": 10,
                "desc": "拖正方体棱长，逼近体积为 2 的棱长",
                "cover": "mj8a-lifanggen/assets/xianweijing.jpg"
              },
              {
                "no": "4.3",
                "title": "实数",
                "genre": "概念",
                "kind": "实数",
                "dir": "mj8a-shishu",
                "pages": 16,
                "desc": "勾股螺旋＋圆规把 √n 动画转到数轴上",
                "cover": "mj8a-shishu/assets/luoke.jpg"
              },
              {
                "no": "4.4",
                "title": "近似数",
                "genre": "概念",
                "kind": "实数",
                "dir": "mj8a-jinsishu",
                "pages": 11,
                "desc": "四舍五入逐位高亮，数轴放大看代表区间",
                "cover": "mj8a-jinsishu/assets/tianping.jpg"
              }
            ]
          },
          {
            "no": "第5章 平面直角坐标系",
            "motto": "一对数确定一个点",
            "goals": [],
            "lessons": [
              {
                "no": "5.1",
                "title": "位置的确定",
                "genre": "概念",
                "kind": "坐标系",
                "dir": "mj8a-weizhi",
                "pages": 9,
                "desc": "按经纬度描台风路径；围棋盘找地址",
                "cover": "mj8a-weizhi/assets/taifeng.jpg"
              },
              {
                "no": "5.2",
                "title": "平面直角坐标系",
                "genre": "概念",
                "kind": "坐标系",
                "dir": "mj8a-zuobiaoxi",
                "pages": 16,
                "desc": "拖点读坐标、象限；图形翻折平移旋转",
                "cover": "mj8a-zuobiaoxi/assets/penquan.jpg"
              }
            ]
          },
          {
            "no": "第6章 一次函数",
            "motto": "一个变，另一个跟着变",
            "goals": [],
            "lessons": [
              {
                "no": "6.1",
                "title": "函数",
                "genre": "概念",
                "kind": "函数",
                "dir": "mj8a-hanshu",
                "cover": "mj8a-hanshu/assets/lieche-cover.jpg",
                "pages": 13,
                "desc": "变化观察器：表格·式子·图象同步"
              },
              {
                "no": "6.2",
                "title": "一次函数",
                "genre": "概念",
                "kind": "函数",
                "dir": "mj8a-yicihanshu",
                "pages": 12,
                "desc": "加油机看油量匀速增加，拼出y=kx+b",
                "cover": "mj8a-yicihanshu/assets/jiayou.jpg"
              },
              {
                "no": "6.3",
                "title": "一次函数的图像",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj8a-yicihanshutuxiang",
                "pages": 14,
                "desc": "拖k、b滑块看直线倾斜与平移",
                "cover": "mj8a-yicihanshutuxiang/assets/shanji.jpg"
              },
              {
                "no": "6.4",
                "title": "用一次函数解决问题",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj8a-yicihanshuwenti",
                "pages": 12,
                "desc": "拖里程比两家租车费，折线配骑车动画",
                "cover": "mj8a-yicihanshuwenti/assets/xueshan.jpg"
              },
              {
                "no": "6.5",
                "title": "一次函数与二元一次方程",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj8a-hanshuyufangcheng",
                "pages": 10,
                "desc": "拖交点，两直线随之转动，验证方程组的解",
                "cover": "mj8a-hanshuyufangcheng/assets/jiaocha.jpg"
              },
              {
                "no": "6.6",
                "title": "一次函数、一元一次方程和一元一次不等式",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj8a-hanshuyubudengshi",
                "pages": 10,
                "desc": "拖交点，数轴同步画不等式解集",
                "cover": "mj8a-hanshuyubudengshi/assets/gaosu.jpg"
              }
            ]
          },
          {
            "no": "课题学习",
            "motto": "探究勾股定理的历史与证法",
            "goals": [],
            "lessons": [
              {
                "no": "课题学习",
                "title": "关于勾股定理的研究",
                "genre": "推导",
                "kind": "课题学习",
                "optional": true
              }
            ]
          }
        ]
      },
      {
        "name": "八年级下册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰科学技术出版社（苏科版）",
        "units": [
          {
            "no": "第7章 数据的收集、整理、描述",
            "motto": "让数据说话",
            "goals": [],
            "lessons": [
              {
                "no": "7.1",
                "title": "普查与抽样调查",
                "genre": "概念",
                "kind": "统计",
                "dir": "mj8b-puchachouyang",
                "pages": 11,
                "desc": "抽样模拟器：随机抽与只抽一班对比",
                "cover": "mj8b-puchachouyang/assets/xiaoyuan-cover.jpg"
              },
              {
                "no": "7.2",
                "title": "统计图的选用",
                "genre": "概念",
                "kind": "统计",
                "dir": "mj8b-tongjitu",
                "pages": 12,
                "desc": "选图实验室：三组数据×三种图",
                "cover": "mj8b-tongjitu/assets/pucha-cover.jpg"
              },
              {
                "no": "7.3",
                "title": "频数和频率",
                "genre": "概念",
                "kind": "统计",
                "dir": "mj8b-pinshupinlv",
                "pages": 10,
                "desc": "47城市逐个唱入分级，正字划记",
                "cover": "mj8b-pinshupinlv/assets/changpiao-cover.jpg"
              },
              {
                "no": "7.4",
                "title": "频数分布表和频数分布直方图",
                "genre": "概念",
                "kind": "统计",
                "dir": "mj8b-zhifangtu",
                "pages": 12,
                "desc": "组距滑块实时重算直方图，拖长条作图",
                "cover": "mj8b-zhifangtu/assets/shengao-cover.jpg"
              }
            ]
          },
          {
            "no": "第8章 认识概率",
            "motto": "可能性也能量化",
            "goals": [],
            "lessons": [
              {
                "no": "8.1",
                "title": "确定事件与随机事件",
                "genre": "概念",
                "kind": "概率",
                "dir": "mj8b-suijishijian",
                "pages": 9,
                "desc": "四袋真随机摸球，调袋子自动判事件",
                "cover": "mj8b-suijishijian/assets/pingpang-cover.jpg"
              },
              {
                "no": "8.2",
                "title": "可能性的大小",
                "genre": "概念",
                "kind": "概率",
                "dir": "mj8b-kenengxing",
                "pages": 9,
                "desc": "转盘真随机旋转，五袋排序",
                "cover": "mj8b-kenengxing/assets/zhuanpan-cover.jpg"
              },
              {
                "no": "8.3",
                "title": "频率与概率",
                "genre": "概念",
                "kind": "概率",
                "dir": "mj8b-pinlvgailv",
                "pages": 12,
                "desc": "2000次多组叠加，看频率稳于概率",
                "cover": "mj8b-pinlvgailv/assets/paoyingbi-cover.jpg"
              }
            ]
          },
          {
            "no": "第9章 中心对称图形——平行四边形",
            "motto": "旋转180°后重合",
            "goals": [],
            "lessons": [
              {
                "no": "9.1",
                "title": "图形的旋转",
                "genre": "概念",
                "kind": "四边形",
                "dir": "mj8b-xuanzhuan",
                "pages": 10,
                "desc": "拖中心转图形，拖点作旋转判对错",
                "cover": "mj8b-xuanzhuan/assets/motianlun.jpg"
              },
              {
                "no": "9.2",
                "title": "中心对称与中心对称图形",
                "genre": "概念",
                "kind": "四边形",
                "dir": "mj8b-zhongxinduicheng",
                "pages": 12,
                "desc": "拖 O 找对称中心；方格点选画对称形",
                "cover": "mj8b-zhongxinduicheng/assets/fengche.jpg"
              },
              {
                "no": "9.3",
                "title": "平行四边形",
                "genre": "推导",
                "kind": "四边形",
                "dir": "mj8b-pingxingsibianxing",
                "pages": 17,
                "desc": "条件检验台：按条件作图，辨真假判定",
                "cover": "mj8b-pingxingsibianxing/assets/louti.jpg"
              },
              {
                "no": "9.4",
                "title": "矩形、菱形、正方形",
                "genre": "推导",
                "kind": "四边形",
                "dir": "mj8b-juxinglingxing",
                "pages": 18,
                "desc": "扭框成矩形、平移成菱形；加条件变身",
                "cover": "mj8b-juxinglingxing/assets/chuanghu.jpg"
              },
              {
                "no": "9.5",
                "title": "三角形的中位线",
                "genre": "推导",
                "kind": "四边形",
                "dir": "mj8b-zhongweixian",
                "pages": 9,
                "desc": "剪拼转180°成平行四边形；中点四边形",
                "cover": "mj8b-zhongweixian/assets/chitang.jpg"
              }
            ]
          },
          {
            "no": "第10章 分式",
            "motto": "分母里有了字母",
            "goals": [],
            "lessons": [
              {
                "no": "10.1",
                "title": "分式",
                "genre": "概念",
                "kind": "分式",
                "dir": "mj8b-fenshi",
                "pages": 11,
                "desc": "数轴拖 x 找分母为零与值为零的点",
                "cover": "mj8b-fenshi/assets/lvdi-cover.jpg"
              },
              {
                "no": "10.2",
                "title": "分式的基本性质",
                "genre": "推导",
                "kind": "分式",
                "dir": "mj8b-fenshixingzhi",
                "pages": 17,
                "desc": "因式卡片配对划去，约分到最简",
                "cover": "mj8b-fenshixingzhi/assets/huoche-cover.jpg"
              },
              {
                "no": "10.3",
                "title": "分式的加减",
                "genre": "推导",
                "kind": "分式",
                "dir": "mj8b-fenshijiajian",
                "pages": 10,
                "desc": "逐行代值，找出错的那一步",
                "cover": "mj8b-fenshijiajian/assets/youlun-cover.jpg"
              },
              {
                "no": "10.4",
                "title": "分式的乘除",
                "genre": "推导",
                "kind": "分式",
                "dir": "mj8b-fenshichengchu",
                "pages": 13,
                "desc": "直接代入与先化简两条路对比",
                "cover": "mj8b-fenshichengchu/assets/heiban-cover.jpg"
              },
              {
                "no": "10.5",
                "title": "分式方程",
                "genre": "推导",
                "kind": "分式",
                "dir": "mj8b-fenshifangcheng",
                "pages": 15,
                "desc": "拖 x 对照两边与公分母，看清增根",
                "cover": "mj8b-fenshifangcheng/assets/zhishu-cover.jpg"
              }
            ]
          },
          {
            "no": "第11章 反比例函数",
            "motto": "积一定，此消彼长",
            "goals": [],
            "lessons": [
              {
                "no": "11.1",
                "title": "反比例函数",
                "genre": "概念",
                "kind": "函数",
                "dir": "mj8b-fanbilihanshu",
                "pages": 11,
                "desc": "正比例与反比例对照台：商一定还是积一定",
                "cover": "mj8b-fanbilihanshu/assets/zhishu.jpg"
              },
              {
                "no": "11.2",
                "title": "反比例函数的图像与性质",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj8b-fanbilituxiang",
                "pages": 17,
                "desc": "拖 k 看双曲线，拖 P 看矩形面积 |k|",
                "cover": "mj8b-fanbilituxiang/assets/jifang.jpg"
              },
              {
                "no": "11.3",
                "title": "用反比例函数解决问题",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj8b-fanbiliwenti",
                "pages": 12,
                "desc": "拖门槛线读“至少”范围；按比例画的杠杆",
                "cover": "mj8b-fanbiliwenti/assets/qiaoshi.jpg"
              }
            ]
          },
          {
            "no": "第12章 二次根式",
            "motto": "开方开不尽也能算",
            "goals": [],
            "lessons": [
              {
                "no": "12.1",
                "title": "二次根式",
                "genre": "概念",
                "kind": "二次根式",
                "dir": "mj8b-ercigenshi",
                "pages": 12,
                "desc": "先平方再开方机器，看出 √(a²)=|a|",
                "cover": "mj8b-ercigenshi/assets/xialuo.jpg"
              },
              {
                "no": "12.2",
                "title": "二次根式的乘除",
                "genre": "推导",
                "kind": "二次根式",
                "dir": "mj8b-genshichengchu",
                "pages": 18,
                "desc": "方格纸画矩形；化简结果精确检验器",
                "cover": "mj8b-genshichengchu/assets/mugong.jpg"
              },
              {
                "no": "12.3",
                "title": "二次根式的加减",
                "genre": "推导",
                "kind": "二次根式",
                "dir": "mj8b-genshijiajian",
                "pages": 14,
                "desc": "线段拼接尺，翻牌归类再合并同类根式",
                "cover": "mj8b-genshijiajian/assets/dizhuan.jpg"
              }
            ]
          },
          {
            "no": "课题学习",
            "motto": "用统计研究心率",
            "goals": [],
            "lessons": [
              {
                "no": "课题学习",
                "title": "心率的调查",
                "genre": "推导",
                "kind": "课题学习",
                "optional": true
              }
            ]
          }
        ]
      },
      {
        "name": "九年级上册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰科学技术出版社（苏科版）",
        "units": [
          {
            "no": "第1章 一元二次方程",
            "motto": "降次：二次化一次",
            "goals": [],
            "lessons": [
              {
                "no": "1.1",
                "title": "一元二次方程",
                "genre": "概念",
                "kind": "方程",
                "dir": "mj9a-yiyuanerci",
                "pages": 10,
                "desc": "花圃滑块试根、一般形式逐步整理器",
                "cover": "mj9a-yiyuanerci/assets/huapu.jpg"
              },
              {
                "no": "1.2",
                "title": "一元二次方程的解法",
                "genre": "推导",
                "kind": "方程",
                "dir": "mj9a-ercijiefa",
                "pages": 18,
                "desc": "配方割补拼图动画、判别式数轴实验",
                "cover": "mj9a-ercijiefa/assets/shuzhuo.jpg"
              },
              {
                "no": "1.3",
                "title": "一元二次方程的根与系数的关系",
                "genre": "推导",
                "kind": "方程",
                "optional": true
              },
              {
                "no": "1.4",
                "title": "用一元二次方程解决问题",
                "genre": "推导",
                "kind": "方程",
                "dir": "mj9a-erciwenti",
                "pages": 13,
                "desc": "矩形动点播放求面积、缉私艇追及",
                "cover": "mj9a-erciwenti/assets/lvyou.jpg"
              }
            ]
          },
          {
            "no": "第2章 对称图形——圆",
            "motto": "圆的对称藏着定理",
            "goals": [],
            "lessons": [
              {
                "no": "2.1",
                "title": "圆",
                "genre": "概念",
                "kind": "圆",
                "dir": "mj9a-yuan",
                "pages": 12,
                "desc": "拖点判圆内外、撒点集合、弦弧联动",
                "cover": "mj9a-yuan/assets/chelun.jpg"
              },
              {
                "no": "2.2",
                "title": "圆的对称性",
                "genre": "推导",
                "kind": "圆",
                "dir": "mj9a-yuanduichengxing",
                "pages": 12,
                "desc": "两圆叠合旋转、沿直径翻折验证垂径",
                "cover": "mj9a-yuanduichengxing/assets/danche.jpg"
              },
              {
                "no": "2.3",
                "title": "确定圆的条件",
                "genre": "推导",
                "kind": "圆",
                "dir": "mj9a-quedingyuan",
                "pages": 9,
                "desc": "拖三点找外心、尺规作外接圆分步演示",
                "cover": "mj9a-quedingyuan/assets/canpian.jpg"
              },
              {
                "no": "2.4",
                "title": "圆周角",
                "genre": "推导",
                "kind": "圆",
                "dir": "mj9a-yuanzhoujiao",
                "pages": 15,
                "desc": "拖动顶点看圆周角不变，三种情形自动判别",
                "cover": "mj9a-yuanzhoujiao/assets/juchang.jpg"
              },
              {
                "no": "2.5",
                "title": "直线与圆的位置关系",
                "genre": "推导",
                "kind": "圆",
                "dir": "mj9a-zhixianyuyuan",
                "pages": 18,
                "desc": "平移直线比 d 与 r，剪最大圆，切线长翻折",
                "cover": "mj9a-zhixianyuyuan/assets/richu.jpg"
              },
              {
                "no": "2.6",
                "title": "正多边形与圆",
                "genre": "概念",
                "kind": "圆",
                "dir": "mj9a-zhengduobianxing",
                "pages": 11,
                "desc": "n 等分圆周对比随手取点，尺规作正六边形",
                "cover": "mj9a-zhengduobianxing/assets/fengchao.jpg"
              },
              {
                "no": "2.7",
                "title": "弧长及扇形的面积",
                "genre": "推导",
                "kind": "圆",
                "dir": "mj9a-huchang",
                "pages": 10,
                "desc": "把弧拉直比周长，扇形切片重拼成平行四边形",
                "cover": "mj9a-huchang/assets/zheshan.jpg"
              },
              {
                "no": "2.8",
                "title": "圆锥的侧面积",
                "genre": "推导",
                "kind": "圆",
                "dir": "mj9a-yuanzhui",
                "pages": 9,
                "desc": "扇形纸片逐步卷成圆锥，弧长等于底面周长",
                "cover": "mj9a-yuanzhui/assets/douli.jpg"
              }
            ]
          },
          {
            "no": "第3章 数据的集中趋势和离散程度",
            "motto": "看平均，也看波动",
            "goals": [],
            "lessons": [
              {
                "no": "3.1",
                "title": "平均数",
                "genre": "概念",
                "kind": "统计",
                "dir": "mj9a-pingjunshu",
                "pages": 12,
                "desc": "拖身高点找平衡点；滑块调权看名次变化",
                "cover": "mj9a-pingjunshu/assets/shengao.jpg"
              },
              {
                "no": "3.2",
                "title": "中位数与众数",
                "genre": "概念",
                "kind": "统计",
                "dir": "mj9a-zhongweishu",
                "pages": 12,
                "desc": "拖动极端值：平均数被拉走、中位数不动",
                "cover": "mj9a-zhongweishu/assets/juankuan.jpg"
              },
              {
                "no": "3.3",
                "title": "用计算器求平均数",
                "genre": "推导",
                "kind": "统计",
                "dir": "mj9a-jisuanqipingjun",
                "pages": 8,
                "desc": "仿真计算器逐键演示；漏输频数的对比",
                "cover": "mj9a-jisuanqipingjun/assets/shangxue.jpg"
              },
              {
                "no": "3.4",
                "title": "方差",
                "genre": "概念",
                "kind": "统计",
                "dir": "mj9a-fangcha",
                "pages": 12,
                "desc": "把每个偏差画成正方形，拖点看方差变化",
                "cover": "mj9a-fangcha/assets/pingpang.jpg"
              },
              {
                "no": "3.5",
                "title": "用计算器求方差",
                "genre": "推导",
                "kind": "统计",
                "dir": "mj9a-jisuanqifangcha",
                "pages": 9,
                "desc": "仿真计算器求 x̄ 与 s²；表格式分列录入",
                "cover": "mj9a-jisuanqifangcha/assets/shejian.jpg"
              }
            ]
          },
          {
            "no": "第4章 等可能条件下的概率",
            "motto": "列举结果算概率",
            "goals": [],
            "lessons": [
              {
                "no": "4.1",
                "title": "等可能性",
                "genre": "概念",
                "kind": "概率",
                "dir": "mj9a-dengkenengxing",
                "pages": 9,
                "desc": "真随机摸球千次看频率齐平；十二面体点选事件",
                "cover": "mj9a-dengkenengxing/assets/moqiu-cover.jpg"
              },
              {
                "no": "4.2",
                "title": "等可能条件下的概率（一）",
                "genre": "推导",
                "kind": "概率",
                "dir": "mj9a-gailvyi",
                "pages": 14,
                "desc": "逐层展开可点选树状图、点格列表法、掷骰实验",
                "cover": "mj9a-gailvyi/assets/touzi-cover.jpg"
              },
              {
                "no": "4.3",
                "title": "等可能条件下的概率（二）",
                "genre": "推导",
                "kind": "概率",
                "dir": "mj9a-gailver",
                "pages": 10,
                "desc": "真随机转盘、设计转盘、投点算面积比",
                "cover": "mj9a-gailver/assets/zhuanpan-cover.jpg"
              }
            ]
          },
          {
            "no": "课题学习",
            "motto": "从数据中找规律",
            "goals": [],
            "lessons": [
              {
                "no": "课题学习",
                "title": "收集数据 分析数据 探索规律",
                "genre": "推导",
                "kind": "课题学习",
                "optional": true
              }
            ]
          }
        ]
      },
      {
        "name": "九年级下册",
        "edition": "义务教育教科书 · 数学 · 江苏凤凰科学技术出版社（苏科版）",
        "units": [
          {
            "no": "第5章 二次函数",
            "motto": "抛物线的形与数",
            "goals": [],
            "lessons": [
              {
                "no": "5.1",
                "title": "二次函数",
                "genre": "概念",
                "kind": "函数",
                "dir": "mj9b-ercihanshu",
                "pages": 10,
                "desc": "小球滚落描点；拖篱笆看面积足迹",
                "cover": "mj9b-ercihanshu/assets/tuzi-cover.jpg"
              },
              {
                "no": "5.2",
                "title": "二次函数的图像和性质",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj9b-ercihanshutuxiang",
                "pages": 18,
                "desc": "拖 a、h、k 和顶点，看开口与平移",
                "cover": "mj9b-ercihanshutuxiang/assets/penquan-cover.jpg"
              },
              {
                "no": "5.3",
                "title": "用待定系数法确定二次函数表达式",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj9b-daidingxishu",
                "pages": 9,
                "desc": "拖已知点，实时解方程组画抛物线",
                "cover": "mj9b-daidingxishu/assets/toulan-cover.jpg"
              },
              {
                "no": "5.4",
                "title": "二次函数与一元二次方程",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj9b-ercihanshufangcheng",
                "pages": 11,
                "desc": "a、b、c 滑块和 Δ、交点联动；逐级放大估根",
                "cover": "mj9b-ercihanshufangcheng/assets/shixinqiu-cover.jpg"
              },
              {
                "no": "5.5",
                "title": "用二次函数解决问题",
                "genre": "推导",
                "kind": "函数",
                "dir": "mj9b-ercihanshuwenti",
                "pages": 14,
                "desc": "拱桥换原点和水位；判断小船能否通过",
                "cover": "mj9b-ercihanshuwenti/assets/gongqiao-cover.jpg"
              }
            ]
          },
          {
            "no": "第6章 图形的相似",
            "motto": "形状相同，大小可变",
            "goals": [],
            "lessons": [
              {
                "no": "6.1",
                "title": "图上距离与实际距离",
                "genre": "概念",
                "kind": "相似",
                "dir": "mj9b-tushangjuli",
                "pages": 12,
                "desc": "换比例尺看线段比不变，格点线段",
                "cover": "mj9b-tushangjuli/assets/ditu-cover.jpg"
              },
              {
                "no": "6.2",
                "title": "黄金分割",
                "genre": "概念",
                "kind": "相似",
                "dir": "mj9b-huangjinfenge",
                "pages": 11,
                "desc": "拖点找黄金比，尺规作图，切黄金矩形",
                "cover": "mj9b-huangjinfenge/assets/balei-cover.jpg"
              },
              {
                "no": "6.3",
                "title": "相似图形",
                "genre": "概念",
                "kind": "相似",
                "dir": "mj9b-xiangsituxing",
                "pages": 12,
                "desc": "相似检测器：拖顶点，量角，比相似比",
                "cover": "mj9b-xiangsituxing/assets/zhaopian-cover.jpg"
              },
              {
                "no": "6.4",
                "title": "探索三角形相似的条件",
                "genre": "推导",
                "kind": "相似",
                "dir": "mj9b-xiangsitiaojian",
                "pages": 18,
                "desc": "三个判定实验台，平移叠合，截取全等",
                "cover": "mj9b-xiangsitiaojian/assets/tanjiu-cover.jpg"
              },
              {
                "no": "6.5",
                "title": "相似三角形的性质",
                "genre": "推导",
                "kind": "相似",
                "dir": "mj9b-xiangsixingzhi",
                "pages": 13,
                "desc": "拖相似比k，k²等分，对应线段",
                "cover": "mj9b-xiangsixingzhi/assets/huayuan-cover.jpg"
              },
              {
                "no": "6.6",
                "title": "图形的位似",
                "genre": "概念",
                "kind": "相似",
                "dir": "mj9b-weisi",
                "pages": 12,
                "desc": "拖位似中心，k可正可负，坐标乘k",
                "cover": "mj9b-weisi/assets/touying-cover.jpg"
              },
              {
                "no": "6.7",
                "title": "用相似三角形解决问题",
                "genre": "推导",
                "kind": "相似",
                "dir": "mj9b-xiangsiwenti",
                "pages": 12,
                "desc": "太阳光与路灯两种影子，由影找光源",
                "cover": "mj9b-xiangsiwenti/assets/yingzi-cover.jpg"
              }
            ]
          },
          {
            "no": "第7章 锐角三角函数",
            "motto": "角定了，边比就定了",
            "goals": [],
            "lessons": [
              {
                "no": "7.1",
                "title": "正切",
                "genre": "概念",
                "kind": "三角函数",
                "dir": "mj9b-zhengqie",
                "pages": 12,
                "desc": "拖角 A：三个相似三角形比值同步变化",
                "cover": "mj9b-zhengqie/assets/taijie.jpg"
              },
              {
                "no": "7.2",
                "title": "正弦、余弦",
                "genre": "概念",
                "kind": "三角函数",
                "dir": "mj9b-zhengxianyuxian",
                "pages": 13,
                "desc": "斜边取 1 读数盘：拖 P 读 sin、cos",
                "cover": "mj9b-zhengxianyuxian/assets/podao.jpg"
              },
              {
                "no": "7.3",
                "title": "特殊角的三角函数",
                "genre": "推导",
                "kind": "三角函数",
                "dir": "mj9b-teshujiao",
                "pages": 9,
                "desc": "三角板取值器：选角选函数高亮边",
                "cover": "mj9b-teshujiao/assets/sanjiaoban.jpg"
              },
              {
                "no": "7.4",
                "title": "由三角函数值求锐角",
                "genre": "推导",
                "kind": "三角函数",
                "dir": "mj9b-qiuruijiao",
                "pages": 9,
                "desc": "由值造角+夹逼；秋千摆角滑块",
                "cover": "mj9b-qiuruijiao/assets/huati.jpg"
              },
              {
                "no": "7.5",
                "title": "解直角三角形",
                "genre": "推导",
                "kind": "三角函数",
                "dir": "mj9b-jiezhijiao",
                "pages": 12,
                "desc": "任选两元素判能否解、给求解顺序",
                "cover": "mj9b-jiezhijiao/assets/muchi.jpg"
              },
              {
                "no": "7.6",
                "title": "用锐角三角函数解决问题",
                "genre": "推导",
                "kind": "三角函数",
                "dir": "mj9b-sanjiaowenti",
                "pages": 16,
                "desc": "坡度器、摩天轮时间轴、测角仪测气球",
                "cover": "mj9b-sanjiaowenti/assets/motianlun.jpg"
              }
            ]
          },
          {
            "no": "第8章 统计和概率的简单应用",
            "motto": "用数据做决策",
            "goals": [],
            "lessons": [
              {
                "no": "8.1",
                "title": "中学生的视力情况调查",
                "genre": "概念",
                "kind": "统计与概率",
                "dir": "mj9b-shilidiaocha",
                "pages": 13,
                "desc": "抽签实验室：从 50 个身高中随机抽 20 个",
                "cover": "mj9b-shilidiaocha/assets/shili-cover.jpg"
              },
              {
                "no": "8.2",
                "title": "货比三家",
                "genre": "概念",
                "kind": "统计与概率",
                "dir": "mj9b-huobisanjia",
                "pages": 11,
                "desc": "挑年份、挑指标，“冠军”就换人",
                "cover": "mj9b-huobisanjia/assets/bingxiang-cover.jpg"
              },
              {
                "no": "8.3",
                "title": "统计分析帮你做预测",
                "genre": "概念",
                "kind": "统计与概率",
                "dir": "mj9b-tongjiyuce",
                "pages": 10,
                "desc": "拖动 A、B 选直线，实时预测",
                "cover": "mj9b-tongjiyuce/assets/chengshi-cover.jpg"
              },
              {
                "no": "8.4",
                "title": "抽签方法合理吗",
                "genre": "推导",
                "kind": "统计与概率",
                "dir": "mj9b-chouqian",
                "pages": 9,
                "desc": "抽签机：甲乙丙依次抽，重复几千次",
                "cover": "mj9b-chouqian/assets/chouqian-cover.jpg"
              },
              {
                "no": "8.5",
                "title": "概率帮你做估计",
                "genre": "推导",
                "kind": "统计与概率",
                "dir": "mj9b-gailvguji",
                "pages": 10,
                "desc": "捉放捉鱼塘：捞鱼估计青鱼条数",
                "cover": "mj9b-gailvguji/assets/yutang-cover.jpg"
              },
              {
                "no": "8.6",
                "title": "收取多少保险费才合理",
                "genre": "推导",
                "kind": "统计与概率",
                "dir": "mj9b-baoxianfei",
                "pages": 10,
                "desc": "保险账本：调保费，飞 10 万次看盈亏",
                "cover": "mj9b-baoxianfei/assets/jichang-cover.jpg"
              }
            ]
          },
          {
            "no": "课题学习",
            "motto": "用数学做动画",
            "goals": [],
            "lessons": [
              {
                "no": "课题学习",
                "title": "制作“动画片”",
                "genre": "推导",
                "kind": "课题学习",
                "optional": true
              }
            ]
          }
        ]
      },
      {
        "name": "高一上册",
        "edition": "普通高中教科书 · 数学必修第一册 · 江苏凤凰教育出版社（苏教版）",
        "units": [
          {
            "no": "第1章 集合",
            "motto": "用集合语言描述数学对象",
            "goals": [],
            "lessons": [
              {
                "no": "1.1",
                "title": "集合的概念与表示",
                "genre": "概念",
                "kind": "集合",
                "dir": "mg10a-jihegainian",
                "pages": 13,
                "desc": "拖数入圈分拣，描述法逐个过筛",
                "cover": "mg10a-jihegainian/assets/niaoqun.jpg"
              },
              {
                "no": "1.2",
                "title": "子集、全集、补集",
                "genre": "概念",
                "kind": "集合",
                "dir": "mg10a-zijibuji",
                "pages": 13,
                "desc": "选/不选枚举子集，生成树推出2ⁿ",
                "cover": "mg10a-zijibuji/assets/shujia.jpg"
              },
              {
                "no": "1.3",
                "title": "交集、并集",
                "genre": "概念",
                "kind": "集合",
                "dir": "mg10a-jiaojibingji",
                "pages": 13,
                "desc": "数轴拖区间端点，实时求交与并",
                "cover": "mg10a-jiaojibingji/assets/saichang.jpg"
              }
            ]
          },
          {
            "no": "第2章 常用逻辑用语",
            "motto": "学会严谨地说话与推理",
            "goals": [],
            "lessons": [
              {
                "no": "2.1",
                "title": "命题、定理、定义",
                "genre": "概念",
                "kind": "常用逻辑用语",
                "dir": "mg10a-mingti",
                "pages": 13,
                "desc": "拖顶点 A′ 找“等积不全等”反例",
                "cover": "mg10a-mingti/assets/taolun.jpg"
              },
              {
                "no": "2.2",
                "title": "充分条件、必要条件、充要条件",
                "genre": "推导",
                "kind": "常用逻辑用语",
                "dir": "mg10a-chongyaotiaojian",
                "pages": 13,
                "desc": "拖动两个集合圈，判充分/必要/充要",
                "cover": "mg10a-chongyaotiaojian/assets/dianlu.jpg"
              },
              {
                "no": "2.3",
                "title": "全称量词命题与存在量词命题",
                "genre": "概念",
                "kind": "常用逻辑用语",
                "dir": "mg10a-liangcimingti",
                "pages": 12,
                "desc": "换集合 M 看 ∀/∃ 判真变化",
                "cover": "mg10a-liangcimingti/assets/shuizu.jpg"
              }
            ]
          },
          {
            "no": "第3章 不等式",
            "motto": "从相等到不等，比较与最值",
            "goals": [],
            "lessons": [
              {
                "no": "3.1",
                "title": "不等式的基本性质",
                "genre": "推导",
                "kind": "不等式",
                "dir": "mg10a-budengshixingzhi",
                "pages": 14,
                "desc": "数轴变换器：乘负数时两点翻转，配反例检验",
                "cover": "mg10a-budengshixingzhi/assets/qiaoqiaoban.jpg"
              },
              {
                "no": "3.2",
                "title": "基本不等式",
                "genre": "推导",
                "kind": "不等式",
                "dir": "mg10a-jibenbudengshi",
                "cover": "mg10a-jibenbudengshi/assets/tianping.jpg",
                "pages": 14,
                "desc": "天平问题建模 · 半圆里拖出√ab≤(a+b)/2 · 三种证法"
              },
              {
                "no": "3.3",
                "title": "从函数观点看一元二次方程和一元二次不等式",
                "genre": "推导",
                "kind": "不等式",
                "dir": "mg10a-yiyuanerci",
                "pages": 16,
                "desc": "拖抛物线顶点，Δ、零点、解集联动",
                "cover": "mg10a-yiyuanerci/assets/penquan.jpg"
              }
            ]
          },
          {
            "no": "第4章 指数与对数",
            "motto": "把运算推广到实数指数",
            "goals": [],
            "lessons": [
              {
                "no": "4.1",
                "title": "指数",
                "genre": "推导",
                "kind": "指数与对数",
                "dir": "mg10a-zhishu",
                "pages": 14,
                "desc": "逐级填满 y=2^x 上的有理点，夹逼出 2^√2",
                "cover": "mg10a-zhishu/assets/xibao.jpg"
              },
              {
                "no": "4.2",
                "title": "对数",
                "genre": "概念",
                "kind": "指数与对数",
                "dir": "mg10a-duishu",
                "pages": 16,
                "desc": "指对互化转换器 + 运算性质、换底验证器",
                "cover": "mg10a-duishu/assets/shiyanshi.jpg"
              }
            ]
          },
          {
            "no": "第5章 函数概念与性质",
            "motto": "用对应的观点认识函数",
            "goals": [],
            "lessons": [
              {
                "no": "5.1",
                "title": "函数的概念和图象",
                "genre": "概念",
                "kind": "函数概念与性质",
                "dir": "mg10a-hanshugainian",
                "cover": "mg10a-hanshugainian/assets/qiwen.jpg",
                "pages": 14,
                "desc": "从变量说到对应说 · 连线判断是不是函数"
              },
              {
                "no": "5.2",
                "title": "函数的表示方法",
                "genre": "概念",
                "kind": "函数概念与性质",
                "dir": "mg10a-hanshubiaoshi",
                "pages": 12,
                "desc": "三种表示法联动 + 分段函数逐段搭建",
                "cover": "mg10a-hanshubiaoshi/assets/yinliao.jpg"
              },
              {
                "no": "5.3",
                "title": "函数的单调性",
                "genre": "推导",
                "kind": "函数概念与性质",
                "dir": "mg10a-dandiaoxing",
                "pages": 16,
                "desc": "任取两点检验器：拖点、抽 100 对辨“任意”",
                "cover": "mg10a-dandiaoxing/assets/dengshan.jpg"
              },
              {
                "no": "5.4",
                "title": "函数的奇偶性",
                "genre": "推导",
                "kind": "函数概念与性质",
                "dir": "mg10a-jiouxing",
                "pages": 14,
                "desc": "沿 y 轴对折、绕原点旋转，看图象是否重合",
                "cover": "mg10a-jiouxing/assets/daoying.jpg"
              }
            ]
          },
          {
            "no": "第6章 幂函数、指数函数和对数函数",
            "motto": "三类基本初等函数",
            "goals": [],
            "lessons": [
              {
                "no": "6.1",
                "title": "幂函数",
                "genre": "概念",
                "kind": "幂函数、指数函数和对数函数",
                "dir": "mg10a-mihanshu",
                "pages": 12,
                "desc": "α 滑块＋拖点 P、Q 看奇偶与单调",
                "cover": "mg10a-mihanshu/assets/qiche.jpg"
              },
              {
                "no": "6.2",
                "title": "指数函数",
                "genre": "概念",
                "kind": "幂函数、指数函数和对数函数",
                "dir": "mg10a-zhishuhanshu",
                "pages": 14,
                "desc": "拖点 (1,a) 改底数；一尺之棰精确截半",
                "cover": "mg10a-zhishuhanshu/assets/chui.jpg"
              },
              {
                "no": "6.3",
                "title": "对数函数",
                "genre": "概念",
                "kind": "幂函数、指数函数和对数函数",
                "dir": "mg10a-duishuhanshu",
                "pages": 14,
                "desc": "沿 y=x 逐点翻折动画，指对互为反函数",
                "cover": "mg10a-duishuhanshu/assets/xibao.jpg"
              }
            ]
          },
          {
            "no": "第7章 三角函数",
            "motto": "刻画周期现象的函数",
            "goals": [],
            "lessons": [
              {
                "no": "7.1",
                "title": "角与弧度",
                "genre": "概念",
                "kind": "三角函数",
                "dir": "mg10a-jiaoyuhudu",
                "pages": 14,
                "desc": "拖终边转任意角；同心圆 l/r 不变得 1 rad",
                "cover": "mg10a-jiaoyuhudu/assets/motianlun.jpg"
              },
              {
                "no": "7.2",
                "title": "三角函数概念",
                "genre": "概念",
                "kind": "三角函数",
                "dir": "mg10a-sanjiaogainian",
                "pages": 16,
                "desc": "单位圆拖 P 看函数值，切换诱导公式对称点",
                "cover": "mg10a-sanjiaogainian/assets/shuiche.jpg"
              },
              {
                "no": "7.3",
                "title": "三角函数的图象和性质",
                "genre": "推导",
                "kind": "三角函数",
                "dir": "mg10a-sanjiaotuxiang",
                "pages": 15,
                "desc": "拖单位圆把弧拉直，逐点描出正弦曲线",
                "cover": "mg10a-sanjiaotuxiang/assets/hailang.jpg"
              },
              {
                "no": "7.4",
                "title": "三角函数应用",
                "genre": "推导",
                "kind": "三角函数",
                "dir": "mg10a-sanjiaoyingyong",
                "pages": 13,
                "desc": "振子边振边描图；拖滑块拟合潮汐数据",
                "cover": "mg10a-sanjiaoyingyong/assets/chaoxi.jpg"
              }
            ]
          },
          {
            "no": "第8章 函数应用",
            "motto": "用函数解决实际问题",
            "goals": [],
            "lessons": [
              {
                "no": "8.1",
                "title": "二分法与求方程近似解",
                "genre": "推导",
                "kind": "函数应用",
                "dir": "mg10a-erfenfa",
                "pages": 14,
                "desc": "二分法器：4 个方程，可选精度 0.1/0.01",
                "cover": "mg10a-erfenfa/assets/xianlu.jpg"
              },
              {
                "no": "8.2",
                "title": "函数与数学模型",
                "genre": "推导",
                "kind": "函数应用",
                "dir": "mg10a-hanshumoxing",
                "pages": 13,
                "desc": "四函数赛跑可拉大视野；数量级比较器",
                "cover": "mg10a-hanshumoxing/assets/kafei.jpg"
              }
            ]
          }
        ]
      },
      {
        "name": "高一下册",
        "edition": "普通高中教科书 · 数学必修第二册 · 江苏凤凰教育出版社（苏教版）",
        "units": [
          {
            "no": "第9章 平面向量",
            "motto": "既有大小又有方向的量",
            "goals": [],
            "lessons": [
              {
                "no": "9.1",
                "title": "向量概念",
                "genre": "概念",
                "kind": "平面向量",
                "dir": "mg10b-xianglianggainian",
                "pages": 14,
                "desc": "拖动平移向量判相等/相反/共线",
                "cover": "mg10b-xianglianggainian/assets/huaxue.jpg"
              },
              {
                "no": "9.2",
                "title": "向量运算",
                "genre": "推导",
                "kind": "平面向量",
                "dir": "mg10b-xiangliangyunsuan",
                "pages": 16,
                "desc": "拖动做加减、数乘滑块、数量积投影",
                "cover": "mg10b-xiangliangyunsuan/assets/duchuan.jpg"
              },
              {
                "no": "9.3",
                "title": "向量基本定理及坐标表示",
                "genre": "推导",
                "kind": "平面向量",
                "dir": "mg10b-xiangliangjibendingli",
                "pages": 16,
                "desc": "拖基底与终点，实时分解出 λ₁、λ₂ 与坐标",
                "cover": "mg10b-xiangliangjibendingli/assets/fanchuan.jpg"
              },
              {
                "no": "9.4",
                "title": "向量应用",
                "genre": "推导",
                "kind": "平面向量",
                "dir": "mg10b-xiangliangyingyong",
                "pages": 13,
                "desc": "拖夹角看提水拉力；拖三角形顶点验证垂心等式",
                "cover": "mg10b-xiangliangyingyong/assets/tishui.jpg"
              }
            ]
          },
          {
            "no": "第10章 三角恒等变换",
            "motto": "用向量推出两角和差公式",
            "goals": [],
            "lessons": [
              {
                "no": "10.1",
                "title": "两角和与差的三角函数",
                "genre": "推导",
                "kind": "三角恒等变换",
                "dir": "mg10b-liangjiaohecha",
                "pages": 16,
                "desc": "单位圆拖 α、β，数量积两种算法实时相等",
                "cover": "mg10b-liangjiaohecha/assets/motianlun.jpg"
              },
              {
                "no": "10.2",
                "title": "二倍角的三角函数",
                "genre": "推导",
                "kind": "三角恒等变换",
                "dir": "mg10b-erbeijiao",
                "pages": 13,
                "desc": "单位圆拖圆周角α，PH=2sinαcosα",
                "cover": "mg10b-erbeijiao/assets/zhonglou.jpg"
              },
              {
                "no": "10.3",
                "title": "几个三角恒等式",
                "genre": "推导",
                "kind": "三角恒等变换",
                "dir": "mg10b-sanjiaohengdengshi",
                "pages": 14,
                "desc": "拖动点(a,b)看正弦余弦叠加成一列波",
                "cover": "mg10b-sanjiaohengdengshi/assets/hailang.jpg"
              }
            ]
          },
          {
            "no": "第11章 解三角形",
            "motto": "边角关系的定量刻画",
            "goals": [],
            "lessons": [
              {
                "no": "11.1",
                "title": "余弦定理",
                "genre": "推导",
                "kind": "解三角形",
                "dir": "mg10b-yuxiandingli",
                "pages": 13,
                "desc": "拖夹角看勾股缺口 −2bc·cosA",
                "cover": "mg10b-yuxiandingli/assets/shuitang.jpg"
              },
              {
                "no": "11.2",
                "title": "正弦定理",
                "genre": "推导",
                "kind": "解三角形",
                "dir": "mg10b-zhengxiandingli",
                "pages": 12,
                "desc": "外接圆比值=2R；圆弧定 SSA 解数",
                "cover": "mg10b-zhengxiandingli/assets/dengshan.jpg"
              },
              {
                "no": "11.3",
                "title": "余弦定理、正弦定理的应用",
                "genre": "推导",
                "kind": "解三角形",
                "dir": "mg10b-sanjiaoyingyong",
                "pages": 12,
                "desc": "河对岸测距模拟、救援时间轴",
                "cover": "mg10b-sanjiaoyingyong/assets/jiuyuan.jpg"
              }
            ]
          },
          {
            "no": "第12章 复数",
            "motto": "数系的又一次扩充",
            "goals": [],
            "lessons": [
              {
                "no": "12.1",
                "title": "复数的概念",
                "genre": "概念",
                "kind": "复数",
                "dir": "mg10b-fushugainian",
                "pages": 12,
                "desc": "点数放进维恩图判类别",
                "cover": "mg10b-fushugainian/assets/kaerdan.jpg"
              },
              {
                "no": "12.2",
                "title": "复数的运算",
                "genre": "推导",
                "kind": "复数",
                "dir": "mg10b-fushuyunsuan",
                "pages": 12,
                "desc": "乘法四格表、i 的乘方循环",
                "cover": "mg10b-fushuyunsuan/assets/sishi.jpg"
              },
              {
                "no": "12.3",
                "title": "复数的几何意义",
                "genre": "概念",
                "kind": "复数",
                "dir": "mg10b-fushujiheyiyi",
                "pages": 10,
                "desc": "拖点作平行四边形、点集",
                "cover": "mg10b-fushujiheyiyi/assets/hanghai.jpg"
              },
              {
                "no": "12.4",
                "title": "复数的三角形式",
                "genre": "推导",
                "kind": "复数",
                "dir": "mg10b-fushusanjiaoxingshi",
                "pages": 12,
                "desc": "乘法=旋转+伸缩演示、单位根",
                "cover": "mg10b-fushusanjiaoxingshi/assets/motianlun.jpg"
              }
            ]
          },
          {
            "no": "第13章 立体几何初步",
            "motto": "从平面走向空间",
            "goals": [],
            "lessons": [
              {
                "no": "13.1",
                "title": "基本立体图形",
                "genre": "概念",
                "kind": "立体几何初步",
                "dir": "mg10b-jibenlitituxing",
                "pages": 14,
                "desc": "平移、截、旋转生成立体，斜二测拖点",
                "cover": "mg10b-jibenlitituxing/assets/wuti.jpg"
              },
              {
                "no": "13.2",
                "title": "基本图形位置关系",
                "genre": "推导",
                "kind": "立体几何初步",
                "dir": "mg10b-weizhiguanxi",
                "pages": 16,
                "desc": "正方体点两线判关系算夹角，二面角翻折",
                "cover": "mg10b-weizhiguanxi/assets/men.jpg"
              },
              {
                "no": "13.3",
                "title": "空间图形的表面积和体积",
                "genre": "推导",
                "kind": "立体几何初步",
                "dir": "mg10b-biaomianjitiji",
                "pages": 14,
                "desc": "圆柱、圆锥、圆台侧面连续展开，祖暅截面",
                "cover": "mg10b-biaomianjitiji/assets/cangku.jpg"
              }
            ]
          },
          {
            "no": "第14章 统计",
            "motto": "用数据说话",
            "goals": [],
            "lessons": [
              {
                "no": "14.1",
                "title": "获取数据的基本途径及相关概念",
                "genre": "概念",
                "kind": "统计",
                "dir": "mg10b-huoqushuju",
                "pages": 12,
                "desc": "概念判对错，坦克序列号估计模拟",
                "cover": "mg10b-huoqushuju/assets/yutang.jpg"
              },
              {
                "no": "14.2",
                "title": "抽样",
                "genre": "概念",
                "kind": "统计",
                "dir": "mg10b-chouyang",
                "pages": 12,
                "desc": "随机数表点选读数，两种抽样各抽200次对比",
                "cover": "mg10b-chouyang/assets/tang.jpg"
              },
              {
                "no": "14.3",
                "title": "统计图表",
                "genre": "概念",
                "kind": "统计",
                "dir": "mg10b-tongjitubiao",
                "pages": 11,
                "desc": "改组距实时重算频率直方图与折线",
                "cover": "mg10b-tongjitubiao/assets/shulin.jpg"
              },
              {
                "no": "14.4",
                "title": "用样本估计总体",
                "genre": "推导",
                "kind": "统计",
                "dir": "mg10b-yangbengujizongti",
                "pages": 15,
                "desc": "拖点看平均数、中位数、方差，百分位数滑块",
                "cover": "mg10b-yangbengujizongti/assets/gangjin.jpg"
              }
            ]
          },
          {
            "no": "第15章 概率",
            "motto": "刻画随机现象的规律",
            "goals": [],
            "lessons": [
              {
                "no": "15.1",
                "title": "随机事件和样本空间",
                "genre": "概念",
                "kind": "概率",
                "dir": "mg10b-suijishijian",
                "pages": 13,
                "desc": "点选 6×6 样本点组成事件，即时算 A+B、AB",
                "cover": "mg10b-suijishijian/assets/yingbi.jpg"
              },
              {
                "no": "15.2",
                "title": "随机事件的概率",
                "genre": "推导",
                "kind": "概率",
                "dir": "mg10b-suijigailv",
                "pages": 15,
                "desc": "真随机模拟摸球，频率折线逼近 3/10",
                "cover": "mg10b-suijigailv/assets/moqiu.jpg"
              },
              {
                "no": "15.3",
                "title": "互斥事件和独立事件",
                "genre": "推导",
                "kind": "概率",
                "dir": "mg10b-huchiduli",
                "pages": 16,
                "desc": "拖面积模型：互斥不重叠，竖条×横条看独立",
                "cover": "mg10b-huchiduli/assets/sheji.jpg"
              }
            ]
          }
        ]
      }
    ]
  },
];
