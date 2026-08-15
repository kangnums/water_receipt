export type Language = 'ko' | 'en' | 'ja' | 'zh';

export const translations = {
  ko: {
    appTitle: "TODAY'S WATER RECEIPT",
    subTitle: "물 사용량 영수증",
    step1Tag: "WATER RECEIPT · 01",
    step1Title: "오늘 물,\n얼마나 썼을까요?",
    step1Desc: "하루 동안 사용한 행동들을 체크해보세요.",
    categoryPersonal: "🛁 개인 위생",
    categoryHousework: "🧺 욕실 & 가사",
    categoryKitchen: "🍳 주방 & 조리",
    categoryDrink: "☕ 음용수",
    issueReceiptBtn: "🧾 오늘의 물 영수증 발행하기",

    step2Tag: "WATER RECEIPT · 02",
    step2Title: "영수증이 발행됐어요",
    receiptHeader: "TODAY'S WATER RECEIPT",
    noRecords: "기록된 항목이 없어요",
    totalLabel: "TOTAL USAGE",
    todayTotalMsg1: "당신은 오늘 하루 동안",
    todayTotalMsg2: "L의 물을 사용했습니다.",
    toAnalysisBtn: "비교 분석 보러가기 →",
    backToChecklistBtn: "체크리스트 수정하기",

    step3Tag: "WATER RECEIPT · 03",
    step3Title: "나는 물을\n얼마나 쓰는 사람일까?",
    vsAverageLabel: "나의 사용량 vs 하루 평균",
    compareCountryLabel: "비교 국가",
    meLabel: "나",
    avgLabel: "하루 평균",
    moreThanAvg: "평균보다 {diff}L ({pct}%) 더 사용",
    lessThanAvg: "평균보다 {diff}L ({pct}%) 적게 사용",
    scarcityTag: "🌍 WATER SCARCITY CHECK",
    scarcityMsg: "오늘 내가 쓴 {total}L는 물 부족 지역(아프리카 기준) 한 가족(5인)의 {daysLo}~{daysHi}일 치 물과 같아요.",
    scarcityFootnote: "※ 유니세프·WHO 통계를 참고한 추정치입니다.",
    reflectionHigh: "생각보다 많이 썼네...",
    reflectionMid: "오늘 하루, 딱 평범한 정도예요.",
    reflectionLow: "오늘은 꽤 아껴 썼네요 🌱",
    toShareBtn: "결과 공유하러 가기 →",

    step4Tag: "WATER RECEIPT · 04",
    step4Title: "스토리로 공유하기",
    streakBadge: "{days}일 연속",
    streakText: "연속 {days}일 기록 중!",
    step4Desc: "저장하거나 SNS로 바로 공유해보세요.",
    friendPollTitle: "내 친구는 얼마 썼을까?",
    pollUnder: "120L 이하일 듯",
    pollOver: "120L 초과일 듯",
    pollToast: "공유하면 친구도 참여할 수 있어요!",
    donationInfo: "굿네이버스 태그와 함께 공유하면 식수지원금이 지원돼요",
    totalDonatedLabel: "누적 기부 적립금",
    donationSuccessToast: "💧 식수 기부 100L 적립 완료! 인스타그램으로 이동합니다 📸",
    instaStoryBtn: "📸 인스타그램 스토리로 공유하기",
    copyImgBtn: "📋 이미지 클립보드 복사",
    saveImgBtn: "📥 이미지 파일 저장하기",
    shareBtn: "🔗 공유 / 링크 복사",
    restartBtn: "처음부터 다시하기",
    toastCopySuccess: "공유 문구가 클립보드에 복사되었어요!",
    toastImgSuccess: "이미지가 성공적으로 저장되었어요!",
    toastImgCopySuccess: "스토리 이미지가 클립보드에 복사되었어요!",
    toastInstaRedirect: "이미지 저장 완료! 인스타그램에 바로 공유해보세요 📸",

    virtualWaterTip: "💡 가상수(Virtual Water) 팁: 커피 1잔(300ml)을 만들기 위해 원두 재배·가공에 들어간 숨은 가상수는 무려 약 140L예요!",

    // Item labels & subtexts
    items: {
      shower: {
        label: "샤워",
        sub: "하루 총 샤워 시간",
        unit: "분",
        runningTapOn: "🚰 물 계속 틀어놓음",
        runningTapOff: "🚿 샤워 중 물 잠그기",
        genderLabel: "성별 구분",
        genderMale: "👨 남성",
        genderFemale: "👩 여성"
      },
      handwash: {
        label: "손 씻기",
        sub: "외출 후 · 화장실 · 식사 전 등",
        unit: "회",
        runningTapOn: "🚰 물 계속 틀어놓음",
        runningTapOff: "🫧 비누칠 때 물 잠그기"
      },
      laundry: {
        label: "세탁기",
        sub: "세탁기 가동 횟수",
        unit: "회"
      },
      toilet: {
        label: "화장실 사용",
        sub: "화장실 사용 횟수",
        unit: "회"
      },
      dish: {
        label: "설거지",
        sub: "설거지 횟수",
        unit: "회",
        runningTapOn: "🚰 물 틀어놓고 헹굼",
        runningTapOff: "🥣 물 받아 쓰기"
      },
      cooking: {
        label: "식재료 세척 및 요리",
        sub: "쌀/채소 세척 및 조리",
        unit: "회"
      },
      tumbler: {
        label: "텀블러/컵 세척",
        sub: "세척 횟수",
        unit: "회"
      },
      brush: {
        label: "양치",
        sub: "양치 횟수",
        unit: "회",
        cupOn: "💧 컵 사용",
        cupOff: "🚰 물 틀어놓음"
      },
      water: {
        label: "마신 물",
        sub: "마신 컵 수",
        unit: "컵"
      },
      drink: {
        label: "커피 · 기타 음료",
        sub: "마신 잔 수",
        unit: "잔"
      }
    },
    showerMinutes: {
      zero: "안함",
      m10: "10분",
      m20: "20분",
      m30: "30분",
      m40: "40분",
      m50: "50분",
      m60: "60분",
      minUnit: "분"
    },
    grades: {
      saver: { title: "Water Saver", sub: "절약형 사용자", pct: "적게 쓴 사람 상위 15%" },
      balancer: { title: "Water Balancer", sub: "평균적 사용자", pct: "평균 수준의 물 사용량" },
      spender: { title: "Water Spender", sub: "여유로운 사용자", pct: "상위 30% 물 사용량" },
      bigSpender: { title: "Water Big Spender", sub: "낭비 주의!", pct: "상위 10% 최다 사용량" }
    }
  },

  en: {
    appTitle: "TODAY'S WATER RECEIPT",
    subTitle: "Daily Water Usage Receipt",
    step1Tag: "WATER RECEIPT · 01",
    step1Title: "How much water\ndid you use today?",
    step1Desc: "Check off your daily activities to calculate.",
    categoryPersonal: "🛁 Personal Hygiene",
    categoryHousework: "🧺 Bathroom & Housework",
    categoryKitchen: "🍳 Kitchen & Cooking",
    categoryDrink: "☕ Drinking Water & Beverages",
    issueReceiptBtn: "🧾 Issue Today's Water Receipt",

    step2Tag: "WATER RECEIPT · 02",
    step2Title: "Your receipt is ready!",
    receiptHeader: "TODAY'S WATER RECEIPT",
    noRecords: "No items checked",
    totalLabel: "TOTAL USAGE",
    todayTotalMsg1: "Today you consumed",
    todayTotalMsg2: "L of water.",
    toAnalysisBtn: "View Comparative Analysis →",
    backToChecklistBtn: "Edit Checklist",

    step3Tag: "WATER RECEIPT · 03",
    step3Title: "How does your usage\ncompare to average?",
    vsAverageLabel: "My Usage vs Daily Average",
    compareCountryLabel: "Compare Country",
    meLabel: "Me",
    avgLabel: "Daily Average",
    moreThanAvg: "{diff}L ({pct}%) more than average",
    lessThanAvg: "{diff}L ({pct}%) less than average",
    scarcityTag: "🌍 WATER SCARCITY CHECK",
    scarcityMsg: "The {total}L you used today equals {daysLo}-{daysHi} days of supply for a family of 5 in water-scarce regions.",
    scarcityFootnote: "※ Estimate based on UNICEF & WHO statistics.",
    reflectionHigh: "More than expected...",
    reflectionMid: "Right around the average today.",
    reflectionLow: "Great job saving water today! 🌱",
    toShareBtn: "Go to Share Results →",

    step4Tag: "WATER RECEIPT · 04",
    step4Title: "Share as a Story",
    streakBadge: "{days} Day Streak",
    streakText: "{days} Day Streak Active!",
    step4Desc: "Save or share directly to social media.",
    friendPollTitle: "How much did your friends use?",
    pollUnder: "Under 120L",
    pollOver: "Over 120L",
    pollToast: "Share with friends so they can check theirs too!",
    donationInfo: "Share with @GoodNeighbors tag to sponsor clean water funds",
    totalDonatedLabel: "Total Clean Water Donated",
    donationSuccessToast: "💧 100L clean water donation recorded! Opening Instagram 📸",
    instaStoryBtn: "📸 Share to Instagram Story",
    copyImgBtn: "📋 Copy Image to Clipboard",
    saveImgBtn: "📥 Save Image File",
    shareBtn: "🔗 Share / Copy Link",
    restartBtn: "Start Over",
    toastCopySuccess: "Text copied to clipboard!",
    toastImgSuccess: "Image saved successfully!",
    toastImgCopySuccess: "Story image copied to clipboard!",
    toastInstaRedirect: "Image saved! Upload it to your Instagram Story 📸",

    virtualWaterTip: "💡 Virtual Water Tip: Producing 1 cup of coffee (300ml) consumes ~140L of virtual water in growing & processing beans!",

    items: {
      shower: {
        label: "Shower",
        sub: "Total daily shower time",
        unit: "m",
        runningTapOn: "🚰 Running Tap Continuously",
        runningTapOff: "🚿 Pause Water While Soaping",
        genderLabel: "Gender",
        genderMale: "👨 Male",
        genderFemale: "👩 Female"
      },
      handwash: {
        label: "Hand Washing",
        sub: "After outdoors, toilet, meals, etc.",
        unit: "times",
        runningTapOn: "🚰 Running Tap",
        runningTapOff: "🫧 Pause Water While Soaping"
      },
      laundry: {
        label: "Laundry Machine",
        sub: "Washing machine runs",
        unit: "times"
      },
      toilet: {
        label: "Bathroom Visits",
        sub: "Number of bathroom visits",
        unit: "times"
      },
      dish: {
        label: "Dishwashing",
        sub: "Dishwashing sessions",
        unit: "times",
        runningTapOn: "🚰 Running Tap",
        runningTapOff: "🥣 Basin Wash"
      },
      cooking: {
        label: "Food Prep & Cooking",
        sub: "Washing ingredients & cooking",
        unit: "times"
      },
      tumbler: {
        label: "Tumbler/Cup Wash",
        sub: "Washing sessions",
        unit: "times"
      },
      brush: {
        label: "Brushing Teeth",
        sub: "Brushing sessions",
        unit: "times",
        cupOn: "💧 Use Cup",
        cupOff: "🚰 Running Tap"
      },
      water: {
        label: "Drinking Water",
        sub: "Cups consumed",
        unit: "cups"
      },
      drink: {
        label: "Coffee & Drinks",
        sub: "Glasses consumed",
        unit: "cups"
      }
    },
    showerMinutes: {
      zero: "0m",
      m10: "10m",
      m20: "20m",
      m30: "30m",
      m40: "40m",
      m50: "50m",
      m60: "60m",
      minUnit: "min"
    },
    grades: {
      saver: { title: "Water Saver", sub: "Eco-Conscious User", pct: "Top 15% lowest water usage" },
      balancer: { title: "Water Balancer", sub: "Average Water User", pct: "Standard average usage" },
      spender: { title: "Water Spender", sub: "Generous Water User", pct: "Top 30% higher usage" },
      bigSpender: { title: "Water Big Spender", sub: "High Usage Alert!", pct: "Top 10% highest usage" }
    }
  },

  ja: {
    appTitle: "TODAY'S WATER RECEIPT",
    subTitle: "水使用量レシート",
    step1Tag: "WATER RECEIPT · 01",
    step1Title: "今日使った水、\nどれくらい？",
    step1Desc: "1日の行動をチェックして計算してみましょう。",
    categoryPersonal: "🛁 個人衛生",
    categoryHousework: "🧺 バス・家事",
    categoryKitchen: "🍳 キッチン・調理",
    categoryDrink: "☕ 飲料水・ドリンク",
    issueReceiptBtn: "🧾 今日の水レシートを発行",

    step2Tag: "WATER RECEIPT · 02",
    step2Title: "レシートが発行されました",
    receiptHeader: "TODAY'S WATER RECEIPT",
    noRecords: "記録がありません",
    totalLabel: "TOTAL USAGE",
    todayTotalMsg1: "あなたは今日1日で",
    todayTotalMsg2: "Lの水を使用しました。",
    toAnalysisBtn: "比較分析を見る →",
    backToChecklistBtn: "チェックリストを修正",

    step3Tag: "WATER RECEIPT · 03",
    step3Title: "自分はどれくらい\n水を使うタイプ？",
    vsAverageLabel: "自分の使用量 vs 1日平均",
    compareCountryLabel: "比較国",
    meLabel: "自分",
    avgLabel: "1日平均",
    moreThanAvg: "平均より {diff}L ({pct}%) 多く使用",
    lessThanAvg: "平均より {diff}L ({pct}%) 節약",
    scarcityTag: "🌍 WATER SCARCITY CHECK",
    scarcityMsg: "今日使った{total}Lは、水不足地域(アフリカ基準)の5人家族의 {daysLo}~{daysHi}日分の生活用水に相当します。",
    scarcityFootnote: "※ UNICEF・WHO統計を参考にした推定値です。",
    reflectionHigh: "思ったより使っていたかも...",
    reflectionMid: "ちょうど平均的な使用量です。",
    reflectionLow: "今日はしっかり節水できました 🌱",
    toShareBtn: "結果をシェアする →",

    step4Tag: "WATER RECEIPT · 04",
    step4Title: "ストーリーで共有",
    streakBadge: "連続 {days}日",
    streakText: "連続 {days}日記録中！",
    step4Desc: "保存してSNSにシェアしてみましょう。",
    friendPollTitle: "友達はどれくらい使った？",
    pollUnder: "120L以下かも",
    pollOver: "120L超かも",
    pollToast: "シェアして友達も招待してみよう！",
    donationInfo: "グッドネイバーズのタグ付きシェアで給水支援基金が積立されます",
    totalDonatedLabel: "累計積立給水基金",
    donationSuccessToast: "💧 給水支援100Lが積立されました！Instagramに移動します 📸",
    instaStoryBtn: "📸 Instagramストーリーズで共有",
    copyImgBtn: "📋 画像をクリップボードにコピー",
    saveImgBtn: "📥 画像ファイルとして保存",
    shareBtn: "🔗 共有 / リンクコピー",
    restartBtn: "最初からやり直す",
    toastCopySuccess: "クリップボードにコピーしました！",
    toastImgSuccess: "画像を保存しました！",
    toastImgCopySuccess: "画像をクリップボードにコピーしました！",
    toastInstaRedirect: "画像を保存しました！Instagramで共有しよう 📸",

    virtualWaterTip: "💡 バーチャルウォーター情報: コーヒー1杯(300ml)の豆の栽培・加工に使われるバーチャルウォーターは約140Lに及びます！",

    items: {
      shower: {
        label: "シャワー",
        sub: "1日の合計シャワー時間",
        unit: "分",
        runningTapOn: "🚰 水를 出しっぱなし",
        runningTapOff: "🚿 泡立て中に水を止める",
        genderLabel: "性別区分",
        genderMale: "👨 男性",
        genderFemale: "👩 女性"
      },
      handwash: {
        label: "手洗い",
        sub: "帰宅後・トイレ後・食事前など",
        unit: "回",
        runningTapOn: "🚰 水を出しっぱなし",
        runningTapOff: "🫧 泡立て時に水を止める"
      },
      laundry: {
        label: "洗濯機",
        sub: "洗濯機を回した回数",
        unit: "回"
      },
      toilet: {
        label: "トイレの使用",
        sub: "トイレの使用回数",
        unit: "回"
      },
      dish: {
        label: "食器洗い",
        sub: "食器洗いの回数",
        unit: "回",
        runningTapOn: "🚰 水を流しながら",
        runningTapOff: "🥣 ため洗い"
      },
      cooking: {
        label: "食材洗い・調理",
        sub: "米・野菜洗いや調理など",
        unit: "回"
      },
      tumbler: {
        label: "タンブラー/カップ洗",
        sub: "洗った回数",
        unit: "回"
      },
      brush: {
        label: "歯みがき",
        sub: "歯みがきの回数",
        unit: "回",
        cupOn: "💧 コップ使用",
        cupOff: "🚰 水を流したまま"
      },
      water: {
        label: "飲んだ水",
        sub: "飲んだ杯数",
        unit: "杯"
      },
      drink: {
        label: "コーヒー・ドリンク",
        sub: "飲んだ杯数",
        unit: "杯"
      }
    },
    showerMinutes: {
      zero: "なし",
      m10: "10分",
      m20: "20分",
      m30: "30分",
      m40: "40分",
      m50: "50分",
      m60: "60分",
      minUnit: "分"
    },
    grades: {
      saver: { title: "Water Saver", sub: "節約ユーザー", pct: "使用量が少ない上位 15%" },
      balancer: { title: "Water Balancer", sub: "標準ユーザー", pct: "平均的な使用量" },
      spender: { title: "Water Spender", sub: "ゆったりユーザー", pct: "上位 30% の使用量" },
      bigSpender: { title: "Water Big Spender", sub: "節水注意！", pct: "上位 10% の最多使用" }
    }
  },

  zh: {
    appTitle: "TODAY'S WATER RECEIPT",
    subTitle: "用水量收据",
    step1Tag: "WATER RECEIPT · 01",
    step1Title: "今天你用了\n多少水？",
    step1Desc: "勾选你今天的日常用水行为。",
    categoryPersonal: "🛁 个人卫生",
    categoryHousework: "🧺 卫浴与家务",
    categoryKitchen: "🍳 厨房与烹饪",
    categoryDrink: "☕ 饮用水与饮料",
    issueReceiptBtn: "🧾 生成今日用水收据",

    step2Tag: "WATER RECEIPT · 02",
    step2Title: "收据已生成！",
    receiptHeader: "TODAY'S WATER RECEIPT",
    noRecords: "暂无纪录",
    totalLabel: "TOTAL USAGE",
    todayTotalMsg1: "你今天一共消耗了",
    todayTotalMsg2: "升水。",
    toAnalysisBtn: "查看对比分析 →",
    backToChecklistBtn: "修改清单",

    step3Tag: "WATER RECEIPT · 03",
    step3Title: "我的用水量\n处于什么水平？",
    vsAverageLabel: "我的用水量 vs 日平均值",
    compareCountryLabel: "比较国家",
    meLabel: "我",
    avgLabel: "日平均",
    moreThanAvg: "比平均多用 {diff}升 ({pct}%)",
    lessThanAvg: "比平均少用 {diff}升 ({pct}%)",
    scarcityTag: "🌍 WATER SCARCITY CHECK",
    scarcityMsg: "你今天消耗的 {total}升水，相当于缺水地区（非洲标准）一个5口之家 {daysLo}~{daysHi} 天的生活用水。",
    scarcityFootnote: "※ 依据联合国儿童基金会与世卫组织统计数据估算。",
    reflectionHigh: "比想象中用得多呢...",
    reflectionMid: "今天处于非常标准的平均水平。",
    reflectionLow: "今天非常注重节约用水！🌱",
    toShareBtn: "去分享结果 →",

    step4Tag: "WATER RECEIPT · 04",
    step4Title: "分享到限时动态",
    streakBadge: "连续 {days}天",
    streakText: "连续 {days}天打卡！",
    step4Desc: "保存图片或直接分享至社交平台。",
    friendPollTitle: "猜猜你的朋友用了多少水？",
    pollUnder: "120升以下",
    pollOver: "120升以上",
    pollToast: "分享给朋友，让他们也来测测看！",
    donationInfo: "加上 Good Neighbors 标签分享，将由企业捐赠饮水基金",
    totalDonatedLabel: "累计捐赠水资源",
    donationSuccessToast: "💧 100L饮水公益基金已成功计入！正在前往 Instagram 📸",
    instaStoryBtn: "📸 分享到 Instagram 动态",
    copyImgBtn: "📋 复制图片到剪贴板",
    saveImgBtn: "📥 保存图片文件",
    shareBtn: "🔗 分享 / 复制链接",
    restartBtn: "重新测试",
    toastCopySuccess: "文案已复制到剪贴板！",
    toastImgSuccess: "图片已成功保存！",
    toastImgCopySuccess: "动态图片已复制到剪贴板！",
    toastInstaRedirect: "图片已保存！可直接上传至 Instagram 📸",

    virtualWaterTip: "💡 虚拟水知识：制作1杯咖啡(300ml)，从种植到加工环节消耗的“虚拟水”高昂至约140升！",

    items: {
      shower: {
        label: "淋浴",
        sub: "一天淋浴总时长",
        unit: "分钟",
        runningTapOn: "🚰 全程不关水",
        runningTapOff: "🚿 擦沐浴露时关水",
        genderLabel: "性别区分",
        genderMale: "👨 男性",
        genderFemale: "👩 女性"
      },
      handwash: {
        label: "洗手",
        sub: "外出归来、饭前便后等",
        unit: "次",
        runningTapOn: "🚰 全程开着水",
        runningTapOff: "🫧 打皂时关水"
      },
      laundry: {
        label: "洗衣机",
        sub: "使用洗衣机次数",
        unit: "次"
      },
      toilet: {
        label: "使用洗手间",
        sub: "使用洗手间次数",
        unit: "次"
      },
      dish: {
        label: "洗碗",
        sub: "洗碗次数",
        unit: "次",
        runningTapOn: "🚰 开着水冲洗",
        runningTapOff: "🥣 蓄水洗涤"
      },
      cooking: {
        label: "食材清洗与烹饪",
        sub: "洗米、洗菜及煮汤调配",
        unit: "次"
      },
      tumbler: {
        label: "清洗水杯/保温杯",
        sub: "清洗次数",
        unit: "次"
      },
      brush: {
        label: "刷牙",
        sub: "刷牙次数",
        unit: "次",
        cupOn: "💧 使用漱口杯",
        cupOff: "🚰 不关水龙头"
      },
      water: {
        label: "饮用水",
        sub: "饮用杯数",
        unit: "杯"
      },
      drink: {
        label: "咖啡与饮料",
        sub: "饮用杯数",
        unit: "杯"
      }
    },
    showerMinutes: {
      zero: "无",
      m10: "10分钟",
      m20: "20分钟",
      m30: "30分钟",
      m40: "40分钟",
      m50: "50分钟",
      m60: "60分钟",
      minUnit: "分钟"
    },
    grades: {
      saver: { title: "Water Saver", sub: "环保节水达人", pct: "用水量少于 85% 的用户" },
      balancer: { title: "Water Balancer", sub: "标准用水用户", pct: "处于平均用水水平" },
      spender: { title: "Water Spender", sub: "充裕用水用户", pct: "高于 30% 用户" },
      bigSpender: { title: "Water Big Spender", sub: "注意节约！", pct: "用水量最高 10%" }
    }
  }
};
