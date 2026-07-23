/**
 * 牛頓・暮年篇
 * 結構：終端（青／壯回聲）➜ 二次函數×5（最高點 Eureka）
 *       ➜ 圖書館員對手拍 ➜ 哲學雙結局
 * 主：二次函數｜Eureka：act2_outro｜禁微積分
 */

export const newtonElder = {
  id: 'NEWTON_ELDER',
  mathematicianId: 'NEWTON',
  era: 'ELDER',
  gradeBand: 3,
  title: '牛頓・暮年',
  subtitle: '終端 ➜ 開口 ➜ 最高點 Eureka ➜ 對稱軸 ➜ 噴水 ➜ 最低點 ➜ 館員對峙 ➜ 抉擇',
  nextChapterId: null,
  rewards: {},
  eurekaMax: 3,
  knowledgeCard: {
    line: '本章練到：二次函數圖形、頂點與極值｜課綱：九上・二次函數（勿真教微積分）',
  },
  endings: [
    {
      id: 'ending_cold',
      title: '只留下符號',
      description:
        '選擇把拋物線收成抽象符號進庫。工程表暫時不公開，符號卻被保存下來。',
      hint: '館員只要符號收藏的前夜，選擇只留符號……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '可算的極值表',
      description:
        '選擇留下航海／工程能用的最高點、最低點表。符號可以晚一點進庫。',
      hint: '館員只要符號收藏的前夜，選擇留下極值表……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'NE1_LINK',
      lines: [
        {
          speaker: 'SYS',
          text: '數感終端機_版本1.0.4 … 目標年代：約西元 1720 年・英格蘭晚年書房',
        },
        {
          speaker: '姐姐',
          text: '「暮年了。這次要找的是彎曲線的最高、最低——不是導數那套。」',
        },
        {
          speaker: '弟弟',
          text: '「像噴泉那樣彎彎的……最高點在哪？」',
        },
        {
          speaker: 'Numi',
          text: '「拋物線！衝到頂——！」',
        },
        {
          speaker: 'NumNum',
          text: '「開口朝哪、頂點在哪、極值是多少。一個一個讀。」',
        },
        {
          speaker: 'SYS',
          text: '時空鎖定……藍紫轉為紙邊與窗格子，傳送開始。',
        },
      ],
    },
    {
      id: 'meet_again',
      type: 'narrative',
      checkpoint: 'NE1_REUNION',
      lines: [
        {
          speaker: 'narrator',
          text: '光芒散去。暮年的牛頓坐在窗邊，紙上畫著一條開口向下的弧。',
        },
        {
          speaker: '牛頓',
          text: '「……還來。」',
        },
        {
          speaker: '牛頓',
          text: '「年輕時色散上了布告欄；壯年時斜率進了刻版。現在我想知道——彎過去的最高點。」',
          whenStory: { youth_ending: 'ending_cold' },
        },
        {
          speaker: '牛頓',
          text: '「年輕時先讓人看見彩虹。彎線的最高點，也該有人看得見。」',
          whenStory: { youth_ending: 'ending_warm' },
        },
        {
          speaker: '牛頓',
          text: '「壯年我把直線釘死。彎線的頂，還得再算一次。」',
          whenStory: { prime_ending: 'ending_cold' },
        },
        {
          speaker: '牛頓',
          text: '「壯年我寫過學徒抄本。今晚這張極值表，也想留給用手的人。」',
          whenStory: { prime_ending: 'ending_warm' },
        },
        {
          speaker: '牛頓',
          text: '「先看這條弧：開口朝哪，最高次項的係數會告訴你。」',
        },
      ],
    },

    // ——— Q1 開口／二次項係數 ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'NE2_OPEN',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓在紙上寫下：高度＝−2×（水平距離的平方）＋10×距離＋5。',
        },
        {
          speaker: '牛頓',
          text: '「平方前面那個數是多少？它決定開口往上還是往下。」',
        },
        {
          speaker: 'NumNum',
          text: '「二次項係數：負的——開口向下，會有最高點。」',
        },
        {
          speaker: 'Numi',
          text: '「往下彎！像噴泉！」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'NE2_OPEN_PROBLEM',
      scene: '關卡一・開口朝哪',
      question: {
        stem:
          '高度寫成「−2 乘上距離的平方，再加其他項」。平方前面的係數是多少？',
        bankRef: {
          id: 1330,
          note: 'DEV對照：二次函數意義／二次項係數（＃1330），非同題。',
        },
      },
    },
    {
      id: 'branch_act1',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：找平方前面】(靈感 −1)',
          detail: '看看「距離的平方」緊貼在哪個數後面。',
          kind: 'insight',
          story: { open_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「平方前面那個數！帶不帶負號都要看清楚！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：認出二次項係數】',
          detail: '標準式裡 x² 的係數就是二次項係數。',
          kind: 'solve',
          story: { open_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「寫成 ax²＋bx＋c 時，a 就是開口的關鍵。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'NE2_OPEN_QUIZ',
      scene: '關卡一・開口朝哪',
      setup: [{ speaker: '牛頓', text: '「平方前面——係數？」' }],
      question: {
        answerType: 'number',
        stem:
          '高度＝−2×（距離的平方）＋10×距離＋5。平方前面的係數是多少？',
        answer: '-2',
        bankRef: {
          id: 1330,
          note: '答案：-2。DEV對照＃1330。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '找到「距離的平方」那一項，看它乘上幾。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「二次項是 −2x²，係數是 −2。負號表示開口向下。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「−2。開口朝下——所以才有最高點可找。」',
        },
        {
          speaker: 'Numi',
          text: '「往下彎！去找頂！」',
          whenStory: { open_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「a＜0，極大值才站得住。」',
          whenStory: { open_method: 'numnum' },
        },
      ],
    },

    // ——— Q2 最高點 Eureka ———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'NE3_MAX',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓把式子整理成：高度＝−2×（距離−3）的平方＋8。',
        },
        {
          speaker: '牛頓',
          text: '「這種寫法，最高離地多少，一眼就該讀得出來。」',
        },
        {
          speaker: 'NumNum',
          text: '「寫成『平方再加減一個數』的樣子時，極值常掛在後面那個數上——但要先分清開口朝哪。」',
        },
        {
          speaker: '弟弟',
          text: '「最高點！幾公尺？」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'NE3_MAX_PROBLEM',
      scene: '關卡二・最高點',
      question: {
        stem:
          '高度＝−2×（距離−3）²＋8。這條軌跡離地最高是多少公尺？',
        bankRef: {
          id: 1353,
          note: 'DEV對照：頂點／最大值（＃1353），非同題。',
        },
      },
    },
    {
      id: 'branch_act2',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：平方最小是零】(靈感 −1)',
          detail: '平方永遠 ≥0；再乘負數後，何時高度最大？',
          kind: 'insight',
          story: { max_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「平方變 0 的時候最高！後面那個數就是！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：讀頂點的 y】',
          detail: '寫成 a(x−h)²＋k 時，頂點是 (h,k)，k 就是極值。',
          kind: 'solve',
          story: { max_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「開口向下時，k 就是最大值。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'NE3_MAX_QUIZ',
      scene: '關卡二・最高點',
      setup: [{ speaker: '牛頓', text: '「最高——幾公尺？」' }],
      question: {
        answerType: 'number',
        stem:
          '高度＝−2×（距離−3）²＋8。離地最高是多少公尺？',
        answer: '8',
        bankRef: {
          id: 1353,
          note: '答案：8。DEV對照＃1353・頂點。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '想想：平方那一項什麼時候讓高度最大？',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「(距離−3)²≥0，乘 −2 後 ≤0；要高度最大就讓平方為 0，高度＝8。」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: '牛頓',
          text: '（眼睛驟亮）「……彎線的最高點，被一個數按住了。」',
        },
        {
          speaker: 'SYS',
          text: '★ 觸發關鍵頓悟：用二次函數頂點讀出最高點！獲得【Eureka 幣 × 1】！',
        },
        {
          speaker: 'Numi',
          text: '「頂到了！8！」',
          whenStory: { max_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「不必真的『一瞬一瞬』切——頂點就把極值交出來。」',
          whenStory: { max_method: 'numnum' },
        },
        {
          speaker: '姐姐',
          text: '「這種最高點若只收進符號庫，用手的人會摸不著。」',
        },
      ],
    },

    // ——— Q3 對稱軸 ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'NE4_AXIS',
      lines: [
        {
          speaker: 'narrator',
          text: '同一條弧，牛頓問：最高點落在哪個水平距離上？',
        },
        {
          speaker: '牛頓',
          text: '「高度＝−2×（距離−3）²＋5。對稱軸是距離等於多少？」',
        },
        {
          speaker: 'NumNum',
          text: '「a(x−h)²＋k 的對稱軸就是 x＝h。」',
        },
        {
          speaker: 'Numi',
          text: '「左右一樣——中間那條！」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'NE4_AXIS_PROBLEM',
      scene: '關卡三・對稱軸',
      question: {
        stem:
          '高度＝−2×（距離−3）²＋5。對稱軸是「距離等於多少」？',
        bankRef: {
          id: 1367,
          note: 'DEV對照：對稱軸／極值（＃1367），非同題。',
        },
      },
    },
    {
      id: 'branch_act3',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：括號裡為零】(靈感 −1)',
          detail: '讓（距離−？）變成 0 的那個位置，就是中線。',
          kind: 'insight',
          story: { axis_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「括號變 0 的地方——就是中間！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：讀 h】',
          detail: '寫成 a(x−h)²＋k 時，對稱軸 x＝h。',
          kind: 'solve',
          story: { axis_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「h 就是對稱軸的位置。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'NE4_AXIS_QUIZ',
      scene: '關卡三・對稱軸',
      setup: [{ speaker: '牛頓', text: '「對稱軸——距離等於？」' }],
      question: {
        answerType: 'number',
        stem:
          '高度＝−2×（距離−3）²＋5。對稱軸是距離等於多少？',
        answer: '3',
        bankRef: {
          id: 1367,
          note: '答案：3。DEV對照＃1367。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '看括號裡「距離減掉誰」。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「形式 a(x−3)²＋k，對稱軸 x＝3。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「3。最高點正上方，軸在這裡。」',
        },
        {
          speaker: 'Numi',
          text: '「中線！3！」',
          whenStory: { axis_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「軸對了，左右才能對摺。」',
          whenStory: { axis_method: 'numnum' },
        },
      ],
    },

    // ——— Q4 噴水最高點位置 ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'NE5_APP',
      lines: [
        {
          speaker: 'narrator',
          text: '庭院噴水：牛頓把水柱寫成高度＝−（水平距離−2）²＋4。',
        },
        {
          speaker: '牛頓',
          text: '「最高點出現在水平距離多少的地方？」',
        },
        {
          speaker: '弟弟',
          text: '「噴到最頂——在哪個位置？」',
        },
        {
          speaker: 'NumNum',
          text: '「還是讀 h：頂點的橫坐標。」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'NE5_APP_PROBLEM',
      scene: '關卡四・噴水位置',
      question: {
        stem:
          '高度＝−（水平距離−2）²＋4。最高點出現在水平距離多少之處？',
        bankRef: {
          id: 1350,
          note: 'DEV對照：頂點應用（＃1350），非同題。',
        },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：括號變零】(靈感 −1)',
          detail: '水平距離減誰會變 0，最高點就在那。',
          kind: 'insight',
          story: { app_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「減誰變零——最高就在那！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：頂點橫坐標】',
          detail: 'a(x−h)²＋k 的頂點橫坐標是 h。',
          kind: 'solve',
          story: { app_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「應用題也一樣：先認頂點。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'NE5_APP_QUIZ',
      scene: '關卡四・噴水位置',
      setup: [{ speaker: '牛頓', text: '「最高點——水平距離？」' }],
      question: {
        answerType: 'number',
        stem:
          '高度＝−（水平距離−2）²＋4。最高點在水平距離多少之處？',
        answer: '2',
        bankRef: {
          id: 1350,
          note: '答案：2。DEV對照＃1350。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '最高點的位置，就是對稱軸／頂點的橫坐標。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「頂點是 (2,4)，所以水平距離 2。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「2。噴頭對準那裡，水柱最高。」',
        },
        {
          speaker: 'Numi',
          text: '「對準 2！噴！」',
          whenStory: { app_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「應用只是把頂點穿上故事外套。」',
          whenStory: { app_method: 'numnum' },
        },
      ],
    },

    // ——— Q5 最低點（開口向上）———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'NE6_MIN',
      lines: [
        {
          speaker: 'narrator',
          text: '最後一張：開口向上的弧——牛頓要找最低點。',
        },
        {
          speaker: '牛頓',
          text: '「高度＝（距離−1）²＋3。最低離地多少？」',
        },
        {
          speaker: 'NumNum',
          text: '「開口向上時，頂點就是最低；開口向下時，頂點就是最高。」',
        },
        {
          speaker: '姐姐',
          text: '「極值表若公開，航海的人會先找最低、最高——別只藏符號。」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'NE6_MIN_PROBLEM',
      scene: '關卡五・最低點',
      question: {
        stem: '高度＝（距離−1）²＋3。這條軌跡離地最低是多少？',
        bankRef: {
          id: 1367,
          note: 'DEV對照：極值求法（＃1367），非同題。',
        },
      },
    },
    {
      id: 'branch_act5',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：平方最小是零】(靈感 −1)',
          detail: '平方最小是 0，那時高度最低。',
          kind: 'insight',
          story: { min_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「平方變 0！剩下後面那個數！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：讀頂點的 k】',
          detail: '開口向上時，k 是最小值。',
          kind: 'solve',
          story: { min_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「a＞0，極小值就是 k。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'NE6_MIN_QUIZ',
      scene: '關卡五・最低點',
      setup: [{ speaker: '牛頓', text: '「最低——多少？」' }],
      question: {
        answerType: 'number',
        stem: '高度＝（距離−1）²＋3。離地最低是多少？',
        answer: '3',
        bankRef: {
          id: 1367,
          note: '答案：3。DEV對照＃1367・極小值。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '開口向上時，頂點的高度就是最低。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「(距離−1)²≥0，高度≥3；最低是 3。」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「3。最高、最低——表上該有兩欄。」',
        },
        {
          speaker: 'Numi',
          text: '「谷底！3！」',
          whenStory: { min_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「極值成對出現，表才好用。」',
          whenStory: { min_method: 'numnum' },
        },
      ],
    },

    // ——— 對手拍 ———
    {
      id: 'act6_rival',
      type: 'narrative',
      checkpoint: 'NE7_RIVAL',
      lines: [
        {
          speaker: 'narrator',
          text: '王家圖書館員推門進來，目光掃過極值表與一堆抽象符號。',
        },
        {
          speaker: '館員',
          text: '「庫裡只要符號。航海、工地那張『最高幾尺、最低幾尺』——太俗，不收。」',
        },
        {
          speaker: '牛頓',
          text: '「……可是用手的人，要的是那兩欄。」',
        },
        {
          speaker: '館員',
          text: '「明日前選：只留符號，或把極值表留下給外面。」',
        },
        {
          speaker: 'narrator',
          text: '門關上。弧線還在紙上彎著。',
        },
        {
          speaker: '姐姐',
          text: '「符號進庫，思想才不被時間磨掉。」',
        },
        {
          speaker: '弟弟',
          text: '「可是船要過彎、水要噴到最高……表不該鎖在庫裡。」',
        },
      ],
    },

    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt: '館員要你在「只留符號」與「留下極值表」之間選。今晚怎麼回？',
      note: '重大哲學抉擇：決定本章結局。',
      lines: [
        {
          speaker: '姐姐',
          text: '「只留符號。抽象進庫——後人才能在乾淨的式子上重建。」',
        },
        {
          speaker: '弟弟',
          text: '「留下可算的極值表。最高、最低，先給用手的人。」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '堅持符號進庫，極值表暫不公開。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '牛頓',
              text: '「……符號進庫。表，我自己還留著底稿。」',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '把最高／最低表留給外面的人。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '牛頓',
              text: '「……表留下。船與噴泉，用得上。」',
            },
          ],
        },
      ],
    },

    {
      id: 'ending_cold',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局一：【只留下符號】' },
        {
          speaker: 'narrator',
          text: '隔日，抽象式子入庫。極值表被館員退回；牛頓把底稿塞進抽屜。',
        },
        {
          speaker: 'NumNum',
          text: '「庫乾淨了。最高點，還在抽屜裡。」',
        },
        {
          speaker: '姐姐',
          text: '「符號進庫，才扛得住時間。」',
        },
        {
          speaker: 'narrator',
          text: '窗格子的光還在。筆記本闔上——弧線收成了符號。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【只留下符號】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【可算的極值表】' },
        {
          speaker: 'narrator',
          text: '牛頓把最高、最低兩欄抄成單頁，塞給願意帶出書房的人。館員只帶走符號摘要。',
        },
        {
          speaker: 'Numi',
          text: '「表跑出去了！有人用得到！」',
        },
        {
          speaker: '弟弟',
          text: '「最高、最低——手才接得住。」',
        },
        {
          speaker: 'narrator',
          text: '書房空了一角。筆記本闔上——極值表已經在路上。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【可算的極值表】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
}
