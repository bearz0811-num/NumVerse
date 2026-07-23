/**
 * 牛頓・青年篇
 * 結構：終端 ➜ 色散分數 ➜ 濾片分數 ➜ 指數律 ➜ 科學記號 Eureka ➜ 波長比公倍
 *       ➜ 學監對手拍 ➜ 哲學雙結局
 * Brief OK｜主：分數×2＋指數＋科學記號｜副：公因公倍×1
 * Eureka：act4_outro +1｜結局各 +1
 */

export const newtonYouth = {
  id: 'NEWTON_YOUTH',
  mathematicianId: 'NEWTON',
  era: 'YOUTH',
  gradeBand: 1,
  title: '牛頓・青年',
  subtitle: '終端 ➜ 色散 ➜ 濾片 ➜ 次方 ➜ 微光 Eureka ➜ 波長比 ➜ 學監對峙 ➜ 抉擇',
  nextChapterId: 'NEWTON_PRIME',
  rewards: {},
  eurekaMax: 3,
  knowledgeCard: {
    line: '本章練到：分數四則、指數律、科學記號｜副：公因公倍｜課綱：七上／七下・因數與分數',
  },
  unlockTeaser: '下一站：力與圖線——一次函數讀斜率，還有平行四邊形合成。',
  endings: [
    {
      id: 'ending_cold',
      title: '可計算的光',
      description:
        '選擇把色散與微光寫成可核對的分數與記號，公開量化筆記。暗室可能被盯上，數字卻站得住。',
      hint: '學監要收暗室的前夜，選擇堅持量化……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '先看見彩虹',
      description:
        '選擇先讓人看見彩虹演示，分數與記號先收在夾層。暗室暫時保住，火種還在。',
      hint: '學監要收暗室的前夜，選擇先演示給人看……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'NY1_LINK',
      lines: [
        {
          speaker: 'SYS',
          text: '數感終端機_版本1.0.4 … 目標年代：約西元 1666 年・英格蘭劍橋暗室',
        },
        {
          speaker: '姐姐',
          text: '「牛頓。三稜鏡、色帶，還有他把極小的光硬寫進筆記本的那股勁。」',
        },
        {
          speaker: '弟弟',
          text: '「彩虹能算嗎？……我想看他怎麼算！」',
        },
        {
          speaker: 'Numi',
          text: '「色散！色帶！衝進暗室——！」',
        },
        {
          speaker: 'NumNum',
          text: '「分數、次方、很小很小的數。排整齊，才讀得懂。」',
        },
        {
          speaker: 'SYS',
          text: '時空鎖定……藍紫轉為隙縫裡的一束白光，傳送開始。',
        },
      ],
    },
    {
      id: 'meet_newton',
      type: 'narrative',
      checkpoint: 'NY1_REUNION',
      lines: [
        {
          speaker: 'narrator',
          text: '光芒散去。年輕的牛頓把三稜鏡對準窗縫，牆上拉出一條長長的色帶。',
        },
        {
          speaker: '牛頓',
          text: '「……你們是誰？別擋光。」',
        },
        {
          speaker: 'Numi',
          text: '「哇——紅橙黃綠藍！像排好的數字！」',
        },
        {
          speaker: '牛頓',
          text: '「好看不夠。我要知道每一段占多少——寫成分數，才算數。」',
        },
      ],
    },

    // ——— Q1 色散分數 ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'NY2_PRISM',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓用粉筆在牆上的色帶旁畫刻度，把整條色帶看成「1」。',
        },
        {
          speaker: '牛頓',
          text: '「紅光這一段占 3/8，藍光占 1/4。紅比藍多多少？」',
        },
        {
          speaker: 'NumNum',
          text: '「同分母才能比。先通分，再相減。」',
        },
        {
          speaker: 'Numi',
          text: '「紅比較長！但要算出『多多少』才算！」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'NY2_PRISM_PROBLEM',
      scene: '關卡一・色散色帶',
      question: {
        stem: '整條色帶看成 1。紅光占 3/8，藍光占 1/4。紅比藍多多少？',
        bankRef: {
          id: 479,
          note: 'DEV對照：異分母分數加減／通分（同知識點，非同題）。',
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
          label: '【Numi：先對齊分母】(靈感 −1)',
          detail: '兩個分數分母不同，先變成一樣再比。',
          kind: 'insight',
          story: { prism_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「分母先對齊！對齊了才能比誰大、多多少！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：通分再相減】',
          detail: '通分後用紅減藍。',
          kind: 'solve',
          story: { prism_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「寫成同分母，再做減法。差就是『多多少』。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'NY2_PRISM_QUIZ',
      scene: '關卡一・色散色帶',
      setup: [{ speaker: '牛頓', text: '「紅比藍多——寫成分數。」' }],
      question: {
        answerType: 'number',
        stem: '紅 3/8，藍 1/4。紅比藍多多少？（寫最簡分數，格式如 2/5）',
        answer: '1/8',
        bankRef: {
          id: 479,
          note: '答案：1/8。DEV對照題庫＃479・異分母加減。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '先讓兩個分數的分母一樣。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「1/4＝2/8。3/8−2/8＝1/8。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「1/8。色帶也能算，不是只能看。」',
        },
        {
          speaker: 'Numi',
          text: '「通分！通分就對了！」',
          whenStory: { prism_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「差寫成最簡分數，筆記本才乾淨。」',
          whenStory: { prism_method: 'numnum' },
        },
      ],
    },

    // ——— Q2 濾片分數乘除 ———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'NY3_FILTER',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓在光束前疊了兩片有色玻璃，牆上的色帶一下子暗了下去。',
        },
        {
          speaker: '牛頓',
          text: '「第一片會讓光通過 2/3。能穿過第一片的那些光，第二片又只讓其中 3/4 通過。兩片都過完，還剩原來的幾分之幾？」',
        },
        {
          speaker: '弟弟',
          text: '「一片擋完，再擋一片……最後剩多少？」',
        },
        {
          speaker: 'NumNum',
          text: '「第二片只管『已經穿過第一片』的光，不是又從頭對原來的光算一次。」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'NY3_FILTER_PROBLEM',
      scene: '關卡二・疊濾片',
      question: {
        stem:
          '第一片讓光通過 2/3。能穿過第一片的光，第二片再讓其中 3/4 通過。兩片都過完後，還剩原來的幾分之幾？',
        bankRef: {
          id: 485,
          note: 'DEV對照：分數乘除與四則混合（同知識點，非同題）。',
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
          label: '【Numi：一片一片想】(靈感 −1)',
          detail: '先想穿過第一片還有多少，再想第二片從這裡面放過去多少。',
          kind: 'insight',
          story: { filter_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「先過第一片！再從過得去的那些裡，看第二片還放多少！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：兩次通過，串成一份】',
          detail: '第二次是對「已穿過第一片的光」再取分數，最後要換成相對原來的份數。',
          kind: 'solve',
          story: { filter_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「步驟分開寫：先過第一片，再過第二片。最後問的是『相對原來』。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'NY3_FILTER_QUIZ',
      scene: '關卡二・疊濾片',
      setup: [{ speaker: '牛頓', text: '「兩片都過完——還剩原來的幾分之幾？」' }],
      question: {
        answerType: 'number',
        stem:
          '第一片讓光通過 2/3；能穿過第一片的光，第二片再讓其中 3/4 通過。兩片都過完後，還剩原來的幾分之幾？（最簡分數）',
        answer: '1/2',
        bankRef: {
          id: 485,
          note: '答案：1/2。DEV對照題庫＃485・分數乘除。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '第二片的 3/4，是針對「已經穿過第一片」的那些光。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「穿過第一片後剩原來的 2/3；再從裡面取 3/4 → (2/3)×(3/4)＝1/2。」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「一半。兩片玻璃，光只剩一半。」',
        },
        {
          speaker: 'Numi',
          text: '「一片一片過——原來就剩一半！」',
          whenStory: { filter_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「第二次對的是穿過第一片的光，最後再換回『原來的幾分之幾』。」',
          whenStory: { filter_method: 'numnum' },
        },
      ],
    },

    // ——— Q3 指數律 ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'NY4_EXP',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓在簿子上用「2 的幾次方」記某種亮度單位：每多疊一層，就再乘一個 2。',
        },
        {
          speaker: '牛頓',
          text: '「這邊已經是 2 的 3 次方；那邊又乘上 2 的 2 次方。合在一起是 2 的幾次方？」',
        },
        {
          speaker: 'NumNum',
          text: '「兩邊都是以 2 為底的次方——可以併成一個次方來看。」',
        },
        {
          speaker: '姐姐',
          text: '「這組次方若寫進給學監看的摘要，併錯會被當亂寫。」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'NY4_EXP_PROBLEM',
      scene: '關卡三・次方疊加',
      question: {
        stem:
          '亮度記成「2 的幾次方」：已經是 2 的 3 次方，再乘上 2 的 2 次方。合起來是 2 的幾次方？（只答指數）',
        bankRef: {
          id: 494,
          note: 'DEV對照：同底指數相乘求次方（＃494 細菌 2^4×2^3）。',
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
          label: '【Numi：把次方拆開數】(靈感 −1)',
          detail: '想想 2 一共乘了幾次。',
          kind: 'insight',
          story: { exp_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「左邊幾次、右邊幾次——數總共幾次！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：同底的次方併在一起】',
          detail: '底都是 2 的時候，兩個次方可以併成一個。',
          kind: 'solve',
          story: { exp_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「同底才能併。併完只留一個指數。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'NY4_EXP_QUIZ',
      scene: '關卡三・次方疊加',
      setup: [{ speaker: '牛頓', text: '「合起來是 2 的——幾次方？」' }],
      question: {
        answerType: 'number',
        stem:
          '已經是 2 的 3 次方，再乘上 2 的 2 次方。合起來是 2 的幾次方？（只答指數）',
        answer: '5',
        bankRef: {
          id: 494,
          note: '答案：5。DEV對照題庫＃494・同底指數律。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '底都是 2 的時候，兩個次方怎麼併成一個？',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「2³×2²＝2⁵，指數 3＋2＝5。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「5 次方。次方能併，筆記本才寫得下。」',
        },
        {
          speaker: 'Numi',
          text: '「指數加加減減——超好記！」',
          whenStory: { exp_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「同底才加得了。底不同就別硬加。」',
          whenStory: { exp_method: 'numnum' },
        },
      ],
    },

    // ——— Q4 科學記號 Eureka ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'NY5_SCI',
      lines: [
        {
          speaker: 'narrator',
          text: '夜深。色帶末端有一段幾乎看不見的微光。牛頓用極細的筆尖寫下一串小數。',
        },
        {
          speaker: '牛頓',
          text: '「量到大約 0.00036。這種小數太長——我想收成『一個不大的數，再乘上 10 的幾次方』。」',
        },
        {
          speaker: 'Numi',
          text: '「好小……小數點要跑好遠！」',
        },
        {
          speaker: 'NumNum',
          text: '「先決定小數點停在哪，再記下移動了幾位。」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'NY5_SCI_PROBLEM',
      scene: '關卡四・微光紀錄',
      question: {
        stem:
          '把 0.00036 寫成科學記號（1 到 10 之間的數，乘上 10 的幾次方）。指數是多少？',
        bankRef: {
          id: 413,
          note: 'DEV對照：科學記號／負指數微小數（＃413 PM2.5），非同題。',
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
          label: '【Numi：數小數點跑幾格】(靈感 −1)',
          detail: '把小數點移到第一個非零數字後面，數一數移了幾位。',
          kind: 'insight',
          story: { sci_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「小數點跑幾格就記幾——方向要想清楚！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：先定 a，再定指數】',
          detail: '先讓前面的數落在 1 到 10 之間，再決定 10 的指數。',
          kind: 'solve',
          story: { sci_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「前面的數要落在 1 到 10 之間（含 1 不含 10），指數才定得下來。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'NY5_SCI_QUIZ',
      scene: '關卡四・微光紀錄',
      setup: [
        {
          speaker: '牛頓',
          text: '「寫成科學記號之後——指數是多少？」',
        },
      ],
      question: {
        answerType: 'number',
        stem:
          '0.00036 寫成科學記號（1 到 10 之間的數 × 10 的幾次方）。指數是多少？',
        answer: '-4',
        bankRef: {
          id: 413,
          note: '答案：-4。DEV對照題庫＃413・科學記號。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '小數點移到第一個非零數字後面；數一數移了幾位、往哪邊。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「0.00036＝3.6×10^(−4)。小數點往左移 4 位，指數是 −4。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: '牛頓',
          text: '（筆尖一頓）「……幾乎看不見的光，也能寫成一個乾淨的數。」',
        },
        {
          speaker: 'SYS',
          text: '★ 觸發關鍵頓悟：用科學記號把極微的光寫成可計算的量！獲得【Eureka 幣 × 1】！',
        },
        {
          speaker: 'Numi',
          text: '「好小的光，被寫住了！」',
          whenStory: { sci_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「長小數收成記號，比較、計算才站得住。」',
          whenStory: { sci_method: 'numnum' },
        },
        {
          speaker: '姐姐',
          text: '「這種寫法若公開，有人會說你把彩虹弄成冷冰冰的分數。」',
        },
      ],
    },

    // ——— Q5 波長比・公因公倍 ———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'NY6_WAVE',
      lines: [
        {
          speaker: 'narrator',
          text: '牛頓在兩段色帶旁標了兩組長度數字，想寫成最簡的比。',
        },
        {
          speaker: '牛頓',
          text: '「兩段色帶刻度 48 與 36。化成最簡整數比，是幾比幾？」',
        },
        {
          speaker: 'NumNum',
          text: '「兩邊一起除掉同一個數，除到不能再除。」',
        },
        {
          speaker: '弟弟',
          text: '「約到最乾淨——比就清楚了！」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'NY6_WAVE_PROBLEM',
      scene: '關卡五・波長比',
      question: {
        stem:
          '兩段刻度 48 與 36。化成最簡整數比，寫成「大:小」（例如 5:2 就輸入 5:2）。',
        bankRef: {
          id: 442,
          note: 'DEV對照：最大公因數（＃442）；最簡比另見＃628。',
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
          label: '【Numi：找能同時整除的數】(靈感 −1)',
          detail: '找一個數，48 和 36 都能被它除盡，越大越好。',
          kind: 'insight',
          story: { wave_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「兩邊一起除！除到不能再除！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：同除後寫成比】',
          detail: '兩邊同除一個儘量大的公因數，再寫成比。',
          kind: 'solve',
          story: { wave_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「同除到互質，比就定了。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'NY6_WAVE_QUIZ',
      scene: '關卡五・波長比',
      setup: [{ speaker: '牛頓', text: '「最簡整數比——幾比幾？」' }],
      question: {
        answerType: 'number',
        stem: '48 與 36 化成最簡整數比。寫成「大:小」。',
        answer: '4:3',
        bankRef: {
          id: 442,
          note: '答案：4:3。DEV對照題庫＃442・最大公因數。',
        },
      },
      hint: {
        speaker: 'NumNum',
        text: '找一個能同時整除兩邊、又儘量大的數。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「最大公因數是 12。48÷12＝4，36÷12＝3，所以 4:3。」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '牛頓',
          text: '「4 比 3。比也要最簡，才進得了摘要。」',
        },
        {
          speaker: 'Numi',
          text: '「除到不能再除！爽！」',
          whenStory: { wave_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「最大公因數一抓，比就定了。」',
          whenStory: { wave_method: 'numnum' },
        },
      ],
    },

    // ——— 對手拍 ———
    {
      id: 'act6_rival',
      type: 'narrative',
      checkpoint: 'NY7_RIVAL',
      lines: [
        {
          speaker: 'narrator',
          text: '門被推開。學監站在隙縫光裡，看著牆上的色帶與滿是分數的紙。',
        },
        {
          speaker: '學監',
          text: '「彩虹只是好看。你把墨水浪費在分數上——明日若還這樣，暗室收回。」',
        },
        {
          speaker: '牛頓',
          text: '「……不好看的光，我也要寫下來。」',
        },
        {
          speaker: '學監',
          text: '「要算，就拿出去給人核；要玩顏色，就別占這間房。選一個。」',
        },
        {
          speaker: 'narrator',
          text: '門關上。三稜鏡還在桌上反光。',
        },
        {
          speaker: '姐姐',
          text: '「可計算，才叫光學。公開量化——讓他們核。」',
        },
        {
          speaker: '弟弟',
          text: '「可是人家連彩虹都還沒看懂……先讓人看見，不好嗎？」',
        },
      ],
    },

    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt: '學監要收暗室。今晚怎麼回？',
      note: '重大哲學抉擇：決定本章結局。',
      lines: [
        {
          speaker: '姐姐',
          text: '「公開量化筆記。分數與記號經得起核對——暗室被盯也要把數寫出去。」',
        },
        {
          speaker: '弟弟',
          text: '「先演示彩虹給人看，分數先收在夾層。暗室要留住。」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '堅持公開可核對的量化筆記。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '牛頓',
              text: '「……那就寫清楚，拿出去。讓他們笑，也讓他們核。」',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '先演示、先護暗室，量化暫藏夾層。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '牛頓',
              text: '「……先讓他們看見。數字，我自己還留著。」',
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
        { speaker: 'SYS', text: '章節結束 — 結局一：【可計算的光】' },
        {
          speaker: 'narrator',
          text: '隔日，牛頓把色散占比與微光記號抄成摘要，釘在學院布告欄。學監派人盯暗室；紙頁卻被人抄走。',
        },
        {
          speaker: 'NumNum',
          text: '「房間被盯了。數，還在外面。」',
        },
        {
          speaker: '姐姐',
          text: '「可計算，才叫光學。」',
        },
        {
          speaker: 'narrator',
          text: '窗縫的光還在。三稜鏡旁，筆記本闔上一半——分數沒有被收回。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【可計算的光】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【先看見彩虹】' },
        {
          speaker: 'narrator',
          text: '牛頓當面收起摘要，改在走廊做了一場短短的色散演示。學監暫時沒封門。',
        },
        {
          speaker: 'Numi',
          text: '「大家看見彩虹了！數字還在夾層！」',
        },
        {
          speaker: '弟弟',
          text: '「人先看懂，數才進得去心裡。」',
        },
        {
          speaker: 'narrator',
          text: '暗室還亮著。筆記本闔上——科學記號與最簡比，睡在夾層裡。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【先看見彩虹】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
}
