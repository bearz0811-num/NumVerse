/**
 * 伽利略・青年篇
 * 結構：終端連線 ➜ 教堂鐘擺（正比）➜ 漏壺反比 Eureka ➜ 比例式 ➜ 斜塔座標 ➜ 線對稱
 *       ➜ 對手拍（講師錯表）➜ 哲學雙結局
 * 拍板：G1a 線對稱｜G2a 章內 Eureka＝Q2｜修訂：去考卷聲／7A 對手拍
 * Eureka：章內 act2_outro +1｜結局各 +1
 */

export const galileoYouth = {
  id: 'GALILEO_YOUTH',
  mathematicianId: 'GALILEO',
  era: 'YOUTH',
  gradeBand: 1,
  title: '伽利略・青年',
  subtitle: '終端連線 ➜ 鐘擺 ➜ 漏壺 Eureka ➜ 換繩 ➜ 斜塔方格 ➜ 立面 ➜ 講師對峙 ➜ 抉擇',
  nextChapterId: 'GALILEO_PRIME',
  rewards: {},
  eurekaMax: 3,
  knowledgeCard: {
    line: '本章練到：正比與反比、比例式｜副：座標讀圖、線對稱｜課綱：七下・比例；平面直角坐標；生活幾何',
  },
  unlockTeaser: '下一站：工坊斜面——用一元二次方程讀落體距離與時間。',
  endings: [
    {
      id: 'ending_cold',
      title: '公開證偽',
      description:
        '選擇在廣場當眾攤開對照表，拆穿講師的錯表。伽利略把「看」變成公共證明。',
      hint: '講師要公開講錯表的前夜，選擇當眾對質……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '筆記裡的數據',
      description:
        '選擇先把正確對照表抄進筆記、悄悄交給願意聽的人。理性以溫度往下傳。',
      hint: '講師要公開講錯表的前夜，選擇先護住火種……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    // ——— 開場 ———
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'GY1_LINK',
      lines: [
        {
          speaker: 'SYS',
          text: '數感終端機_版本1.0.4 … 目標年代：約西元 1580 年・義大利比薩',
        },
        {
          speaker: '姐姐',
          text: '「這次換人了——青年伽利略。鐘擺、斜塔，還有他筆記本裡那些成對的數字。」',
        },
        {
          speaker: '弟弟',
          text: '「聽說他會一邊數自己的心跳一邊看吊燈！好酷！」',
        },
        {
          speaker: 'Numi',
          text: '「比薩！斜塔！衝——！」',
        },
        {
          speaker: 'NumNum',
          text: '「先看他怎麼把數字排成兩欄。誰跟誰一起變，誰跟誰反著變。」',
        },
        {
          speaker: 'SYS',
          text: '時空座標鎖定……藍紫轉暖黃，傳送開始。',
        },
      ],
    },

    // ——— 幕一：鐘擺・正比 ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'GY2_PENDULUM',
      lines: [
        {
          speaker: 'narrator',
          text: '教堂裡，一盞吊燈微微擺動。年輕的伽利略用手指按著脈搏，盯著繩長，每擺一次就默數心跳。',
        },
        {
          speaker: '伽利略',
          text: '「繩子換長，擺一次要跳更多下……我記成兩欄：繩長，和心跳數。」',
        },
        {
          speaker: 'Numi',
          text: '「繩子拉長，心跳也要多跳——好像一起長大！」',
        },
        {
          speaker: 'NumNum',
          text: '「一起變幾倍的話，第二欄就能從第一欄推過去。」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'GY2_PENDULUM_PROBLEM',
      scene: '關卡一・鐘擺',
      question: {
        stem:
          '伽利略的筆記：繩長 3 尺時，擺一次心跳 12 下；兩欄數字成正比。若繩長改成 5 尺，擺一次心跳幾下？',
        bankRef: {
          id: 648,
          note: '正比求未知（比例放大）。',
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
          label: '【Numi 的直覺：一起變幾倍】(靈感 −1)',
          detail: '先看繩長變成幾倍，心跳跟著乘同樣倍數。',
          kind: 'insight',
          story: { pend_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「3 變成 5，就是乘上同一個倍數！心跳也乘一樣的！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的比例式】',
          detail: '把兩欄寫成比，再求未知那一格。',
          kind: 'solve',
          story: { pend_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「心跳比等於繩長比。兩邊對齊，未知的那格就會自己站出來。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'GY2_PENDULUM_QUIZ',
      scene: '關卡一・鐘擺',
      setup: [
        {
          speaker: '伽利略',
          text: '「繩長 5 尺——心跳該記幾下？」',
        },
      ],
      question: {
        answerType: 'number',
        stem: '繩長 3 尺時心跳 12；成正比。繩長 5 尺時，心跳幾下？',
        answer: '20',
        bankRef: { id: 648, note: '答案：20' },
      },
      hint: {
        speaker: 'NumNum',
        text: '先想：繩長變成幾倍？',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「12÷3＝4，每尺 4 下；5 尺就是 20。寫成 12:□＝3:5 交叉相乘也一樣。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「繩長與心跳……一起變。第一欄，記上了。」',
        },
        {
          speaker: 'Numi',
          text: '「一起變幾倍！燈也在點頭！」',
          whenStory: { pend_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「兩欄對齊，數字才肯聽話。」',
          whenStory: { pend_method: 'numnum' },
        },
        {
          speaker: '弟弟',
          text: '「那有沒有『一個變大、一個變小』的？」',
        },
        {
          speaker: '伽利略',
          text: '「有。跟我來工坊——漏壺。」',
        },
      ],
    },

    // ——— 幕二：漏壺・反比（章內 Eureka）———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'GY3_FALL',
      lines: [
        {
          speaker: 'narrator',
          text: '工坊裡一只漏壺滴答作響。伽利略換了不同大小的出水孔，數水漏完要多少下心跳。',
        },
        {
          speaker: '伽利略',
          text: '「孔越大，漏完越快……這兩欄，會不會是反著變的？」',
        },
        {
          speaker: 'Numi',
          text: '「孔變大，時間就被擠小——像我把數字堆撞扁！」',
        },
        {
          speaker: 'NumNum',
          text: '「一個變幾倍、另一個縮成幾分之一的話，乘起來會差不多。」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'GY3_FALL_PROBLEM',
      scene: '關卡二・漏壺',
      question: {
        stem:
          '筆記：出水孔面積 2 平方寸時，漏完要 12 下心跳；兩欄成反比。孔改成 6 平方寸，要幾下？',
        bankRef: {
          id: 654,
          note: '反比求未知（乘積守恆）。',
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
          label: '【Numi 的直覺：一個乘、一個除】(靈感 −1)',
          detail: '孔變幾倍，時間就縮成幾分之一。',
          kind: 'insight',
          story: { leak_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「孔變大的倍數，時間就要除掉同樣的倍數！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：乘起來看】',
          detail: '兩欄乘積差不多不變，再反推時間。',
          kind: 'solve',
          story: { leak_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「先把舊的兩欄乘一乘，再用新的孔去除——時間就出來了。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'GY3_FALL_QUIZ',
      scene: '關卡二・漏壺',
      setup: [
        {
          speaker: '伽利略',
          text: '「孔 6 平方寸——漏完幾下？」',
        },
      ],
      question: {
        answerType: 'number',
        stem: '孔面積 2 時心跳 12；成反比。孔面積 6 時，心跳幾下？',
        answer: '4',
        bankRef: { id: 654, note: '答案：4' },
      },
      hint: {
        speaker: 'NumNum',
        text: '想想：乘起來會不會差不多？',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「2×12＝24；24÷6＝4。反比就是乘積守住。」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: '伽利略',
          text: '（眼睛驟亮）「一邊一起變，一邊反著變——兩欄對照，世界比較肯說話了。」',
        },
        {
          speaker: 'SYS',
          text: '★ 觸發關鍵頓悟：正比／反比對照成立！獲得【Eureka 幣 × 1】！',
        },
        {
          speaker: 'Numi',
          text: '「一個乘、一個除——超好撞！」',
          whenStory: { leak_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「乘積守住，時間就不會亂跑。」',
          whenStory: { leak_method: 'numnum' },
        },
      ],
    },

    // ——— 幕三：換繩・比例式 ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'GY3_RATIO',
      lines: [
        {
          speaker: 'narrator',
          text: '傍晚，伽利略又換了一組繩。舊繩與新繩的長度比，他已經量過了。',
        },
        {
          speaker: '伽利略',
          text: '「舊繩比新繩是 2 比 5。舊的心跳是 8——新的該寫幾？」',
        },
        {
          speaker: 'NumNum',
          text: '「還是一起變。心跳的比，跟繩長的比，該是同一份。」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'GY3_RATIO_PROBLEM',
      scene: '關卡三・換繩',
      question: {
        stem: '心跳與繩長成正比。舊繩：新繩＝2:5，舊心跳＝8。新心跳是多少？',
        bankRef: { id: 645, note: '比例式求未知。' },
      },
    },
    {
      id: 'branch_act3',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：倍率直乘】(靈感 −1)',
          detail: '新繩是舊繩的幾倍，心跳就乘幾倍。',
          kind: 'insight',
          story: { ratio_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「2 變 5 的那個倍數，往心跳上一乘！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：兩邊對齊】',
          detail: '心跳比＝繩長比，再求未知格。',
          kind: 'solve',
          story: { ratio_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「把比寫好，未知的那一格用對齊的辦法求。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'GY3_RATIO_QUIZ',
      scene: '關卡三・換繩',
      setup: [
        {
          speaker: '伽利略',
          text: '「新繩的心跳——幾下？」',
        },
      ],
      question: {
        answerType: 'number',
        stem: '舊繩：新繩＝2:5，舊心跳＝8，成正比。新心跳？',
        answer: '20',
        bankRef: { id: 645, note: '答案：20' },
      },
      hint: {
        speaker: 'NumNum',
        text: '心跳比，要跟繩長比同一份。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「8:□＝2:5 → 2×□＝40 → □＝20。或 8×(5/2)＝20。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「比可以搬，關係沒變就行。」',
        },
        {
          speaker: 'Numi',
          text: '「倍率一乘，格子自己亮！」',
          whenStory: { ratio_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「對齊，比亂寫。」',
          whenStory: { ratio_method: 'numnum' },
        },
        {
          speaker: '弟弟',
          text: '「斜塔那邊風好大——要不要去把觀測點畫進方格紙？」',
        },
      ],
    },

    // ——— 幕四：斜塔座標 ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'GY4_COORD',
      lines: [
        {
          speaker: 'narrator',
          text: '廣場上斜塔的影子拉得很長。伽利略在地上鋪開方格紙，把兩次目測的位置點上去。',
        },
        {
          speaker: '伽利略',
          text: '「同一條豎線上：一個點在 (3, 2)，一個在 (3, 7)。我想知道兩次高度差了多少刻度。」',
        },
        {
          speaker: 'Numi',
          text: '「橫的一樣！那就直直往上數格子！」',
        },
        {
          speaker: 'NumNum',
          text: '「先看清楚兩個點的位置，再比高低。」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'GY4_COORD_PROBLEM',
      scene: '關卡四・斜塔方格',
      question: {
        stem:
          'A 記在 (3, 2)，B 記在 (3, 7)，同一條豎線上。兩個高度差多少刻度？',
        bankRef: { id: 583, note: '讀座標／軸向距離（國一）。' },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：往上數格子】(靈感 −1)',
          detail: '從較低的點，一格一格數到較高的點。',
          kind: 'insight',
          story: { coord_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「從下面那個點，往上爬——數有幾格！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：比兩個高度】',
          detail: '橫的相同，只比兩個高度數字。',
          kind: 'solve',
          story: { coord_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「橫的一樣，就看兩個高度差多少。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'GY4_COORD_QUIZ',
      scene: '關卡四・斜塔方格',
      setup: [
        {
          speaker: '伽利略',
          text: '「差多少刻度？」',
        },
      ],
      question: {
        answerType: 'number',
        stem: 'A(3, 2)、B(3, 7)，同一豎線。高度差多少刻度？',
        answer: '5',
        bankRef: { id: 583, note: '答案：5' },
      },
      hint: {
        speaker: 'NumNum',
        text: '兩個高度數字，差多少？',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「7 減 2 是 5。橫都是 3，不用斜著算。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「點站在格子上，高低就不是感覺了。」',
        },
        {
          speaker: 'Numi',
          text: '「往上爬格子！清楚！」',
          whenStory: { coord_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「先讀位置，再決定比哪一邊。」',
          whenStory: { coord_method: 'numnum' },
        },
      ],
    },

    // ——— 幕五：線對稱 ———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'GY5_SYMM',
      lines: [
        {
          speaker: 'narrator',
          text: '鐘樓立面窗戶左右成排。伽利略隨手畫了幾張草圖，想挑一張「對摺後還對得起來」的給石匠。',
        },
        {
          speaker: '弟弟',
          text: '「像把紙對摺，圖案要對得起來！」',
        },
        {
          speaker: '伽利略',
          text: '「我用字母當記號試試——哪一個對摺後還認得自己。」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'GY5_SYMM_PROBLEM',
      scene: '關卡五・鐘樓立面',
      question: {
        stem: '石匠問：下面哪個大寫字母，對摺後左右還能重合？',
        bankRef: { id: 721, note: '線對稱判別（字母）。' },
      },
    },
    {
      id: 'branch_act5',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：對摺看看】(靈感 −1)',
          detail: '想像把字母紙對摺。',
          kind: 'insight',
          story: { sym_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「對摺！左右要長得一樣！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：找中線】',
          detail: '看有沒有一條中線，兩邊對得起來。',
          kind: 'solve',
          story: { sym_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「找中線。對不起來的，就劃掉。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'GY5_SYMM_QUIZ',
      scene: '關卡五・鐘樓立面',
      setup: [
        {
          speaker: '伽利略',
          text: '「哪一個對得起來？」',
        },
      ],
      question: {
        answerType: 'choice',
        stem: '下列哪一個大寫英文字母，對摺後左右能重合？',
        answer: 'B',
        options: [
          { letter: 'A', text: 'F' },
          { letter: 'B', text: 'H' },
          { letter: 'C', text: 'G' },
          { letter: 'D', text: 'J' },
        ],
        bankRef: { id: 721, note: '正確：B＝H' },
      },
      hint: {
        speaker: 'NumNum',
        text: '想像從中間對摺。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「H 左右對得起來。F、G、J 對摺後會缺一塊。」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「立面要對得起自己。這張給石匠。」',
        },
        {
          speaker: 'Numi',
          text: '「對摺！美！」',
          whenStory: { sym_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「中線找到，左右才安分。」',
          whenStory: { sym_method: 'numnum' },
        },
      ],
    },

    // ——— 7A 對手拍：講師錯表 ———
    {
      id: 'act6_rival',
      type: 'narrative',
      checkpoint: 'GY6_RIVAL',
      lines: [
        {
          speaker: 'narrator',
          text: '回工坊的路上，遇到講師馬爾科。他腋下夾著明天要在廣場講課的木板——上面畫滿繩長與「神秘擺動」，數字卻對不起伽利略的兩欄。',
        },
        {
          speaker: '馬爾科',
          text: '「繩越長、擺越慢，是神意，不可用你們那種『成正比』去量。明天廣場上，我要當眾說明——別再用心跳去瀆神。」',
        },
        {
          speaker: '伽利略',
          text: '「……你板上的第二欄，和繩長對不上。我量過。」',
        },
        {
          speaker: '馬爾科',
          text: '（冷笑）「量？明天讓全廣場聽我的。年輕人，別出醜。」',
        },
        {
          speaker: 'narrator',
          text: '馬爾科走了。木板的錯表還在夕陽裡反光。伽利略捏著自己的筆記本，指節發白。',
        },
        {
          speaker: '姐姐',
          text: '「他明天要公開講錯的。你的表是對的——要不要明天也站上去？」',
        },
        {
          speaker: '弟弟',
          text: '「可是廣場上那麼多人……若他一怒，你還能繼續量嗎？先把正確的表護住，不好嗎？」',
        },
      ],
    },

    // ——— 哲學 ———
    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt: '馬爾科明天要在廣場講那塊錯表。伽利略的對照表已經齊了——今晚怎麼決定？',
      note: '重大哲學抉擇：決定本章結局。',
      lines: [
        {
          speaker: '姐姐',
          text: '「明天當眾攤開你的兩欄：擺的一起變、壺的反著變。錯表經不起對照——公開，才叫證明。」',
        },
        {
          speaker: '弟弟',
          text: '「先把正確的表抄進筆記，悄悄交給還願意聽的人。火種要護著，你才能繼續量下去。」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '明天廣場當眾對照，拆穿馬爾科的錯表。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '伽利略',
              text: '「……那就抬到廣場上。看，比聽他說更乾淨。」',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '先抄進筆記，護住火種與繼續測量的路。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '伽利略',
              text: '「……先寫下來。數字還在，人也可以慢慢懂。」',
            },
          ],
        },
      ],
    },

    // ——— 雙結局 ———
    {
      id: 'ending_cold',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局一：【公開證偽】' },
        {
          speaker: 'narrator',
          text: '隔日廣場上，馬爾科正要開講。伽利略把鐘擺表與漏壺表並排放上：同向者、反向者，一眼對得起來。',
        },
        {
          speaker: 'NumNum',
          text: '「他的木板對不上。你的兩欄對得上。」',
        },
        {
          speaker: '姐姐',
          text: '「公開，才叫證明。」',
        },
        {
          speaker: 'narrator',
          text: '有人鼓掌，有人皺眉。馬爾科收起木板走了。伽利略把自己推到風口——也把「看」變成公共事件。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【公開證偽】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【筆記裡的數據】' },
        {
          speaker: 'narrator',
          text: '伽利略沒上廣場。燈下，他把對照表一筆一筆抄進筆記本最內頁，天亮前塞給兩個還會來工坊的學徒。',
        },
        {
          speaker: 'Numi',
          text: '「火種先藏好！以後誰要核對，翻得出來！」',
        },
        {
          speaker: '弟弟',
          text: '「數字還是對的。你也能繼續量。」',
        },
        {
          speaker: 'narrator',
          text: '風從鐘樓縫隙進來。筆記闔上——比例關係還在，等下一個願意打開它的人。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【筆記裡的數據】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
}
