/**
 * 第一章：阿基米德・青年篇
 * 結構：現代台北操作終端機 ➜ 四人組穿越古希臘 ➜ 歷史冒險與解謎
 * Eureka 幣獲得時機：
 *  1. 阿基米德領悟浴缸原理時 (+1)
 *  2. 達成結局一結算時 (+1)
 *  3. 達成結局二結算時 (+1)
 */

export const archimedesYouth = {
  id: 'ARCHIMEDES_YOUTH',
  mathematicianId: 'ARCHIMEDES',
  era: 'YOUTH',
  title: '阿基米德・青年',
  subtitle: '終端啟動 ➜ 澡堂頓悟 ➜ 密室搜查 ➜ 密度推算 ➜ 浮力秤決戰',
  nextChapterId: 'ARCHIMEDES_PRIME',
  rewards: {}, // 全章預設獎勵清空，改由各特定節點發放
  /** 本章 Eureka 蒐集上限：澡堂頓悟 1 + 結局各 1 */
  eurekaMax: 3,
  endings: [
    {
      id: 'ending_cold',
      title: '理性的冷酷神殿',
      description:
        '選擇當眾演示鐵證，讓邏輯與法律做出最純粹的審判。阿基米德決定將一生投入純粹抽象的幾何世界。',
      hint: '在審判前夜，選擇重視冰冷邏輯與絕對真理的道路……',
      badgeIcon: '❄️',
      eurekaReward: 1,
    },
    {
      id: 'ending_warm',
      title: '溫暖的理性之光',
      description:
        '選擇私下給予機會，用數學與同理心化解困境並拯救他人。數學不僅揭開規律，更能守護善良。',
      hint: '在審判前夜，選擇重視人文同理的道路……',
      badgeIcon: '☀️',
      eurekaReward: 1,
    },
  ],
  nodes: [
    // ——— 章節開場：現代台北操作終端機穿越 ———
    {
      id: 'sys_boot',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_1_LINK',
      lines: [
        { speaker: 'SYS', text: '數感終端機_版本1.0.4 … 目標年代：西元前 250 年・西西里島敘拉古' },
        {
          speaker: '姐姐',
          text: '「終端機螢幕亮起來了！這次的目標是青年時期的阿基米德。」',
        },
        {
          speaker: '弟弟',
          text: '「太好了！大家手拉手，準備出發囉！」',
        },
        {
          speaker: 'Numi',
          text: '「好耶——！又要看螺旋光芒了！衝啊——！」',
        },
        {
          speaker: 'NumNum',
          text: '「Numi 抓緊！穿越時空間的秩序波動很大，別摔出去了！」',
        },
        {
          speaker: 'SYS',
          text: '時空座標鎖定……藍紫色光芒轉為暖黃，傳送開始！',
        },
      ],
    },

    // ——— 幕一：古希臘澡堂頓悟 ———
    {
      id: 'act1_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_2_BATH',
      lines: [
        {
          speaker: 'narrator',
          text: '光芒散去，四人組一頭摔進了一間充滿蒸氣的古希臘石牆浴室。',
        },
        {
          speaker: 'Numi',
          text: '「噗通！這裡滿滿都是水！那個捲頭髮的大叔踩進水裡，水像黃金螺旋一樣噴出來了！」',
        },
        {
          speaker: 'NumNum',
          text: '「（撢撢身上的水）Numi 站好！注意看，大叔踩進去排開的水，高度與空間是有嚴格規律的。」',
        },
        {
          speaker: '阿基米德',
          text: '（渾然不知身後多了四個穿越者）水淹出來了……我身體進入水裡的空間，跟排開的水量……完全相等！',
        },
        {
          speaker: '姐姐',
          text: '「阿基米德頓悟了！只要算出流出來的水量，就能用等式推算出水面上升的高度 h。」',
        },
      ],
    },
    {
      id: 'problem_act1',
      type: 'problem',
      checkpoint: 'CHECKPOINT_2_BATH_PROBLEM',
      scene: '關卡一・體積排開測試',
      question: {
        stem:
          '木盆底面積為 400 平方公分，阿基米德踏入後，水面上升高度為 h 公分。若排出的水恰好填滿一個長 20 公分、寬 10 公分、高 8 公分的矩形容器，求水面上升高度 h（公分）。',
        math: '400h = 20 \\times 10 \\times 8',
        bankRef: {
          id: 520,
          note: '一元一次列式與基本求解（排水體積換算）。',
        },
      },
    },
    {
      id: 'branch_act1',
      type: 'branch',
      prompt: '請選擇協助阿基米德的思考夥伴與精靈提示：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的衝動直覺：水塊碰撞】(靈感 −1)',
          detail: '像 Numi 撞進數字堆一樣，直觀感受體積置換。',
          kind: 'insight',
          story: { bath_method: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「就像我剛撞進台北房間一樣！身體佔了多少空間，就把多少水推出去！20×10×8＝1600，這塊水倒回去木盆，就是底面積 400 乘以高度 h 啦！」',
            },
            {
              speaker: '弟弟',
              text: '「Numi 說得真好懂！直觀看就是 1600 的水塊擠出了高度 h！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的秩序推導：守恆方程】',
          detail: '像 NumNum 排列數字一樣，建立嚴謹的守恆等式。',
          kind: 'solve',
          story: { bath_method: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「按照數學世界的規則，兩邊代表同一個體積。右邊實體排水量為 1600，兩邊同時除以 400，規律就會展現。」',
            },
            {
              speaker: '姐姐',
              text: '「建立守恆方程，求解 h 就非常清楚了。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act1',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_2_BATH_QUIZ',
      scene: '關卡一・體積排開測試',
      setup: [
        {
          speaker: 'SYS',
          text: '思路已釐清，請計算出水面上升高度 h。',
        },
      ],
      question: {
        answerType: 'number',
        stem:
          '木盆底面積為 400 平方公分，阿基米德踏入後，水面上升高度為 h 公分。若排出的水恰好填滿一個長 20 公分、寬 10 公分、高 8 公分的矩形容器，求 h（公分）。',
        math: '400h = 20 \\times 10 \\times 8',
        answer: '4',
        bankRef: { id: 520, note: '答案：4' },
      },
      analysis: {
        speaker: 'NumNum',
        text: '「右側排水量為 20×10×8＝1600。求解 400h＝1600 ⇒ h＝4 公分。規則完美符合。」',
      },
    },
    {
      id: 'act1_outro',
      type: 'narrative',
      rewards: { eurekaCoin: 1 }, // ★ 時機 1：阿基米德領悟浴缸原理時獲得
      lines: [
        {
          speaker: '阿基米德',
          text: '（眼睛驟然發亮）我明白了！不破壞物體就能量出體積！國王讓我調查皇冠是否被金匠偷工減料……我有辦法了！',
        },
        {
          speaker: 'SYS',
          text: '★ 觸發關鍵歷史頓悟：阿基米德領悟浴缸排水原理！獲得【Eureka 幣 × 1】！',
        },
        {
          speaker: 'Numi',
          text: '「哇哇！大叔赤裸著喊著『Eureka』跑出去了！大家快跟上！」',
        },
        {
          speaker: 'NumNum',
          text: '「（搖頭苦笑）希臘人的秩序真是奔放……大家跟緊他，去王宮庫房！」',
        },
      ],
    },

    // ——— 幕二：國庫帳冊追查（已修復 400 金幣邏輯漏洞） ———
    {
      id: 'act2_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_3_LEDGER',
      lines: [
        {
          speaker: 'narrator',
          text: '四人組跟著阿基米德來到王宮庫房。在檢測皇冠前，阿基米德決定先核對撥給金匠的黃金採購帳冊。',
        },
        {
          speaker: 'NumNum',
          text: '「這本帳冊裡的數字排列極度混亂，完全不符合數學世界的秩序。」',
        },
        {
          speaker: '姐姐',
          text: '「等一下！國王原始的國庫撥款清單上明明寫著【總預算 2000 金幣】，但這本工坊領料帳冊記載的數字卻完全對不上！」',
        },
        {
          speaker: '弟弟',
          text: '「對呀，工匠宣稱他領到的預算金幣是學徒的 3 倍，但在補貼 150 金幣後，帳面記載卻變得很詭異……設學徒原本帳面為 y，我們來算算出帳冊上他們到底登記了多少錢！」',
        },
      ],
    },
    {
      id: 'problem_act2',
      type: 'problem',
      checkpoint: 'CHECKPOINT_3_LEDGER_PROBLEM',
      scene: '關卡二・國庫帳冊追查',
      question: {
        stem:
          '國庫原始撥款總額為 2000 金幣。但工坊帳冊上記載：工匠原本領到的預算金幣是學徒的 3 倍。若工匠給了學徒 150 金幣後，工匠剩餘的金幣恰好是學徒總金幣的 2 倍少 50 金幣。設學徒原本帳面預算為 y 金幣，求 y。',
        math: '3y - 150 = 2(y + 150) - 50',
        bankRef: {
          id: 532,
          note: '動態轉移應用題。',
        },
      },
    },
    {
      id: 'branch_act2',
      type: 'branch',
      prompt: '選擇解析帳冊數據的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的追逐直覺：金幣跳躍】(靈感 −1)',
          detail: '追蹤金幣從工匠口袋跳到學徒口袋的動向。',
          kind: 'insight',
          story: { ledger_strategy: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「看金幣跳去哪裡！工匠給出 150 剩下 (3y - 150)；學徒拿到 150 變成 (y + 150)。學徒的新金額乘以 2 再減 50，就剛好等於工匠剩下來的金幣！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的整理習慣：括號展開】',
          detail: '按順序展開右式括號，整理同類項。',
          kind: 'solve',
          story: { ledger_strategy: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「右式 2(y + 150) - 50 按照規則展開為 2y + 250。將 y 歸併至左邊，常數排至右邊，即可解出原始預算 y。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act2',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_3_LEDGER_QUIZ',
      scene: '關卡二・國庫帳冊追查',
      setup: [
        {
          speaker: 'SYS',
          text: '請計算並輸入學徒原本帳面記錄的預算金幣數 y：',
        },
      ],
      question: {
        answerType: 'number',
        stem:
          '工匠原本領到的預算金幣是學徒的 3 倍。若工匠給了學徒 150 金幣後，工匠剩餘的金幣恰好是學徒總金幣的 2 倍少 50 金幣。設學徒原本帳面預算為 y 金幣，求 y。',
        math: '3y - 150 = 2(y + 150) - 50',
        answer: '400',
        bankRef: { id: 532, note: '答案：400' },
      },
      analysis: {
        speaker: '阿基米德',
        text: '「解出 y ＝ 400！學徒原本 400 金幣、工匠原本 1200 金幣，兩人帳冊上的金額加起來只有 1600 金幣！」',
      },
    },
    {
      id: 'act2_outro',
      type: 'narrative',
      lines: [
        {
          speaker: '姐姐',
          text: '「果然有鬼！國庫總共撥了 2000 金幣，帳冊卻只記了 1600 金幣，這代表中間整整有 400 金幣被憑空私吞了！」',
        },
        {
          speaker: 'Numi',
          text: '「抓到了抓到了！那 400 個金幣一定被藏進工坊的秘密基地了啦！」',
        },
        {
          speaker: '阿基米德',
          text: '「走！我們帶兵突擊工坊，看看老金匠拿這消失的 400 金幣做了什麼！」',
        },
      ],
    },

    // ——— 幕三：工坊暗爐搜查 ———
    {
      id: 'act3_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_4_FORGE',
      lines: [
        {
          speaker: 'narrator',
          text: '抓到消失的 400 金幣後，四人組陪同阿基米德帶著衛兵突擊老金匠的鑄造工坊。',
        },
        {
          speaker: 'Numi',
          text: '「哇！這裡好熱喔！倉庫裡有一排排高溫橄欖油桶，排列起來好像矩形陣列喔！」',
        },
        {
          speaker: 'NumNum',
          text: '「官方登記這間工坊只有 6 座熔爐，但這些油桶總量極不尋常。我們必須推算出真實的熔爐數量 x。」',
        },
      ],
    },
    {
      id: 'problem_act3',
      type: 'problem',
      checkpoint: 'CHECKPOINT_4_FORGE_PROBLEM',
      scene: '關卡三・工坊暗爐搜查',
      question: {
        stem:
          '工坊內有 x 座熔爐：若每座配給 8 桶高溫橄欖油，還剩下 12 桶；若每座配給 10 桶，則有 3 座熔爐分配不到，且最後一座熔爐只拿到 4 桶。求熔爐數 x。',
        math: '8x + 12 = 10(x - 4) + 4',
        bankRef: {
          id: 536,
          note: '過與不足應用題。',
        },
      },
    },
    {
      id: 'branch_act3',
      type: 'branch',
      prompt: '選擇推算熔爐數量的視角：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：沒吃飽的熔爐】(靈感 −1)',
          detail: '從沒分到滿額油桶的熔爐數量倒推。',
          kind: 'insight',
          story: { forge_strategy: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「看第二種分法！3 座沒分到、1 座只吃到 4 桶。所以只有 (x - 4) 座熔爐吃滿了 10 桶油！再加上最後那座的 4 桶，總油量就跟第一種分法完全一樣啦！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的整理：過與不足】',
          detail: '列出兩邊代表油桶總量的代數式並求解。',
          kind: 'solve',
          story: { forge_strategy: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「左式油桶總量 8x + 12，右式總量 10(x - 4) + 4 展開為 10x - 36。按照移項規則即可求得 x。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act3',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_4_FORGE_QUIZ',
      scene: '關卡三・工坊暗爐搜查',
      setup: [
        {
          speaker: 'SYS',
          text: '請計算並輸入工坊真實的熔爐總數 x：',
        },
      ],
      question: {
        answerType: 'number',
        stem:
          '工坊內有 x 座熔爐：若每座配給 8 桶高溫橄欖油，還剩下 12 桶；若每座配給 10 桶，則有 3 座熔爐分配不到，且最後一座熔爐只拿到 4 桶。求 x。',
        math: '8x + 12 = 10(x - 4) + 4',
        answer: '24',
        bankRef: { id: 536, note: '答案：24' },
      },
      analysis: {
        speaker: '阿基米德',
        text: '「解出 x ＝ 24 座熔爐，油桶總數高達 204 桶！官方登記這間工坊只有 6 座熔爐，金匠居然私設了 18 座暗爐！他一直在秘密熔化並偷轉黃金！」',
      },
    },

    // ——— 幕四：皇冠混合密度 ———
    {
      id: 'act4_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_5_DENSITY',
      lines: [
        {
          speaker: 'narrator',
          text: '掌握假帳與暗爐的鐵證後，阿基米德封鎖工坊，取回工匠打造完成的 1000 克皇冠進行排水檢測。',
        },
        {
          speaker: '阿基米德',
          text: '1000 克的純金塊排開 50 立方公分的水；但這頂 1000 克的皇冠卻排開了 70 立方公分的水！果然被摻入了密度較低、體積較大的白銀！',
        },
        {
          speaker: 'Numi',
          text: '「白銀就像膨脹的雲朵一樣佔空間！所以排開的水量才會變大啦！」',
        },
        {
          speaker: '姐姐',
          text: '「根據金（密度 20）與銀（密度 10）的體積守恆，設純金重量為 x 克，我們來算出皇冠裡還殘存多少純金。」',
        },
      ],
    },
    {
      id: 'problem_act4',
      type: 'problem',
      checkpoint: 'CHECKPOINT_5_DENSITY_PROBLEM',
      scene: '關卡四・皇冠混合密度推算',
      question: {
        stem:
          '1000 克皇冠排開 70 立方公分的水。純金密度為 20 克/立方公分，白銀密度為 10 克/立方公分。設皇冠中含有純金 x 克，其餘為白銀，求 x。',
        math: '\\dfrac{x}{20} + \\dfrac{1000 - x}{10} = 70',
        bankRef: {
          id: 527,
          note: '含分母的一元一次方程式（密度與體積）。',
        },
      },
    },
    {
      id: 'branch_act4',
      type: 'branch',
      prompt: '選擇計算純金含量的思路：',
      options: [
        {
          id: 'insight',
          label: '【Numi 的直覺：拆成兩個水塊】(靈感 −1)',
          detail: '把皇冠拆成「純金水塊」與「白銀水塊」。',
          kind: 'insight',
          story: { density_strategy: 'numi' },
          resultLines: [
            {
              speaker: 'Numi',
              text: '「把皇冠分成兩塊！純金 x 克佔 (x/20) 水；白銀 (1000-x) 克佔 ((1000-x)/10) 水，兩個水塊加起來必須剛好填滿 70！」',
            },
          ],
        },
        {
          id: 'algebra',
          label: '【NumNum 的整理：同倍消除】',
          detail: '全式乘以最小公倍數 20 化簡分母。',
          kind: 'solve',
          story: { density_strategy: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「全式同乘以公倍數 20：x + 2(1000 - x) = 1400，展開移項，數字就會井然有序地呈現答案。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act4',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_5_DENSITY_QUIZ',
      scene: '關卡四・皇冠混合密度推算',
      setup: [
        {
          speaker: 'SYS',
          text: '請計算並輸入皇冠中含有純金的重量 x（克）：',
        },
      ],
      question: {
        answerType: 'number',
        stem:
          '1000 克皇冠排開 70 立方公分的水。純金密度為 20 克/立方公分，白銀密度為 10 克/立方公分。設皇冠中含有純金 x 克，求 x。',
        math: '\\dfrac{x}{20} + \\dfrac{1000 - x}{10} = 70',
        answer: '600',
        bankRef: { id: 527, note: '答案：600' },
      },
      analysis: {
        speaker: '阿基米德',
        text: '「解出 x ＝ 600 克！這頂皇冠只有 600 克純金，整整 400 克黃金被換成了白銀！這 400 克黃金，剛好完全對應帳冊裡消失的 400 金幣！」',
      },
    },

    // ——— 幕五：阿基米德浮力秤決戰（已補齊 x=7 鐵證說明） ———
    {
      id: 'act5_intro',
      type: 'narrative',
      checkpoint: 'CHECKPOINT_6_BALANCE',
      lines: [
        {
          speaker: 'narrator',
          text: '大殿審判的前夜。阿基米德為了在國王與眾臣面前公開演示，特地製造了一台「阿基米德浮力槓桿秤」。',
        },
        {
          speaker: '阿基米德',
          text: '「單靠排水容器容易有觀察誤差。我設計了這台天平，左邊放皇冠，右邊放等重的純金塊，同時浸入水中。」',
        },
        {
          speaker: 'NumNum',
          text: '「若是純金皇冠，兩邊排水量與浮力會完全相同，天平指針應停在刻度 0；若摻了白銀，體積變大、浮力變大，天平就會向左偏轉。」',
        },
        {
          speaker: '姐姐',
          text: '「左臂受皇冠浮力影響為 (2x-5)/3，右臂受純金浮力為 (x+1)/4。我們設刻度為 x，來算出天平偏轉到平衡時的精確刻度！」',
        },
      ],
    },
    {
      id: 'problem_act5',
      type: 'problem',
      checkpoint: 'CHECKPOINT_6_BALANCE_PROBLEM',
      scene: '關卡五・浮力槓桿刻度調校',
      question: {
        stem:
          '阿基米德調校浮力槓桿秤：左臂受皇冠水中浮力影響，參數為 (2x - 5)/3；右臂受金塊浮力影響，參數為 (x + 1)/4。兩臂浮力差額需達到平衡基準值 1。求平衡刻度 x。',
        math: '\\dfrac{2x - 5}{3} - \\dfrac{x + 1}{4} = 1',
        bankRef: {
          id: 521,
          note: '含分母複雜一元一次方程式。',
        },
      },
    },
    {
      id: 'branch_act5',
      type: 'branch',
      prompt: '選擇去分母與力矩平衝的思路：',
      options: [
        {
          id: 'balance_insight',
          label: '【Numi 的直覺：槓桿同倍放大】(靈感 −1)',
          detail: '將槓桿兩端同時放大 12 倍來消除分數。',
          kind: 'insight',
          resultLines: [
            {
              speaker: 'Numi',
              text: '「把天平兩邊同時放大 12 倍！第一項變成 4(2x - 5)，第二項變成 3(x + 1)，右邊的平衡基準值 1 也別忘了乘以 12 喔！」',
            },
          ],
        },
        {
          id: 'balance_algebra',
          label: '【NumNum 的整理：分配律展開】',
          detail: '同乘以 12，注意負號對分子的分配。',
          kind: 'solve',
          story: { balance_strategy: 'numnum' },
          resultLines: [
            {
              speaker: 'NumNum',
              text: '「同乘 12 消除分母。請注意負號規則：−3(x + 1) 展開後為 −3x − 3，這是數學世界不可違背的規則。」',
            },
          ],
        },
      ],
    },
    {
      id: 'quiz_act5',
      type: 'quiz',
      checkpoint: 'CHECKPOINT_6_BALANCE_QUIZ',
      scene: '關卡五・浮力槓桿刻度調校',
      setup: [
        {
          speaker: 'SYS',
          text: '請輸入計算出浮力槓桿秤的平衡刻度 x：',
        },
      ],
      question: {
        answerType: 'number',
        stem:
          '求解浮力槓桿平衡刻度 x：\\dfrac{2x - 5}{3} - \\dfrac{x + 1}{4} = 1',
        math: '\\dfrac{2x - 5}{3} - \\dfrac{x + 1}{4} = 1',
        answer: '7',
        bankRef: { id: 521, note: '答案：7' },
      },
      analysis: {
        speaker: '阿基米德',
        text: '「解出 x ＝ 7！天平兩端在數值 7 達到了平衡偏轉，左邊皇冠浮力硬生生比右邊純金多出了整整 1 個單位的差額！」',
      },
    },
    {
      id: 'act5_outro',
      type: 'narrative',
      lines: [
        {
          speaker: 'NumNum',
          text: '「這代表只要將天平放入水中，指針就會當場彈到【刻度 7】，而不是純金該有的【刻度 0】。」',
        },
        {
          speaker: '姐姐',
          text: '「沒錯！刻度 7 就是最直觀的鐵證！在大殿上只要水一淹過天平，任何人都能用肉眼看出皇冠被摻假了！」',
        },
        {
          speaker: 'Numi',
          text: '「太酷了！數字變成可以親眼看到的物理現象了！」',
        },
      ],
    },

    // ——— 哲學抉擇與雙結局 ———
    {
      id: 'philosophy_finale',
      type: 'philosophy',
      prompt:
        '算出刻度 x＝7 後，阿基米德掌握了全套鐵證。四人組在審判前夜圍著阿基米德討論著明天的抉擇。',
      note: '重大哲學抉擇：決定本章結局與智者性格。',
      lines: [
        {
          speaker: '姐姐',
          text: '「明天在大殿當眾啟動浮力秤，指針指向刻度 7。數據與物理現象會說明一切，真理高於世俗人情。」',
        },
        {
          speaker: '弟弟',
          text: '「可是老金匠今晚在工坊發抖……他可能是被宮廷貪官威脅才這麼做的。今晚私下找他，給他機會把偷藏的 400 克黃金熔回皇冠吧！數學是用來拯救困境的啊！」',
        },
      ],
      options: [
        {
          id: 'cold',
          label: '【姐姐的理性秩序】',
          detail: '當眾演示，讓邏輯與法律審判金匠。',
          flags: {
            coldlogic_vs_empathy: 1,
            platonism_vs_constructivism: 1,
          },
          flagNote: '冷酷邏輯 ＋1｜柏拉圖主義 ＋1',
          endingId: 'ending_cold',
          resultLines: [
            {
              speaker: '阿基米德',
              text: '……讓數字在國王與世人面前自己說話。真理容不下妥協。',
            },
          ],
        },
        {
          id: 'warm',
          label: '【弟弟的人文溫度】',
          detail: '私下給予機會，逼其交出宮廷貪腐名單。',
          flags: {
            coldlogic_vs_empathy: -1,
            platonism_vs_constructivism: -1,
          },
          flagNote: '人文同理 ＋1｜建構主義 ＋1',
          endingId: 'ending_warm',
          resultLines: [
            {
              speaker: '阿基米德',
              text: '……先救人，並挖出背後的幕後黑手。數學可以成為拯救人的光芒。',
            },
          ],
        },
      ],
    },

    // ——— 雙結局 ———
    {
      id: 'ending_cold',
      type: 'ending',
      rewards: { eurekaCoin: 1 }, // ★ 時機 2：完成結局一時獲得
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局一：【理性的冷酷神殿】' },
        {
          speaker: 'narrator',
          text: '大殿演示中，皇冠與金塊浸入水中，浮力槓桿指針「喀噠」一聲，精確停在刻度 7！',
        },
        {
          speaker: 'NumNum',
          text: '「數據與規律展現了絕對的精準。金匠被逮捕下獄。」',
        },
        {
          speaker: '阿基米德',
          text: '阿基米德看著冰冷的宮殿，對世俗權謀感到厭倦，決定將一生投入純粹抽象的幾何世界。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【理性的冷酷神殿】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
    {
      id: 'ending_warm',
      type: 'ending',
      rewards: { eurekaCoin: 1 }, // ★ 時機 3：完成結局二時獲得
      lines: [
        { speaker: 'SYS', text: '章節結束 — 結局二：【溫暖的理性之光】' },
        {
          speaker: 'narrator',
          text: '前夜阿基米德展現了 x＝7 的浮力數據，老金匠痛哭流涕，連夜將偷藏的 400 克黃金熔回皇冠，並供出脅迫他的宮廷官員。',
        },
        {
          speaker: 'Numi',
          text: '「隔天指針完美停在 0！金匠保住了性命，壞官員也被抓起來了！弟弟的提議太棒了！」',
        },
        {
          speaker: '阿基米德',
          text: '阿基米德看著重新團聚的金匠一家，明白：數學不僅能揭開規律，更能成為守護善良的力量。',
        },
        {
          speaker: 'SYS',
          text: '★ 達成結局【溫暖的理性之光】！獲得【Eureka 幣 × 1】！',
        },
      ],
    },
  ],
};