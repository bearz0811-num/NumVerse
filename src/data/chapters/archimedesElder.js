/**
 * 第三章：阿基米德・暮年篇
 * 結構：終端連線 ➜ 承接壯年態度 ➜ 弦心距 ➜ 圓心角 ➜ 弧長
 *       ➜ 球與柱 Eureka ➜ 扇形 ➜「不要碰我的圓」➜ 哲學雙結局
 * Eureka 幣：
 *  1. 幕四球與柱頓悟 (+1)
 *  2. 結局一 (+1)
 *  3. 結局二 (+1)
 * 開場態度依 progress.lastEndingId.ARCHIMEDES_PRIME（prime_ending）
 * 敘事鎖定：名句＝沙盤被干擾（Numi＋遠處人影）；不寫被殺主線
 */

export const archimedesElder = {
  id: 'ARCHIMEDES_ELDER',
  mathematicianId: 'ARCHIMEDES',
  era: 'ELDER',
  title: '阿基米德・暮年',
  subtitle: '終端暮年 ➜ 沙盤弦距 ➜ 圓心角 ➜ 弧長 ➜ 球柱 Eureka ➜ 扇形 ➜ 不要碰我的圓',
  nextChapterId: null,
  rewards: {},
  eurekaMax: 3,
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
          text: '「弦、圓心角、弧、球與柱……這次要把性質寫清楚，不能只憑感覺。」',
        },
      ],
    },

    // ——— 關卡一：弦心距 ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E3_CHORD',
      lines: [
        {
          speaker: 'narrator',
          text: '沙盤上一個圓，半徑已量成 13 寸；弦畫在圓內，長度 10 寸。阿基米德要知道圓心到這條弦的垂直距離。',
        },
        {
          speaker: '阿基米德',
          text: '「從圓心垂到弦，會把弦切成兩半。半弦、半徑、這段距離——組成一個直角三角形。」',
        },
        {
          speaker: 'NumNum',
          text: '「垂徑定理：垂直平分弦。半弦長先求出來，再和半徑配。」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'CHECKPOINT_E3_CHORD_PROBLEM',
      scene: '關卡一・沙盤弦距',
      question: {
        stem:
          '圓的半徑為 13 寸，弦長為 10 寸。從圓心作弦的垂線，求圓心到弦的距離（寸）。',
        bankRef: { id: null, note: '垂徑定理＋畢氏：半弦 5，d＝√(13²−5²)＝12。' },
      },
    },
    {
      id: 'branch_act1',
      type: 'branch',
      prompt: '選擇求弦心距的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：對折弦】(靈感 −1)',
          detail: '先把弦對折成兩半，再想像直角三角形。',
          kind: 'insight',
          story: { chord_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「弦對折！半邊長知道了，再跟半徑組成直角三角形，缺的那一股就是距離！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的步驟：垂徑＋畢氏】',
          detail: '垂線平分弦，再用畢氏定理求另一股。',
          kind: 'solve',
          story: { chord_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「垂線平分弦。半弦與半徑已知，用畢氏求弦心距。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E3_CHORD_QUIZ',
      scene: '關卡一・沙盤弦距',
      setup: [{ speaker: 'SYS', text: '請輸入圓心到弦的距離（寸）：' }],
      question: {
        answerType: 'number',
        stem:
          '圓半徑 13 寸、弦長 10 寸，求圓心到弦的距離（寸）。',
        answer: '12',
        bankRef: { id: null, note: '答案：12' },
      },
      hint: {
        speaker: 'NumNum',
        text: '垂線會平分弦。半弦長、半徑、弦心距組成直角三角形，缺的那一股用畢氏求。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「先求半弦長，再和半徑配成直角三角形。別把整段弦長直接當直角邊。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '阿基米德在沙上點出垂足，距離與計算吻合。燭火晃了一下。',
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
        bankRef: { id: null, note: '360÷6＝60。' },
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
        bankRef: { id: null, note: '答案：60' },
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
          speaker: '姐姐',
          text: '「接下來若知道半徑與圓心角，就能估一段弧有多長。」',
        },
      ],
    },

    // ——— 關卡三：弧長 ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E5_ARC',
      lines: [
        {
          speaker: 'narrator',
          text: '沙盤旁的木牌寫著：「圓周率暫以 3 計」。阿基米德指著半徑 8 寸、圓心角 90 度的那一段弧。',
        },
        {
          speaker: '阿基米德',
          text: '「弧長佔整圓周的比例，等於圓心角佔整圓的比例。先求比例，再乘圓周。」',
        },
        {
          speaker: 'NumNum',
          text: '「圓周＝直徑×圓周率。這題圓周率已指定，照牌上的數來算。」',
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
          '圓的半徑為 8 寸，某弧的圓心角為 90 度。圓周率以 3 計算，求該弧長（寸）。',
        bankRef: { id: null, note: '弧長＝(90/360)×2×3×8＝12。' },
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
              text: '「角是整圓的幾分之幾，弧就是圓周的同樣幾分之幾！圓周用半徑與圓周率算。」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的公式：比例×圓周】',
          detail: '用圓心角比例乘上整圓周長。',
          kind: 'solve',
          story: { arc_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「弧長＝（圓心角／360）×圓周。圓周＝2×半徑×圓周率。」',
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
      setup: [{ speaker: 'SYS', text: '圓周率以 3 計。請輸入弧長（寸）：' }],
      question: {
        answerType: 'number',
        stem:
          '半徑 8 寸、圓心角 90 度，圓周率以 3 計算，求弧長（寸）。',
        answer: '12',
        bankRef: { id: null, note: '答案：12' },
      },
      hint: {
        speaker: 'NumNum',
        text: '弧長佔圓周的比例，等於圓心角佔 360 度的比例。圓周＝2×半徑×圓周率。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「先確認圓心角是整圓的幾分之幾，再乘圓周。圓周率用題目指定的值，別自己換成別的。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '弧長寫上木牌。阿基米德擦擦手：「圓在平面上夠了。我更在意——球，能裝進多大的圓柱裡。」',
        },
        {
          speaker: 'Numi',
          text: '「球！圓柱！這聽起來像甜點疊疊樂——我是說，像很重要的 Eureka 前兆！」',
        },
      ],
    },

    // ——— 關卡四：球與柱（Eureka） ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E6_SPHERE',
      lines: [
        {
          speaker: 'narrator',
          text: '桌上放著一個木製圓柱模型，高度恰好等於底面直徑；旁白還有一顆能剛好塞進柱內的球。',
        },
        {
          speaker: '阿基米德',
          text: '「外切圓柱——球貼住上下底與側面。我確信：球的體積，是這個圓柱體積的固定比例。」',
        },
        {
          speaker: '姐姐',
          text: '「先確定比例對不對，再把圓柱的體積換成球的體積。」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'CHECKPOINT_E6_SPHERE_PROBLEM',
      scene: '關卡四・球與柱',
      question: {
        stem:
          '球與其外切圓柱（高＝球的直徑）體積成固定比。先選出正確比例；若圓柱體積為 45，求球的體積。',
        bankRef: { id: null, note: '球：柱＝2:3；柱 45 → 球 30。' },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '選擇處理球與柱的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：誰裝得比較滿】(靈感 −1)',
          detail: '想像柱裡的空間，球會留下上下一圈空隙。',
          kind: 'insight',
          story: { sphere_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「球塞進柱子會留下空隙，所以球比較『瘦』一點——比例不是一半一半那麼隨便猜，要對公式！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的步驟：先比例、再乘】',
          detail: '先確認球佔柱的幾分之幾，再乘圓柱體積。',
          kind: 'solve',
          story: { sphere_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「外切時球體積是圓柱的三分之二。先鎖定比例，再代入圓柱體積。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4_ratio',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E6_SPHERE_RATIO',
      scene: '關卡四・球與柱',
      setup: [{ speaker: 'SYS', text: '第一步：選出球體積：圓柱體積的正確比。' }],
      question: {
        answerType: 'choice',
        stem:
          '球與其外切圓柱（高＝球的直徑）的體積比（球：柱）為？',
        answer: 'B',
        options: [
          { letter: 'A', text: '1：2' },
          { letter: 'B', text: '2：3' },
          { letter: 'C', text: '3：4' },
          { letter: 'D', text: '1：3' },
        ],
        bankRef: { id: null, note: '正確：B＝2：3' },
      },
      hint: {
        speaker: 'NumNum',
        text: '外切圓柱的高等於球的直徑。球體積對這個圓柱體積，是一個固定的簡單比。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「別用『看起來半滿』去猜。外切時球與柱有固定比，對一下選項裡哪一個是課綱會記的那個。」',
      },
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_E6_SPHERE_QUIZ',
      scene: '關卡四・球與柱',
      setup: [
        {
          speaker: 'SYS',
          text: '比例確認：球：柱＝2：3。第二步：圓柱體積為 45，求球的體積。',
        },
      ],
      question: {
        answerType: 'number',
        stem: '球：柱＝2：3。圓柱體積為 45，求球的體積。',
        answer: '30',
        bankRef: { id: null, note: '答案：30' },
      },
      hint: {
        speaker: 'NumNum',
        text: '球是柱的三分之二。用圓柱體積乘上這個比例。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「球佔柱的三分之二。用乘法求球，別把 2 和 3 加減錯邊。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_E6_SPHERE_OUTRO',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: 'narrator',
          text: '木球與圓柱並置。比例對上的瞬間，書房裡像有一道很淡的暖黃光掠過沙盤——不夠刺眼，卻很清楚。',
        },
        {
          speaker: '阿基米德',
          text: '「……就是這個。球是柱的三分之二。我想把這件事留給以後所有畫圓的人。」',
        },
        {
          speaker: 'Numi',
          text: '「Eureka 甜點味！可是好淡——像暮年的糖霜！」',
        },
        {
          speaker: 'NumNum',
          text: '「收斂一點。還有扇形沒算完。」',
        },
        {
          speaker: 'SYS',
          text: '★ 球與柱關係頓悟！獲得【Eureka 幣 × 1】！',
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
        bankRef: { id: null, note: 'k＝(60/360)×36＝6。' },
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
        bankRef: { id: null, note: '答案：6' },
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
        '亂世書房。球與柱的比例已寫下。阿基米德問你們：這些證明，要以什麼方式留下？',
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
          text: '證明被謄進城邦能保存的冊頁：弦、角、弧、球與柱。沙盤可以掃掉，式子卻留在公共傳統裡。',
        },
        {
          speaker: 'NumNum',
          text: '「人會走。圓的性質——只要還有人讀——就還在。」',
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
          text: '他把球與柱的比例縮成學徒背得下的幾句，又另抄一份藏進瓦罐。沙盤邊，有人反覆練習「不要碰我的圓」之前的那幾步。',
        },
        {
          speaker: 'Numi',
          text: '「這樣就算沙被踩亂，也還能再畫一次對不對！」',
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
