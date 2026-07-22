/**
 * 第二章：阿基米德・壯年篇
 * 結構：終端重連 ➜ 城牆投石（畢氏）➜ 起重機槓桿 Eureka（乘法公式）
 *       ➜ 齒輪傳動（多項式）➜ 測距校準（根式／畢氏）➜ 決戰參數 ➜ 哲學雙結局
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
  subtitle: '終端重連 ➜ 投石測距 ➜ 起重 Eureka ➜ 齒輪校準 ➜ 鏡距 ➜ 防衛抉擇',
  nextChapterId: 'ARCHIMEDES_ELDER',
  rewards: {},
  eurekaMax: 3,
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
          text: '（抬起頭，認出你們）……又是你們。',
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
          text: '羅馬人要攻城。國王要投石機、起重爪。你們若還肯幫忙——先從城牆這台投石機開始。',
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
          text: '水平六丈、高差八丈。繩索與彈道要走的，是這兩段構成的斜邊——量錯一寸，石頭就砸進自家碼頭。',
        },
        {
          speaker: 'NumNum',
          text: '「直角與兩股已經確定。斜邊的必然長度，算出來就知道。」',
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
        bankRef: { id: null, note: '畢氏定理基本應用。' },
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
              text: '「6 跟 8……這不就是把熟悉的 3、4、5 放大兩倍嗎？斜邊一定也是整數！」',
            },
            {
              speaker: '弟弟',
              text: '「對耶！3、4、5 的兩倍！拉直繩子來驗證看看！」',
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
              text: '「兩股平方求和再開根號。精準的數據，不需要靠運氣。」',
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
        bankRef: { id: null, note: '答案：10' },
      },
      analysis: {
        speaker: 'NumNum',
        text: '「6²＋8²＝100，√100＝10。斜距正確，第一輪試射才能對準外港浮標。」',
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
          speaker: '阿基米德',
          text: '斜邊對了。下一步：海港邊的起重爪。巨船靠近時，要能把它掀翻——那需要力臂，不是蠻力。',
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
          text: '配重箱底面的長為 (x+2) 寸、寬為 (x+5) 寸。先把長寬相乘展開，再帶入今天測好的刻度 x，配重才不會出錯！',
        },
        {
          speaker: '姐姐',
          text: '「長與寬都有未知數 x，把它們完全展開成多項式，代入數字就能算出總面積了。」',
        },
        {
          speaker: '阿基米德',
          text: '（低聲）給我夠長的力臂，再重的船也能被撬起……但前提是，數字不能飄。',
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
        bankRef: { id: null, note: '先選展開式，再代入 x＝3。' },
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
              text: '「把大長方形畫成四塊！一塊是 x 的正方形、兩塊長形、還有一塊 2 乘 5 的小角角，分開算再加起來就好啦！」',
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
              text: '「照公式將多項式完全展開，整理出一次項與常數項，再把刻度 x 代進去。」',
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
        bankRef: { id: null, note: '正確：B＝x²＋7x＋10' },
      },
      analysis: {
        speaker: 'NumNum',
        text: '「(x+2)(x+5)＝x²＋5x＋2x＋10＝x²＋7x＋10。一次項 7x 不能漏。」',
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
        bankRef: { id: null, note: '答案：40' },
      },
      analysis: {
        speaker: '姐姐',
        text: '「x＝3 時：9＋21＋10＝40。配重箱底板面積正確，長臂才能壓得住短臂勾住的船舷。」',
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
          speaker: '阿基米德',
          text: '（眼睛驟亮）……我懂了。力與距離在說話：短臂承重，長臂只需較小的力。給我支點與夠長的臂，我就能撬動這艘船——甚至，撬動我以為撬不動的東西。',
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
          text: '爪臂能掀船。但齒盤傳動還在抖——工坊那邊，齒輪比沒對上。',
        },
      ],
    },

    // ——— 幕三：齒輪／繩索（多項式） ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P4_GEAR',
      lines: [
        {
          speaker: 'narrator',
          text: '工坊內，傳動齒盤咬合時發出刺耳聲。師傅在板上寫著：大輪齒數 2x＋4，小輪齒數 x＋2，卻說「運轉起來老是卡住」。',
        },
        {
          speaker: '工匠',
          text: '「大輪與小輪分別設計成 (2x＋4) 與 (x＋2)。為了傳動平順，齒數比必須化成固定常數，不能跟著製造規格 x 亂飄。」',
        },
        {
          speaker: '阿基米德',
          text: '先化簡 (2x＋4)／(x＋2)。比值若是常數，再用小輪實齒去推大輪該做幾齒。',
        },
        {
          speaker: 'NumNum',
          text: '「分子提公因數約分。亂掉的齒數比，整理後就清楚了。」',
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
          '大輪齒數為 2x＋4，小輪為 x＋2。化簡 (2x＋4)/(x＋2)，求傳動比常數。',
        bankRef: { id: null, note: '上半：只化簡比值。' },
      },
    },
    {
      id: 'branch_act3',
      type: 'branch',
      prompt: '選擇處理齒數比的方式：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：看倍數關係】(靈感 −1)',
          detail: '觀察分子與分母數字的關係。',
          kind: 'insight',
          story: { gear_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「你看！大輪的 2x＋4，數字剛好都是小輪 x＋2 的兩倍！所以不管 x 是多少，大輪齒數都是小輪的兩倍啦！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的整理：提公因式】',
          detail: '分子提公因式約分求固定比值。',
          kind: 'solve',
          story: { gear_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「先看分子能不能提出公因數，再跟分母對齊約分。」',
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
        stem: '(2x＋4)/(x＋2) 化簡後等於？',
        answer: 'B',
        options: [
          { letter: 'A', text: 'x＋2' },
          { letter: 'B', text: '2' },
          { letter: 'C', text: '2x' },
          { letter: 'D', text: '4' },
        ],
        bankRef: { id: null, note: '正確：B＝2' },
      },
      analysis: {
        speaker: 'NumNum',
        text: '「分子提 2：2(x＋2)/(x＋2)。約分後剩下 2——傳動比是固定常數。」',
      },
    },
    {
      id: 'problem_act3b',
      type: 'problem',
      checkpoint: 'CHECKPOINT_P4_GEAR_SCALE',
      scene: '關卡三・齒數比化簡',
      question: {
        stem: '傳動比已確定為 2。若小輪實際有 8 齒，求大輪應有幾齒。',
        bankRef: { id: null, note: '下半：用常數比推大輪齒數。' },
      },
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_P4_GEAR_QUIZ',
      scene: '關卡三・齒數比化簡',
      setup: [{ speaker: 'SYS', text: '請輸入大輪應製造的齒數：' }],
      question: {
        answerType: 'number',
        stem: '傳動比＝2，小輪 8 齒，大輪應有幾齒？',
        answer: '16',
        bankRef: { id: null, note: '答案：16' },
      },
      analysis: {
        speaker: '阿基米德',
        text: '「8×2＝16。小輪 8 齒、大輪 16 齒——咬合聲消了。傳動穩了，才能把力量送到爪尖。」',
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
          speaker: '阿基米德',
          text: '還差觀測。投石與爪臂都要知道：敵船離牆多遠。不能只靠喊「很近」。',
        },
        {
          speaker: '姐姐',
          text: '「測距——直角三角與根式。上牆，但別被箭射到。」',
        },
      ],
    },

    // ——— 幕四：測距（畢氏／根式） ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_P5_RANGE',
      lines: [
        {
          speaker: 'narrator',
          text: '城牆觀測台。你們量得：從牆根到敵船投影的水平距離 12 丈，船桅相對牆頂的高差 5 丈。視線斜距決定投石提前量。',
        },
        {
          speaker: '阿基米德',
          text: '水平 12 與高差 5。要把這兩段的平方加起來再開根號，算出真正的斜線距離！算錯，石頭會落在空水面上。',
        },
        {
          speaker: '弟弟',
          text: '「12 跟 5……這也是一組很有名的直角三角形組合，算算看！」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'CHECKPOINT_P5_RANGE_PROBLEM',
      scene: '關卡四・敵船斜距',
      question: {
        stem:
          '水平距離 12 丈、高差 5 丈，求觀測斜距 c（丈）。',
        bankRef: { id: null, note: '畢氏／根式。' },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '選擇取得斜距的方式：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：直角邊長聯想】(靈感 −1)',
          detail: '回想常見的直角三角形整數邊長。',
          kind: 'insight',
          story: { range_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「5 跟 12！我知道這組！平方加起來開根號後也會是很漂亮的整數！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的計算：開根號】',
          detail: '用畢氏定理：兩股平方和再開根號。',
          kind: 'solve',
          story: { range_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「兩股各自平方後相加，再開根號，就是斜距。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_P5_RANGE_QUIZ',
      scene: '關卡四・敵船斜距',
      setup: [{ speaker: 'SYS', text: '請輸入斜距 c（丈）：' }],
      question: {
        answerType: 'number',
        stem: '水平 12 丈、高差 5 丈，求直角三角形斜邊 c（丈）。',
        answer: '13',
        bankRef: { id: null, note: '答案：13' },
      },
      analysis: {
        speaker: 'NumNum',
        text: '「144＋25＝169，√169＝13。提前量可以寫進投石表了。」',
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
          speaker: '阿基米德',
          text: '最後一步：把兩段備用繩的根式長度加總，寫成決戰校準參數。明天——不，今夜——國王要看公開試射。',
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
          text: '數字齊了。但試射要給國王看什麼——最大殺傷，還是留一條能喊停的生路——那是明天以前必須決定的事。',
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
        bankRef: { id: null, note: '根式化簡後係數相加。' },
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
          detail: '把 18 與 8 拆成含有平方數的乘積。',
          kind: 'insight',
          story: { calib_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「把 18 看成 9×2，把 8 看成 4×2！9 可以提出去變成 3，4 可以提出去變成 2，再把外面的數字加起來！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的化簡：根式整理】',
          detail: '化為最簡根式後合併同類項。',
          kind: 'solve',
          story: { calib_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「先各自化成最簡根式，再合併 √2 的同類項。」',
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
        bankRef: { id: null, note: '答案：5' },
      },
      analysis: {
        speaker: '姐姐',
        text: '「3√2＋2√2＝5√2，係數和為 5。校準牌刻好了——接下來是立場，不是算式。」',
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
          speaker: 'NumNum',
          text: '「機械已就緒。剩下的，是你們希望這座城用什麼方式活下去。」',
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
              text: '……讓數字在海面上自己說話。力臂與斜距，不容溫情修改。',
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
              text: '……先讓他們怕，再讓他們有路可退。機械可以守城，也可以留人。',
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
          text: '「參數沒有溫情。效率達到最大。」',
        },
        {
          speaker: '阿基米德',
          text: '他看著退去的帆影，卻把臉轉向沙地上的圓與直線：防衛只是暫時的；絕對的幾何，才值得一生。',
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
          speaker: '阿基米德',
          text: '他擦去校準牌上的最大殺傷欄，留下「守護」二字：數學既能撬船，也能護人——這想法，會跟著他走進更艱難的歲月。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【守護射程】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
};