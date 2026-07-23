/**
 * 牛頓・壯年篇
 * 結構：終端（青年回聲）➜ 一次函數×3（斜率 Eureka）➜ 平行四邊形×2
 *       ➜ 書記對手拍 ➜ 哲學雙結局
 * 主：一次函數｜副：平行四邊形｜Eureka：act3_outro
 */

export const newtonPrime = {
  id: 'NEWTON_PRIME',
  mathematicianId: 'NEWTON',
  era: 'PRIME',
  gradeBand: 2,
  title: '牛頓・壯年',
  subtitle: '終端 ➜ 記數直線 ➜ 兩式對齊 ➜ 斜率 Eureka ➜ 力框 ➜ 坐標框 ➜ 書記對峙 ➜ 抉擇',
  nextChapterId: 'NEWTON_ELDER',
  rewards: {},
  eurekaMax: 3,
  knowledgeCard: {
    line: '本章練到：一次函數及其圖形｜副：平行四邊形｜課綱：八上・函數；八下・平行與四邊形',
  },
  unlockTeaser: '下一站：晚年書房——用二次函數找出軌跡的最高點。',
  endings: [
    {
      id: 'ending_cold',
      title: '定律公開刻版',
      description:
        '選擇把直線關係與力框寫進公開刻版。學徒可能讀得吃力，秩序卻被釘死在紙上。',
      hint: '書記要只准拉丁刻版的前夜，選擇公開刻版……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '學徒的人話版',
      description:
        '選擇先寫給學徒看得懂的人話版。刻版晚一點，火種先傳下去。',
      hint: '書記要只准拉丁刻版的前夜，選擇人話版……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'NP1_LINK',
      lines: [
        {
          speaker: 'SYS',
          text: '數感終端機_版本1.0.4 … 目標年代：約西元 1687 年・英格蘭書房',
        },
        {
          speaker: '姐姐',
          text: '「壯年了。這次不是色帶——是直線、斜率，還有把兩股力框進平行四邊形。」',
        },
        {
          speaker: '弟弟',
          text: '「蘋果樹？……還有他簿子上那些成對的數。」',
        },
        {
          speaker: 'Numi',
          text: '「直線！往上衝——！」',
        },
        {
          speaker: 'NumNum',
          text: '「誰跟誰一起變、變多快——要從表與圖讀出來。」',
        },
        {
          speaker: 'SYS',
          text: '時空鎖定……藍紫轉為燭煙與紙邊，傳送開始。',
        },
      ],
    },
    {
      id: 'meet_again',
      type: 'narrative',
      checkpoint: 'NP1_REUNION',
      lines: [
        {
          speaker: 'narrator',
          text: '光芒散去。壯年的牛頓站在窗邊，桌上攤開兩欄數字：一邊是「拉了多少」，一邊是「記數」。',
        },
        {
          speaker: '牛頓',
          text: '「……又是你們。」',
        },
        {
          speaker: '牛頓',
          text: '「年輕時我把色散釘上布告欄。現在——我要把變化寫成一條線。」',
          whenStory: { youth_ending: 'ending_cold' },
        },
        {
          speaker: '牛頓',
          text: '「年輕時我先讓人看見彩虹。火種還在，所以這本簿子也還在。」',
          whenStory: { youth_ending: 'ending_warm' },
        },
        {
          speaker: '牛頓',
          text: '「先從這張表練起。拉長一寸，記數怎麼走。」',
        },
      ],
    },

    // ——— Q1 一次函數求值 ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'NP2_LIN1',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓在彈簧旁做記號：沒拉時記數 30；每多拉 1 寸，記數再加 15。',
        },
        {
          speaker: '牛頓',
          text: '「拉了 4 寸——記數該是多少？」',
        },
        {
          speaker: 'NumNum',
          text: '「起始多少，再加上『每寸加多少』乘上寸數。」',
        },
        {
          speaker: 'Numi',
          text: '「4 寸——加四次！」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'NP2_LIN1_PROBLEM',
      scene: '關卡一・彈簧記數',
      question: {
        stem:
          '沒拉時記數 30；每多拉 1 寸，記數加 15。拉了 4 寸時，記數是多少？',
        bankRef: {
          id: 1023,
          note: 'DEV對照：一次函數 y＝ax＋b 求值（＃1023），非同題。',
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
          label: '【Numi：加四次】(靈感 −1)',
          detail: '從起始數開始，一寸一寸往上加。',
          kind: 'insight',
          story: { lin1_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「先記住沒拉時的數！再一寸一寸加！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：寫成 ax＋b】',
          detail: '把「每寸加多少」和「起始」寫進同一個式子再代入。',
          kind: 'solve',
          story: { lin1_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「每寸的變化當斜率，沒拉時當截距。代入寸數。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'NP2_LIN1_QUIZ',
      scene: '關卡一・彈簧記數',
      setup: [{ speaker: '牛頓', text: '「拉 4 寸——記數？」' }],
      question: {
        answerType: 'number',
        stem:
          '沒拉時記數 30；每多拉 1 寸加 15。拉了 4 寸，記數是多少？',
        answer: '90',
        bankRef: {
          id: 1023,
          note: '答案：90。DEV對照＃1023・一次函數求值。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '先算「多出來的寸數」貢獻多少，再加回起始。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「30＋15×4＝30＋60＝90。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「90。表上對上了。」',
        },
        {
          speaker: 'Numi',
          text: '「加四次！清楚！」',
          whenStory: { lin1_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「直線關係，代入就讀得出點。」',
          whenStory: { lin1_method: 'numnum' },
        },
      ],
    },

    // ——— Q2 兩直線函數值相等 ———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'NP3_LIN2',
      lines: [
        {
          speaker: 'narrator',
          text: '簿子另一頁有兩種記法，牛頓想找「兩個式子講同一件事」的那個位置。',
        },
        {
          speaker: '牛頓',
          text: '「第一種：4 倍再減 5；第二種：先取相反的 2 倍再加 7。什麼時候兩種記數一樣？」',
        },
        {
          speaker: 'NumNum',
          text: '「設那個位置是 x，兩個式子相等，解出 x。」',
        },
        {
          speaker: '姐姐',
          text: '「這組對照若公開，書記會逐行核——別解錯交點。」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'NP3_LIN2_PROBLEM',
      scene: '關卡二・兩式對齊',
      question: {
        stem:
          '第一種記數是「4 倍減 5」，第二種是「−2 倍加 7」。兩種一樣時，那個倍數（x）是多少？',
        bankRef: {
          id: 1024,
          note: 'DEV對照：兩一次函數函數值相等（＃1024），非同題。',
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
          label: '【Numi：兩邊對齊】(靈感 −1)',
          detail: '讓兩個說法相等，再把 x 集中到一邊。',
          kind: 'insight',
          story: { lin2_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「兩邊一樣！把帶 x 的搬到同一邊！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：列等式求解】',
          detail: '寫成一個等式，移項合併同類項。',
          kind: 'solve',
          story: { lin2_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「等式兩邊同加減，讓 x 單獨露出來。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'NP3_LIN2_QUIZ',
      scene: '關卡二・兩式對齊',
      setup: [{ speaker: '牛頓', text: '「對齊時——x 是多少？」' }],
      question: {
        answerType: 'number',
        stem:
          '何時「4x−5」與「−2x＋7」的值相同？求 x。',
        answer: '2',
        bankRef: {
          id: 1024,
          note: '答案：2。DEV對照＃1024。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '先寫成等式，再把含 x 的項集中。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「4x−5＝−2x＋7 → 6x＝12 → x＝2。」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「2。兩條線在這裡碰到。」',
        },
        {
          speaker: 'Numi',
          text: '「對齊！撞到同一點！」',
          whenStory: { lin2_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「函數值相等，就是交點的橫坐標。」',
          whenStory: { lin2_method: 'numnum' },
        },
      ],
    },

    // ——— Q3 斜率／變化率 Eureka ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'NP4_SLOPE',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓指著表上兩列：時間 0 時費用 50；時間 2 時費用 200。他要的是「每多 1 個時間，費用多多少」。',
        },
        {
          speaker: '牛頓',
          text: '「從 0 到 2，費用從 50 走到 200。平均起來，每增加 1，費用增加多少？」',
        },
        {
          speaker: 'Numi',
          text: '「變了多少，除掉走了多遠！」',
        },
        {
          speaker: 'NumNum',
          text: '「這就是直線的斜率——變化有多陡。」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'NP4_SLOPE_PROBLEM',
      scene: '關卡三・變化有多快',
      question: {
        stem:
          '時間 0 時費用 50；時間 2 時費用 200。每增加 1 個時間單位，費用平均增加多少？',
        bankRef: {
          id: 1020,
          note: 'DEV對照：一次函數斜率／變化率（＃1020），非同題。',
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
          label: '【Numi：差除掉間隔】(靈感 −1)',
          detail: '先看費用差了多少，再除以時間走了多少。',
          kind: 'insight',
          story: { slope_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「變多少，除掉走多遠——每一步就出來了！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：用兩點算斜率】',
          detail: '斜率＝縱坐標差 ÷ 橫坐標差。',
          kind: 'solve',
          story: { slope_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「兩點定一條直線。斜率就是『陡』的數字。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'NP4_SLOPE_QUIZ',
      scene: '關卡三・變化有多快',
      setup: [{ speaker: '牛頓', text: '「每增加 1——費用多多少？」' }],
      question: {
        answerType: 'number',
        stem:
          '時間 0→費用 50；時間 2→費用 200。每增加 1 個時間，費用平均增加多少？',
        answer: '75',
        bankRef: {
          id: 1020,
          note: '答案：75。DEV對照＃1020・斜率。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '先算費用差，再除以時間差。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「(200−50)÷(2−0)＝150÷2＝75。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: '牛頓',
          text: '（筆尖一頓）「……變化有多快，被一個數說清楚了。」',
        },
        {
          speaker: 'SYS',
          text: '★ 觸發關鍵頓悟：從一次函數的表讀出變化率！獲得【Eureka 幣 × 1】！',
        },
        {
          speaker: 'Numi',
          text: '「陡！這個數就是陡！」',
          whenStory: { slope_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「斜率一讀，直線才像會說話。」',
          whenStory: { slope_method: 'numnum' },
        },
        {
          speaker: '姐姐',
          text: '「這種『人人可算的陡』，若刻進公開版，有人會說你把自然寫得太白話。」',
        },
      ],
    },

    // ——— Q4 平行四邊形對角 ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'NP5_PARA1',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓用四根木條釘成一個可活動的框，說這是「兩股力拉住的架子」——要保持成平行四邊形。',
        },
        {
          speaker: '牛頓',
          text: '「對邊平行。這個角是 65 度——對面那個角是多少？」',
        },
        {
          speaker: 'NumNum',
          text: '「平行四邊形的對角相等。」',
        },
        {
          speaker: '弟弟',
          text: '「對面要一樣大！」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'NP5_PARA1_PROBLEM',
      scene: '關卡四・力框對角',
      question: {
        stem:
          '平行四邊形裡，一個內角是 65 度。它對面的那個內角是多少度？',
        bankRef: {
          id: 1110,
          note: 'DEV對照：平行四邊形對角相等（＃1110），非同題。',
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
          label: '【Numi：對面一樣】(靈感 −1)',
          detail: '平行四邊形裡，對著的兩個角一樣大。',
          kind: 'insight',
          story: { para1_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「對著看！一樣大！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：對角相等】',
          detail: '用平行四邊形的對角性質直接讀出。',
          kind: 'solve',
          story: { para1_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「對邊平行推出對角相等。不用亂猜鄰角。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'NP5_PARA1_QUIZ',
      scene: '關卡四・力框對角',
      setup: [{ speaker: '牛頓', text: '「對面那個角？」' }],
      question: {
        answerType: 'number',
        stem: '平行四邊形的一個內角是 65 度。對角是多少度？',
        answer: '65',
        bankRef: {
          id: 1110,
          note: '答案：65。DEV對照＃1110。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '想想：對著的角，關係是什麼？',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「平行四邊形對角相等，所以也是 65。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「65。框還咬得住。」',
        },
        {
          speaker: 'Numi',
          text: '「對面一樣！好記！」',
          whenStory: { para1_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「性質對了，力框才不會歪掉。」',
          whenStory: { para1_method: 'numnum' },
        },
      ],
    },

    // ——— Q5 坐標平行四邊形 ———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'NP6_PARA2',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓把框架的三個角點畫在方格紙上，要你補第四個點，讓它仍是平行四邊形。',
        },
        {
          speaker: '牛頓',
          text: '「A(−2,1)、B(3,1)、C(4,5)。D 的橫坐標該是多少，才能讓 ABCD 成平行四邊形？」',
        },
        {
          speaker: 'NumNum',
          text: '「對角線交點要重合——中點公式。」',
        },
        {
          speaker: 'Numi',
          text: '「對邊要平行——方格上平移一樣多！」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'NP6_PARA2_PROBLEM',
      scene: '關卡五・坐標力框',
      question: {
        stem:
          'A(−2,1)、B(3,1)、C(4,5)。若 ABCD 是平行四邊形，D 的橫坐標是多少？',
        bankRef: {
          id: 1112,
          note: 'DEV對照：坐標平面平行四邊形（＃1112），非同題。',
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
          label: '【Numi：平移一樣多】(靈感 −1)',
          detail: '從 A 到 B 怎麼走，D 到 C 也要怎麼走。',
          kind: 'insight',
          story: { para2_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「邊怎麼平移，對面也要一樣平移！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：對角線中點重合】',
          detail: 'AC 中點＝BD 中點，列出橫坐標等式。',
          kind: 'solve',
          story: { para2_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「中點座標相等，未知的橫坐標就出來了。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'NP6_PARA2_QUIZ',
      scene: '關卡五・坐標力框',
      setup: [{ speaker: '牛頓', text: '「D 的橫坐標？」' }],
      question: {
        answerType: 'number',
        stem:
          'A(−2,1)、B(3,1)、C(4,5)，ABCD 為平行四邊形。D 的橫坐標？',
        answer: '-1',
        bankRef: {
          id: 1112,
          note: '答案：-1。DEV對照＃1112。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '讓兩條對角線的中點重合，或讓對邊平移量相同。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「AC 中點橫坐標 1；BD 中點 (3＋x)/2＝1 → x＝−1。」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「−1。第四個角點咬上了。」',
        },
        {
          speaker: 'Numi',
          text: '「平移！框住了！」',
          whenStory: { para2_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「中點一對，平行四邊形就站得住。」',
          whenStory: { para2_method: 'numnum' },
        },
      ],
    },

    // ——— 對手拍 ———
    {
      id: 'act6_rival',
      type: 'narrative',
      checkpoint: 'NP7_RIVAL',
      lines: [
        {
          speaker: 'narrator',
          text: '門被敲響。學會書記站在燭光裡，盯著斜率與力框的草稿。',
        },
        {
          speaker: '書記',
          text: '「自然律要進刻版，就只准拉丁、只准給讀得起書的人。你要寫給學徒的人話——我們不收。」',
        },
        {
          speaker: '牛頓',
          text: '「……可是『陡』這個數，學徒也算得出來。」',
        },
        {
          speaker: '書記',
          text: '「明日前回覆。公開刻版，或收回人話草稿。」',
        },
        {
          speaker: 'narrator',
          text: '門關上。直線還在紙上傾斜。',
        },
        {
          speaker: '姐姐',
          text: '「定律公開刻版，才叫秩序。讀得吃力，也不能藏起來。」',
        },
        {
          speaker: '弟弟',
          text: '「可是學徒先看懂，火種才傳得下去啊……」',
        },
      ],
    },

    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt: '書記要你在「公開刻版」與「人話版」之間選。今晚怎麼回？',
      note: '重大哲學抉擇：決定本章結局。',
      lines: [
        {
          speaker: '姐姐',
          text: '「公開刻版。斜率與力框寫死在紙上——人人可核，哪怕難讀。」',
        },
        {
          speaker: '弟弟',
          text: '「先寫學徒看得懂的人話版。刻版可以晚一點。」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '堅持公開刻版與可核對的直線關係。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '牛頓',
              text: '「……那就刻。讓他們去咬文嚼字。數還在線上。」',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '先做人話版給學徒，刻版暫緩。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '牛頓',
              text: '「……先寫給他們看。陡，要有人接得住。」',
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
        { speaker: 'SYS', text: '章節結束 — 結局一：【定律公開刻版】' },
        {
          speaker: 'narrator',
          text: '隔日，斜率與力框的摘要送去刻版。書記收下拉丁稿；學徒在門外踮腳看不清。',
        },
        {
          speaker: 'NumNum',
          text: '「紙變硬了。線，還在外面。」',
        },
        {
          speaker: '姐姐',
          text: '「公開刻版，才叫秩序。」',
        },
        {
          speaker: 'narrator',
          text: '窗邊的彈簧還在。筆記本闔上——變化率被釘進了版面。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【定律公開刻版】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【學徒的人話版】' },
        {
          speaker: 'narrator',
          text: '牛頓當面收回拉丁稿，改把「每寸加多少」寫成學徒抄本。書記暫時沒蓋章。',
        },
        {
          speaker: 'Numi',
          text: '「學徒看懂了！陡傳下去了！」',
        },
        {
          speaker: '弟弟',
          text: '「人先讀得懂，定律才進得了手。」',
        },
        {
          speaker: 'narrator',
          text: '書房還亮著。筆記本闔上——人話版的斜率，睡在夾層裡。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【學徒的人話版】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
}
