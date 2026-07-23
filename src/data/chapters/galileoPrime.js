/**
 * 伽利略・壯年篇
 * 結構：終端重連（青年結局回聲）➜ 刻痕和積 ➜ 漏壺反推 ➜ s∝t² Eureka
 *       ➜ 實驗簿累積（鋪對手）➜ 兩段時間列式 ➜ 停供威脅 ➜ 哲學雙結局
 * 修訂：測量推出式子｜Q5 口述列式｜姐弟去教鞭｜累積鋪對手拍
 */

export const galileoPrime = {
  id: 'GALILEO_PRIME',
  mathematicianId: 'GALILEO',
  era: 'PRIME',
  gradeBand: 2,
  title: '伽利略・壯年',
  subtitle: '終端重連 ➜ 刻痕和積 ➜ 漏壺反推 ➜ 距離與時間平方 Eureka ➜ 實驗簿 ➜ 兩段列式 ➜ 抉擇',
  nextChapterId: 'GALILEO_ELDER',
  rewards: {},
  eurekaMax: 3,
  knowledgeCard: {
    line: '本章練到：一元二次方程式（因式／配方／應用）｜副：累積次數｜課綱：八下・一元二次；統計相對／累積次數',
  },
  unlockTeaser: '下一站：夜觀望遠鏡——相似形與比例線段，把看不見的距離算出來。',
  endings: [
    {
      id: 'ending_cold',
      title: '方程式不讓步',
      description:
        '選擇公開堅持時間平方與距離的模型。實驗室可能被收走，式子仍站在廣場上。',
      hint: '贊助人要你收起式子的前夜，選擇公開不讓步……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '先保住實驗室',
      description:
        '選擇暫時低頭、把式子與數據藏進實驗室夾層。火種先護住，才能繼續量。',
      hint: '贊助人要你收起式子的前夜，選擇先護住實驗室……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    // ——— 開場 ———
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'GP1_LINK',
      lines: [
        {
          speaker: 'SYS',
          text: '數感終端機_版本1.0.4 … 目標年代：約西元 1604 年・帕多瓦工坊',
        },
        {
          speaker: '姐姐',
          text: '「座標跳到壯年了。這次不是鐘擺心跳——是斜面、計時，還有他反覆改的實驗簿。」',
        },
        {
          speaker: '弟弟',
          text: '「他還在量嗎？青年那次之後……好多年了。」',
        },
        {
          speaker: 'Numi',
          text: '「斜面！球會滾！我要追——！」',
        },
        {
          speaker: 'NumNum',
          text: '「滾動的距離若跟時間有關，式子會比青年那時更陡。抓穩。」',
        },
        {
          speaker: 'SYS',
          text: '時空鎖定……藍紫轉為木屑與蠟燭味，傳送開始。',
        },
      ],
    },
    {
      id: 'meet_again',
      type: 'narrative',
      checkpoint: 'GP1_SHOP',
      lines: [
        {
          speaker: 'narrator',
          text: '光芒散去。工坊裡一條長斜面鋪滿刻度，漏壺滴答。壯年的伽利略抬起頭，認出你們。',
        },
        {
          speaker: '伽利略',
          text: '「……又是你們。」',
        },
        {
          speaker: '伽利略',
          text: '「那年廣場上攤開兩欄之後，有人鼓掌，有人要我閉嘴。我學會一件事：式子若對，就該讓人看。」',
          whenStory: { youth_ending: 'ending_cold' },
        },
        {
          speaker: '伽利略',
          text: '「那年我把表塞進筆記、交給學徒。火種還在——所以我才還有這間工坊，能繼續量。」',
          whenStory: { youth_ending: 'ending_warm' },
        },
        {
          speaker: '伽利略',
          text: '「現在我想弄清：球滾下去的距離，跟時間到底怎麼咬合。幫我把式子嵌進這條斜面。」',
        },
      ],
    },

    // ——— 幕一：兩段式——具體情境列式 choice，再因式求根 number（不考韋達）———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'GP2_QUAD1',
      lines: [
        {
          speaker: 'narrator',
          text: '斜面中段兩道刻痕。伽利略對完漏壺：兩次時間加起來 5 秒，乘起來 6——要先列式，再讀較長的那一次。',
        },
        {
          speaker: '伽利略',
          text: '「設較長的時間是 t 秒，那較短的就是 5−t。兩者乘起來是 6。先把式子寫對。」',
        },
        {
          speaker: 'NumNum',
          text: '「具體情境先列式：t 乘上 (5−t) 等於 6。整理成一邊等於零，再拆根。」',
        },
        {
          speaker: 'Numi',
          text: '「喔——先寫乘起來，再整理！不是直接撞兩個數。」',
        },
        {
          speaker: '姐姐',
          text: '「報告上要留列式過程。猜中數字卻寫不出式子，複測時站不住。」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'GP2_QUAD1_PROBLEM',
      scene: '關卡一・斜面刻痕',
      question: {
        stem:
          '兩次試滾時間加起來 5 秒、乘起來 6。設較長時間為 t 秒（較短為 5−t）。請先列出正確方程，再求出 t。',
        bankRef: { id: 920, note: '具體情境列式 t(5−t)=6 → 整理後因式求根。' },
      },
    },
    {
      id: 'branch_act1',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：先寫乘積】(靈感 −1)',
          detail: '較長×較短＝6，再把括號打開整理。',
          kind: 'insight',
          story: { factor_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「t 乘上 (5−t)，等於 6！打開再搬到一邊！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：列式→標準式→拆根】',
          detail: '先寫 t(5−t)＝6，整理成一邊為 0，再因式分解。',
          kind: 'solve',
          story: { factor_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「列式、移項、拆括號。每一步都留在報告上。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1_setup',
      type: 'quiz',
      checkpoint: 'GP2_QUAD1_SETUP',
      scene: '關卡一・斜面刻痕',
      setup: [
        {
          speaker: '伽利略',
          text: '「第一步：哪一個是整理後的正確方程？」',
        },
      ],
      question: {
        answerType: 'choice',
        stem:
          '設較長時間為 t，較短為 5−t，且 t(5−t)＝6。整理成一邊等於 0 後，哪一個正確？',
        answer: 'B',
        options: [
          { letter: 'A', text: 't²＋5t＋6＝0' },
          { letter: 'B', text: 't²−5t＋6＝0' },
          { letter: 'C', text: 't²−5t−6＝0' },
          { letter: 'D', text: '5t−t²＝6' },
        ],
        bankRef: {
          id: 920,
          note: '正確：B。t(5−t)＝6 → 5t−t²＝6 → t²−5t＋6＝0。D 未移項完成。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '先打開括號，再把所有項移到同一邊。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「t(5−t)＝6 → 5t−t²＝6 → 0＝t²−5t＋6，也就是 t²−5t＋6＝0。D 還停在半路。」',
      },
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'GP2_QUAD1_QUIZ',
      scene: '關卡一・斜面刻痕',
      setup: [
        {
          speaker: '伽利略',
          text: '「式子是 t²−5t＋6＝0。第二步：較長的 t 是幾秒？」',
        },
      ],
      question: {
        answerType: 'number',
        stem: '已列式 t²−5t＋6＝0，且 t 為較長時間。t＝？',
        answer: '3',
        bankRef: { id: 901, note: '答案：3（根 2 與 3，取較長）' },
      },
      hint: {
        speaker: 'NumNum',
        text: '拆成兩括號，讀出兩個根；t 是較長的那個。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「(t−2)(t−3)＝0，根是 2 與 3。較長 t＝3（較短 5−3＝2，乘積也對）。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「列式留下了，3 秒那道刻痕也對上了。」',
        },
        {
          speaker: 'Numi',
          text: '「先乘起來再整理——比瞎猜兩個數踏實！」',
          whenStory: { factor_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「具體情境列式，才經得起複測。」',
          whenStory: { factor_method: 'numnum' },
        },
      ],
    },

    // ——— 幕二：配方／公式（由測量關係推出）———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'GP3_QUAD2',
      lines: [
        {
          speaker: 'narrator',
          text: '下一輪刻度對不上整數對。伽利略盯著漏壺與距離尺，反覆核對。',
        },
        {
          speaker: '伽利略',
          text: '「這次：時間的平方，剛好比『六倍的時間』多 7。我要正的那一個時間。」',
        },
        {
          speaker: 'NumNum',
          text: '「可以先讓左邊變成正方形，再開根；不合理的負時間丟掉。」',
        },
        {
          speaker: '姐姐',
          text: '「贊助人的人昨晚在門口晃過。數字越難算，越要算準——他們會盯。」',
        },
        {
          speaker: '弟弟',
          text: '「別被嚇到……可是工坊真的不能沒了。」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'GP3_QUAD2_PROBLEM',
      scene: '關卡二・漏壺反推',
      question: {
        stem:
          '時間 t 滿足：t 的平方比 6t 多 7。正的時間是多少？',
        bankRef: { id: 911, note: '由口述關係整理後求正根。' },
      },
    },
    {
      id: 'branch_act2',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：湊成正方形】(靈感 −1)',
          detail: '把前兩項湊成正方形，再移項開根。',
          kind: 'insight',
          story: { complete_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「中間那個係數對半——湊正方形！再把多出來的搬過去！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：先整理再求根】',
          detail: '先寫成一邊等於零，再求正根。',
          kind: 'solve',
          story: { complete_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「先整理成標準樣子，再算。負的時間直接丟掉。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'GP3_QUAD2_QUIZ',
      scene: '關卡二・漏壺反推',
      setup: [{ speaker: '伽利略', text: '「正的時間——幾秒？」' }],
      question: {
        answerType: 'number',
        stem: 't 的平方比 6t 多 7。正的 t 是多少？',
        answer: '7',
        bankRef: { id: 911, note: '答案：7（t²−6t−7＝0）' },
      },
      hint: {
        speaker: 'NumNum',
        text: '算完記得丟掉不合理的時間。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「整理成 t²−6t−7＝0。(t−3)²＝16 → t＝7 或 −1。時間取 7。」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「7 秒。漏壺也點頭。」',
        },
        {
          speaker: 'Numi',
          text: '「湊正方形超爽！」',
          whenStory: { complete_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「負根丟掉，剩下的才是漏壺上的時間。」',
          whenStory: { complete_method: 'numnum' },
        },
      ],
    },

    // ——— 幕三：s∝t² 包裝應用（Eureka）———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'GP4_PARAM',
      lines: [
        {
          speaker: 'narrator',
          text: '伽利略把多次「時間／距離」排成兩欄，停筆——距離欄，幾乎跟著時間欄的平方在走。',
        },
        {
          speaker: '伽利略',
          text: '「倍率先取 3：距離 s＝3t²。這一筆距離是 48——時間該是多少？」',
        },
        {
          speaker: '弟弟',
          text: '「時間的平方對上距離……好漂亮！」',
        },
        {
          speaker: 'NumNum',
          text: '「先讓 t² 單獨站一邊，再取正的時間。」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'GP4_PARAM_PROBLEM',
      scene: '關卡三・距離與時間',
      question: {
        stem: '斜面模型：距離＝3t²。距離為 48 時，正的時間 t 是多少？',
        bankRef: { id: 920, note: '一元二次應用（s∝t² 包裝）。' },
      },
    },
    {
      id: 'branch_act3',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：先除掉倍率】(靈感 −1)',
          detail: '先拿掉那個 3，再想平方。',
          kind: 'insight',
          story: { st_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「先除掉 3！剩下誰平方之後對得上？」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：移項求根】',
          detail: '整理後取正根。',
          kind: 'solve',
          story: { st_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「移到一邊，開方或因式都行——負的丟掉。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'GP4_PARAM_QUIZ',
      scene: '關卡三・距離與時間',
      setup: [{ speaker: '伽利略', text: '「t 是多少？」' }],
      question: {
        answerType: 'number',
        stem: '距離＝3t²，距離為 48。正的時間 t？',
        answer: '4',
        bankRef: { id: 920, note: '答案：4' },
      },
      hint: {
        speaker: 'NumNum',
        text: '先讓「時間的平方」單獨站一邊。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「3t²＝48 → t²＝16 → t＝4（負根捨去）。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: '伽利略',
          text: '（眼睛驟亮）「距離跟著時間的平方走——式子與刻度對上了。」',
        },
        {
          speaker: 'SYS',
          text: '★ 觸發關鍵頓悟：時間平方與距離一致！獲得【Eureka 幣 × 1】！',
        },
        {
          speaker: 'Numi',
          text: '「除掉倍率，平方自己跳出來！」',
          whenStory: { st_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「正根對上刻度，模型才算咬合。」',
          whenStory: { st_method: 'numnum' },
        },
        {
          speaker: '姐姐',
          text: '「這種寫法若傳出去，有人會不開心。先把實驗簿核完——次數不能給人抓把柄。」',
        },
      ],
    },

    // ——— 幕四：累積次數（鋪對手拍）———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'GP4_STATS',
      lines: [
        {
          speaker: 'narrator',
          text: '實驗簿最後一頁：一共滾了 40 次。助手囁嚅：偏慢的次數若太多，外頭會說「斜面不可信」。',
        },
        {
          speaker: '伽利略',
          text: '「時間 ≤3 秒的累積是 28 次。超過 3 秒的有幾次？我要知道『把柄』有多大。」',
        },
        {
          speaker: '弟弟',
          text: '「若偏慢很多……會不會被拿去跟贊助人告狀？」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'GP4_STATS_PROBLEM',
      scene: '關卡四・實驗簿',
      question: {
        stem: '共 40 次。「時間 ≤3 秒」累積 28 次。超過 3 秒的有幾次？',
        bankRef: { id: 939, note: '累積次數補集。' },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：剩下的】(靈感 −1)',
          detail: '總數扣掉已經累積的。',
          kind: 'insight',
          story: { stats_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「40 扣掉 28——剩下就是超過的！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：另一側】',
          detail: '超過＝總次數−累積。',
          kind: 'solve',
          story: { stats_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「累積到 ≤3，另一側就是 >3。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'GP4_STATS_QUIZ',
      scene: '關卡四・實驗簿',
      setup: [{ speaker: '伽利略', text: '「超過 3 秒——幾次？」' }],
      question: {
        answerType: 'number',
        stem: '共 40 次，≤3 秒累積 28。超過 3 秒幾次？',
        answer: '12',
        bankRef: { id: 939, note: '答案：12' },
      },
      hint: {
        speaker: 'NumNum',
        text: '總次數減掉累積。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「40−28＝12。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「12 次偏慢……先把斜面擦淨再測。別讓數字髒給人看。」',
        },
        {
          speaker: 'narrator',
          text: '助手臉色發白：昨晚有人問過「偏慢多不多」。門外靴聲遠去——像去報信。',
        },
        {
          speaker: 'Numi',
          text: '「擦乾淨再滾！剩下載掉就好！」',
          whenStory: { stats_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「12 是把柄的大小。擦完，數字要重新站整齊。」',
          whenStory: { stats_method: 'numnum' },
        },
      ],
    },

    // ——— 幕五：口述列式（與 Q1 不同構）———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'GP5_FIN',
      lines: [
        {
          speaker: 'narrator',
          text: '斜面擦淨。伽利略改用兩段時間：滾過第一道刻痕後，再過一段固定間隔，才到第二道。',
        },
        {
          speaker: '伽利略',
          text: '「設第一段時間是 t 秒；之後又固定過了 3 秒才到第二道。兩段時間乘起來，漏壺換算是 28。第一段是幾秒？」',
        },
        {
          speaker: 'NumNum',
          text: '「先把話寫成式子，再求正的 t。」',
        },
        {
          speaker: '弟弟',
          text: '「這次不是現成方程……要自己列！」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'GP5_FIN_PROBLEM',
      scene: '關卡五・兩段時間',
      question: {
        stem:
          '第一段時間 t 秒，之後再加 3 秒到第二刻痕；兩段時間的乘積是 28。求第一段時間 t（正值）。',
        bankRef: { id: 896, note: '口述列式 t(t+3)=28 再求解。' },
      },
    },
    {
      id: 'branch_act5',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：兩段乘起來】(靈感 −1)',
          detail: 't 乘上 (t＋3) 等於 28。',
          kind: 'insight',
          story: { retry_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「t 乘上後面那段——等於 28！再想哪個正數對得上。」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：先列式再解】',
          detail: '列出乘積式，移項後求正根。',
          kind: 'solve',
          story: { retry_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「先列式，再整理成一邊等於零，取正根。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'GP5_FIN_QUIZ',
      scene: '關卡五・兩段時間',
      setup: [{ speaker: '伽利略', text: '「第一段——幾秒？」' }],
      question: {
        answerType: 'number',
        stem: '第一段 t，再加 3 秒；兩段乘積 28。正的 t？',
        answer: '4',
        bankRef: { id: 896, note: '答案：4（t(t+3)=28）' },
      },
      hint: {
        speaker: 'NumNum',
        text: '先把「兩段乘起來等於 28」寫下來。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「t(t＋3)＝28 → t²＋3t−28＝0 → (t＋7)(t−4)＝0 → t＝4。」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「4 秒。簿子可以先闔上了。」',
        },
        {
          speaker: 'Numi',
          text: '「自己列式！乘起來就對了！」',
          whenStory: { retry_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「口述變式子，根才站得住。」',
          whenStory: { retry_method: 'numnum' },
        },
      ],
    },

    // ——— P4a 對手拍 ———
    {
      id: 'act6_rival',
      type: 'narrative',
      checkpoint: 'GP6_RIVAL',
      lines: [
        {
          speaker: 'narrator',
          text: '門被推開。贊助人科西莫的管家站在門口——正是報信靴聲的方向。目光掃過斜面與寫滿時間平方的黑板。',
        },
        {
          speaker: '管家',
          text: '「主人聽說你要公開『距離跟著時間平方走』。也聽說你有一堆偏慢的次數。收起式子——否則蠟燭、木材與助手薪資，全部停。」',
        },
        {
          speaker: '伽利略',
          text: '「……式子是對的。」',
        },
        {
          speaker: '管家',
          text: '「對不對，不是實驗室說了算。明天之前給回覆。」',
        },
        {
          speaker: 'narrator',
          text: '門關上。工坊只剩漏壺聲。黑板上的 t² 還在反光。',
        },
        {
          speaker: '姐姐',
          text: '「他在用實驗室威脅你。式子若對，就該讓人看見——不然量了做什麼？」',
        },
        {
          speaker: '弟弟',
          text: '「可是沒有實驗室，你就量不下去了……先低頭，把式子藏好，不好嗎？」',
        },
      ],
    },

    // ——— 哲學 ———
    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt: '贊助人要你收起時間平方的模型，否則停供實驗室。今晚怎麼回？',
      note: '重大哲學抉擇：決定本章結局。',
      lines: [
        {
          speaker: '姐姐',
          text: '「公開堅持。方程式不讓步——實驗室可以被收走，式子還在。」',
        },
        {
          speaker: '弟弟',
          text: '「先保住實驗室。式子抄進夾層，等風頭過了再量——火種要護著。」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '公開堅持模型，不向停供低頭。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '伽利略',
              text: '「……那就讓他們收。式子我明天照樣寫在門上。」',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '暫時低頭，藏式護實驗室。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '伽利略',
              text: '「……先留下這間屋子。式子，我寫在夾層裡。」',
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
        { speaker: 'SYS', text: '章節結束 — 結局一：【方程式不讓步】' },
        {
          speaker: 'narrator',
          text: '隔日，伽利略把 s＝kt² 與實驗摘要釘在工坊門外。管家來收走鑰匙。',
        },
        {
          speaker: 'NumNum',
          text: '「實驗室沒了。式子還在門上。」',
        },
        {
          speaker: '姐姐',
          text: '「公開，才叫證明。」',
        },
        {
          speaker: 'narrator',
          text: '路人抄走一頁。伽利略站在空屋前，手裡只剩一支粉筆——與不肯讓步的方程。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【方程式不讓步】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【先保住實驗室】' },
        {
          speaker: 'narrator',
          text: '伽利略當面點頭。夜裡，他把完整推導與 40 次累積表塞進地板夾層，門上只留空白木板。',
        },
        {
          speaker: 'Numi',
          text: '「實驗室留下了！火種在夾層裡！」',
        },
        {
          speaker: '弟弟',
          text: '「你還能繼續量。風頭過了，再掀起來。」',
        },
        {
          speaker: 'narrator',
          text: '漏壺依舊滴答。筆記本闔上——時間平方還在夾層裡等。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【先保住實驗室】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
}
