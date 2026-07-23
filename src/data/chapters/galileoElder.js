/**
 * 伽利略・暮年篇（修訂：Eureka→Q1｜≥3 題明確△相似｜收洩底＋白話）
 * 結構：終端重連 ➜ 測高 Eureka（兩直角△）➜ 鏡筒連比 ➜ 雙竿影相似
 *       ➜ 星圖小△∽大△ ➜ 兩步（連比＋相似）➜ 出版官 ➜ 雙結局
 * 配比：相似△ ×3＋（Q4）｜比例線段 ×2（Q2、Q5 上半）
 * Eureka：act1_outro +1｜結局各 +1
 */

export const galileoElder = {
  id: 'GALILEO_ELDER',
  mathematicianId: 'GALILEO',
  era: 'ELDER',
  gradeBand: 3,
  title: '伽利略・暮年',
  subtitle: '終端暮年 ➜ 測高 Eureka ➜ 鏡筒連比 ➜ 雙竿影 ➜ 星圖相似 ➜ 兩步測距 ➜ 出版抉擇',
  nextChapterId: null,
  rewards: {},
  eurekaMax: 3,
  knowledgeCard: {
    line: '本章練到：相似三角形、比例線段｜課綱：九上・比例線段與相似形',
  },
  endings: [
    {
      id: 'ending_cold',
      title: '星象公開',
      description:
        '選擇把觀測與算法公開刊出。弟子可能被問話，星象卻能讓更多人看見。',
      hint: '出版官要你收起星圖的前夜，選擇公開……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '鏡與火種',
      description:
        '選擇先把望遠鏡與筆記交給弟子。星象晚一點再亮，人與鏡先留下。',
      hint: '出版官要你收起星圖的前夜，選擇護鏡與弟子……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'GE1_LINK',
      lines: [
        {
          speaker: 'SYS',
          text: '數感終端機_版本1.0.4 … 目標年代：約西元 1610 年・帕多瓦夜觀工坊',
        },
        {
          speaker: '姐姐',
          text: '「暮年了。這次不是斜面——是鏡子、影子，還有夠不著的星。」',
        },
        {
          speaker: '弟弟',
          text: '「他還在看天嗎？青、壯那兩次之後……好多年了。」',
        },
        {
          speaker: 'Numi',
          text: '「望遠鏡！我想鑽進去追螺旋——！」',
        },
        {
          speaker: 'NumNum',
          text: '「夠不著的東西，常常可以用『形狀一樣、大小不同』的兩個三角形去算。」',
        },
        {
          speaker: 'SYS',
          text: '時空鎖定……藍紫轉為夜風與燭煙，傳送開始。',
        },
      ],
    },
    {
      id: 'meet_again',
      type: 'narrative',
      checkpoint: 'GE1_REUNION',
      lines: [
        {
          speaker: 'narrator',
          text: '光芒散去。暮年的伽利略站在庭院，手裡一支細鏡筒，抬頭對準黑暗。',
        },
        {
          speaker: '伽利略',
          text: '「……又是你們。」',
        },
        {
          speaker: '伽利略',
          text: '「年輕時我把表攤上廣場；壯年時式子釘在門上。現在——我想算夠不著的距離。」',
          whenStory: { youth_ending: 'ending_cold' },
        },
        {
          speaker: '伽利略',
          text: '「年輕時我把表塞進筆記；壯年時式子藏進夾層。火種還在，所以我還有這支鏡。」',
          whenStory: { youth_ending: 'ending_warm' },
        },
        {
          speaker: '伽利略',
          text: '「實驗室沒了之後，我學會把推導寫進夾層。今夜這支鏡，也是靠那些式子撐下來的。」',
          whenStory: { prime_ending: 'ending_warm' },
        },
        {
          speaker: '伽利略',
          text: '「式子公開之後，門被收走了。鏡筒是我自己磨的——數字還在，屋子不在。」',
          whenStory: { prime_ending: 'ending_cold' },
        },
        {
          speaker: '伽利略',
          text: '「先從庭院旗桿練起。爬不上去的高度，用兩個相似的直角三角形就能碰到。」',
        },
      ],
    },

    // ——— Q1 兩直角△相似測高 + Eureka ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'GE2_HEIGHT',
      lines: [
        {
          speaker: 'narrator',
          text: '太陽斜照。伽利略在旗桿旁立一支矮標竿。地上出現兩個影子：短的是標竿，長的是旗桿。',
        },
        {
          speaker: '伽利略',
          text: '「看：標竿、它的影，跟地面，圍成一個小直角三角形；旗桿、它的影，圍成一個大的。太陽同一方向，這兩個直角三角形形狀一樣。」',
        },
        {
          speaker: '伽利略',
          text: '「小三角形：高 2 尺、影 3 尺。大三角形的影是 18 尺。大三角形的高——旗桿——是多少？」',
        },
        {
          speaker: 'NumNum',
          text: '「形狀一樣，就可以把對應的邊拿來比。」',
        },
        {
          speaker: 'Numi',
          text: '「小的對大的！像放大一樣！」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'GE2_HEIGHT_PROBLEM',
      scene: '關卡一・庭院測高',
      question: {
        stem:
          '兩個直角三角形相似。小的：高 2 尺、底邊（影）3 尺；大的底邊（影）18 尺。求大的高（旗桿，尺）。',
        bankRef: { id: 1200, note: 'AA 相似直角△求高。' },
      },
    },
    {
      id: 'branch_act1',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：小的放大成大的】(靈感 −1)',
          detail: '先想底邊變成幾倍，高也變一樣倍。',
          kind: 'insight',
          story: { height_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「底邊變長的倍數，高度也要變同樣倍數！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：對應邊列比例】',
          detail: '小高／小底＝大高／大底，再求大高。',
          kind: 'solve',
          story: { height_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「高對高、底對底。寫成比例式再求未知的那一邊。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'GE2_HEIGHT_QUIZ',
      scene: '關卡一・庭院測高',
      setup: [{ speaker: '伽利略', text: '「旗桿幾尺？」' }],
      question: {
        answerType: 'number',
        stem:
          '相似直角三角形：小的高 2、底 3；大的底 18。大的高是多少？',
        answer: '12',
        bankRef: { id: 1200, note: '答案：12' },
      },
      hint: {
        speaker: 'NumNum',
        text: '先對齊：哪一邊對哪一邊。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「2:3＝h:18 → 3h＝36 → h＝12。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      rewards: { eurekaCoin: 1 },
      lines: [
        {
          speaker: '伽利略',
          text: '（眼睛驟亮）「爬不上去的高度——用兩個相似的三角形，算下來了。」',
        },
        {
          speaker: 'SYS',
          text: '★ 觸發關鍵頓悟：用相似三角形算出夠不著的高！獲得【Eureka 幣 × 1】！',
        },
        {
          speaker: 'Numi',
          text: '「小的變大的，高度自己跳出來！」',
          whenStory: { height_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「形狀一樣，比例才站得住。」',
          whenStory: { height_method: 'numnum' },
        },
        {
          speaker: '姐姐',
          text: '「這招若寫進觀測簿，有人會問你怎麼量到爬不上去的東西。」',
        },
      ],
    },

    // ——— Q2 比例線段（連比・非△）———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'GE3_TUBE',
      lines: [
        {
          speaker: 'narrator',
          text: '回到工坊。鏡筒外側有三道刻痕，把整支筒長切成三段。',
        },
        {
          speaker: '伽利略',
          text: '「整支長 20 寸，三段的比是 2 比 3 比 5。最前面那一段有多長？」',
        },
        {
          speaker: 'NumNum',
          text: '「這題先不畫三角形——用連比：先看一共幾份，再看第一段占幾份。」',
        },
        {
          speaker: '姐姐',
          text: '「刻度寫進簿子，出版官會拿尺核。份數別算錯。」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'GE3_TUBE_PROBLEM',
      scene: '關卡二・鏡筒刻度',
      question: {
        stem: '全長 20 寸，分成 2:3:5 三段。第一段長多少寸？',
        bankRef: { id: 1136, note: '連比例求段長。' },
      },
    },
    {
      id: 'branch_act2',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：先數有幾份】(靈感 −1)',
          detail: '把比的三個數加起來，看第一段占幾份。',
          kind: 'insight',
          story: { tube_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「先加加看一共幾份！第一段是比較前面那一份數！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：份數乘全長】',
          detail: '第一段長度＝（第一段份數÷總份數）×全長。',
          kind: 'solve',
          story: { tube_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「總份數當分母，再乘整支的長度。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2_setup',
      type: 'quiz',
      checkpoint: 'GE3_TUBE_SETUP',
      scene: '關卡二・鏡筒刻度',
      setup: [{ speaker: '伽利略', text: '「第一步：哪一個列式對？」' }],
      question: {
        answerType: 'choice',
        stem: '全長 20 寸，比 2:3:5。求第一段長，哪個列式正確？',
        answer: 'B',
        options: [
          { letter: 'A', text: '20×(2/3)' },
          { letter: 'B', text: '20×(2/10)' },
          { letter: 'C', text: '20×(2/5)' },
          { letter: 'D', text: '20÷2' },
        ],
        bankRef: { id: 1136, note: '正確：B（2+3+5=10）' },
      },
      hint: {
        speaker: 'NumNum',
        text: '先把 2、3、5 加起來。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「2＋3＋5＝10 份。第一段 2 份，所以是 20×(2/10)。」',
      },
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'GE3_TUBE_QUIZ',
      scene: '關卡二・鏡筒刻度',
      setup: [{ speaker: '伽利略', text: '「第二步：用你選的列式，第一段幾寸？」' }],
      question: {
        answerType: 'number',
        stem: '依正確列式，第一段長多少寸？',
        answer: '4',
        bankRef: { id: 1136, note: '答案：4' },
      },
      hint: {
        speaker: 'NumNum',
        text: '把列式算完就好。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「20×2÷10＝4。」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「4 寸。刻度對上了。」',
        },
        {
          speaker: 'Numi',
          text: '「數份！乾脆！」',
          whenStory: { tube_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「連比先加總，段長才不會飄。」',
          whenStory: { tube_method: 'numnum' },
        },
      ],
    },

    // ——— Q3 雙竿＋影＝兩直角△相似 ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'GE4_SHADOW',
      lines: [
        {
          speaker: 'narrator',
          text: '燭火邊，伽利略並立兩支細竿：矮的一支、高的一支，影子拖在同一直線上。',
        },
        {
          speaker: '伽利略',
          text: '「又是兩個直角三角形：竿是高、影是底。燭光方向一樣，兩個三角形相似。」',
        },
        {
          speaker: '伽利略',
          text: '「矮竿高 4 寸、影 3 寸；高竿的影是 9 寸。高竿有多高？」',
        },
        {
          speaker: '弟弟',
          text: '「跟旗桿那題一樣是兩個三角形！只是換成室內的竿。」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'GE4_SHADOW_PROBLEM',
      scene: '關卡三・雙竿影',
      question: {
        stem:
          '兩個直角三角形相似。小的：高 4 寸、底（影）3 寸；大的底（影）9 寸。求大的高（寸）。',
        bankRef: { id: 1200, note: '相似直角△（雙竿影）。' },
      },
    },
    {
      id: 'branch_act3',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：底邊變幾倍】(靈感 −1)',
          detail: '先看影變長的倍數，高也變同樣倍。',
          kind: 'insight',
          story: { lamp_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「影變長幾倍，竿就要變高幾倍！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：對應邊列比例】',
          detail: '小高／小底＝大高／大底。',
          kind: 'solve',
          story: { lamp_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「高對高、影對影，寫比例式。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'GE4_SHADOW_QUIZ',
      scene: '關卡三・雙竿影',
      setup: [{ speaker: '伽利略', text: '「高竿幾寸？」' }],
      question: {
        answerType: 'number',
        stem: '相似直角三角形：小的高 4、底 3；大的底 9。大的高？',
        answer: '12',
        bankRef: { id: 1200, note: '答案：12' },
      },
      hint: {
        speaker: 'NumNum',
        text: '對齊高與底，再列比。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「4:3＝h:9 → 3h＝36 → h＝12。」',
      },
    },
    {
      id: 'act3_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「12 寸。室內的兩個三角形，也聽話。」',
        },
        {
          speaker: 'Numi',
          text: '「又是小的對大的！」',
          whenStory: { lamp_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「相似一確認，比例就能用。」',
          whenStory: { lamp_method: 'numnum' },
        },
      ],
    },

    // ——— Q4 紙上小△∽天上大△（應用・不發 Eureka）———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'GE5_STAR',
      lines: [
        {
          speaker: 'narrator',
          text: '夜深。伽利略在紙上畫一個小直角三角形，說那是天上某個亮點與旁邊小點的「縮小版」。',
        },
        {
          speaker: '伽利略',
          text: '「紙上小三角形：底 2、高 5。天上那個大三角形跟它相似，底對應到 40。大三角形的高是多少？」',
        },
        {
          speaker: 'Numi',
          text: '「跟測旗桿同一招！只是大的在天上！」',
        },
        {
          speaker: 'NumNum',
          text: '「小△∽大△，對應邊成比例。」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'GE5_STAR_PROBLEM',
      scene: '關卡四・星圖相似',
      question: {
        stem:
          '小直角三角形∽大直角三角形。小的底 2、高 5；大的底 40。求大的高。',
        bankRef: { id: 1205, note: '相似△放大求對應高。' },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：底邊放大】(靈感 −1)',
          detail: '先想底邊放大幾倍，高也放大同樣倍。',
          kind: 'insight',
          story: { star_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「底邊變長幾倍，高就變長幾倍！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：對應邊列比例】',
          detail: '小底／大底＝小高／大高。',
          kind: 'solve',
          story: { star_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「底對底、高對高，列式求未知高。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'GE5_STAR_QUIZ',
      scene: '關卡四・星圖相似',
      setup: [{ speaker: '伽利略', text: '「大三角形的高？」' }],
      question: {
        answerType: 'number',
        stem: '相似：小的底 2、高 5；大的底 40。大的高？',
        answer: '100',
        bankRef: { id: 1205, note: '答案：100' },
      },
      hint: {
        speaker: 'NumNum',
        text: '對齊底與高。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「2:40＝5:h → h＝100。」',
      },
    },
    {
      id: 'act4_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「100。同一招，從庭院用到天上。」',
        },
        {
          speaker: 'Numi',
          text: '「星星也被三角形碰到了！」',
          whenStory: { star_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「小△對大△，方法沒變。」',
          whenStory: { star_method: 'numnum' },
        },
        {
          speaker: '姐姐',
          text: '「這種算法若公開刊出，有人會說你在量不該量的東西。」',
        },
      ],
    },

    // ——— Q5 兩步：連比中段 + 相似△ ———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'GE6_COMBO',
      lines: [
        {
          speaker: 'narrator',
          text: '最後一筆要兩步：先用鏡筒連比取出中段長度當小三角形的底，再用相似求牆外大三角形的高。',
        },
        {
          speaker: '伽利略',
          text: '「全長 30 寸，比還是 2:3:5，先取中段當小底。小三角形高是 15；大三角形的底是中段的 5 倍。大高多少？」',
        },
        {
          speaker: 'NumNum',
          text: '「第一步算中段；第二步才當成兩個相似三角形來比。」',
        },
        {
          speaker: '弟弟',
          text: '「先切段、再相似——兩步！」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'GE6_COMBO_PROBLEM',
      scene: '關卡五・兩步測距',
      question: {
        stem:
          '全長 30 寸、比 2:3:5。中段當小直角三角形的底；小高 15；大底＝5×中段。兩三角形相似。求大高。',
        bankRef: { id: 1210, note: '連比取中段→相似△。' },
      },
    },
    {
      id: 'branch_act5',
      type: 'branch',
      prompt: '請選擇解題思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi：先切中段】(靈感 −1)',
          detail: '先把中間那一段長度算出來，再拿去跟大的比。',
          kind: 'insight',
          story: { combo_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「中段先切出來！再拿去當小底！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum：兩步分開】',
          detail: '先求中段長，再列小底／大底＝小高／大高。',
          kind: 'solve',
          story: { combo_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「第一步段長，第二步相似比。不要混成一步。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5_setup',
      type: 'quiz',
      checkpoint: 'GE6_COMBO_SETUP',
      scene: '關卡五・兩步測距',
      setup: [{ speaker: '伽利略', text: '「第一步：中段幾寸？」' }],
      question: {
        answerType: 'number',
        stem: '全長 30 寸，比 2:3:5。中段長多少？',
        answer: '9',
        bankRef: { id: 1136, note: '答案：9' },
      },
      hint: {
        speaker: 'NumNum',
        text: '中段是比裡的第二個數；先加總份數。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「2＋3＋5＝10；中段 30×3÷10＝9。」',
      },
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'GE6_COMBO_QUIZ',
      scene: '關卡五・兩步測距',
      setup: [
        {
          speaker: '伽利略',
          text: '「中段當小底了。小高 15，大底是中段的 5 倍。第二步：大高？」',
        },
      ],
      question: {
        answerType: 'number',
        stem:
          '相似直角三角形：小底為中段長、小高 15；大底＝5×中段。大高是多少？（中段你已求出）',
        answer: '75',
        bankRef: { id: 1210, note: '答案：75（小底9、大底45）' },
      },
      hint: {
        speaker: 'NumNum',
        text: '先寫出大底，再對齊高與底。',
      },
      analysis: {
        speaker: 'NumNum',
        text: '「中段 9，大底 45；9:45＝15:h → h＝75。」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '伽利略',
          text: '「75。連比與相似，兩步都留下了。」',
        },
        {
          speaker: 'Numi',
          text: '「先切再放大！清楚！」',
          whenStory: { combo_method: 'numi' },
        },
        {
          speaker: 'NumNum',
          text: '「步驟分開，才經得起核對。」',
          whenStory: { combo_method: 'numnum' },
        },
      ],
    },

    // ——— 對手拍 ———
    {
      id: 'act6_rival',
      type: 'narrative',
      checkpoint: 'GE7_RIVAL',
      lines: [
        {
          speaker: 'narrator',
          text: '門被敲響。出版官站在燭光裡，目光掃過星圖與畫滿三角形的紙。',
        },
        {
          speaker: '出版官',
          text: '「你要用紙上的三角形去量天上的距離，還打算印成冊子。若公開——你的弟子會被叫去問話；這支鏡，也可能被收走。」',
        },
        {
          speaker: '伽利略',
          text: '「……算法是對的。」',
        },
        {
          speaker: '出版官',
          text: '「對不對，明天之前回覆。公開，或收起。」',
        },
        {
          speaker: 'narrator',
          text: '門關上。星圖還在桌上反光。',
        },
        {
          speaker: '姐姐',
          text: '「算出來卻藏住，等於沒算。公開，才叫觀測。」',
        },
        {
          speaker: '弟弟',
          text: '「可是弟子跟鏡子……先護住，不好嗎？火種要有人接。」',
        },
      ],
    },

    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt: '出版官要你在「公開刊出」與「收起」之間選。今晚怎麼回？',
      note: '重大哲學抉擇：決定本章結局。',
      lines: [
        {
          speaker: '姐姐',
          text: '「公開。讓更多人看見星象——弟子的安危，不能擋下算出來的事實。」',
        },
        {
          speaker: '弟弟',
          text: '「把鏡與筆記交給弟子，先護住人。星象可以晚一點再亮。」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '堅持把觀測與算法公開刊出。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '伽利略',
              text: '「……那就印。讓他們去問話。數字還在紙上。」',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '先不刊出，把鏡與火種交給弟子。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '伽利略',
              text: '「……鏡給你們。星象，先活在你們手裡。」',
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
        { speaker: 'SYS', text: '章節結束 — 結局一：【星象公開】' },
        {
          speaker: 'narrator',
          text: '隔日，觀測與算法印成冊子。出版官帶走兩名弟子問話；鏡筒被封進木箱。',
        },
        {
          speaker: 'NumNum',
          text: '「屋子暗了。紙上的三角形，還在外面。」',
        },
        {
          speaker: '姐姐',
          text: '「公開，才叫觀測。」',
        },
        {
          speaker: 'narrator',
          text: '街角有人抄走一頁星圖。伽利略空手站在庭院——夠不著的高與遠，已被人用相似算過。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【星象公開】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 },
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【鏡與火種】' },
        {
          speaker: 'narrator',
          text: '伽利略當面答應不刊出。夜裡，他把鏡筒與夾層筆記塞進弟子的行囊。',
        },
        {
          speaker: 'Numi',
          text: '「火種帶走了！以後還能看！」',
        },
        {
          speaker: '弟弟',
          text: '「人還在，鏡還在。星象可以晚一點亮。」',
        },
        {
          speaker: 'narrator',
          text: '庭院空了。筆記本闔上——相似的畫法還在夾層裡，等下一雙手打開。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【鏡與火種】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
}
