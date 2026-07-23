/**
 * 第二章：阿基米德・壯年篇
 * 結構：終端重連 ➜ 城牆投石（畢氏求斜邊）➜ 起重機槓桿 Eureka（乘法公式）
 *       ➜ 齒輪傳動（因式分解約分）➜ 測距（畢氏求一股）➜ 決戰參數（根式）➜ 哲學雙結局
 * Eureka 幣：
 *  1. 幕二起重機槓桿頓悟 (+1)
 *  2. 結局一 (+1)
 *  3. 結局二 (+1)
 * 開場態度依 progress.lastEndingId.ARCHIMEDES_YOUTH（youth_ending）
 */

export const archimedesPrime = {
  id: 'ARCHIMEDES_PRIME',
  mathematicianId: 'ARCHIMEDES',
  era: 'PRIME',
  title: '阿基米德・壯年',
  subtitle: '終端重連 ➜ 投石測距 ➜ 起重 Eureka ➜ 齒輪化簡 ➜ 水平距 ➜ 防衛抉擇',
  nextChapterId: 'ARCHIMEDES_ELDER',
  rewards: {},
  eurekaMax: 3,
  knowledgeCard: {
    line: '本章練到：畢氏定理、乘法公式、因式分解、根式｜課綱：八上・平方根與畢氏／乘法公式；八下・因式分解',
  },
  endings: [
    {
      id: 'ending_cold',
      title: '鐵律防衛',
      description:
        '選擇公開最大殺傷參數，用絕對數據壓制敵軍。阿基米德更深地鑽進抽象幾何，防衛機器成為冷酷的證明。',
      hint: '在試射前夜，選擇重視冰冷邏輯與絕對效率的道路……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '守護射程',
      description:
        '選擇把參數校成可警告、可留生路的用法。數學不僅撬動巨石，更能守護城邦裡的人。',
      hint: '在試射前夜，選擇重視人文同理的道路……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    // ——— 開場：多年後重連 ———
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P1_LINK',
      lines: [
        {
          speaker: 'SYS',
          text: '數感終端機_版本1.0.4 … 目標年代：西元前 214 年・敘拉古城牆',
        },
        {
          speaker: '姐姐',
          text: '「座標跳到壯年了。羅馬艦隊已經壓在外港——這次不是浴室，是戰場。」',
        },
        {
          speaker: '弟弟',
          text: '「阿基米德還好嗎？上次分開之後……好多年了吧？」',
        },
        {
          speaker: 'Numi',
          text: '「城牆上有新的螺旋！巨大的木頭手臂在轉——衝啊！」',
        },
        {
          speaker: 'NumNum',
          text: '「Numi 抓穩。防衛機械的力臂與齒數，容不得一點紊亂。」',
        },
        {
          speaker: 'SYS',
          text: '時空鎖定……藍紫轉為海風與焦油氣味，傳送開始！',
        },
      ],
    },

    {
      id: 'meet_again',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P1_WALL',
      lines: [
        {
          speaker: 'narrator',
          text: '光芒散去。敘拉古城牆外，海面佈滿敵船的黑點；城內木架與繩索像一座會呼吸的骨架。',
        },
        {
          speaker: '阿基米德',
          text: '（抬起頭，認出你們）「……又是你們。」',
        },
        {
          speaker: '阿基米德',
          text: '「多虧你們當年溫暖的提醒，金匠一家現在過得很好。否則我大概還會以為——數字只能用來審判。」',
          whenStory: { youth_ending: 'ending_warm' },
        },
        {
          speaker: '阿基米德',
          text: '「自從當年大殿上那精準的刻度 7 之後，我就明白：只有數據不會背叛人類。這座城，也只能靠數據守。」',
          whenStory: { youth_ending: 'ending_cold' },
        },
        {
          speaker: '阿基米德',
          text: '「羅馬人要攻城。國王要投石機、起重爪。你們若還肯幫忙——先從城牆這台投石機開始。」',
        },
        {
          speaker: '姐姐',
          text: '「投石、起重、齒輪……這次要把式子嵌進木頭與繩索裡，不能只寫在沙地上。」',
        },
      ],
    },

    // ——— 幕一：投石機斜距（畢氏） ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P2_CATAPULT',
      lines: [
        {
          speaker: 'narrator',
          text: '城垛邊，投石機的彈臂指向外港。士兵用步測報了水平距離與高差，卻怎麼也對不準落點。',
        },
        {
          speaker: '阿基米德',
          text: '「水平六丈、高差八丈。繩索與彈道要走的，是這兩段構成的斜邊——量錯一寸，石頭就砸進自家碼頭。」',
        },
        {
          speaker: 'NumNum',
          text: '「兩股定了，斜邊就定了。算出來。」',
        },
        {
          speaker: '弟弟',
          text: '「先算清楚再試射！亂丟會砸到漁船的！」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'CHECKPOINT_P2_CATAPULT_PROBLEM',
      scene: '關卡一・投石斜距',
      question: {
        stem:
          '投石機觀測：水平距離 6 丈、高差 8 丈，構成直角三角形。求彈道斜向距離（斜邊）為多少丈。',
        bankRef: {
          id: 849,
          note: '仿題庫畢氏兩股求斜邊骨架（#849 為 5、12→13；本題 6、8→10）。',
        },
      },
    },
    {
      id: 'branch_act1',
      type: 'branch',
      prompt: '選擇校正投石斜距的方式：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：比例對照】(靈感 −1)',
          detail: '聯想經典直角三角形的放大倍數。',
          kind: 'insight',
          story: { catapult_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「兩股看起來有沒有共同倍數？想想有沒有熟悉的直角三角形可以對照！」',
            },
            {
              speaker: '弟弟',
              text: '「對！別急著丟石頭，先把邊長對清楚！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的推導：畢氏計算】',
          detail: '計算兩股平方和再開根號。',
          kind: 'solve',
          story: { catapult_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「兩股各自平方後相加，再開根號。算準就好，別靠運氣。」',
            },
            {
              speaker: '姐姐',
              text: '「斜邊確定，射程才站得住。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_P2_CATAPULT_QUIZ',
      scene: '關卡一・投石斜距',
      setup: [{ speaker: 'SYS', text: '請輸入斜向距離 c（丈）：' }],
      question: {
        answerType: 'number',
        stem:
          '水平 6 丈、高差 8 丈，求直角三角形斜邊 c（丈）。',
        answer: '10',
        bankRef: { id: 849, note: '答案：10' },
      },
      hint: {
        speaker: 'NumNum',
        text: '畢氏定理：兩股各自平方後相加，再開根號，就是斜邊。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「兩股各自平方後相加，再開根號。別只加兩股，也別忘了開根號。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '石頭掠過海面，砸在標定浮標外側一丈處——誤差在允許範圍。士兵歡呼。',
        },
        {
          speaker: '弟弟',
          text: '「剛才用熟悉直角邊對照——斜距一下子就穩了。」',
          whenStory: { catapult_method: 'numi' },
        },
        {
          speaker: '姐姐',
          text: '「兩股平方相加再開根——斜邊才禁得起試射。」',
          whenStory: { catapult_method: 'numnum' },
        },
        {
          speaker: '阿基米德',
          text: '「斜邊對了。下一步：海港邊的起重爪。巨船靠近時，要能把它掀翻——那需要力臂，不是蠻力。」',
        },
        {
          speaker: 'Numi',
          text: '「巨大的木頭手臂！看起來比黃金螺旋還誇張！」',
        },
      ],
    },

    // ——— 幕二：起重機／槓桿 Eureka（乘法公式） ———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P3_CRANE',
      lines: [
        {
          speaker: 'narrator',
          text: '海港起重爪：短臂勾住船舷，長臂掛配重箱。工匠把配重箱的長、寬寫成「比基準多幾寸」的記號，卻算不清底板面積。',
        },
        {
          speaker: '阿基米德',
          text: '「配重箱底面的長為 (x+2) 寸、寬為 (x+5) 寸。先把長寬相乘展開，再帶入今天測好的刻度 x，配重才不會出錯！」',
        },
        {
          speaker: '姐姐',
          text: '「長與寬都有未知數 x，把它們完全展開成多項式，代入數字就能算出總面積了。」',
        },
        {
          speaker: '阿基米德',
          text: '（低聲）「給我夠長的力臂，再重的船也能被撬起……但前提是，數字不能飄。」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'CHECKPOINT_P3_CRANE_PROBLEM',
      scene: '關卡二・配重箱展開',
      question: {
        stem:
          '配重箱底面長 (x+2) 寸、寬 (x+5) 寸。先將面積展開為多項式；若今日取 x＝3，求底面積（平方寸）。',
        bankRef: {
          id: 736,
          note: '仿題庫乘法公式展開骨架；本題 (x+2)(x+5)→x²＋7x＋10，再代入。',
        },
      },
    },
    {
      id: 'branch_act2',
      type: 'branch',
      prompt: '選擇處理配重箱面積的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：圖解拆拆看】(靈感 −1)',
          detail: '想像把長方形切成四個小圖塊。',
          kind: 'insight',
          story: { crane_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「把大長方形拆成幾塊小圖：正方形、長條、小角角，分開算再加起來就好啦！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的展開：乘法公式】',
          detail: '用 (x+a)(x+b) 展開再代入 x。',
          kind: 'solve',
          story: { crane_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「照公式把括號全部打開，整理好之後，再把刻度 x 代進去。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2_expand',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_P3_CRANE_EXPAND',
      scene: '關卡二・配重箱展開',
      setup: [{ speaker: 'SYS', text: '第一步：選出正確的展開式。' }],
      question: {
        answerType: 'choice',
        stem: '面積＝(x+2)(x+5)。哪一個是正確的展開式？',
        answer: 'B',
        options: [
          { letter: 'A', text: 'x²＋10' },
          { letter: 'B', text: 'x²＋7x＋10' },
          { letter: 'C', text: 'x²＋7x' },
          { letter: 'D', text: 'x²＋2x＋5' },
        ],
        bankRef: { id: 736, note: '正確：B＝x²＋7x＋10' },
      },
      hint: {
        speaker: 'NumNum',
        text: '乘法公式：(x+a)(x+b)＝x²＋(a+b)x＋ab。中間那項別漏。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「用乘法公式打開：(x+a)(x+b)。中間那項是 (a+b)x，最容易漏。」',
      },
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_P3_CRANE_QUIZ',
      scene: '關卡二・配重箱展開',
      setup: [
        {
          speaker: 'SYS',
          text: '展開式確認：x²＋7x＋10。第二步：代入今日刻度 x＝3。',
        },
      ],
      question: {
        answerType: 'number',
        stem: '已知面積＝x²＋7x＋10。當 x＝3 時，底面積為多少平方寸？',
        answer: '40',
        bankRef: { id: 736, note: '答案：40' },
      },
      hint: {
        speaker: 'NumNum',
        text: '把已知的 x 代入多項式，算出數值。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「把 x＝3 代進展開式每一項，再加起來。代完檢查一次：每一項都有算到嗎？」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: 'narrator',
          text: '配重箱就位。短臂鐵爪扣住靶船模型——長臂緩緩下沉，模型船舷被掀離水面。',
        },
        {
          speaker: 'Numi',
          text: '「長方形拆成小圖塊再加——面積沒再飄了！」',
          whenStory: { crane_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「乘法公式展開後再代入——配重才不會算錯。」',
          whenStory: { crane_method: 'numnum' },
        },
        {
          speaker: '阿基米德',
          text: '（眼睛驟亮）「……我懂了。力與距離在說話：短臂承重，長臂只需較小的力。給我支點與夠長的臂，我就能撬動這艘船——甚至，撬動我以為撬不動的東西。」',
        },
        {
          speaker: 'SYS',
          text: '★ 觸發關鍵歷史頓悟：阿基米德領悟槓桿／力臂原理！獲得【Eureka 幣 × 1】！',
        },
        {
          speaker: 'Numi',
          text: '「好甜……第二道甜點來了！」',
        },
        {
          speaker: 'NumNum',
          text: '「這是他的領悟。我們只是把展開式排整齊。」',
        },
        {
          speaker: '阿基米德',
          text: '「爪臂能掀船。但齒盤傳動還在抖——工坊那邊，齒輪比沒對上。」',
        },
      ],
    },

    // ——— 幕三：齒輪（因式分解／約分） ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P4_GEAR',
      lines: [
        {
          speaker: 'narrator',
          text: '工坊內，傳動齒盤咬合時發出刺耳聲。師傅在板上寫著二次式：大輪齒數 2x²＋6x，小輪齒數 x²＋3x，卻說「怎麼約都約不乾淨」。',
        },
        {
          speaker: '工匠',
          text: '「規格 x 進到二次項了。為了傳動平順，齒數比必須化成固定常數，不能跟著 x 亂飄。」',
        },
        {
          speaker: '阿基米德',
          text: '「化簡 (2x²＋6x)／(x²＋3x)。若約得乾淨，咬合才穩。」',
        },
        {
          speaker: 'NumNum',
          text: '「分子、分母都先拆成因式，再找能對消的部分。」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'CHECKPOINT_P4_GEAR_PROBLEM',
      scene: '關卡三・齒數比化簡',
      question: {
        stem:
          '大輪齒數為 2x²＋6x，小輪為 x²＋3x。化簡 (2x²＋6x)/(x²＋3x)，求傳動比常數。（x≠0 且 x≠−3）',
        bankRef: {
          id: 886,
          note: '仿題庫提公因式骨架；本題 (2x²＋6x)/(x²＋3x) 約分為 2。',
        },
      },
    },
    {
      id: 'branch_act3',
      type: 'branch',
      prompt: '選擇處理齒數比的方式：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：兩邊拆開】(靈感 −1)',
          detail: '分子、分母各自拆成因式再對消。',
          kind: 'insight',
          story: { gear_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「分子分母都拆開！兩邊如果出現一樣的，就可以消掉，看最後剩什麼！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的整理：因式分解】',
          detail: '先拆成因式，再把相同的消掉。',
          kind: 'solve',
          story: { gear_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「先把分子跟分母都拆開，再把兩邊一樣的因式消掉。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3_simplify',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_P4_GEAR_SIMPLIFY',
      scene: '關卡三・齒數比化簡',
      setup: [{ speaker: 'SYS', text: '請選出化簡後的傳動比：' }],
      question: {
        answerType: 'choice',
        stem: '(2x²＋6x)/(x²＋3x) 化簡後等於？',
        answer: 'B',
        options: [
          { letter: 'A', text: '2x' },
          { letter: 'B', text: '2' },
          { letter: 'C', text: 'x＋3' },
          { letter: 'D', text: '2(x＋3)' },
        ],
        bankRef: { id: 886, note: '正確：B＝2' },
      },
      hint: {
        speaker: 'NumNum',
        text: '分子、分母先拆成因式，把相同的消掉，看最後剩什麼。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「分子、分母先拆成因式，把相同的消掉。若消得乾淨，應該會剩下一個常數。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '齒盤重新嚙合，起重爪的回收變得平順。城外敵船又靠近了一分。',
        },
        {
          speaker: 'Numi',
          text: '「分子分母拆開對消——傳動比終於不跟著 x 亂跳。」',
          whenStory: { gear_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「因式分解後約分——咬合才穩。」',
          whenStory: { gear_method: 'numnum' },
        },
        {
          speaker: '阿基米德',
          text: '「還差觀測。投石表要的是水平距離——斜視線與高差已知，水平邊還沒寫上。」',
        },
        {
          speaker: '姐姐',
          text: '「直角三角：已知斜邊與一股，求另一股。上牆，但別被箭射到。」',
        },
      ],
    },

    // ——— 幕四：測距（畢氏求一股） ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P5_RANGE',
      lines: [
        {
          speaker: 'narrator',
          text: '城牆觀測台。視線斜距已用測繩量得 13 丈，船桅相對牆頂的高差 5 丈。投石提前量要的是水平距離。',
        },
        {
          speaker: '阿基米德',
          text: '「斜邊 13、一股 5。另一股是水平距——平方關係反過來用，不能搞混。」',
        },
        {
          speaker: '弟弟',
          text: '「已知斜邊跟一股，求另一股！先想清楚哪一邊是斜邊。」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'CHECKPOINT_P5_RANGE_PROBLEM',
      scene: '關卡四・敵船水平距',
      question: {
        stem:
          '觀測斜距（斜邊）13 丈、高差 5 丈，求水平距離（另一股）為多少丈。',
        bankRef: {
          id: 849,
          note: '仿題庫 5-12-13 骨架；本題已知斜邊 13、一股 5，求另一股 12。',
        },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '選擇求水平距的方式：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：邊長對照】(靈感 −1)',
          detail: '回想常見的直角三角形整數邊長組合。',
          kind: 'insight',
          story: { range_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「斜邊跟一股都給了……有沒有熟悉的整數直角邊可以對照？」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的計算：畢氏反求】',
          detail: '由 a²＋b²＝c² 反求未知股。',
          kind: 'solve',
          story: { range_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「未知那一邊的平方＝斜邊平方減掉已知邊的平方，再開根號。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_P5_RANGE_QUIZ',
      scene: '關卡四・敵船水平距',
      setup: [{ speaker: 'SYS', text: '請輸入水平距離（丈）：' }],
      question: {
        answerType: 'number',
        stem: '直角三角形斜邊 13 丈、一股 5 丈，求另一股（丈）。',
        answer: '12',
        bankRef: { id: 849, note: '答案：12' },
      },
      hint: {
        speaker: 'NumNum',
        text: '未知邊²＝斜邊²−已知邊²，再開根號。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「未知邊的平方＝斜邊平方減掉已知邊的平方，再開根號。別減反了。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '觀測板更新。投石表與爪臂回收節拍對上同一套距離。',
        },
        {
          speaker: '弟弟',
          text: '「整數直角邊對照——水平距沒搞混斜邊。」',
          whenStory: { range_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「斜邊平方減一股再開根——水平邊才寫得進投石表。」',
          whenStory: { range_method: 'numnum' },
        },
        {
          speaker: '阿基米德',
          text: '「最後一步：把兩段備用繩的根式長度加總，寫成決戰校準參數。明天——不，今夜——國王要看公開試射。」',
        },
      ],
    },

    // ——— 幕五：決戰參數（根式） ———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P6_CALIB',
      lines: [
        {
          speaker: 'narrator',
          text: '夜。工坊燈火。兩段保險繩長度記為 √18 與 √8，需化簡後以「√2 的係數和」寫入校準牌。',
        },
        {
          speaker: '姐姐',
          text: '「√18 與 √8 裡面都藏著平方數。各自化簡成最簡根式再加起來，就能算出 √2 前面的總數字了。」',
        },
        {
          speaker: '阿基米德',
          text: '「數字齊了。但試射要給國王看什麼——最大殺傷，還是留一條能喊停的生路——那是明天以前必須決定的事。」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'CHECKPOINT_P6_CALIB_PROBLEM',
      scene: '關卡五・保險繩根式',
      question: {
        stem:
          '兩段繩長為 √18 與 √8。化簡後寫成 a√2 與 b√2，求係數和 a＋b。',
        bankRef: {
          id: 842,
          note: '仿題庫 √8、√18 根式骨架；本題化簡後係數和 a＋b＝5。',
        },
      },
    },
    {
      id: 'branch_act5',
      type: 'branch',
      prompt: '選擇整理根式的方式：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：拆數字】(靈感 −1)',
          detail: '把根號裡的數字拆成「平方數 × 剩下的」。',
          kind: 'insight',
          story: { calib_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「根號裡先拆出平方數、提出去！化成同樣的 √2 之後，再把前面的係數加起來！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的化簡：根式整理】',
          detail: '化成最簡根式後，把帶 √2 的項合在一起。',
          kind: 'solve',
          story: { calib_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「先各自化成最簡根式，再把帶 √2 的項合在一起。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_P6_CALIB_QUIZ',
      scene: '關卡五・保險繩根式',
      setup: [{ speaker: 'SYS', text: '請輸入係數和 a＋b：' }],
      question: {
        answerType: 'number',
        stem: '√18 與 √8 化簡成 a√2、b√2 後，求 a＋b。',
        answer: '5',
        bankRef: { id: 842, note: '答案：5' },
      },
      hint: {
        speaker: 'NumNum',
        text: '先各自化成最簡根式，再把 √2 前面的數字加起來。',
      },
      analysis: {
        speaker: '姐姐',
        text: '「先各自化成最簡根式，確認都是 √2 之後，再把前面的係數加起來。問的是係數和，不是整條根式。」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text: '校準牌釘上爪臂。城外火把連成線。國王的使者在門外等候「公開試射」的命令。',
        },
        {
          speaker: 'Numi',
          text: '「根號裡拆出平方數——√2 前面的數字終於加得齊。」',
          whenStory: { calib_method: 'numi' },
        },
        {
          speaker: '姐姐',
          text: '「化成最簡根式再合併——校準牌才寫得下去。」',
          whenStory: { calib_method: 'numnum' },
        },
        {
          speaker: 'NumNum',
          text: '「機器都好了。接下來——你們希望這座城怎麼活下去？」',
        },
      ],
    },

    // ——— 哲學抉擇 ———
    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt:
        '試射前夜。參數齊全。阿基米德問你們：明天要讓這套機械展示什麼？',
      note: '重大哲學抉擇：決定本章結局與智者性格。',
      lines: [
        {
          speaker: '姐姐',
          text: '「公開最大殺傷參數。讓敵軍看見絕對數據——真理與效率不容妥協，城才能活。」',
        },
        {
          speaker: '弟弟',
          text: '「把提前量改成警告彈與可勸降的射程。砸船可以，但先留一條讓人退走的生路。數學是用來守護的。」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '公開最大殺傷參數，以數據壓制敵軍。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '阿基米德',
              text: '「……讓數字在海面上自己說話。力臂與斜距，不容溫情修改。」',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '校準警告射程，先逼退、再求少殺傷。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '阿基米德',
              text: '「……先讓他們怕，再讓他們有路可退。機械可以守城，也可以留人。」',
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
        { speaker: 'SYS', text: '章節結束 — 結局一：【鐵律防衛】' },
        {
          speaker: 'narrator',
          text: '公開試射。投石依表落下，起重爪掀翻靶船。海面一陣死寂——敵艦緩緩後退。',
        },
        {
          speaker: 'NumNum',
          text: '「數字不講情面。這次打得又準又狠。」',
        },
        {
          speaker: 'narrator',
          text: '城牆上釘起「最大殺傷」校準表：水平距、斜距、爪臂節拍一律公開。漁船也暫時不准靠近外港。',
        },
        {
          speaker: '姐姐',
          text: '「敵軍看見的是絕對數據。這座城，至少今夜不會被談判拖垮。」',
        },
        {
          speaker: 'narrator',
          text: '阿基米德看著退走的帆影，卻把臉轉向沙地上的圓與直線：守城只是暫時的；幾何，才值得他花一輩子。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【鐵律防衛】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【守護射程】' },
        {
          speaker: 'narrator',
          text: '試射改為警告落點：石頭砸在船首前方空水，爪臂只掀翻無人靶船。敵艦在喊話後撤離至射程外。',
        },
        {
          speaker: 'Numi',
          text: '「他們跑了！而且……好像沒死很多人！」',
        },
        {
          speaker: 'narrator',
          text: '校準牌改釘「警告距／勸退距」兩欄；外港重新放行小漁船，士兵記住：先喊停，再動手。',
        },
        {
          speaker: '弟弟',
          text: '「機械還在。只是射程表多留了一格給人。」',
        },
        {
          speaker: 'narrator',
          text: '阿基米德擦掉校準牌上的「最大殺傷」，留下「守護」兩字：數學既能掀船，也能護人——這個想法，會陪他走更難的日子。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【守護射程】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
};