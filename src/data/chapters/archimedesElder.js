/**
 * 第三章：阿基米德・暮年篇
 * 結構：終端連線 ➜ 承接壯年態度 ➜ 弦心距 ➜ 圓心角 ➜ 弧長
 *       ➜ 圓錐展開 Eureka ➜ 扇形 ➜「不要碰我的圓」➜ 哲學雙結局
 * Eureka 幣：
 *  1. 幕四圓錐展開頓悟 (+1)
 *  2. 結局一 (+1)
 *  3. 結局二 (+1)
 * 開場態度依 progress.lastEndingId：
 *   ARCHIMEDES_YOUTH → youth_ending
 *   ARCHIMEDES_PRIME → prime_ending
 * 敘事鎖定：名句＝沙盤被干擾（Numi＋遠處人影）；不寫被殺主線
 */

export const archimedesElder = {
  id: 'ARCHIMEDES_ELDER',
  mathematicianId: 'ARCHIMEDES',
  era: 'ELDER',
  title: '阿基米德・暮年',
  subtitle: '終端暮年 ➜ 沙盤弦距 ➜ 圓心角 ➜ 弧長 ➜ 圓錐展開 Eureka ➜ 扇形 ➜ 不要碰我的圓',
  nextChapterId: null,
  rewards: {},
  eurekaMax: 3,
  knowledgeCard: {
    line: '本章練到：弦長、圓心角、弧長、圓錐展開、扇形｜課綱：九下・圓的性質；立體＝圓錐側面展開',
  },
  endings: [
    {
      id: 'ending_cold',
      title: '圓上的永恆刻痕',
      description:
        '選擇把證明寫入公共檔案與幾何傳統。人會走，圓與式子還在。',
      hint: '在亂世的書房裡，選擇重視冰冷秩序與公開真理的道路……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '沙盤傳承',
      description:
        '選擇先把證明縮短教給學徒、藏起副本。理性以溫度往下傳。',
      hint: '在亂世的書房裡，選擇重視人文傳承與護火種的道路……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    // ——— 開場 ———
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E1_LINK',
      lines: [
        {
          speaker: 'SYS',
          text: '數感終端機_版本1.0.4 … 目標年代：西元前 212 年・敘拉古書房',
        },
        {
          speaker: '姐姐',
          text: '「暮年座標。外面有城牆的動靜，裡面卻安靜得只剩沙盤。」',
        },
        {
          speaker: '弟弟',
          text: '「阿基米德還在算圓嗎？我……有點擔心外面。」',
        },
        {
          speaker: 'Numi',
          text: '「沙地上有好大的圓！衝——等等，我先看清楚再衝。」',
        },
        {
          speaker: 'NumNum',
          text: '「Numi 這次說得對。圓的性質一亂，後面全崩。」',
        },
        {
          speaker: 'SYS',
          text: '時空鎖定……藍紫轉為燭火與沙塵氣味，傳送開始！',
        },
      ],
    },

    {
      id: 'meet_again',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E2_REUNION',
      lines: [
        {
          speaker: 'narrator',
          text: '光芒散去。書房不大，沙盤佔了半張桌子；遠處隱約傳來金屬撞擊，像潮水拍岸，又遠了一點。',
        },
        {
          speaker: '阿基米德',
          text: '（頭也不抬）「……又來了。別踩沙。」',
        },
        {
          speaker: '阿基米德',
          text: '「當年大殿上刻度 7 當眾揭穿之後，我就更信：數字寫在眾人眼前，才站得住。那條路，我沒後悔。」',
          whenStory: { youth_ending: 'ending_cold' },
        },
        {
          speaker: '阿基米德',
          text: '「金匠一家後來還常送油燈來書房。我才記起——有些證明，是為了讓人還能回家。」',
          whenStory: { youth_ending: 'ending_warm' },
        },
        {
          speaker: '阿基米德',
          text: '「城牆那套機械，後來照你們說的——把參數校成能警告、能留生路。城多撐了一陣。現在，我想把力氣留給圓。」',
          whenStory: { prime_ending: 'ending_warm' },
        },
        {
          speaker: '阿基米德',
          text: '「城牆那套機械，後來照你們說的——公開最大殺傷，讓數據自己說話。敵艦退了。現在，我想把力氣留給圓。」',
          whenStory: { prime_ending: 'ending_cold' },
        },
        {
          speaker: '阿基米德',
          text: '「圓周有多長、球裝得下多少——這些問題比刀槍耐放。你們若還肯幫忙，從這條弦開始。」',
        },
        {
          speaker: '姐姐',
          text: '「弦、圓心角、弧、圓錐展開、扇形……這次要把性質寫清楚，不能只憑感覺。」',
        },
      ],
    },

    // ——— 關卡一：弦長（對齊題庫：給弦心距求弦長） ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E3_CHORD',
      lines: [
        {
          speaker: 'narrator',
          text: '沙盤上一個圓，半徑已量成 13 寸；圓心到弦的垂直距離量得 5 寸。阿基米德要知道這條弦有多長。',
        },
        {
          speaker: '阿基米德',
          text: '「從圓心垂到弦，會把弦切成兩半。半徑、弦心距、半弦——組成一個直角三角形。」',
        },
        {
          speaker: 'NumNum',
          text: '「垂徑定理：垂直平分弦。先求半弦，再加倍就是整弦。」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'CHECKPOINT_E3_CHORD_PROBLEM',
      scene: '關卡一・沙盤弦長',
      question: {
        stem:
          '圓的半徑為 13 寸，圓心到弦的距離（弦心距）為 5 寸。求弦長（寸）。',
        bankRef: {
          id: 1211,
          note: '仿題庫：r=13、弦心距=5 → 弦長 24（半弦 12）。',
        },
      },
    },
    {
      id: 'branch_act1',
      type: 'branch',
      prompt: '選擇求弦長的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：直角拆半】(靈感 −1)',
          detail: '半徑當斜邊，弦心距當一股，先求半弦再加倍。',
          kind: 'insight',
          story: { chord_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「半徑是斜邊、弦心距是一股！半弦先求出來，再乘 2 就是整條弦！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的步驟：垂徑＋畢氏】',
          detail: '垂線平分弦，用畢氏求半弦後再×2。',
          kind: 'solve',
          story: { chord_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「垂線平分弦。半弦²＝半徑²−弦心距²，再把半弦加倍。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E3_CHORD_QUIZ',
      scene: '關卡一・沙盤弦長',
      setup: [{ speaker: 'SYS', text: '請輸入弦長（寸）：' }],
      question: {
        answerType: 'number',
        stem: '圓半徑 13 寸、弦心距 5 寸，求弦長（寸）。',
        answer: '24',
        bankRef: { id: 1211, note: '答案：24' },
      },
      hint: {
        speaker: 'NumNum',
        text: '垂線會平分弦。半徑、弦心距、半弦組成直角三角形；先求半弦，再加倍。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「先用畢氏求半弦，再乘 2。別把弦心距直接當成弦長，也別忘了加倍。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '阿基米德在沙上標出弦的兩端，長度與計算吻合。燭火晃了一下。',
        },
        {
          speaker: 'Numi',
          text: '「半徑當斜邊、弦心距當一股——半弦加倍就對了！」',
          whenStory: { chord_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「垂徑定理加畢氏——弦長才站得住。」',
          whenStory: { chord_method: 'numnum' },
        },
        {
          speaker: '阿基米德',
          text: '「弦穩了。下一步：把圓周切成相同的角——我想用有限步，去逼近圓周有多長。」',
        },
      ],
    },

    // ——— 關卡二：圓心角 ———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E4_ANGLE',
      lines: [
        {
          speaker: 'narrator',
          text: '他在圓周上點出六個等分點，像替圓戴上一圈規則的刻度。',
        },
        {
          speaker: '阿基米德',
          text: '「整圓是 360 度。若均勻切成六份，每一份對應的圓心角是多少？」',
        },
        {
          speaker: '弟弟',
          text: '「這就像把蛋糕切成一樣大的六塊——每塊的角應該一樣。」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'CHECKPOINT_E4_ANGLE_PROBLEM',
      scene: '關卡二・等分圓心角',
      question: {
        stem:
          '一個圓被均勻分成六等份。求每一等份所對的圓心角（度）。',
        bankRef: { id: 342, note: '仿題庫：圓等分求圓心角（#342 為 8 等分→45；本題 6 等分→60）。' },
      },
    },
    {
      id: 'branch_act2',
      type: 'branch',
      prompt: '選擇想圓心角的方式：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：均分整圓】(靈感 −1)',
          detail: '整圓的度數拿去平均分。',
          kind: 'insight',
          story: { angle_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「整圓固定那麼多度，均勻切幾份，就一人分一份角！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的步驟：總度÷等份】',
          detail: '用整圓度數除以等分的份數。',
          kind: 'solve',
          story: { angle_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「圓心角之和是整圓。均分時，每一份＝總度數÷份數。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E4_ANGLE_QUIZ',
      scene: '關卡二・等分圓心角',
      setup: [{ speaker: 'SYS', text: '請輸入每一等份的圓心角（度）：' }],
      question: {
        answerType: 'number',
        stem: '圓均勻六等分，求每一等份的圓心角（度）。',
        answer: '60',
        bankRef: { id: 342, note: '答案：60' },
      },
      hint: {
        speaker: 'NumNum',
        text: '整圓的度數是固定的。均勻切成幾份，就把總度數平均分。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「均分時每一份的圓心角相同。用總度數除以份數，別除成弧長或其他量。」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '六條半徑像花瓣張開。阿基米德點頭：有限的等分，已經能開始逼近圓周。',
        },
        {
          speaker: '弟弟',
          text: '「整圓均分——每一份的角就齊了。」',
          whenStory: { angle_method: 'numi' },
        },
        {
          speaker: '姐姐',
          text: '「總度數除以份數——圓心角才不會猜。」',
          whenStory: { angle_method: 'numnum' },
        },
        {
          speaker: '姐姐',
          text: '「接下來若知道半徑與圓心角，就能估一段弧有多長。」',
        },
      ],
    },

    // ——— 關卡三：弧長（保留 π，對齊題庫） ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E5_ARC',
      lines: [
        {
          speaker: 'narrator',
          text: '沙盤旁的木牌寫著：「弧長請保留 π」。阿基米德指著半徑 12 寸、圓心角 90 度的那一段弧。',
        },
        {
          speaker: '阿基米德',
          text: '「弧長佔整圓周的比例，等於圓心角佔整圓的比例。答案寫成 kπ，我要那個 k。」',
        },
        {
          speaker: 'NumNum',
          text: '「圓周＝2×半徑×π。先乘角度比例，再讀出 π 前面的係數。」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'CHECKPOINT_E5_ARC_PROBLEM',
      scene: '關卡三・弧長逼近',
      question: {
        stem:
          '圓的半徑為 12 寸，某弧的圓心角為 90 度。弧長寫成 kπ，求 k。',
        bankRef: {
          id: 343,
          note: '仿題庫保留 π：弧長＝(90/360)×2π×12＝6π → k＝6。',
        },
      },
    },
    {
      id: 'branch_act3',
      type: 'branch',
      prompt: '選擇求弧長的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：佔整圓幾分之幾】(靈感 −1)',
          detail: '先看這個角是整圓的幾分之幾，再乘圓周。',
          kind: 'insight',
          story: { arc_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「角是整圓的幾分之幾，弧就是圓周的同樣幾分之幾！最後看 π 前面的數字。」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的公式：比例×圓周】',
          detail: '用圓心角比例乘上整圓周長，再讀 k。',
          kind: 'solve',
          story: { arc_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「弧長＝（圓心角／360）×2πr。化成 kπ 後，k 就是係數。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E5_ARC_QUIZ',
      scene: '關卡三・弧長逼近',
      setup: [{ speaker: 'SYS', text: '請輸入 k（弧長＝kπ）：' }],
      question: {
        answerType: 'number',
        stem: '半徑 12 寸、圓心角 90 度，弧長＝kπ，求 k。',
        answer: '6',
        bankRef: { id: 343, note: '答案：6（弧長＝6π）' },
      },
      hint: {
        speaker: 'NumNum',
        text: '弧長佔圓周的比例，等於圓心角佔 360 度的比例。圓周＝2×半徑×π；求的是 π 前面的係數。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「先確認圓心角是整圓的幾分之幾，再乘 2πr。問的是 k，不是整段帶 π 的式子。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '弧長的 k 寫上木牌。阿基米德擦擦手：「圓在平面上夠了。我更在意——立體模型的側面，展開後怎麼對回底面。」',
        },
        {
          speaker: 'Numi',
          text: '「角是整圓幾分之幾，弧就佔圓周同樣幾分——k 才讀得出來。」',
          whenStory: { arc_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「比例乘圓周，再讀 π 前面的係數——弧長才乾淨。」',
          whenStory: { arc_method: 'numnum' },
        },
        {
          speaker: 'Numi',
          text: '「展開圖！立體！這聽起來像甜點包裝紙——我是說，像很重要的 Eureka 前兆！」',
        },
      ],
    },

    // ——— 關卡四：圓錐側面展開（Eureka；對齊題庫立體／扇形展開） ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E6_CONE',
      lines: [
        {
          speaker: 'narrator',
          text: '桌上多了一個木製直圓錐。阿基米德把它的側面沿著一條母線剪開，攤成沙盤上的扇形——扇形半徑就是母線長。',
        },
        {
          speaker: '阿基米德',
          text: '「展開後，扇形的弧要能對回底面那一圈。母線 15 寸、圓心角 216 度——底面半徑是多少？」',
        },
        {
          speaker: '姐姐',
          text: '「先想清楚展開時『哪條線對哪條線』，再動手算。」',
        },
        {
          speaker: 'narrator',
          text: '（他隨口提過球與柱的體積也曾讓他著迷——但那不在今天要驗算的沙盤上。）',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'CHECKPOINT_E6_CONE_PROBLEM',
      scene: '關卡四・圓錐展開',
      question: {
        stem:
          '一直圓錐的側面展開圖是半徑 15 寸、圓心角 216 度的扇形。求此圓錐的底面圓半徑（寸）。',
        bankRef: {
          id: 346,
          note: '仿題庫：扇形展開求圓錐底半徑；(216/360)×2π×15＝2πr → r＝9。',
        },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '選擇處理圓錐展開的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：弧邊貼回圓】(靈感 −1)',
          detail: '想像把扇形的弧重新捲成底面那一圈。',
          kind: 'insight',
          story: { cone_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「扇形外面那條弧，捲起來就是底面圓周！弧多長，底面圓就多長。」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的步驟：弧長對底周】',
          detail: '展開後，扇形弧長對應底面圓周，再求底半徑。',
          kind: 'solve',
          story: { cone_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「弧長要對上底面周長。用圓心角比例算出弧長後，就能回推底半徑。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4_link',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E6_CONE_LINK',
      scene: '關卡四・圓錐展開',
      setup: [{ speaker: 'SYS', text: '第一步：選出展開時正確的對應關係。' }],
      question: {
        answerType: 'choice',
        stem: '直圓錐側面展開成扇形時，下列哪一項對應正確？',
        answer: 'B',
        options: [
          { letter: 'A', text: '扇形面積＝底面圓面積' },
          { letter: 'B', text: '扇形弧長＝底面圓周長' },
          { letter: 'C', text: '扇形圓心角＝底面圓心角' },
          { letter: 'D', text: '扇形半徑＝底面圓半徑' },
        ],
        bankRef: { id: 346, note: '正確：B＝弧長對應底周' },
      },
      hint: {
        speaker: 'NumNum',
        text: '展開時，母線變成扇形半徑；底面那一圈圓周，對應扇形最外面的弧。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「別把面積或角度直接劃等號。捲回去時，是『弧』對上『底面圓周』。」',
      },
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E6_CONE_QUIZ',
      scene: '關卡四・圓錐展開',
      setup: [
        {
          speaker: 'SYS',
          text: '對應確認：弧長＝底面周長。第二步：母線 15 寸、圓心角 216 度，求底面半徑（寸）。',
        },
      ],
      question: {
        answerType: 'number',
        stem:
          '直圓錐側面展開為半徑 15 寸、圓心角 216 度的扇形，求底面圓半徑（寸）。',
        answer: '9',
        bankRef: { id: 346, note: '答案：9' },
      },
      hint: {
        speaker: 'NumNum',
        text: '用圓心角比例算出扇形弧長，再令它等於底面周長，回推半徑。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「弧長用圓心角比例去算，再對上底面周長。別把母線直接當成底半徑。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E6_CONE_OUTRO',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: 'narrator',
          text: '扇形弧長與底面圓周對上的瞬間，書房裡掠過一道很淡的暖黃光——不夠刺眼，卻很清楚。',
        },
        {
          speaker: 'Numi',
          text: '「扇形外弧捲回去——就是底面那一圈！對上了才發亮。」',
          whenStory: { cone_method: 'numi' },
        },
        {
          speaker: '姐姐',
          text: '「弧長對底周，再回推半徑——展開與立體才是同一件事。」',
          whenStory: { cone_method: 'numnum' },
        },
        {
          speaker: '阿基米德',
          text: '「……展開與立體，是同一件事的兩面。我想把這種對應留給以後所有做模型的人。」',
        },
        {
          speaker: 'Numi',
          text: '「Eureka 甜點味！可是好淡——像暮年的糖霜！」',
        },
        {
          speaker: 'NumNum',
          text: '「收斂一點。還有平面上的扇形面積沒算完。」',
        },
        {
          speaker: 'SYS',
          text: '★ 圓錐展開對應頓悟！獲得【Eureka 幣 × 1】！',
        },
      ],
    },

    // ——— 關卡五：扇形 ———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E7_SECTOR',
      lines: [
        {
          speaker: 'narrator',
          text: '阿基米德又畫出半徑 6 寸、圓心角 60 度的扇形，像從圓上切下一片薄餅。',
        },
        {
          speaker: '阿基米德',
          text: '「扇形面積佔圓面積的比例，同樣等於圓心角佔整圓的比例。答案寫成 kπ，我要那個 k。」',
        },
        {
          speaker: '弟弟',
          text: '「圓面積是 π 乘半徑平方；扇形再乘角度比例就好……對嗎？」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'CHECKPOINT_E7_SECTOR_PROBLEM',
      scene: '關卡五・扇形面積',
      question: {
        stem:
          '扇形半徑為 6，圓心角為 60 度。面積寫成 kπ，求 k。',
        bankRef: {
          id: 348,
          note: '仿題庫扇形面積比例骨架；本題 (60/360)×π×36＝6π → k＝6。',
        },
      },
    },
    {
      id: 'branch_act5',
      type: 'branch',
      prompt: '選擇求扇形面積的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：切圓的幾分之幾】(靈感 −1)',
          detail: '先看扇形是整圓的幾分之幾。',
          kind: 'insight',
          story: { sector_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「角是整圓的幾分之幾，面積就是圓面積的同樣幾分之幾！最後看 π 前面的數字。」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的公式：比例×圓面積】',
          detail: '用圓心角比例乘上 πr²，再讀出 k。',
          kind: 'solve',
          story: { sector_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「扇形面積＝（圓心角／360）×πr²。化成 kπ 後，k 就是係數。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E7_SECTOR_QUIZ',
      scene: '關卡五・扇形面積',
      setup: [{ speaker: 'SYS', text: '請輸入 k（面積＝kπ）：' }],
      question: {
        answerType: 'number',
        stem: '扇形半徑 6、圓心角 60 度，面積＝kπ，求 k。',
        answer: '6',
        bankRef: { id: 348, note: '答案：6' },
      },
      hint: {
        speaker: 'NumNum',
        text: '扇形佔圓面積的比例，等於圓心角佔 360 度的比例。圓面積＝π×半徑×半徑。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「先算圓面積裡 π 前面的數，再乘角度比例。問的是 k，不是整段帶 π 的式子。」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '扇形的 k 寫進沙盤邊緣。書房暫時只剩沙沙的刮痕聲——以及越來越近的門外腳步。',
        },
        {
          speaker: '弟弟',
          text: '「扇形是圓的幾分之幾——面積的 k 就跟著出來。」',
          whenStory: { sector_method: 'numi' },
        },
        {
          speaker: '姐姐',
          text: '「角度比例乘圓面積——扇形才寫得進沙盤。」',
          whenStory: { sector_method: 'numnum' },
        },
        {
          speaker: '阿基米德',
          text: '「數字齊了。證明要怎麼留下——公開刻死，還是先傳給學徒——你們得幫我選。」',
        },
      ],
    },

    // ——— 名句節拍 ———
    {
      id: 'noli_circulos',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E8_CIRCLES',
      lines: [
        {
          speaker: 'narrator',
          text: 'Numi 興奮地繞過桌子，腳尖已經抬到沙盤邊緣——再一寸就要踩進弧線裡。',
        },
        {
          speaker: 'NumNum',
          text: '「Numi——！」',
        },
        {
          speaker: 'narrator',
          text: '同一瞬間，窗外掠過一個模糊人影，甲冑反光一閃又沒入巷子。城外的撞擊聲更近了。',
        },
        {
          speaker: '阿基米德',
          text: '（終於抬起頭，聲音不大，卻很硬）「不要碰我的圓。」',
        },
        {
          speaker: 'Numi',
          text: '（腳急剎，差點摔坐）「我、我只是想看螺旋有沒有躲在圓裡面……！」',
        },
        {
          speaker: '弟弟',
          text: '「外面好像……不太妙。可是這些圓，真的好重要。」',
        },
        {
          speaker: '姐姐',
          text: '「證明還在沙上。現在決定怎麼保全它——比決定誰先逃跑更急。」',
        },
        {
          speaker: 'narrator',
          text: '沙盤安然無恙。人影沒有推門進來。戰爭仍在遠處，圓仍在桌上。',
        },
      ],
    },

    // ——— 哲學 ———
    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt:
        '亂世書房。圓錐展開與扇形都已寫下。阿基米德問你們：這些證明，要以什麼方式留下？',
      note: '重大哲學抉擇：決定本章結局。',
      lines: [
        {
          speaker: '姐姐',
          text: '「寫進公共檔案，刻進幾何傳統。真理要公開，才禁得起時間——即使城會亂。」',
        },
        {
          speaker: '弟弟',
          text: '「先縮短成學徒背得下的版本，藏一份副本。人要先活著，火種才能傳下去。」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '把證明寫入公共檔案與幾何傳統。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '阿基米德',
              text: '「……那就寫死。圓不認情面，檔案也不該認。」',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '縮短證明教給學徒，並藏起副本。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '阿基米德',
              text: '「……那就先教人。沙盤會被踩亂，嘴巴記得的，還能再畫一次。」',
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
        { speaker: 'SYS', text: '章節結束 — 結局一：【圓上的永恆刻痕】' },
        {
          speaker: 'narrator',
          text: '證明被謄進城邦能保存的冊頁：弦、角、弧、圓錐展開與扇形。沙盤可以掃掉，式子卻留在公共傳統裡。',
        },
        {
          speaker: 'NumNum',
          text: '「人會走。圓的性質——只要還有人讀——就還在。」',
        },
        {
          speaker: 'narrator',
          text: '冊頁送進公共檔案庫，門口掛「不得塗改」。學徒只能抄，不准縮寫；他說縮寫會把嚴格性磨掉。',
        },
        {
          speaker: '姐姐',
          text: '「真理要公開，才禁得起時間。哪怕外面已經亂了。」',
        },
        {
          speaker: 'narrator',
          text: '窗外的喧囂遠了一點，又近了一點。阿基米德只看著冊頁上的圓：這就夠了。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【圓上的永恆刻痕】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【沙盤傳承】' },
        {
          speaker: 'narrator',
          text: '他把圓錐展開的對應縮成學徒背得下的幾句，又另抄一份藏進瓦罐。沙盤邊，有人反覆練習「不要碰我的圓」之前的那幾步。',
        },
        {
          speaker: 'Numi',
          text: '「這樣就算沙被踩亂，也還能再畫一次對不對！」',
        },
        {
          speaker: 'narrator',
          text: '學徒把口訣帶走；瓦罐埋在牆腳。完整冊頁暫不公開——先讓火種離得開這間書房。',
        },
        {
          speaker: '弟弟',
          text: '「人要先活著。圓，可以再畫。」',
        },
        {
          speaker: 'narrator',
          text: '遠處仍有戰火的氣味。書房裡卻多了一條溫一點的路：理性，可以跟著人走。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【沙盤傳承】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
}
