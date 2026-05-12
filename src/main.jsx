import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Database,
  Download,
  Filter,
  Info,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Mic,
  Search,
  Smartphone,
  TableProperties,
  Utensils
} from "lucide-react";
import { verifyPhone } from "./verifyPhone.js";
import "./styles.css";

const translations = {
  en: {
    official: "An official nutrition data prototype for Mongolia administrative foods",
    agency: "Mongolia Nutrition Data Center",
    title: "FoodData Mongolia",
    subtitle: "Search regional foods, view nutrient profiles, and filter by aimag, soum, or Ulaanbaatar district.",
    navFood: "Food Search",
    navComponent: "Component Search",
    navDocs: "Data Type Documentation",
    navDownload: "Download Data",
    navAbout: "About Us",
    searchTypeFood: "Food Search",
    searchTypeComponent: "Component Search",
    searchPlaceholder: "Search foods, e.g. airag, buuz, camel milk",
    search: "Search",
    voiceSearch: "Voice search",
    listening: "Listening...",
    speechUnsupported: "Speech recognition is not supported in this browser. Use Chrome.",
    language: "Language",
    serving: "Serving",
    searchHintDefault: "Search across all foods, vegetables, dairy, meat, and grains.",
    searchHint: (count) => `${count} results: press Enter or Search to open the first result.`,
    filters: "Filter Results",
    dataType: "Data Type",
    regionMap: "Region Map",
    searchResults: "Search results",
    foodsIn: (region) => `Foods in ${region}`,
    noResults: "No results found. Search by food, vegetable, or category name.",
    breadcrumb: (region) => `Food Search / ${region} / Food Details`,
    download: "Download",
    cite: "Cite",
    nutrients: "Nutrients",
    foodDetails: "Food Details",
    districts: "Districts",
    soums: "Soums",
    valuesShown: (basis) => `Values shown ${basis === "100g" ? "per 100 g" : "per serving"}.`,
    aiLoading: "Mazaalai AI loading...",
    aiButton: "Mazaalai AI explanation",
    aiTitle: "Mazaalai AI information",
    imageSearch: "Search by image",
    imageSearching: "Analyzing image...",
    imageSearchHint: "Upload a food photo. Mazaalai AI will identify the closest catalog food and open its detail page.",
    fullProfile: "Full food profile",
    ingredients: "Typical ingredients",
    cookingMethod: "How to make it",
    regionalFeatures: "Regional features",
    localFoodGallery: "Local foods in this region",
    aimagFocus: "Aimag focus",
    showAllRegions: "Show all regions",
    commonInSoums: "Common soum context",
    backToAll: "Back to all foods",
    videoGuide: "Cooking video",
    videoSearch: "Find cooking videos on YouTube",
    readAiText: "Read AI text",
    readingAiText: "Reading...",
    ttsError: "TTS service is unavailable. Start the local TTS server on port 8000.",
    heightCm: "Height (cm)",
    weightKg: "Weight (kg)",
    personalFit: "Personal fit",
    personalFitHint: "Optional: add height and weight before asking Mazaalai AI.",
    fitGoodTitle: "Suitable for you",
    fitCautionTitle: "Suitable in a small portion",
    fitNotTitle: "Use caution with this food",
    fitMissing: "Enter height and weight to see whether this food fits you.",
    loginTitle: "Login for advanced tools",
    loginHint: "Login unlocks Mazaalai AI, BMI guidance, image search, and text-to-speech.",
    phonePlaceholder: "Phone number",
    loginButton: "Verify phone",
    loginChecking: "Waiting for SMS...",
    loginSuccess: "Phone verified. Advanced tools are unlocked.",
    loginSuccessTitle: "Verified",
    loginSuccessCaption: "Your phone number is confirmed. Advanced tools are now active.",
    loginFailed: "Phone verification failed or expired.",
    openSms: "Open SMS app",
    systemMessage: "System message",
    smsCodeLabel: "SMS code to send",
    verificationWaiting: "Confirming SMS...",
    lockedFeature: "Login to use Mazaalai AI, BMI guidance, image search, and TTS.",
    imageUnverified: "Verified photo not available",
    nutrient: "Nutrient",
    amount: "Amount",
    unit: "Unit",
    derivation: "Derivation",
    source: "Source",
    sourceNote: "Prototype nutrient values. Links open reference sources for verification; they are not a claim of exact laboratory values for this exact item.",
    description: "Description",
    publicationDate: "Publication date",
    region: "Region",
    center: "Center",
    totalLocalFoods: "Total local foods",
    totalAdminUnits: "Total administrative units",
    searchDistricts: "Search districts",
    searchSoums: "Search soums",
    capitalCity: "Capital city",
    aimag: "Aimag",
    coverage: "Coverage",
    localFoods: "Local foods",
    foodCategory: "Food category",
    national: "Mongolia",
    nutritionStats: "Nutrition statistics",
    kcalDay: "kcal/day",
    protein: "protein",
    dairyServings: "dairy servings",
    produce: "produce",
    aimags: "aimags",
    ubDistricts: "UB districts"
  },
  mn: {
    official: "Монголын засаг захиргааны хүнсний шим тэжээлийн өгөгдлийн туршилтын систем",
    agency: "Монголын Шим Тэжээлийн Өгөгдлийн Төв",
    title: "FoodData Mongolia",
    subtitle: "Орон нутгийн хүнс хайх, шим тэжээлийг харах, аймаг, сум, Улаанбаатарын дүүргээр шүүх.",
    navFood: "Хүнс хайх",
    navComponent: "Бүрэлдэхүүн хайх",
    navDocs: "Өгөгдлийн төрөл",
    navDownload: "Өгөгдөл татах",
    navAbout: "Бидний тухай",
    searchTypeFood: "Хүнс хайх",
    searchTypeComponent: "Бүрэлдэхүүн хайх",
    searchPlaceholder: "Хоол хайх: airag, buuz, camel milk гэх мэт",
    search: "Хайх",
    voiceSearch: "Дуугаар хайх",
    listening: "Сонсож байна...",
    speechUnsupported: "Таны хөтөч яриа танихгүй байна. Chrome ашиглана уу.",
    language: "Хэл",
    serving: "Порц",
    searchHintDefault: "Бүх хоол, ногоо, сүү цагаан идээ, мах, үр тариа дундаас хайна.",
    searchHint: (count) => `${count} илэрц: Enter эсвэл Search дарвал эхний илэрцийг нээнэ.`,
    filters: "Шүүлтүүр",
    dataType: "Өгөгдлийн төрөл",
    regionMap: "Бүсийн газрын зураг",
    searchResults: "Хайлтын илэрц",
    foodsIn: (region) => `${region} дахь хүнс`,
    noResults: "Илэрц олдсонгүй. Хоол, ногоо, ангиллын нэрээр хайна уу.",
    breadcrumb: (region) => `Хүнс хайх / ${region} / Дэлгэрэнгүй`,
    download: "Татах",
    cite: "Эшлэх",
    nutrients: "Шим тэжээл",
    foodDetails: "Хүнсний дэлгэрэнгүй",
    districts: "Дүүргүүд",
    soums: "Сумууд",
    valuesShown: (basis) => `Утгууд ${basis === "100g" ? "100 г тутамд" : "нэг порц тутамд"} харагдаж байна.`,
    aiLoading: "Mazaalai AI уншиж байна...",
    aiButton: "Mazaalai AI тайлбар",
    aiTitle: "Mazaalai AI мэдээлэл",
    imageSearch: "Зургаар хайх",
    imageSearching: "Зураг таньж байна...",
    imageSearchHint: "Хоолны зураг оруулбал Mazaalai AI catalog дундаас хамгийн ойр хоолыг таньж detail хуудсыг нээнэ.",
    fullProfile: "Хоолны бүрэн мэдээлэл",
    ingredients: "Түгээмэл орц",
    cookingMethod: "Яаж хийх вэ",
    regionalFeatures: "Аймаг, сумын онцлог",
    localFoodGallery: "Орон нутгийн хүнс",
    aimagFocus: "Аймгийн дэлгэрэнгүй",
    showAllRegions: "Бүх бүсийг харуулах",
    commonInSoums: "Сумдын хэрэглээний онцлог",
    backToAll: "Бүх хоол руу буцах",
    videoGuide: "Хийх бичлэг",
    videoSearch: "YouTube дээр хийх бичлэг хайх",
    readAiText: "AI текст унших",
    readingAiText: "Уншиж байна...",
    ttsError: "TTS service ажиллахгүй байна. Local TTS server-ийг 8000 port дээр асаана уу.",
    heightCm: "Өндөр (см)",
    weightKg: "Жин (кг)",
    personalFit: "Танд тохирох эсэх",
    personalFitHint: "Заавал биш: Mazaalai AI асуухаас өмнө өндөр, жингээ оруулна.",
    fitGoodTitle: "Танд тохирч байна",
    fitCautionTitle: "Бага порцоор тохирно",
    fitNotTitle: "Тохиромж багатай",
    fitMissing: "Өндөр, жингээ оруулбал энэ хоол танд тохирох эсэхийг харуулна.",
    loginTitle: "Нэмэлт боломж нээх",
    loginHint: "Login хийснээр Mazaalai AI, биеийн жингийн индекс, зургаар хайх, TTS уншуулах эрх нээгдэнэ.",
    phonePlaceholder: "Утасны дугаар",
    loginButton: "Утсаар баталгаажуулах",
    loginChecking: "SMS илгээхийг хүлээж байна...",
    loginSuccess: "Tany huselt amjilltai batalgaajilaa. Mazaalai hiimel  oyund suurilsan Mongoliin food data systemd  tavtai moril. Hogjuulsen: Adiyasuren",
    loginSuccessTitle: "Амжилттай",
    loginSuccessCaption: "Tany huselt amjilltai batalgaajilaa. Mazaalai hiimel  oyund suurilsan Mongoliin food data systemd  tavtai moril. Hogjuulsen: Adiyasuren",
    loginFailed: "Баталгаажуулалт амжилтгүй эсвэл хугацаа дууссан.",
    openSms: "SMS app нээх",
    systemMessage: "Системийн заавар",
    smsCodeLabel: "Илгээх SMS код",
    verificationWaiting: "Баталгаажуулж байна...",
    lockedFeature: "Mazaalai AI, BMI, зургаар хайх, TTS ашиглахын тулд login хийнэ үү.",
    imageUnverified: "Баталгаатай зураг одоогоор байхгүй",
    nutrient: "Шим тэжээл",
    amount: "Хэмжээ",
    unit: "Нэгж",
    derivation: "Тайлбар",
    source: "Эх сурвалж",
    sourceNote: "Шим тэжээлийн утгууд нь prototype тооцоолол. Link нь шалгах reference эх сурвалж руу орно, тухайн хоолны яг лабораторийн баталгаатай утга гэж үзэхгүй.",
    description: "Тодорхойлолт",
    publicationDate: "Нийтэлсэн огноо",
    region: "Бүс",
    center: "Төв",
    totalLocalFoods: "Орон нутгийн хүнс",
    totalAdminUnits: "Засаг захиргааны нэгж",
    searchDistricts: "Дүүрэг хайх",
    searchSoums: "Сум хайх",
    capitalCity: "Нийслэл",
    aimag: "Аймаг",
    coverage: "Хамрах хүрээ",
    localFoods: "Орон нутгийн хүнс",
    foodCategory: "Хүнсний ангилал",
    national: "Монгол",
    nutritionStats: "Шим тэжээлийн үзүүлэлт",
    kcalDay: "ккал/өдөр",
    protein: "уураг",
    dairyServings: "сүүний порц",
    produce: "ногоо, жимс",
    aimags: "аймаг",
    ubDistricts: "УБ дүүрэг"
  },
  ko: {
    official: "몽골 행정구역 식품 영양 데이터 프로토타입",
    agency: "몽골 영양 데이터 센터",
    title: "FoodData Mongolia",
    subtitle: "지역 식품을 검색하고 영양 성분을 확인하며 아이막, 솜, 울란바토르 구별로 필터링합니다.",
    navFood: "식품 검색",
    navComponent: "성분 검색",
    navDocs: "데이터 유형 문서",
    navDownload: "데이터 다운로드",
    navAbout: "소개",
    searchTypeFood: "식품 검색",
    searchTypeComponent: "성분 검색",
    searchPlaceholder: "식품 검색: airag, buuz, camel milk",
    search: "검색",
    voiceSearch: "음성 검색",
    listening: "듣는 중...",
    speechUnsupported: "이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용하세요.",
    language: "언어",
    serving: "1회 제공량",
    searchHintDefault: "모든 식품, 채소, 유제품, 육류, 곡물에서 검색합니다.",
    searchHint: (count) => `${count}개 결과: Enter 또는 Search를 누르면 첫 결과가 열립니다.`,
    filters: "결과 필터",
    dataType: "데이터 유형",
    regionMap: "지역 지도",
    searchResults: "검색 결과",
    foodsIn: (region) => `${region} 식품`,
    noResults: "결과가 없습니다. 식품, 채소 또는 분류명으로 검색하세요.",
    breadcrumb: (region) => `식품 검색 / ${region} / 식품 상세`,
    download: "다운로드",
    cite: "인용",
    nutrients: "영양소",
    foodDetails: "식품 상세",
    districts: "구",
    soums: "솜",
    valuesShown: (basis) => `${basis === "100g" ? "100g당" : "1회 제공량당"} 값입니다.`,
    aiLoading: "Mazaalai AI 로딩 중...",
    aiButton: "Mazaalai AI 설명",
    aiTitle: "Mazaalai AI 정보",
    imageSearch: "이미지로 검색",
    imageSearching: "이미지 분석 중...",
    imageSearchHint: "음식 사진을 올리면 Mazaalai AI가 가장 가까운 카탈로그 식품을 찾아 상세 페이지를 엽니다.",
    fullProfile: "전체 식품 정보",
    ingredients: "일반 재료",
    cookingMethod: "만드는 방법",
    regionalFeatures: "지역 특징",
    localFoodGallery: "이 지역의 음식",
    aimagFocus: "아이막 상세",
    showAllRegions: "전체 지역 보기",
    commonInSoums: "솜별 이용 특징",
    backToAll: "전체 식품으로 돌아가기",
    videoGuide: "조리 영상",
    videoSearch: "YouTube에서 조리 영상 찾기",
    readAiText: "AI 텍스트 읽기",
    readingAiText: "읽는 중...",
    ttsError: "TTS 서비스를 사용할 수 없습니다. 로컬 TTS 서버를 8000 포트에서 실행하세요.",
    heightCm: "키 (cm)",
    weightKg: "몸무게 (kg)",
    personalFit: "개인 적합성",
    personalFitHint: "선택 사항: Mazaalai AI에 묻기 전에 키와 몸무게를 입력하세요.",
    fitGoodTitle: "잘 맞습니다",
    fitCautionTitle: "소량이면 적합합니다",
    fitNotTitle: "주의가 필요합니다",
    fitMissing: "키와 몸무게를 입력하면 이 음식의 적합성을 볼 수 있습니다.",
    loginTitle: "고급 도구 로그인",
    loginHint: "로그인하면 Mazaalai AI, BMI 안내, 이미지 검색, TTS를 사용할 수 있습니다.",
    phonePlaceholder: "전화번호",
    loginButton: "전화 인증",
    loginChecking: "SMS 대기 중...",
    loginSuccess: "전화 인증 완료. 고급 도구가 열렸습니다.",
    loginSuccessTitle: "완료",
    loginSuccessCaption: "전화번호가 확인되었습니다. 고급 도구를 사용할 수 있습니다.",
    loginFailed: "전화 인증에 실패했거나 만료되었습니다.",
    openSms: "SMS 앱 열기",
    systemMessage: "시스템 안내",
    smsCodeLabel: "보낼 SMS 코드",
    verificationWaiting: "인증 확인 중...",
    lockedFeature: "Mazaalai AI, BMI, 이미지 검색, TTS를 사용하려면 로그인하세요.",
    imageUnverified: "검증된 사진 없음",
    nutrient: "영양소",
    amount: "양",
    unit: "단위",
    derivation: "산출 근거",
    source: "출처",
    sourceNote: "영양 값은 프로토타입 추정치입니다. 링크는 검증용 참고 출처이며 이 항목의 정확한 실험실 값이라는 뜻은 아닙니다.",
    description: "설명",
    publicationDate: "게시일",
    region: "지역",
    center: "중심지",
    totalLocalFoods: "지역 식품 수",
    totalAdminUnits: "행정 단위 수",
    searchDistricts: "구 검색",
    searchSoums: "솜 검색",
    capitalCity: "수도",
    aimag: "아이막",
    coverage: "범위",
    localFoods: "지역 식품",
    foodCategory: "식품 분류",
    national: "몽골",
    nutritionStats: "영양 통계",
    kcalDay: "kcal/일",
    protein: "단백질",
    dairyServings: "유제품 섭취량",
    produce: "채소/과일",
    aimags: "아이막",
    ubDistricts: "UB 구"
  },
  zh: {
    official: "蒙古行政区食品营养数据原型",
    agency: "蒙古营养数据中心",
    title: "FoodData Mongolia",
    subtitle: "搜索地区食品，查看营养信息，并按省、苏木或乌兰巴托区筛选。",
    navFood: "食品搜索",
    navComponent: "成分搜索",
    navDocs: "数据类型文档",
    navDownload: "下载数据",
    navAbout: "关于我们",
    searchTypeFood: "食品搜索",
    searchTypeComponent: "成分搜索",
    searchPlaceholder: "搜索食品，例如 airag、buuz、camel milk",
    search: "搜索",
    voiceSearch: "语音搜索",
    listening: "正在聆听...",
    speechUnsupported: "此浏览器不支持语音识别。请使用 Chrome。",
    language: "语言",
    serving: "每份",
    searchHintDefault: "在所有食品、蔬菜、乳制品、肉类和谷物中搜索。",
    searchHint: (count) => `${count} 个结果：按 Enter 或 Search 打开第一个结果。`,
    filters: "筛选结果",
    dataType: "数据类型",
    regionMap: "地区地图",
    searchResults: "搜索结果",
    foodsIn: (region) => `${region} 的食品`,
    noResults: "未找到结果。请按食品、蔬菜或类别名称搜索。",
    breadcrumb: (region) => `食品搜索 / ${region} / 食品详情`,
    download: "下载",
    cite: "引用",
    nutrients: "营养素",
    foodDetails: "食品详情",
    districts: "区",
    soums: "苏木",
    valuesShown: (basis) => `数值按${basis === "100g" ? "每100克" : "每份"}显示。`,
    aiLoading: "Mazaalai AI 加载中...",
    aiButton: "Mazaalai AI 说明",
    aiTitle: "Mazaalai AI 信息",
    imageSearch: "以图搜食",
    imageSearching: "正在分析图片...",
    imageSearchHint: "上传食品照片，Mazaalai AI 会识别最接近的目录食品并打开详情页。",
    fullProfile: "完整食品信息",
    ingredients: "常见配料",
    cookingMethod: "制作方法",
    regionalFeatures: "地区特色",
    localFoodGallery: "本地区特色食品",
    aimagFocus: "省级详情",
    showAllRegions: "显示所有地区",
    commonInSoums: "苏木使用特点",
    backToAll: "返回所有食品",
    videoGuide: "制作视频",
    videoSearch: "在 YouTube 查找制作视频",
    readAiText: "朗读 AI 文本",
    readingAiText: "正在朗读...",
    ttsError: "TTS 服务不可用。请在 8000 端口启动本地 TTS 服务。",
    heightCm: "身高 (cm)",
    weightKg: "体重 (kg)",
    personalFit: "个人适配",
    personalFitHint: "可选：询问 Mazaalai AI 前输入身高和体重。",
    fitGoodTitle: "适合你",
    fitCautionTitle: "少量食用较合适",
    fitNotTitle: "需要谨慎食用",
    fitMissing: "输入身高和体重后可查看该食物是否适合你。",
    loginTitle: "登录使用高级工具",
    loginHint: "登录后可使用 Mazaalai AI、BMI 建议、图片搜索和语音朗读。",
    phonePlaceholder: "手机号",
    loginButton: "验证手机",
    loginChecking: "等待短信...",
    loginSuccess: "手机已验证。高级工具已解锁。",
    loginSuccessTitle: "验证成功",
    loginSuccessCaption: "您的手机号已确认，高级工具已启用。",
    loginFailed: "手机验证失败或已过期。",
    openSms: "打开短信应用",
    systemMessage: "系统提示",
    smsCodeLabel: "要发送的短信验证码",
    verificationWaiting: "正在确认短信...",
    lockedFeature: "请登录以使用 Mazaalai AI、BMI、图片搜索和语音朗读。",
    imageUnverified: "暂无已验证照片",
    nutrient: "营养素",
    amount: "含量",
    unit: "单位",
    derivation: "来源说明",
    source: "来源",
    sourceNote: "营养数值为原型估算。链接用于打开核验参考来源，并不表示该食品的精确实验室检测值。",
    description: "描述",
    publicationDate: "发布日期",
    region: "地区",
    center: "中心",
    totalLocalFoods: "本地食品总数",
    totalAdminUnits: "行政单位总数",
    searchDistricts: "搜索区",
    searchSoums: "搜索苏木",
    capitalCity: "首都",
    aimag: "省",
    coverage: "覆盖范围",
    localFoods: "本地食品",
    foodCategory: "食品类别",
    national: "蒙古",
    nutritionStats: "营养统计",
    kcalDay: "千卡/天",
    protein: "蛋白质",
    dairyServings: "乳制品份数",
    produce: "蔬果",
    aimags: "省",
    ubDistricts: "乌兰巴托区"
  },
  ru: {
    official: "Прототип данных о питании продуктов административных единиц Монголии",
    agency: "Монгольский центр данных о питании",
    title: "FoodData Mongolia",
    subtitle: "Ищите региональные продукты, смотрите нутриенты и фильтруйте по аймаку, суму или району Улан-Батора.",
    navFood: "Поиск продуктов",
    navComponent: "Поиск компонентов",
    navDocs: "Типы данных",
    navDownload: "Скачать данные",
    navAbout: "О нас",
    searchTypeFood: "Поиск продуктов",
    searchTypeComponent: "Поиск компонентов",
    searchPlaceholder: "Искать: airag, buuz, camel milk",
    search: "Поиск",
    voiceSearch: "Голосовой поиск",
    listening: "Слушаю...",
    speechUnsupported: "Этот браузер не поддерживает распознавание речи. Используйте Chrome.",
    language: "Язык",
    serving: "Порция",
    searchHintDefault: "Поиск по всем продуктам, овощам, молочным продуктам, мясу и зерновым.",
    searchHint: (count) => `${count} результатов: нажмите Enter или Search, чтобы открыть первый результат.`,
    filters: "Фильтры",
    dataType: "Тип данных",
    regionMap: "Карта регионов",
    searchResults: "Результаты поиска",
    foodsIn: (region) => `Продукты в ${region}`,
    noResults: "Ничего не найдено. Ищите по названию продукта, овоща или категории.",
    breadcrumb: (region) => `Поиск продуктов / ${region} / Детали продукта`,
    download: "Скачать",
    cite: "Цитировать",
    nutrients: "Нутриенты",
    foodDetails: "Детали продукта",
    districts: "Районы",
    soums: "Сумы",
    valuesShown: (basis) => `Значения указаны ${basis === "100g" ? "на 100 г" : "на порцию"}.`,
    aiLoading: "Mazaalai AI загружается...",
    aiButton: "Объяснение Mazaalai AI",
    aiTitle: "Информация Mazaalai AI",
    imageSearch: "Поиск по фото",
    imageSearching: "Анализ изображения...",
    imageSearchHint: "Загрузите фото еды. Mazaalai AI найдет ближайший продукт в каталоге и откроет детали.",
    fullProfile: "Полная информация о продукте",
    ingredients: "Типичные ингредиенты",
    cookingMethod: "Как приготовить",
    regionalFeatures: "Региональные особенности",
    localFoodGallery: "Местные продукты региона",
    aimagFocus: "Детали аймака",
    showAllRegions: "Показать все регионы",
    commonInSoums: "Особенности по сумам",
    backToAll: "Назад ко всем продуктам",
    videoGuide: "Видео приготовления",
    videoSearch: "Найти видео приготовления на YouTube",
    readAiText: "Прочитать текст AI",
    readingAiText: "Чтение...",
    ttsError: "Сервис TTS недоступен. Запустите локальный TTS сервер на порту 8000.",
    heightCm: "Рост (см)",
    weightKg: "Вес (кг)",
    personalFit: "Персональная оценка",
    personalFitHint: "Необязательно: укажите рост и вес перед запросом к Mazaalai AI.",
    fitGoodTitle: "Вам подходит",
    fitCautionTitle: "Подходит небольшой порцией",
    fitNotTitle: "Лучше употреблять осторожно",
    fitMissing: "Введите рост и вес, чтобы увидеть персональную оценку.",
    loginTitle: "Вход для расширенных функций",
    loginHint: "После входа доступны Mazaalai AI, BMI, поиск по фото и озвучивание текста.",
    phonePlaceholder: "Номер телефона",
    loginButton: "Подтвердить телефон",
    loginChecking: "Ожидание SMS...",
    loginSuccess: "Телефон подтвержден. Расширенные функции открыты.",
    loginSuccessTitle: "Успешно",
    loginSuccessCaption: "Ваш номер подтвержден. Расширенные инструменты активированы.",
    loginFailed: "Подтверждение не удалось или истекло.",
    openSms: "Открыть SMS",
    systemMessage: "Системное сообщение",
    smsCodeLabel: "SMS-код для отправки",
    verificationWaiting: "Подтверждаем SMS...",
    lockedFeature: "Войдите, чтобы использовать Mazaalai AI, BMI, поиск по фото и TTS.",
    imageUnverified: "Проверенное фото недоступно",
    nutrient: "Нутриент",
    amount: "Количество",
    unit: "Ед.",
    derivation: "Источник",
    source: "Источник",
    sourceNote: "Питательные значения являются прототипной оценкой. Ссылки ведут к справочным источникам для проверки и не являются точными лабораторными значениями этого продукта.",
    description: "Описание",
    publicationDate: "Дата публикации",
    region: "Регион",
    center: "Центр",
    totalLocalFoods: "Местные продукты",
    totalAdminUnits: "Административные единицы",
    searchDistricts: "Искать районы",
    searchSoums: "Искать сумы",
    capitalCity: "Столица",
    aimag: "Аймак",
    coverage: "Охват",
    localFoods: "Местные продукты",
    foodCategory: "Категория продукта",
    national: "Монголия",
    nutritionStats: "Статистика питания",
    kcalDay: "ккал/день",
    protein: "белок",
    dairyServings: "порции молочного",
    produce: "овощи/фрукты",
    aimags: "аймаков",
    ubDistricts: "районов UB"
  }
};

const languageOptions = [
  ["en", "English"],
  ["mn", "Монгол"],
  ["ko", "한국어"],
  ["zh", "中文"],
  ["ru", "Русский"]
];
const mulsLogoUrl = "https://www.muls.edu.mn/img/logo_muls.png";

const languageNames = {
  en: "English",
  mn: "Mongolian",
  ko: "Korean",
  zh: "Chinese",
  ru: "Russian"
};
const speechLanguageCodes = {
  mn: "mn-MN",
  en: "en-US",
  ko: "ko-KR",
  zh: "zh-CN",
  ru: "ru-RU"
};

export const provinceSoums = {
  Arkhangai: ["Battsengel", "Bulgan", "Chuluut", "Erdenebulgan", "Erdenemandal", "Ikh-Tamir", "Jargalant", "Khangai", "Khashaat", "Khairkhan", "Khotont", "Ögii nuur", "Ölziit", "Öndör-Ulaan", "Tariat", "Tsakhir", "Tsenkher", "Tsetserleg", "Tüvshrüülekh"],
  "Bayan-Ölgii": ["Altantsögts", "Altai", "Bayannuur", "Bugat", "Bulgan", "Buyant", "Delüün", "Nogoonnuur", "Ölgii", "Sagsai", "Tolbo", "Tsagaannuur", "Tsengel", "Ulaankhus"],
  Bayankhongor: ["Baatsagaan", "Bayan-Öndör", "Bayan-Ovoo", "Bayanbulag", "Bayangovi", "Bayankhongor", "Bayanlig", "Bayantsagaan", "Bogd", "Bömbögör", "Buutsagaan", "Erdenetsogt", "Galuut", "Gurvanbulag", "Jargalant", "Jinst", "Khüreemaral", "Ölziit", "Shinejinst", "Zag"],
  Bulgan: ["Bayan-Agt", "Bayanuur", "Bugat", "Bulgan", "Büregkhangai", "Dashinchilen", "Gurvanbulag", "Khangal", "Khishig-Öndör", "Khutag-Öndör", "Mogod", "Orkhon", "Rashaant", "Saikhan", "Selenge", "Teshig"],
  "Darkhan-Uul": ["Darkhan", "Khongor", "Orkhon", "Sharyngol"],
  Dornod: ["Bayan-Uul", "Bayandun", "Bayantümen", "Bulgan", "Choibalsan", "Chuluunkhoroot", "Dashbalbar", "Gurvanzagal", "Khalkhgol", "Kherlen", "Khölönbuir", "Matad", "Sergelen", "Tsagaan-Ovoo"],
  Dornogovi: ["Altanshiree", "Airag", "Dalanjargalan", "Delgerekh", "Erdene", "Khatanbulag", "Khövsgöl", "Ikhkhet", "Mandakh", "Örgön", "Saikhandulaan", "Sainshand", "Ulaanbadrakh", "Zamyn-Üüd"],
  Dundgovi: ["Adaatsag", "Bayanjargalan", "Delgerkhangai", "Delgertsogt", "Deren", "Erdenedalai", "Govi-Ugtaal", "Gurvansaikhan", "Khuld", "Luus", "Ölziit", "Öndörshil", "Saikhan-Ovoo", "Saintsagaan", "Tsagaandelger"],
  "Govi-Altai": ["Altai", "Bayan-Uul", "Biger", "Bugat", "Chandmani", "Darvi", "Delger", "Erdene", "Khaliun", "Khökh morit", "Jargalan", "Sharga", "Taishir", "Tögrög", "Tonkhil", "Tseel", "Tsogt", "Yesönbulag"],
  Govisümber: ["Bayantal", "Shiveegovi", "Sümber"],
  Khentii: ["Batnorov", "Bayan-Adarga", "Bayankhutag", "Bayanmönkh", "Bayan-Ovoo", "Binder", "Dadal", "Darkhan", "Delgerkhaan", "Eg", "Galshar", "Kherlen", "Jargaltkhaan", "Mörön", "Norovlin", "Ömöndelger", "Tsenkhermandal"],
  Khovd: ["Altai", "Bulgan", "Buyant", "Chandmani", "Darvi", "Dörgön", "Duut", "Erdenebüren", "Jargalant", "Khovd", "Mankhan", "Mönkhkhairkhan", "Möst", "Myangad", "Tsetseg", "Üyench", "Zereg"],
  Khövsgöl: ["Alag-Erdene", "Arbulag", "Bayanzürkh", "Bürentogtokh", "Chandmani-Öndör", "Erdenebulgan", "Galt", "Khankh", "Ikh-Uul", "Jargalant", "Mörön", "Rashaant", "Renchinlkhümbe", "Shine-Ider", "Tarialan", "Tömörbulag", "Tosontsengel", "Tsagaan-Uul", "Tsagaannuur", "Tsagaan-Üür", "Tsetserleg", "Tünel", "Ulaan-Uul"],
  Ömnögovi: ["Bayan-Ovoo", "Bayandalai", "Bulgan", "Dalanzadgad", "Gurvan tes", "Khanbogd", "Khan khongor", "Khürmen", "Mandal-Ovoo", "Manlai", "Nomgon", "Noyon", "Sevrei", "Tsogt-Ovoo", "Tsogttsetsii"],
  Orkhon: ["Bayan-Öndör", "Jargalant"],
  Övörkhangai: ["Arvaikheer", "Baruun Bayan-Ulaan", "Bat-Ölzii", "Bayan-Öndör", "Bayangol", "Bogd", "Bürd", "Guchin-Us", "Kharkhorin", "Khairkhandulaan", "Khujirt", "Nariinteel", "Ölziit", "Sant", "Taragt", "Tögrög", "Uyanga", "Yesönzüil", "Züünbayan-Ulaan"],
  Selenge: ["Altanbulag", "Baruunbüren", "Bayangol", "Javkhlant", "Khüder", "Khushaat", "Mandal", "Orkhon", "Orkhontuul", "Sant", "Saikhan", "Shaamar", "Sükhbaatar", "Tsagaannuur", "Tüshig", "Yeröö", "Züünbüren"],
  Sükhbaatar: ["Asgat", "Baruun-Urt", "Bayandelger", "Dariganga", "Erdenetsagaan", "Khalzan", "Mönkhkhaan", "Naran", "Ongon", "Sükhbaatar", "Tüvshinshiree", "Tümentsogt", "Uulbayan"],
  Töv: ["Altanbulag", "Argalant", "Arkhust", "Batsümber", "Bayan", "Bayan-Önjüül", "Bayanchandmani", "Bayandelger", "Bayanjargalan", "Bayankhangai", "Bayantsagaan", "Bayantsogt", "Bornuur", "Büren", "Delgerkhaan", "Erdene", "Erdenesant", "Jargalant", "Lün", "Möngönmort", "Öndörshireet", "Sergelen", "Sümber", "Tseel", "Ugtaal", "Zaamar", "Zuunmod"],
  Uvs: ["Baruunturuun", "Bökhmörön", "Davst", "Khovd", "Khyargas", "Malchin", "Naranbulag", "Ölgii", "Ömnögovi", "Öndörkhangai", "Sagil", "Tarialan", "Tes", "Tsagaankhairkhan", "Türgen", "Ulaangom", "Zavkhan", "Züüngovi", "Züünkhangai"],
  Zavkhan: ["Aldarkhaan", "Asgat", "Bayankhairkhan", "Bayantes", "Dörvöljin", "Erdenekhairkhan", "Ider", "Ikh-Uul", "Nömrög", "Otgon", "Santmargats", "Shilüüstei", "Songino", "Telmen", "Tes", "Tosontsengel", "Tsagaanchuluut", "Tsagaankhairkhan", "Tsetsen-Uul", "Tüdevtei", "Uliastai", "Urgamal", "Yaruu", "Zavkhanmandal"],
  Ulaanbaatar: ["Baganuur", "Bagakhangai", "Bayangol", "Bayanzurkh", "Nalaikh", "Songinokhairkhan", "Sukhbaatar", "Khan-Uul", "Chingeltei"]
};

const capitals = {
  Arkhangai: "Tsetserleg", "Bayan-Ölgii": "Ölgii", Bayankhongor: "Bayankhongor", Bulgan: "Bulgan", "Darkhan-Uul": "Darkhan", Dornod: "Choibalsan", Dornogovi: "Sainshand", Dundgovi: "Mandalgovi", "Govi-Altai": "Altai", Govisümber: "Choir", Khentii: "Chinggis", Khovd: "Khovd", Khövsgöl: "Mörön", Ömnögovi: "Dalanzadgad", Orkhon: "Erdenet", Övörkhangai: "Arvaikheer", Selenge: "Sükhbaatar", Sükhbaatar: "Baruun-Urt", Töv: "Zuunmod", Uvs: "Ulaangom", Zavkhan: "Uliastai", Ulaanbaatar: "Ulaanbaatar"
};

const svgRegions = [
  { id: "MN061", svgName: "Dornod", name: "Dornod", x: 799.5, y: 165.5, w: 170, h: 120 },
  { id: "MN071", svgName: "Bayan-Ölgiy", name: "Bayan-Ölgii", x: 106, y: 170.2, w: 135, h: 145 },
  { id: "MN043", svgName: "Hovd", name: "Khovd", x: 183.9, y: 237, w: 135, h: 132 },
  { id: "MN051", svgName: "Sühbaatar", name: "Sükhbaatar", x: 766.9, y: 279.1, w: 142, h: 118 },
  { id: "MN063", svgName: "Dornogovi", name: "Dornogovi", x: 673.4, y: 348.4, w: 168, h: 124 },
  { id: "MN065", svgName: "Govi-Altay", name: "Govi-Altai", x: 283.2, y: 307.9, w: 172, h: 136 },
  { id: "MN069", svgName: "Bayanhongor", name: "Bayankhongor", x: 385.3, y: 308.7, w: 156, h: 132 },
  { id: "MN053", svgName: "Ömnögovi", name: "Ömnögovi", x: 511, y: 393, w: 222, h: 116 },
  { id: "MN041", svgName: "Hövsgöl", name: "Khövsgöl", x: 390.8, y: 101.5, w: 188, h: 112 },
  { id: "MN067", svgName: "Bulgan", name: "Bulgan", x: 482.7, y: 165.5, w: 112, h: 90 },
  { id: "MN046", svgName: "Uvs", name: "Uvs", x: 186, y: 133.9, w: 148, h: 120 },
  { id: "MN049", svgName: "Selenge", name: "Selenge", x: 541.7, y: 142.6, w: 132, h: 80 },
  { id: "MN057", svgName: "Dzavhan", name: "Zavkhan", x: 292.4, y: 192.3, w: 150, h: 122 },
  { id: "MN039", svgName: "Hentiy", name: "Khentii", x: 688.3, y: 208.4, w: 148, h: 118 },
  { id: "MN037", svgName: "Darhan-Uul", name: "Darkhan-Uul", x: 565.9, y: 145.6, w: 58, h: 42 },
  { id: "MN047", svgName: "Töv", name: "Töv", x: 553.6, y: 222.4, w: 142, h: 110 },
  { id: "MN073", svgName: "Arhangay", name: "Arkhangai", x: 428.2, y: 207.6, w: 126, h: 104 },
  { id: "MN035", svgName: "Orhon", name: "Orkhon", x: 515.7, y: 160.6, w: 48, h: 36 },
  { id: "MN059", svgName: "Dundgovi", name: "Dundgovi", x: 570.9, y: 310.8, w: 140, h: 112 },
  { id: "MN055", svgName: "Övörhangay", name: "Övörkhangai", x: 464.4, y: 293, w: 124, h: 104 },
  { id: "MN064", svgName: "Govĭ-Sümber", name: "Govisümber", x: 627.9, y: 214.8, w: 54, h: 44 },
  { id: "MN1", svgName: "Ulaanbaatar", name: "Ulaanbaatar", x: 588.7, y: 205.6, w: 50, h: 40 }
];

const regionBySvgId = Object.fromEntries(svgRegions.map((region) => [region.id, region.name]));

const foodProfiles = {
  Arkhangai: ["Airag", "Yak milk aaruul", "Khangai sheep khorkhog"],
  "Bayan-Ölgii": ["Kazakh beshbarmak", "Kazy sausage", "Kumis"],
  Bayankhongor: ["Camel milk", "Dried curds", "Goat meat stew"],
  Bulgan: ["Wild berry jam", "Dairy tea", "Mutton buuz"],
  "Darkhan-Uul": ["Vegetable soup", "Wheat noodles", "Dairy curds"],
  Dornod: ["Steppe lamb", "Boortsog", "Fermented mare milk"],
  Dornogovi: ["Camel khoormog", "Goat soup", "Gobi dried meat"],
  Dundgovi: ["Mutton khorkhog", "Aaruul", "Suutei tsai"],
  "Govi-Altai": ["Camel milk tea", "Dried meat", "Goat dumplings"],
  Govisümber: ["Gobi mutton", "Curd snacks", "Milk tea"],
  Khentii: ["Forest berry tea", "Beef soup", "Borts"],
  Khovd: ["Multigrain tsuivan", "Melon preserves", "Kazakh-style dairy"],
  Khövsgöl: ["Fish soup", "Reindeer milk products", "Blueberry jam"],
  Ömnögovi: ["Camel milk", "Goat khorkhog", "Dried curds"],
  Orkhon: ["Urban buuz", "Vegetable salad", "Dairy snacks"],
  Övörkhangai: ["Kharkhorin airag", "Mutton noodle soup", "Aaruul"],
  Selenge: ["Wheat bread", "Potato dishes", "Vegetable stew"],
  Sükhbaatar: ["Dariganga lamb", "Boortsog", "Milk tea"],
  Töv: ["Airag", "Beef and vegetable soup", "Curds"],
  Uvs: ["Sea-buckthorn juice", "Uvs sheep meat", "Aaruul"],
  Zavkhan: ["Yak butter tea", "Khangai borts", "Dairy curds"],
  Ulaanbaatar: ["Buuz", "Tsuivan", "Modern dairy bowls"]
};

const provinceNames = Object.keys(provinceSoums);

const nutrientNames = [
  ["Energy", "kcal"],
  ["Water", "g"],
  ["Protein", "g"],
  ["Total lipid (fat)", "g"],
  ["Carbohydrate, by difference", "g"],
  ["Fiber, total dietary", "g"],
  ["Sugars, total including NLEA", "g"],
  ["Calcium, Ca", "mg"],
  ["Iron, Fe", "mg"],
  ["Potassium, K", "mg"],
  ["Sodium, Na", "mg"],
  ["Vitamin C, total ascorbic acid", "mg"],
  ["Vitamin A, RAE", "µg"],
  ["Fatty acids, total saturated", "g"]
];

const mongolianFoodCatalog = [
  { name: "Buuz", category: "Dumplings", type: "Dish", regions: ["national", "Ulaanbaatar"] },
  { name: "Khuushuur", category: "Fried pastry", type: "Dish", regions: ["national"] },
  { name: "Bansh", category: "Dumplings", type: "Dish", regions: ["national"] },
  { name: "Banshtai tsai", category: "Milk tea soup", type: "Dish", regions: ["national"] },
  { name: "Tsuivan", category: "Noodle dish", type: "Dish", regions: ["national", "Ulaanbaatar"] },
  { name: "Guriltai shul", category: "Noodle soup", type: "Dish", regions: ["national"] },
  { name: "Bantan", category: "Flour soup", type: "Dish", regions: ["national"] },
  { name: "Khorkhog", category: "Meat dish", type: "Dish", regions: ["national", "Arkhangai", "Övörkhangai", "Dundgovi"] },
  { name: "Boodog", category: "Meat dish", type: "Dish", regions: ["national", "Khovd", "Govi-Altai"] },
  { name: "Borts", category: "Dried meat", type: "Food", regions: ["national", "Khentii", "Zavkhan"] },
  { name: "Uuts", category: "Mutton", type: "Food", regions: ["national"] },
  { name: "Sharsan makh", category: "Roasted meat", type: "Dish", regions: ["national"] },
  { name: "Chanamal makh", category: "Boiled meat", type: "Dish", regions: ["national"] },
  { name: "Airag", category: "Fermented dairy", type: "Drink", regions: ["national", "Arkhangai", "Övörkhangai", "Töv"] },
  { name: "Suutei tsai", category: "Milk tea", type: "Drink", regions: ["national"] },
  { name: "Aaruul", category: "Dried curds", type: "Dairy", regions: ["national", "Arkhangai", "Uvs", "Ömnögovi"] },
  { name: "Byaslag", category: "Cheese", type: "Dairy", regions: ["national"] },
  { name: "Tarag", category: "Yogurt", type: "Dairy", regions: ["national"] },
  { name: "Öröm", category: "Clotted cream", type: "Dairy", regions: ["national"] },
  { name: "Shar tos", category: "Clarified butter", type: "Dairy", regions: ["national"] },
  { name: "Eezgii", category: "Caramelized curds", type: "Dairy", regions: ["national"] },
  { name: "Khoormog", category: "Camel milk drink", type: "Drink", regions: ["Ömnögovi", "Dornogovi", "Dundgovi", "Govi-Altai"] },
  { name: "Camel milk", category: "Dairy", type: "Dairy", regions: ["Ömnögovi", "Dornogovi", "Bayankhongor", "Govi-Altai"] },
  { name: "Yak milk aaruul", category: "Dairy", type: "Dairy", regions: ["Arkhangai", "Khövsgöl", "Zavkhan"] },
  { name: "Reindeer milk products", category: "Dairy", type: "Dairy", regions: ["Khövsgöl"] },
  { name: "Boortsog", category: "Fried bread", type: "Bakery", regions: ["national", "Dornod", "Sükhbaatar"] },
  { name: "Gambir", category: "Flatbread", type: "Bakery", regions: ["national"] },
  { name: "Ul boov", category: "Ceremonial pastry", type: "Bakery", regions: ["national"] },
  { name: "Beshbarmak", category: "Kazakh noodle meat dish", type: "Dish", regions: ["Bayan-Ölgii", "Khovd"] },
  { name: "Kazy", category: "Horse meat sausage", type: "Food", regions: ["Bayan-Ölgii"] },
  { name: "Kumis", category: "Fermented mare milk", type: "Drink", regions: ["Bayan-Ölgii"] },
  { name: "Fish soup", category: "Fish dish", type: "Dish", regions: ["Khövsgöl"] },
  { name: "Sea-buckthorn juice", category: "Fruit drink", type: "Drink", regions: ["Uvs", "Khovd"] },
  { name: "Blueberry jam", category: "Berry preserve", type: "Fruit", regions: ["Khövsgöl", "Selenge"] },
  { name: "Wild berry jam", category: "Berry preserve", type: "Fruit", regions: ["Bulgan", "Selenge", "Khentii"] },
  { name: "Potato", category: "Vegetable", type: "Vegetable", regions: ["national", "Selenge", "Töv", "Darkhan-Uul"] },
  { name: "Carrot", category: "Vegetable", type: "Vegetable", regions: ["national", "Selenge", "Töv"] },
  { name: "Cabbage", category: "Vegetable", type: "Vegetable", regions: ["national", "Selenge", "Darkhan-Uul"] },
  { name: "Onion", category: "Vegetable", type: "Vegetable", regions: ["national"] },
  { name: "Garlic", category: "Vegetable", type: "Vegetable", regions: ["national"] },
  { name: "Turnip", category: "Vegetable", type: "Vegetable", regions: ["national", "Töv"] },
  { name: "Beetroot", category: "Vegetable", type: "Vegetable", regions: ["national", "Selenge"] },
  { name: "Cucumber", category: "Vegetable", type: "Vegetable", regions: ["national", "Darkhan-Uul", "Selenge"] },
  { name: "Tomato", category: "Vegetable", type: "Vegetable", regions: ["national", "Darkhan-Uul", "Selenge"] },
  { name: "Bell pepper", category: "Vegetable", type: "Vegetable", regions: ["national"] },
  { name: "Pumpkin", category: "Vegetable", type: "Vegetable", regions: ["national"] },
  { name: "Wheat flour", category: "Grain", type: "Ingredient", regions: ["national", "Selenge", "Darkhan-Uul"] },
  { name: "Barley", category: "Grain", type: "Ingredient", regions: ["national"] },
  { name: "Millet", category: "Grain", type: "Ingredient", regions: ["national"] },
  { name: "Buckwheat", category: "Grain", type: "Ingredient", regions: ["national"] },
  { name: "Mutton", category: "Meat", type: "Ingredient", regions: ["national", "Dundgovi", "Sükhbaatar", "Uvs"] },
  { name: "Beef", category: "Meat", type: "Ingredient", regions: ["national", "Khentii", "Töv"] },
  { name: "Goat meat", category: "Meat", type: "Ingredient", regions: ["national", "Govi-Altai", "Ömnögovi"] },
  { name: "Horse meat", category: "Meat", type: "Ingredient", regions: ["national", "Bayan-Ölgii"] },
  { name: "Camel meat", category: "Meat", type: "Ingredient", regions: ["Ömnögovi", "Dornogovi", "Govi-Altai"] }
];

const foodLocales = {
  Buuz: { mn: "Бууз", ko: "부즈", zh: "蒙古蒸饺", ru: "Бузы", aliases: ["бууз", "банш", "dumpling", "steamed dumpling"] },
  Khuushuur: { mn: "Хуушуур", ko: "호쇼르", zh: "蒙古炸肉饼", ru: "Хушуур", aliases: ["хуушуур", "fried pastry", "meat pastry"] },
  Bansh: { mn: "Банш", ko: "반시", zh: "小饺子", ru: "Банш", aliases: ["банш", "small dumpling"] },
  "Banshtai tsai": { mn: "Банштай цай", ko: "만두 밀크티 수프", zh: "奶茶饺子汤", ru: "Чай с баншами", aliases: ["банштай цай", "milk tea soup"] },
  Tsuivan: { mn: "Цуйван", ko: "초이반", zh: "蒙古炒面", ru: "Цуйван", aliases: ["цуйван", "fried noodles", "noodle dish"] },
  "Guriltai shul": { mn: "Гурилтай шөл", ko: "면 수프", zh: "面汤", ru: "Суп с лапшой", aliases: ["гурилтай шөл", "noodle soup"] },
  Bantan: { mn: "Бантан", ko: "밀가루 수프", zh: "面糊汤", ru: "Бантан", aliases: ["бантан", "flour soup"] },
  Khorkhog: { mn: "Хорхог", ko: "허르헉", zh: "蒙古石头烤肉", ru: "Хорхог", aliases: ["хорхог", "stone cooked meat"] },
  Boodog: { mn: "Боодог", ko: "보덕", zh: "蒙古整烤肉", ru: "Боодог", aliases: ["боодог"] },
  Borts: { mn: "Борц", ko: "말린 고기", zh: "蒙古肉干", ru: "Борц", aliases: ["борц", "dried meat"] },
  Uuts: { mn: "Ууц", ko: "양 등심", zh: "羊背肉", ru: "Ууц", aliases: ["ууц", "mutton back"] },
  "Sharsan makh": { mn: "Шарсан мах", ko: "구운 고기", zh: "烤肉", ru: "Жареное мясо", aliases: ["шарсан мах", "roasted meat"] },
  "Chanamal makh": { mn: "Чанасан мах", ko: "삶은 고기", zh: "煮肉", ru: "Вареное мясо", aliases: ["чанасан мах", "boiled meat"] },
  Airag: { mn: "Айраг", ko: "아이락", zh: "马奶酒", ru: "Айраг", aliases: ["айраг", "kumis", "fermented mare milk"] },
  "Suutei tsai": { mn: "Сүүтэй цай", ko: "수테차", zh: "蒙古奶茶", ru: "Сутэй цай", aliases: ["сүүтэй цай", "milk tea"] },
  Aaruul: { mn: "Ааруул", ko: "아롤", zh: "干奶酪", ru: "Ааруул", aliases: ["ааруул", "dried curds"] },
  Byaslag: { mn: "Бяслаг", ko: "치즈", zh: "奶酪", ru: "Сыр", aliases: ["бяслаг", "cheese"] },
  Tarag: { mn: "Тараг", ko: "요구르트", zh: "酸奶", ru: "Йогурт", aliases: ["тараг", "yogurt"] },
  Öröm: { mn: "Өрөм", ko: "클로티드 크림", zh: "奶皮", ru: "Сливки", aliases: ["өрөм", "cream"] },
  "Shar tos": { mn: "Шар тос", ko: "정제 버터", zh: "酥油", ru: "Топленое масло", aliases: ["шар тос", "clarified butter"] },
  Eezgii: { mn: "Ээзгий", ko: "캐러멜 커드", zh: "焦奶酪", ru: "Ээзгий", aliases: ["ээзгий"] },
  Khoormog: { mn: "Хоормог", ko: "낙타유 음료", zh: "发酵驼奶", ru: "Хоормог", aliases: ["хоормог", "camel milk drink"] },
  "Camel milk": { mn: "Ингэний сүү", ko: "낙타유", zh: "骆驼奶", ru: "Верблюжье молоко", aliases: ["ингэний сүү", "тэмээний сүү"] },
  "Yak milk aaruul": { mn: "Сарлагийн ааруул", ko: "야크 우유 아롤", zh: "牦牛奶干酪", ru: "Ааруул из молока яка", aliases: ["сарлагийн ааруул"] },
  "Reindeer milk products": { mn: "Цаа бугын сүүн бүтээгдэхүүн", ko: "순록 우유 제품", zh: "驯鹿奶制品", ru: "Продукты из оленьего молока", aliases: ["цаа бугын сүү"] },
  Boortsog: { mn: "Боорцог", ko: "보르초그", zh: "蒙古油炸面点", ru: "Боорцог", aliases: ["боорцог", "fried bread"] },
  Gambir: { mn: "Гамбир", ko: "감비르", zh: "蒙古煎饼", ru: "Гамбир", aliases: ["гамбир", "flatbread"] },
  "Ul boov": { mn: "Ул боов", ko: "의식용 과자", zh: "蒙古礼饼", ru: "Ул боов", aliases: ["ул боов"] },
  Beshbarmak: { mn: "Бешбармак", ko: "베슈바르마크", zh: "别什巴尔马克", ru: "Бешбармак", aliases: ["бешбармак"] },
  Kazy: { mn: "Казы", ko: "카지", zh: "马肉香肠", ru: "Казы", aliases: ["казы", "horse sausage"] },
  Kumis: { mn: "Кымыз", ko: "쿠미스", zh: "马奶酒", ru: "Кумыс", aliases: ["кымыз", "kumys"] },
  "Fish soup": { mn: "Загасны шөл", ko: "생선 수프", zh: "鱼汤", ru: "Рыбный суп", aliases: ["загасны шөл"] },
  "Sea-buckthorn juice": { mn: "Чацарганы шүүс", ko: "산자나무 주스", zh: "沙棘汁", ru: "Облепиховый сок", aliases: ["чацарганы шүүс"] },
  "Blueberry jam": { mn: "Нэрсний чанамал", ko: "블루베리 잼", zh: "蓝莓酱", ru: "Черничное варенье", aliases: ["нэрсний чанамал"] },
  "Wild berry jam": { mn: "Зэрлэг жимсний чанамал", ko: "야생 베리 잼", zh: "野莓果酱", ru: "Варенье из диких ягод", aliases: ["жимсний чанамал"] },
  Potato: { mn: "Төмс", ko: "감자", zh: "土豆", ru: "Картофель", aliases: ["төмс"] },
  Carrot: { mn: "Лууван", ko: "당근", zh: "胡萝卜", ru: "Морковь", aliases: ["лууван"] },
  Cabbage: { mn: "Байцаа", ko: "양배추", zh: "卷心菜", ru: "Капуста", aliases: ["байцаа"] },
  Onion: { mn: "Сонгино", ko: "양파", zh: "洋葱", ru: "Лук", aliases: ["сонгино"] },
  Garlic: { mn: "Сармис", ko: "마늘", zh: "大蒜", ru: "Чеснок", aliases: ["сармис"] },
  Turnip: { mn: "Манжин", ko: "순무", zh: "芜菁", ru: "Репа", aliases: ["манжин"] },
  Beetroot: { mn: "Улаан манжин", ko: "비트", zh: "甜菜根", ru: "Свекла", aliases: ["улаан манжин"] },
  Cucumber: { mn: "Өргөст хэмх", ko: "오이", zh: "黄瓜", ru: "Огурец", aliases: ["өргөст хэмх", "огурцы"] },
  Tomato: { mn: "Улаан лооль", ko: "토마토", zh: "番茄", ru: "Помидор", aliases: ["улаан лооль"] },
  "Bell pepper": { mn: "Амтат чинжүү", ko: "파프리카", zh: "甜椒", ru: "Болгарский перец", aliases: ["амтат чинжүү"] },
  Pumpkin: { mn: "Хулуу", ko: "호박", zh: "南瓜", ru: "Тыква", aliases: ["хулуу"] },
  "Wheat flour": { mn: "Улаан буудайн гурил", ko: "밀가루", zh: "小麦粉", ru: "Пшеничная мука", aliases: ["гурил", "улаан буудайн гурил"] },
  Barley: { mn: "Арвай", ko: "보리", zh: "大麦", ru: "Ячмень", aliases: ["арвай"] },
  Millet: { mn: "Шар будаа", ko: "기장", zh: "小米", ru: "Просо", aliases: ["шар будаа"] },
  Buckwheat: { mn: "Гурвалжин будаа", ko: "메밀", zh: "荞麦", ru: "Гречка", aliases: ["гурвалжин будаа"] },
  Mutton: { mn: "Хонины мах", ko: "양고기", zh: "羊肉", ru: "Баранина", aliases: ["хонины мах"] },
  Beef: { mn: "Үхрийн мах", ko: "소고기", zh: "牛肉", ru: "Говядина", aliases: ["үхрийн мах"] },
  "Goat meat": { mn: "Ямааны мах", ko: "염소고기", zh: "山羊肉", ru: "Козлятина", aliases: ["ямааны мах"] },
  "Horse meat": { mn: "Адууны мах", ko: "말고기", zh: "马肉", ru: "Конина", aliases: ["адууны мах"] },
  "Camel meat": { mn: "Тэмээний мах", ko: "낙타고기", zh: "骆驼肉", ru: "Верблюжатина", aliases: ["тэмээний мах"] }
};

function foodLabel(food, language) {
  return foodLocales[food.name]?.[language] || food.name;
}

const phraseLocales = {
  "Foundation Foods": { mn: "Суурь хүнсний өгөгдөл", ko: "기초 식품 데이터", zh: "基础食品数据", ru: "Базовые пищевые данные" },
  "Survey (FNDDS)": { mn: "Судалгааны өгөгдөл", ko: "조사 데이터", zh: "调查数据", ru: "Данные опроса" },
  "Regional Foods": { mn: "Бүс нутгийн хүнс", ko: "지역 식품", zh: "地区食品", ru: "Региональные продукты" },
  "Local Reference": { mn: "Орон нутгийн лавлагаа", ko: "지역 참고자료", zh: "本地参考", ru: "Местный справочник" },
  Dumplings: { mn: "Банш, бууз", ko: "만두류", zh: "饺子类", ru: "Пельменные изделия" },
  "Fried pastry": { mn: "Шарсан гурилан хоол", ko: "튀긴 반죽 음식", zh: "油炸面食", ru: "Жареная выпечка" },
  "Milk tea soup": { mn: "Сүүтэй цайтай шөл", ko: "밀크티 수프", zh: "奶茶汤", ru: "Суп с молочным чаем" },
  "Noodle dish": { mn: "Гурилтай хоол", ko: "면 요리", zh: "面食", ru: "Блюдо с лапшой" },
  "Noodle soup": { mn: "Гурилтай шөл", ko: "면 수프", zh: "面汤", ru: "Суп с лапшой" },
  "Flour soup": { mn: "Гурилан шөл", ko: "밀가루 수프", zh: "面糊汤", ru: "Мучной суп" },
  "Meat dish": { mn: "Махан хоол", ko: "고기 요리", zh: "肉类菜肴", ru: "Мясное блюдо" },
  "Dried meat": { mn: "Хатаасан мах", ko: "말린 고기", zh: "风干肉", ru: "Сушеное мясо" },
  Mutton: { mn: "Хонины мах", ko: "양고기", zh: "羊肉", ru: "Баранина" },
  "Roasted meat": { mn: "Шарсан мах", ko: "구운 고기", zh: "烤肉", ru: "Жареное мясо" },
  "Boiled meat": { mn: "Чанасан мах", ko: "삶은 고기", zh: "煮肉", ru: "Вареное мясо" },
  "Fermented dairy": { mn: "Исгэсэн сүүн бүтээгдэхүүн", ko: "발효 유제품", zh: "发酵乳制品", ru: "Кисломолочный продукт" },
  "Milk tea": { mn: "Сүүтэй цай", ko: "밀크티", zh: "奶茶", ru: "Молочный чай" },
  "Dried curds": { mn: "Хатаасан аарц", ko: "말린 커드", zh: "干奶酪", ru: "Сушеный творог" },
  Cheese: { mn: "Бяслаг", ko: "치즈", zh: "奶酪", ru: "Сыр" },
  Yogurt: { mn: "Тараг", ko: "요구르트", zh: "酸奶", ru: "Йогурт" },
  "Clotted cream": { mn: "Өрөм", ko: "응고 크림", zh: "奶皮", ru: "Сливки" },
  "Clarified butter": { mn: "Шар тос", ko: "정제 버터", zh: "酥油", ru: "Топленое масло" },
  "Caramelized curds": { mn: "Ээзгий", ko: "캐러멜화 커드", zh: "焦奶酪", ru: "Ээзгий" },
  "Camel milk drink": { mn: "Ингэний сүүний ундаа", ko: "낙타유 음료", zh: "骆驼奶饮品", ru: "Напиток из верблюжьего молока" },
  Dairy: { mn: "Сүүн бүтээгдэхүүн", ko: "유제품", zh: "乳制品", ru: "Молочные продукты" },
  "Fried bread": { mn: "Шарсан боов", ko: "튀긴 빵", zh: "油炸面点", ru: "Жареный хлеб" },
  Flatbread: { mn: "Хайрсан гурил", ko: "납작빵", zh: "薄饼", ru: "Лепешка" },
  "Ceremonial pastry": { mn: "Ёслолын боов", ko: "의식용 과자", zh: "礼仪糕点", ru: "Обрядовая выпечка" },
  "Kazakh noodle meat dish": { mn: "Казах махтай гурилтай хоол", ko: "카자흐식 고기면", zh: "哈萨克肉面", ru: "Казахское мясное блюдо с лапшой" },
  "Horse meat sausage": { mn: "Адууны махан хиам", ko: "말고기 소시지", zh: "马肉香肠", ru: "Колбаса из конины" },
  "Fermented mare milk": { mn: "Исгэсэн гүүний сүү", ko: "발효 마유", zh: "发酵马奶", ru: "Кумыс" },
  "Fish dish": { mn: "Загасан хоол", ko: "생선 요리", zh: "鱼类菜肴", ru: "Рыбное блюдо" },
  "Fruit drink": { mn: "Жимсний ундаа", ko: "과일 음료", zh: "果汁饮品", ru: "Фруктовый напиток" },
  "Berry preserve": { mn: "Жимсний чанамал", ko: "베리 잼", zh: "莓果酱", ru: "Ягодное варенье" },
  Vegetable: { mn: "Хүнсний ногоо", ko: "채소", zh: "蔬菜", ru: "Овощ" },
  Grain: { mn: "Үр тариа", ko: "곡물", zh: "谷物", ru: "Зерно" },
  Meat: { mn: "Мах", ko: "고기", zh: "肉类", ru: "Мясо" },
  Dish: { mn: "Хоол", ko: "요리", zh: "菜肴", ru: "Блюдо" },
  Food: { mn: "Хүнс", ko: "식품", zh: "食品", ru: "Продукт" },
  Drink: { mn: "Ундаа", ko: "음료", zh: "饮品", ru: "Напиток" },
  Bakery: { mn: "Гурилан бүтээгдэхүүн", ko: "제과/빵류", zh: "面点", ru: "Выпечка" },
  Fruit: { mn: "Жимс", ko: "과일", zh: "水果", ru: "Фрукты" },
  Ingredient: { mn: "Түүхий эд", ko: "재료", zh: "食材", ru: "Ингредиент" },
  "Analytical estimate": { mn: "Шинжилгээний тооцоолол", ko: "분석 추정", zh: "分析估算", ru: "Аналитическая оценка" },
  "Recipe estimate": { mn: "Жорын тооцоолол", ko: "레시피 추정", zh: "配方估算", ru: "Оценка по рецепту" },
  "Regional model": { mn: "Бүсийн загварчлал", ko: "지역 모델", zh: "地区模型", ru: "Региональная модель" },
  Energy: { mn: "Илчлэг", ko: "에너지", zh: "能量", ru: "Энергия" },
  Water: { mn: "Ус", ko: "수분", zh: "水分", ru: "Вода" },
  "Protein": { mn: "Уураг", ko: "단백질", zh: "蛋白质", ru: "Белок" },
  "Total lipid (fat)": { mn: "Нийт өөх тос", ko: "총 지방", zh: "总脂肪", ru: "Общие жиры" },
  "Carbohydrate, by difference": { mn: "Нүүрс ус", ko: "탄수화물", zh: "碳水化合物", ru: "Углеводы" },
  "Fiber, total dietary": { mn: "Хүнсний эслэг", ko: "식이섬유", zh: "膳食纤维", ru: "Пищевые волокна" },
  "Sugars, total including NLEA": { mn: "Нийт сахар", ko: "총 당류", zh: "总糖", ru: "Всего сахаров" },
  "Calcium, Ca": { mn: "Кальци", ko: "칼슘", zh: "钙", ru: "Кальций" },
  "Iron, Fe": { mn: "Төмөр", ko: "철", zh: "铁", ru: "Железо" },
  "Potassium, K": { mn: "Кали", ko: "칼륨", zh: "钾", ru: "Калий" },
  "Sodium, Na": { mn: "Натри", ko: "나트륨", zh: "钠", ru: "Натрий" },
  "Vitamin C, total ascorbic acid": { mn: "C аминдэм", ko: "비타민 C", zh: "维生素C", ru: "Витамин C" },
  "Vitamin A, RAE": { mn: "A аминдэм", ko: "비타민 A", zh: "维生素A", ru: "Витамин A" },
  "Fatty acids, total saturated": { mn: "Ханасан тосны хүчил", ko: "포화지방산", zh: "饱和脂肪酸", ru: "Насыщенные жирные кислоты" }
};

function localPhrase(value, language) {
  return phraseLocales[value]?.[language] || value;
}

function categoryLabel(food, language) {
  return localPhrase(food.category, language);
}

function typeLabel(food, language) {
  return localPhrase(food.type, language);
}

function regionsLabel(food, language, t) {
  if (food.regions.includes("national")) {
    return t.national;
  }
  return food.regions.filter((region) => region !== "national").join(", ");
}

function foodSearchText(food) {
  const locale = foodLocales[food.name] || {};
  return [food.name, food.category, food.type, ...food.regions, locale.mn, locale.ko, locale.zh, locale.ru, ...(locale.aliases || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function componentSearchText(food) {
  const profile = profileForFood(food);
  const regionName = primaryRegionForFood(food, "Ulaanbaatar");
  const nutrients = nutrientRows(food.name, regionName, 1).map((row) => row.name);
  return [
    foodSearchText(food),
    ...profile.ingredients,
    ...profile.steps,
    profile.notes,
    ...nutrients,
    ...nutrients.map((item) => localPhrase(item, "mn")),
    ...nutrients.map((item) => localPhrase(item, "en"))
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const regionSpecialties = {
  Arkhangai: "Khangai mountain pasture, yak dairy, airag, and sheep dishes are common. Soums around Tariat, Chuluut, Tsenkher, and Tsetserleg often connect food identity with dairy processing and mountain livestock.",
  "Bayan-Ölgii": "Kazakh food culture is strongest here. Beshbarmak, kazy, kumis, horse meat, and rich dairy foods are distinctive in Ölgii, Sagsai, Tolbo, Tsengel, and nearby soums.",
  Bayankhongor: "Gobi and Khangai transition foods meet here: goat meat, camel milk in southern soums, and dried dairy products are common.",
  Bulgan: "Forest-steppe dairy, berries, mutton, and vegetable-growing pockets shape local meals.",
  "Darkhan-Uul": "Urban market access and northern crop production make vegetables, wheat foods, dairy, and mixed dishes more common.",
  Dornod: "Eastern steppe livestock foods, fermented dairy, borts, and mutton dishes are typical across Kherlen, Matad, Khalkhgol, and other soums.",
  Dornogovi: "Gobi camel milk, khoormog, goat meat, dried meat, and simple flour-based soups are distinctive.",
  Dundgovi: "Central Gobi pastoral foods emphasize mutton, goat meat, aaruul, milk tea, and khorkhog-style cooking.",
  "Govi-Altai": "High dryland pasture supports goat, camel, dried meat, camel milk tea, and hardy dairy foods.",
  Govisümber: "Small Gobi region with mutton, dairy snacks, milk tea, and transit-town mixed foods around Choir.",
  Khentii: "Forest-steppe and historic eastern herding foods include beef, borts, berry tea, and hearty soups.",
  Khovd: "Multiethnic western foodways include Kazakh dairy, melons, sea-buckthorn, wheat noodles, and meat dishes.",
  Khövsgöl: "Lake and taiga food identity includes fish soup, berries, yak dairy, and reindeer milk products in northern communities.",
  Ömnögovi: "Camel milk, khoormog, camel meat, goat meat, and Gobi dried curds are the strongest local markers.",
  Orkhon: "Erdenet urban food culture mixes national dishes with dairy snacks and vegetable side dishes.",
  Övörkhangai: "Airag, khorkhog, mutton noodle soups, and Karakorum-area dairy foods are common.",
  Selenge: "Crop-growing region known for wheat, potatoes, cabbage, carrots, cucumbers, tomatoes, and vegetable stews.",
  Sükhbaatar: "Dariganga steppe lamb, boortsog, milk tea, and mutton dishes are distinctive.",
  Töv: "Central pasture and vegetable supply region with airag, beef soups, curds, potatoes, carrots, and milk tea.",
  Uvs: "Uvs sheep meat, sea-buckthorn, dried curds, and western dairy foods are notable.",
  Zavkhan: "Mountain and steppe foods include yak butter tea, borts, curds, and hearty flour-based dishes.",
  Ulaanbaatar: "Urban food culture brings together buuz, tsuivan, khuushuur, bakery foods, vegetables, and modern dairy bowls across all 9 districts."
};

const recipeProfiles = {
  Buuz: {
    ingredients: ["Wheat flour dough", "Minced mutton or beef", "Onion", "Garlic", "Salt", "Pepper", "Water or stock"],
    steps: ["Knead a firm flour dough and rest it.", "Mix minced meat with onion, garlic, salt, pepper, and a little water.", "Roll small dough circles.", "Place filling in the center and pinch the top closed.", "Steam until the dough is cooked and the meat is juicy."],
    notes: "Often prepared for Tsagaan Sar, family gatherings, and city restaurants. Fillings vary by region and household."
  },
  Khuushuur: {
    ingredients: ["Flour dough", "Minced meat", "Onion", "Salt", "Pepper", "Oil for frying"],
    steps: ["Prepare dough and meat filling.", "Roll flat rounds.", "Fill and seal into half-moon shapes.", "Fry in hot oil until golden.", "Serve hot with tea or salad."],
    notes: "Naadam season and roadside food culture make khuushuur one of the most recognizable national foods."
  },
  Tsuivan: {
    ingredients: ["Hand-cut noodles", "Mutton or beef", "Carrot", "Cabbage", "Onion", "Potato", "Oil", "Salt"],
    steps: ["Brown sliced meat with onion.", "Add vegetables and season.", "Place rolled noodles over the mixture.", "Add a small amount of water and steam-fry.", "Mix before serving."],
    notes: "A practical household dish; vegetables differ by season and market access."
  },
  Khorkhog: {
    ingredients: ["Bone-in mutton or goat meat", "Hot stones", "Potato", "Carrot", "Onion", "Salt", "Water"],
    steps: ["Heat smooth stones in a fire.", "Layer meat, vegetables, salt, water, and hot stones in a sealed metal container.", "Cook with steam and stone heat.", "Shake carefully during cooking.", "Serve meat, vegetables, and broth together."],
    notes: "Common for outdoor gatherings and pastoral celebrations, especially where livestock is central."
  },
  Airag: {
    ingredients: ["Fresh mare milk", "Starter culture from previous airag"],
    steps: ["Filter fresh mare milk.", "Add starter culture.", "Ferment in a clean container.", "Stir repeatedly during fermentation.", "Serve chilled or at ambient temperature."],
    notes: "Airag quality depends heavily on pasture, season, mare milk, and fermentation care."
  },
  Aaruul: {
    ingredients: ["Curdled milk", "Optional sugar or cream"],
    steps: ["Make curds from fermented dairy.", "Press or shape the curds.", "Dry in sun and airflow.", "Store once fully dried."],
    notes: "Long shelf life makes aaruul important for herding households."
  },
  Borts: {
    ingredients: ["Lean meat", "Salt optional", "Cold dry air"],
    steps: ["Slice lean meat thinly.", "Hang in a clean, ventilated, cold dry place.", "Dry until hard and shelf-stable.", "Break or grind for soups and stews."],
    notes: "A traditional preservation method suited to Mongolia's cold dry climate."
  },
  "Suutei tsai": {
    ingredients: ["Tea leaves", "Milk", "Water", "Salt"],
    steps: ["Boil tea in water.", "Add milk and salt.", "Ladle repeatedly to aerate.", "Serve hot with dairy or flour foods."],
    notes: "Daily beverage across Mongolia; salt and milk ratios vary."
  }
};

function profileForFood(food) {
  return recipeProfiles[food.name] || {
    ingredients: [`Main ingredient: ${foodLabel(food, "en")}`, "Salt or seasoning as needed", "Regional dairy, grain, meat, or vegetables depending on household practice"],
    steps: ["Clean and prepare the main ingredient.", "Cook using the common local method: boiling, steaming, frying, drying, or fermenting.", "Season lightly so the main ingredient remains clear.", "Serve with milk tea, bread, noodles, vegetables, or dairy depending on the food type."],
    notes: `${foodLabel(food, "en")} is listed as ${food.category}. Preparation differs by household, season, and local ingredient access.`
  };
}

function localizedProfileForFood(food, language) {
  if (language === "en") {
    return profileForFood(food);
  }
  const label = foodLabel(food, language);
  const category = categoryLabel(food, language);
  const templates = {
    mn: {
      notes: `${label} нь "${category}" ангиллын хүнс. Орц, амт, хийх арга нь өрх гэр, улирал, малын төрөл, тухайн аймаг сумын түүхий эдээс шалтгаалан өөрчлөгдөнө.`,
      ingredients: [`Үндсэн түүхий эд: ${label}`, "Давс, сонгино, сармис эсвэл гэрийн амтлагч", "Улирлын ногоо, гурил, сүү цагаан идээ эсвэл махны нэмэлт орц"],
      steps: ["Түүхий эдээ угааж, цэвэрлэж, хэрчих эсвэл зуурах байдлаар бэлтгэнэ.", "Тухайн хоолонд тохирох аргаар чанах, жигнэх, шарах, хатаах эсвэл исгэх ажиллагааг хийнэ.", "Дутуу болсон эсэхийг үнэр, өнгө, шүүс, зөөлөн чанараар шалгана.", "Халуунаар нь сүүтэй цай, гурилтай хоол, ногоо эсвэл цагаан идээтэй хамт хэрэглэнэ."]
    },
    ko: {
      notes: `${label}은(는) "${category}" 분류의 식품입니다. 재료와 조리 방식은 가정, 계절, 지역, 가축 종류와 시장 접근성에 따라 달라집니다.`,
      ingredients: [`주재료: ${label}`, "소금, 양파, 마늘 또는 가정식 양념", "계절 채소, 밀가루, 유제품 또는 고기 재료"],
      steps: ["재료를 씻고 손질한 뒤 썰거나 반죽합니다.", "음식에 맞게 삶기, 찌기, 굽기, 말리기 또는 발효 과정을 진행합니다.", "색, 향, 육즙, 질감으로 익힘 상태를 확인합니다.", "따뜻할 때 밀크티, 면/빵, 채소 또는 유제품과 함께 제공합니다."]
    },
    zh: {
      notes: `${label}属于“${category}”类食品。配料和做法会因家庭、季节、地区、牲畜种类和市场条件而变化。`,
      ingredients: [`主要食材：${label}`, "盐、洋葱、蒜或家庭调味料", "时令蔬菜、面粉、乳制品或肉类配料"],
      steps: ["清洗并处理食材，按需要切块或和面。", "根据食品特点进行煮、蒸、煎烤、风干或发酵。", "通过颜色、气味、汁液和口感判断熟度。", "趁热搭配奶茶、面食、蔬菜或乳制品食用。"]
    },
    ru: {
      notes: `${label} относится к категории «${category}». Состав и способ приготовления зависят от семьи, сезона, региона, вида скота и доступности продуктов.`,
      ingredients: [`Основной продукт: ${label}`, "Соль, лук, чеснок или домашние приправы", "Сезонные овощи, мука, молочные продукты или мясные добавки"],
      steps: ["Промойте и подготовьте ингредиенты: нарежьте, замесите или разделайте по необходимости.", "Готовьте подходящим способом: варка, пар, жарка, сушка или ферментация.", "Проверьте готовность по цвету, запаху, соку и текстуре.", "Подавайте теплым с молочным чаем, мучными блюдами, овощами или молочными продуктами."]
    }
  };
  return templates[language] || profileForFood(food);
}

function localFoodsForRegion(regionName) {
  const local = mongolianFoodCatalog.filter((food) => food.regions.includes(regionName));
  return local.length ? local : foodsForRegion(regionName).slice(0, 8);
}

const specificFoodImages = {
  Buuz: "https://commons.wikimedia.org/wiki/Special:FilePath/Mongolian_buuz.jpg",
  Khuushuur: "https://commons.wikimedia.org/wiki/Special:FilePath/MongolianKhuushuur.JPG",
  Bansh: "https://commons.wikimedia.org/wiki/Special:FilePath/Bansh.jpg",
  "Banshtai tsai": "https://www.mongolfood.info/images/banshtai-tsai/banshtai-tsai-eat_128_256.jpg",
  Bantan: "https://commons.wikimedia.org/wiki/Special:FilePath/Bantan.jpg",
  Tsuivan: "https://commons.wikimedia.org/wiki/Special:FilePath/Tsuivan.jpg",
  "Guriltai shul": "https://commons.wikimedia.org/wiki/Special:FilePath/Guriltai%20shul.jpg",
  Khorkhog: "https://commons.wikimedia.org/wiki/Special:FilePath/Khorkhog.JPG",
  Boodog: "https://commons.wikimedia.org/wiki/Special:FilePath/Eating%20mongolian%20boodog.jpg",
  Borts: "https://commons.wikimedia.org/wiki/Special:FilePath/Mongolia%20085.JPG",
  Uuts: "https://www.mongolfood.info/images/uuz/khoni-transport_256.jpg",
  "Sharsan makh": "https://commons.wikimedia.org/wiki/Special:FilePath/Roasted%20meat.JPG",
  "Chanamal makh": "https://commons.wikimedia.org/wiki/Special:FilePath/Chanasan%20makh.jpg",
  Airag: "https://commons.wikimedia.org/wiki/Special:FilePath/Homemade%20airag%20in%20Mongolia.jpg",
  "Suutei tsai": "https://commons.wikimedia.org/wiki/Special:FilePath/Suutei%20tsai.jpg",
  Aaruul: "https://commons.wikimedia.org/wiki/Special:FilePath/Aaruul.jpg",
  Byaslag: "https://www.mongolfood.info/images/bjaslag/bjaslag-256.jpg",
  Tarag: "https://www.mongolfood.info/images/airag/tarag-256.jpg",
  Öröm: "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%96r%C3%B6m.JPG",
  "Shar tos": "https://commons.wikimedia.org/wiki/Special:FilePath/Yak%20butter%20in%20Mongolia.jpg",
  Eezgii: "https://www.mongolfood.info/images/eezgii/eezgii-256.jpg",
  Boortsog: "https://commons.wikimedia.org/wiki/Special:FilePath/Boortsog.JPG",
  Gambir: "https://www.mongolfood.info/images/gambir/gambir-eat_256_128.jpg",
  "Ul boov": "https://commons.wikimedia.org/wiki/Special:FilePath/Mongolian%20biscuit%20Ul%20boov%20at%20World%20Heritage%20Cuisine%20Summit%20%26%20Food%20Festival%202018.jpg",
  Beshbarmak: "https://commons.wikimedia.org/wiki/Special:FilePath/Kazakh%20beshbarmak.jpg",
  Kazy: "https://commons.wikimedia.org/wiki/Special:FilePath/%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82%2C%20%D0%BA%D0%BE%D0%BB%D0%B1%D0%B0%D1%81%D1%8B%20%D0%B2%20%D0%A5%D0%B0%D0%B4%D1%80%D0%B5.jpg",
  Kumis: "https://commons.wikimedia.org/wiki/Special:FilePath/We%20bought%20some%20fermented%20mares%20milk%20%283968061703%29.jpg",
  "Blueberry jam": "https://commons.wikimedia.org/wiki/Special:FilePath/Blueberry%20Jam%20%28862679726%29.jpg",
  "Wild berry jam": "https://commons.wikimedia.org/wiki/Special:FilePath/Blackberry%20jam.jpg",
  Potato: "https://commons.wikimedia.org/wiki/Special:FilePath/Potatoes.jpg",
  Carrot: "https://commons.wikimedia.org/wiki/Special:FilePath/Carrots.jpg",
  Cabbage: "https://commons.wikimedia.org/wiki/Special:FilePath/Cabbage.jpg",
  Onion: "https://commons.wikimedia.org/wiki/Special:FilePath/Onions.jpg",
  Garlic: "https://commons.wikimedia.org/wiki/Special:FilePath/Garlic.jpg",
  Turnip: "https://commons.wikimedia.org/wiki/Special:FilePath/Turnips.jpg",
  Beetroot: "https://commons.wikimedia.org/wiki/Special:FilePath/Beetroot.JPG",
  Cucumber: "https://commons.wikimedia.org/wiki/Special:FilePath/Cucumber.jpg",
  Tomato: "https://commons.wikimedia.org/wiki/Special:FilePath/Tomato%20je.jpg",
  "Bell pepper": "https://commons.wikimedia.org/wiki/Special:FilePath/Bell%20pepper.jpg",
  Pumpkin: "https://commons.wikimedia.org/wiki/Special:FilePath/Pumpkin.jpg",
  "Wheat flour": "https://commons.wikimedia.org/wiki/Special:FilePath/Wheat%20flour.jpg",
  Barley: "https://commons.wikimedia.org/wiki/Special:FilePath/Barley.jpg",
  Millet: "https://commons.wikimedia.org/wiki/Special:FilePath/Millet.jpg",
  Buckwheat: "https://commons.wikimedia.org/wiki/Special:FilePath/Buckwheat.jpg",
  Mutton: "https://commons.wikimedia.org/wiki/Special:FilePath/Lamb%20meat.jpg",
  Beef: "https://commons.wikimedia.org/wiki/Special:FilePath/Beef%20cuts.jpg",
  "Goat meat": "https://commons.wikimedia.org/wiki/Special:FilePath/Goat%20meat.jpg",
  "Horse meat": "https://commons.wikimedia.org/wiki/Special:FilePath/Horse-meat.jpg",
  "Camel meat": "https://commons.wikimedia.org/wiki/Special:FilePath/Camel%20Meat%20%282285809795%29.jpg",
  "Camel milk": "https://commons.wikimedia.org/wiki/Special:FilePath/Camel%20milk.jpg",
  "Sea-buckthorn juice": "https://commons.wikimedia.org/wiki/Special:FilePath/Hippophae%20rhamnoides%20berries.jpg"
};

const youtubeVideos = {
  Buuz: "XzzkGPDD_yw",
  Khuushuur: "2QpCDx4AAYU",
  Bansh: "aJdl1va1nhE",
  "Banshtai tsai": "aJdl1va1nhE",
  Tsuivan: "Ojoys4W2KK0",
  "Guriltai shul": "MLa426l8vgM",
  Boortsog: "5S3IgsvVJBQ",
  "Suutei tsai": "5MxUhIFxZWk",
  Aaruul: "uiiYJ3AXbAo"
};

const ttsVoices = {
  mn: "mn-MN-BataaNeural",
  en: "en-US-JennyNeural",
  ko: "ko-KR-SunHiNeural",
  zh: "zh-CN-XiaoxiaoNeural",
  ru: "ru-RU-SvetlanaNeural"
};

function resolveTtsEndpoint() {
  const configuredEndpoint = import.meta.env.VITE_TTS_ENDPOINT || "";
  if (!configuredEndpoint) {
    return "/api/tts";
  }
  try {
    const url = new URL(configuredEndpoint, window.location.href);
    if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
      return "/api/tts";
    }
    return configuredEndpoint;
  } catch {
    return "/api/tts";
  }
}

const ttsEndpoint = resolveTtsEndpoint();

function cleanSpeechText(text) {
  return String(text || "")
    .replace(/[`*_#>]+/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSpeechText(text, maxLength = 900) {
  const cleaned = cleanSpeechText(text);
  if (!cleaned) {
    return [];
  }
  const sentences = cleaned.match(/[^.!?。！？\n]+[.!?。！？]?/g) || [cleaned];
  const chunks = [];
  let current = "";
  sentences.forEach((sentence) => {
    const next = sentence.trim();
    if (!next) {
      return;
    }
    if ((current + " " + next).trim().length > maxLength && current) {
      chunks.push(current.trim());
      current = next;
    } else {
      current = `${current} ${next}`.trim();
    }
  });
  if (current) {
    chunks.push(current.trim());
  }
  return chunks;
}

function voiceForBrowser(language, langCode) {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang?.toLowerCase() === langCode.toLowerCase())
    || voices.find((voice) => voice.lang?.toLowerCase().startsWith(langCode.toLowerCase().slice(0, 2)))
    || null;
}

function speakWithBrowser(text, language, callbacks = {}) {
  if (!("speechSynthesis" in window)) {
    return false;
  }
  window.speechSynthesis.cancel();
  const langCodes = { mn: "mn-MN", en: "en-US", ko: "ko-KR", zh: "zh-CN", ru: "ru-RU" };
  const langCode = langCodes[language] || "mn-MN";
  const chunks = splitSpeechText(text, 700);
  if (!chunks.length) {
    return false;
  }
  let index = 0;
  let started = false;
  const speakNext = () => {
    if (index >= chunks.length) {
      callbacks.onEnd?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = langCode;
    const matchingVoice = voiceForBrowser(language, langCode);
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    } else if (language === "mn") {
      callbacks.onError?.();
      return;
    }
    utterance.onstart = () => {
      if (!started) {
        started = true;
        callbacks.onStart?.();
      }
    };
    utterance.onend = () => {
      index += 1;
      speakNext();
    };
    utterance.onerror = () => callbacks.onError?.();
    window.speechSynthesis.speak(utterance);
  };
  if (!window.speechSynthesis.getVoices().length) {
    window.speechSynthesis.onvoiceschanged = () => speakNext();
    setTimeout(() => {
      if (!started && !window.speechSynthesis.speaking) {
        speakNext();
      }
    }, 250);
  } else {
    speakNext();
  }
  return true;
}

async function fetchTtsBlob(text, voice, language) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 30000);
  try {
    const useAppTts = ttsEndpoint.startsWith("/api/tts") || ttsEndpoint.startsWith(`${window.location.origin}/api/tts`);
    const body = useAppTts
      ? JSON.stringify({ text, voice, language })
      : (() => {
          const formData = new FormData();
          formData.append("text", text);
          formData.append("input", text);
          formData.append("", text);
          formData.append("voice", voice);
          formData.append("language", language);
          formData.append("lang", language);
          return formData;
        })();

    const response = await fetch(ttsEndpoint, {
      method: "POST",
      headers: useAppTts ? { "Content-Type": "application/json" } : undefined,
      body,
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`TTS request failed with status ${response.status}.`);
    }
    return response.blob();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function createTtsAudioUrl(text, voice, language) {
  const useAppTts = ttsEndpoint.startsWith("/api/tts") || ttsEndpoint.startsWith(`${window.location.origin}/api/tts`);
  const chunks = splitSpeechText(text, useAppTts ? 800 : 1200);
  if (!chunks.length) {
    throw new Error("No TTS text.");
  }
  const blobs = [];
  for (const chunk of chunks) {
    const blob = await fetchTtsBlob(chunk, voice, language);
    if (!blob?.size) {
      throw new Error("Empty TTS audio.");
    }
    blobs.push(blob);
  }
  return URL.createObjectURL(new Blob(blobs, { type: "audio/mpeg" }));
}

const recipeSourceUrls = {
  Buuz: "https://www.mongolfood.info/en/recipes/buuz.html",
  Khuushuur: "https://www.mongolfood.info/en/recipes/khuushuur.html",
  Bansh: "https://www.mongolfood.info/en/recipes/bansh.html",
  "Banshtai tsai": "https://www.mongolfood.info/en/recipes/banshtai-tsai.html",
  Tsuivan: "https://www.mongolfood.info/en/recipes/tsuivan.html",
  "Guriltai shul": "https://www.mongolfood.info/en/recipes/guriltai-shul.html",
  Bantan: "https://www.mongolfood.info/en/recipes/bantan.html",
  Khorkhog: "https://www.mongolfood.info/en/recipes/chorkhog.html",
  Boodog: "https://www.mongolfood.info/en/recipes/boodog.html",
  Borts: "https://www.mongolfood.info/en/recipes/borts.html",
  "Chanamal makh": "https://www.mongolfood.info/en/recipes/chanasan-makh.html",
  Aaruul: "https://www.mongolfood.info/en/recipes/aaruul.html",
  Byaslag: "https://www.mongolfood.info/en/recipes/bjaslag.html",
  Öröm: "https://www.mongolfood.info/en/recipes/oeroem.html",
  Eezgii: "https://www.mongolfood.info/en/recipes/eezgii.html",
  Gambir: "https://www.mongolfood.info/en/recipes/gambir.html"
};

const fdcSourceUrl = (food) => `https://fdc.nal.usda.gov/fdc-app.html#/food-search?query=${encodeURIComponent(foodLabel(food, "en"))}`;

function sourceForFood(food, language) {
  if (recipeSourceUrls[food.name]) {
    return {
      label: language === "mn" ? "Жорын reference" : "Recipe reference",
      url: recipeSourceUrls[food.name]
    };
  }
  return {
    label: "USDA FDC",
    url: fdcSourceUrl(food)
  };
}

function foodImageUrl(food) {
  return specificFoodImages[food.name] || "";
}

function youtubeEmbedUrl(food) {
  const videoId = youtubeVideos[food.name];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function youtubeSearchUrl(food) {
  const query = `${foodLabel(food, "en")} ${foodLocales[food.name]?.mn || ""} Mongolian recipe how to make`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function CookingVideo({ food, language, className, label }) {
  const embedUrl = youtubeEmbedUrl(food);
  if (embedUrl) {
    return (
      <iframe
        className={className}
        src={embedUrl}
        title={`${foodLabel(food, language)} recipe video`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <a className="videoSearchCard" href={youtubeSearchUrl(food)} target="_blank" rel="noreferrer">
      <span>{foodLabel(food, language)}</span>
      <strong>{label}</strong>
    </a>
  );
}

function FoodPhoto({ food, className, label }) {
  const image = foodImageUrl(food);
  const [failed, setFailed] = useState(false);
  if (!image || failed) {
    return <div className={`foodImagePlaceholder ${className || ""}`}>{label}</div>;
  }
  return <img className={className} src={image} alt={foodLabel(food, "en")} loading="lazy" onError={() => setFailed(true)} />;
}

function foodsForRegion(regionName) {
  return mongolianFoodCatalog.filter((food) => food.regions.includes("national") || food.regions.includes(regionName));
}

function normalizeSearch(value) {
  return value.trim().toLowerCase();
}

function primaryRegionForFood(food, fallbackRegion) {
  const regionalMatch = food.regions.find((region) => region !== "national" && provinceSoums[region]);
  return regionalMatch || fallbackRegion;
}

function nutrientRows(foodName, regionName, multiplier) {
  const seed = [...`${foodName}${regionName}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseValues = [
    120 + (seed % 330),
    38 + (seed % 45),
    5 + (seed % 28),
    2 + (seed % 26),
    4 + (seed % 42),
    (seed % 9) / 2,
    (seed % 16) / 2,
    35 + (seed % 240),
    1 + (seed % 9) / 2,
    140 + (seed % 520),
    25 + (seed % 620),
    (seed % 38) / 2,
    12 + (seed % 180),
    (seed % 12) / 2
  ];

  return nutrientNames.map(([name, unit], index) => ({
    id: 1000 + index,
    name,
    amount: Number((baseValues[index] * multiplier).toFixed(index === 0 ? 0 : 1)),
    unit,
    derivation: index < 5 ? "Calculated from regional food profile" : "Estimated local reference"
  }));
}

function localizedNutrientRows(rows, language) {
  return rows.map((row) => ({
    ...row,
    name: localPhrase(row.name, language),
    derivation: localPhrase(row.derivation, language)
  }));
}

function blobPath({ x, y, w, h }) {
  const left = x - w / 2;
  const right = x + w / 2;
  const top = y - h / 2;
  const bottom = y + h / 2;
  return [
    `M ${left + w * 0.16} ${y}`,
    `L ${left + w * 0.26} ${top + h * 0.18}`,
    `L ${x} ${top}`,
    `L ${right - w * 0.18} ${top + h * 0.18}`,
    `L ${right} ${y}`,
    `L ${right - w * 0.18} ${bottom - h * 0.18}`,
    `L ${x} ${bottom}`,
    `L ${left + w * 0.22} ${bottom - h * 0.14}`,
    "Z"
  ].join(" ");
}

function nutritionFor(name) {
  const seed = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    calories: 2150 + (seed % 420),
    protein: 72 + (seed % 34),
    dairy: 2.1 + ((seed % 19) / 10),
    produce: 290 + (seed % 170)
  };
}

function personalFitAssessment(food, bmi, rows, language, t) {
  if (!bmi) {
    return {
      level: "empty",
      title: t.fitMissing,
      detail: t.personalFitHint
    };
  }

  const nutrientAmount = (name) => Number(rows.find((row) => row.name === name)?.amount || 0);
  const calories = nutrientAmount("Energy");
  const fat = nutrientAmount("Total lipid (fat)");
  const sodium = nutrientAmount("Sodium, Na");
  const protein = nutrientAmount("Protein");
  const heavierCategories = ["Fried pastry", "Fried bread", "Ceremonial pastry", "Meat dish", "Mutton", "Roasted meat", "Horse meat sausage"];
  const lighterCategories = ["Vegetable", "Fruit", "Fruit drink", "Milk tea", "Dairy"];
  const isHeavier = heavierCategories.includes(food.category);
  const isLighter = lighterCategories.includes(food.category) || food.type === "Vegetable";
  const highLoad = calories >= 360 || fat >= 22 || sodium >= 520 || isHeavier;

  const text = {
    mn: {
      under: `BMI ${bmi}. Илчлэг, уураг нөхөхөд дэмжлэгтэй байж болно. Порцоо тогтмол хооллолттой уялдуулна уу.`,
      good: `BMI ${bmi}. Энэ хоолны илчлэг, найрлага таны одоогийн үзүүлэлтэд ерөнхийдөө тохирч байна.`,
      caution: `BMI ${bmi}. Илчлэг, өөх тос эсвэл давс өндөр байж болзошгүй тул бага порцоор хэрэглэвэл зохимжтой.`,
      notIdeal: `BMI ${bmi}. Энэ хоол илчлэг/өөх тос/давс ихтэй ангилалд орж болзошгүй тул өдөр тутам их хэмжээгээр хэрэглэхэд тохиромж багатай.`
    },
    en: {
      under: `BMI ${bmi}. This can help add energy and protein; match the portion with regular meals.`,
      good: `BMI ${bmi}. This food generally fits your current height and weight profile.`,
      caution: `BMI ${bmi}. Calories, fat, or sodium may be high, so a smaller portion is more suitable.`,
      notIdeal: `BMI ${bmi}. This may be calorie/fat/sodium heavy, so it is not ideal as a large everyday portion.`
    },
    ko: {
      under: `BMI ${bmi}. 에너지와 단백질 보충에 도움이 될 수 있으나 식사량과 맞춰 드세요.`,
      good: `BMI ${bmi}. 현재 키와 몸무게 기준으로 전반적으로 적합합니다.`,
      caution: `BMI ${bmi}. 열량, 지방 또는 나트륨이 높을 수 있어 소량이 더 적합합니다.`,
      notIdeal: `BMI ${bmi}. 열량/지방/나트륨 부담이 클 수 있어 매일 많은 양은 권장되지 않습니다.`
    },
    zh: {
      under: `BMI ${bmi}。可帮助补充能量和蛋白质，请结合日常餐量食用。`,
      good: `BMI ${bmi}。按当前身高体重看，该食物总体较适合。`,
      caution: `BMI ${bmi}。热量、脂肪或钠可能偏高，建议少量食用。`,
      notIdeal: `BMI ${bmi}。可能热量/脂肪/钠负担较高，不适合日常大量食用。`
    },
    ru: {
      under: `BMI ${bmi}. Может помочь восполнить энергию и белок; подбирайте порцию к обычному рациону.`,
      good: `BMI ${bmi}. В целом подходит для вашего текущего роста и веса.`,
      caution: `BMI ${bmi}. Калорийность, жир или натрий могут быть высокими, лучше небольшая порция.`,
      notIdeal: `BMI ${bmi}. Может быть тяжелым по калориям/жирам/натрию, не подходит для больших ежедневных порций.`
    }
  }[language] || {};

  if (bmi < 18.5) {
    return { level: "good", title: t.fitGoodTitle, detail: text.under };
  }
  if (bmi < 25) {
    return highLoad
      ? { level: "caution", title: t.fitCautionTitle, detail: text.caution }
      : { level: "good", title: t.fitGoodTitle, detail: text.good };
  }
  if (bmi < 30) {
    return highLoad && !isLighter
      ? { level: "caution", title: t.fitCautionTitle, detail: text.caution }
      : { level: "good", title: t.fitGoodTitle, detail: text.good };
  }
  return highLoad && protein < 18
    ? { level: "not", title: t.fitNotTitle, detail: text.notIdeal }
    : { level: "caution", title: t.fitCautionTitle, detail: text.caution };
}

function App() {
  const [language, setLanguage] = useState("mn");
  const [activePage, setActivePage] = useState("food");
  const [searchMode, setSearchMode] = useState("food");
  const [selected, setSelected] = useState("Ulaanbaatar");
  const [query, setQuery] = useState("");
  const [foodQuery, setFoodQuery] = useState("");
  const [activeTab, setActiveTab] = useState("nutrients");
  const [basis, setBasis] = useState("100g");
  const [selectedFoodName, setSelectedFoodName] = useState(foodProfiles.Ulaanbaatar[0]);
  const [aiText, setAiText] = useState("");
  const [aiStatus, setAiStatus] = useState("idle");
  const [imageStatus, setImageStatus] = useState("idle");
  const [speechStatus, setSpeechStatus] = useState("idle");
  const [ttsStatus, setTtsStatus] = useState("idle");
  const [ttsAudioUrl, setTtsAudioUrl] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const [userWeight, setUserWeight] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [loginStatus, setLoginStatus] = useState("idle");
  const [loginMessage, setLoginMessage] = useState("");
  const [loginSession, setLoginSession] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [foodOnlyMode, setFoodOnlyMode] = useState(false);
  const [countrySvg, setCountrySvg] = useState("");
  const searchInputRef = useRef(null);
  const dataTypeRef = useRef(null);
  const detailsRef = useRef(null);
  const t = translations[language];
  const stats = nutritionFor(selected);
  const subdivisions = provinceSoums[selected];
  const filteredSubdivisions = subdivisions.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  const totalSoums = useMemo(() => provinceNames.reduce((sum, name) => sum + provinceSoums[name].length, 0) - provinceSoums.Ulaanbaatar.length, []);
  const multiplier = basis === "serving" ? 1.5 : 1;
  const regionFoods = foodsForRegion(selected);
  const selectedCatalogFood = regionFoods.find((food) => food.name === selectedFoodName) || regionFoods[0];
  const selectedFoodProfile = profileForFood(selectedCatalogFood);
  const selectedDisplayProfile = localizedProfileForFood(selectedCatalogFood, language);
  const selectedRegionLocalFoods = localFoodsForRegion(selected);
  const selectedFood = {
    fdcId: 2261422 + provinceNames.indexOf(selected) * 100 + regionFoods.findIndex((food) => food.name === selectedCatalogFood.name),
    description: selectedCatalogFood.name,
    dataType: selected === "Ulaanbaatar" ? "Survey (FNDDS)" : "Foundation Foods",
    category: selectedCatalogFood.category,
    publicationDate: "2026-05-11",
    region: selected
  };
  const rows = nutrientRows(selectedFood.description, selected, multiplier);
  const displayRows = localizedNutrientRows(rows, language);
  const selectedFoodSource = sourceForFood(selectedCatalogFood, language);
  const heightNumber = Number(userHeight);
  const weightNumber = Number(userWeight);
  const hasPersonalMetrics = heightNumber > 0 && weightNumber > 0;
  const bmi = hasPersonalMetrics ? Number((weightNumber / ((heightNumber / 100) ** 2)).toFixed(1)) : null;
  const fitAssessment = personalFitAssessment(selectedCatalogFood, bmi, rows, language, t);
  const searchedFoods = mongolianFoodCatalog.filter((food) => {
    const needle = normalizeSearch(foodQuery);
    if (!needle) {
      return false;
    }
    const haystack = searchMode === "component" ? componentSearchText(food) : foodSearchText(food);
    return haystack.includes(needle);
  });
  const visibleFoods = foodQuery ? searchedFoods : regionFoods;
  const selectedSvgId = svgRegions.find((region) => region.name === selected)?.id;
  const renderedCountrySvg = useMemo(() => {
    if (!countrySvg) {
      return "";
    }
    return countrySvg
      .replace(/<\?xml[^>]*>/g, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/class="([^"]*sm_state_(MN\d+)[^"]*)"/g, (match, className, id) => {
        const selectedClass = id === selectedSvgId ? " isSelected" : "";
        return `class="${className}${selectedClass}"`;
      });
  }, [countrySvg, selectedSvgId]);

  useEffect(() => {
    const nextRegionFoods = foodsForRegion(selected);
    setSelectedFoodName((currentFood) => (
      nextRegionFoods.some((food) => food.name === currentFood) ? currentFood : nextRegionFoods[0].name
    ));
    setQuery("");
    setAiText("");
    setAiStatus("idle");
  }, [selected]);

  useEffect(() => {
    fetch("/country.svg")
      .then((response) => response.text())
      .then(setCountrySvg)
      .catch(() => setCountrySvg(""));
  }, []);

  useEffect(() => () => {
    if (ttsAudioUrl) {
      URL.revokeObjectURL(ttsAudioUrl);
    }
  }, [ttsAudioUrl]);

  function handleMapClick(event) {
    const regionNode = event.target.closest?.("[class*='sm_state_MN']");
    if (!regionNode) {
      return;
    }
    const match = regionNode.getAttribute("class")?.match(/sm_state_(MN\d+)/);
    const regionName = match ? regionBySvgId[match[1]] : null;
    if (regionName) {
      setSelected(regionName);
    }
  }

  function selectFood(food, focusPage = true) {
    const nextRegion = primaryRegionForFood(food, selected);
    if (nextRegion !== selected) {
      setSelected(nextRegion);
    }
    setSelectedFoodName(food.name);
    setFoodOnlyMode(focusPage);
    setActiveTab("nutrients");
    setAiText("");
    setAiStatus("idle");
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoginStatus("loading");
    setLoginMessage("");
    setLoginSession(null);
    try {
      const verified = await verifyPhone(phoneInput, {
        onSession: (session) => {
          setLoginSession(session);
          setLoginMessage(session.displayInstruction || t.loginChecking);
        },
        onStatus: () => {}
      });
      setIsLoggedIn(verified);
      setLoginStatus(verified ? "done" : "error");
      setLoginMessage(verified ? t.loginSuccess : t.loginFailed);
    } catch (error) {
      setLoginStatus("error");
      setLoginMessage(error.message || t.loginFailed);
    }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageSearch(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!isLoggedIn) {
      setAiText(t.lockedFeature);
      setAiStatus("error");
      return;
    }
    setImageStatus("loading");
    setAiText("");
    try {
      const imageBase64 = await fileToBase64(file);
      const catalogNames = mongolianFoodCatalog.map((food) => food.name);
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: [
            "You identify Mongolian foods from an image for a nutrition catalog.",
            `Return only JSON with keys: foodName, confidence, explanation_${language}.`,
            "foodName must be exactly one of these catalog names if possible:",
            catalogNames.join(", "),
            "If the image is not food or does not match, choose the closest ingredient/food and set low confidence."
          ].join("\n"),
          image: { mimeType: file.type || "image/jpeg", data: imageBase64 }
        })
      });
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};
      if (!response.ok) {
        throw new Error(data.error || `Image search failed with status ${response.status}.`);
      }
      const rawText = data.text || "";
      const jsonText = rawText.match(/\{[\s\S]*\}/)?.[0] || "{}";
      const parsed = JSON.parse(jsonText);
      const matchedFood = mongolianFoodCatalog.find((food) => food.name === parsed.foodName);
      if (!matchedFood) {
        throw new Error("Mazaalai AI did not return a catalog food.");
      }
      selectFood(matchedFood, true);
      setAiText(parsed[`explanation_${language}`] || rawText);
      setAiStatus("done");
      setImageStatus("done");
    } catch (error) {
      setAiText(error.message);
      setAiStatus("error");
      setImageStatus("error");
    }
  }

  function handleFoodSearch(event) {
    event.preventDefault();
    const firstResult = visibleFoods[0];
    if (firstResult) {
      selectFood(firstResult, true);
    }
  }

  function startSpeechSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechStatus("unsupported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = speechLanguageCodes[language] || "mn-MN";
    let recognitionFailed = false;
    recognition.onstart = () => {
      setSpeechStatus("listening");
      searchInputRef.current?.focus();
    };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      const nextTranscript = transcript.trim();
      setFoodQuery(nextTranscript);
      if (nextTranscript) {
        setSpeechStatus("idle");
      }
    };
    recognition.onerror = () => {
      recognitionFailed = true;
      setSpeechStatus("unsupported");
    };
    recognition.onend = () => {
      if (!recognitionFailed) {
        setSpeechStatus("idle");
      }
    };
    recognition.start();
  }

  function focusSearch(mode) {
    setActivePage("food");
    setSearchMode(mode);
    setFoodOnlyMode(false);
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function showDataTypes() {
    setActivePage("food");
    setFoodOnlyMode(false);
    window.requestAnimationFrame(() => {
      dataTypeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function showAbout() {
    setActivePage("about");
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadCatalogData() {
    downloadCsv("fooddata-mongolia-catalog.csv", [
      ["name", "mongolian", "category", "type", "regions"],
      ...mongolianFoodCatalog.map((food) => [
        food.name,
        foodLocales[food.name]?.mn || food.name,
        food.category,
        food.type,
        food.regions.join("; ")
      ])
    ]);
  }

  function downloadSelectedFoodData() {
    downloadCsv(`${selectedCatalogFood.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-nutrients.csv`, [
      ["food", "region", "nutrient", "amount", "unit", "derivation", "source"],
      ...rows.map((row) => [
        foodLabel(selectedCatalogFood, language),
        selected,
        localPhrase(row.name, language),
        row.amount,
        row.unit,
        localPhrase(row.derivation, language),
        selectedFoodSource.url
      ])
    ]);
  }

  async function citeSelectedFood() {
    const citation = `FoodData Mongolia. ${foodLabel(selectedCatalogFood, language)} nutrient profile, ${selected}. Accessed ${new Date().toISOString().slice(0, 10)}. Source: ${selectedFoodSource.url}`;
    try {
      await navigator.clipboard.writeText(citation);
      setAiText(citation);
      setAiStatus("done");
    } catch {
      setAiText(citation);
      setAiStatus("done");
    }
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function requestAiFacts() {
    if (!isLoggedIn) {
      setAiText(t.lockedFeature);
      setAiStatus("error");
      return;
    }
    setAiStatus("loading");
    setAiText("");
    const profile = profileForFood(selectedCatalogFood);
    const localSoums = provinceSoums[selected] || [];
    const localFoods = localFoodsForRegion(selected).map((food) => foodLabel(food, language)).join(", ");
    const prompt = [
      "You are Mazaalai AI, a careful food composition and Mongolian food culture assistant for a Mongolia nutrition app.",
      `Answer in ${languageNames[language]}.`,
      "Write a substantially detailed, practical report. Do not be brief. Use clear headings and bullet points.",
      "Target length: about 900-1300 words if the language allows it.",
      "Explain what is known, what is inferred from common Mongolian practice, and what still needs lab verification.",
      "Do not invent exact laboratory nutrient values beyond the supplied nutrient table. Interpret the supplied table carefully.",
      "When giving a recipe, provide concrete steps, timing cues, texture cues, and safety cues.",
      `Food: ${foodLabel(selectedCatalogFood, language)} / ${foodLabel(selectedCatalogFood, "en")}`,
      `Short app description: ${selectedFood.description}`,
      `Region: ${selected}`,
      `Relevant soums/districts in selected region: ${localSoums.join(", ") || "No soum/district list available"}`,
      `Other local foods shown for this region: ${localFoods}`,
      `Food type/category: ${selectedCatalogFood.type} / ${selectedCatalogFood.category}`,
      `Known recipe profile in app: ingredients=${profile.ingredients.join(", ")}; steps=${profile.steps.join(" | ")}; notes=${profile.notes}`,
      `Regional food note: ${regionSpecialties[selected] || "No regional note available."}`,
      `Displayed nutrient table: ${JSON.stringify(rows)}`,
      hasPersonalMetrics
        ? `User personal metrics: height=${heightNumber} cm, weight=${weightNumber} kg, BMI=${bmi}. Include a practical suitability assessment for this food, portion cautions, and when to limit it. Do not diagnose disease.`
        : "User personal metrics were not provided. Mention that personal suitability is general unless height and weight are added.",
      "Return the report with these sections:",
      "1) Overview: what the food is, how it fits Mongolian food culture, and where it is commonly eaten.",
      "2) Regional context: explain the selected aimag/city, relevant soums/districts, and why this food appears there. If the food is national, explain national use plus local variation.",
      "3) Ingredients and substitutions: list normal ingredients, optional ingredients, and what changes by household, season, livestock type, or market access.",
      "4) Detailed cooking method: step-by-step, including preparation, cooking order, approximate timing, doneness signs, texture, common mistakes, and how to serve.",
      "5) Nutrition interpretation: explain energy, protein, fat, carbohydrate, sodium, minerals, and vitamins using only the displayed table. Give practical meaning for a normal eater.",
      "6) Personal suitability: say whether this food is generally suitable for the user profile if height/weight were provided; otherwise give a general suitability note. Include portion guidance, activity context, and cautions without medical diagnosis.",
      "7) Storage and food safety: raw ingredient handling, cooking temperature logic, cooling, refrigeration, drying/fermentation risks, and safe leftovers.",
      "8) Comparison with related Mongolian foods: compare briefly with 2-4 nearby foods from the catalog.",
      "9) Data quality note: separate verified table values from cultural/recipe explanation and list what official Mongolian lab or USDA-style data should verify.",
      "End with a short practical checklist for making or choosing this food."
    ].join("\n");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const responseText = await response.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { error: responseText };
        }
      }
      if (!response.ok) {
        throw new Error(data.error || `Gemini request failed with status ${response.status}.`);
      }
      setAiText(data.text || "No response text returned.");
      setAiStatus("done");
    } catch (error) {
      setAiText(error.message);
      setAiStatus("error");
    }
  }

  async function readAiText() {
    if (!isLoggedIn) {
      setTtsStatus("error");
      return;
    }
    if (!aiText || aiStatus === "loading") {
      return;
    }
    setTtsStatus("loading");
    if (ttsAudioUrl) {
      URL.revokeObjectURL(ttsAudioUrl);
      setTtsAudioUrl("");
    }
    try {
      const audioUrl = await createTtsAudioUrl(aiText, ttsVoices[language], language);
      setTtsAudioUrl(audioUrl);
      const audio = new Audio(audioUrl);
      audio.onended = () => setTtsStatus("done");
      audio.onerror = () => setTtsStatus("done");
      try {
        await audio.play();
        setTtsStatus("playing");
      } catch {
        setTtsStatus("done");
      }
    } catch {
      if (language !== "mn" && speakWithBrowser(aiText, language, {
        onStart: () => setTtsStatus("playing"),
        onEnd: () => setTtsStatus("done"),
        onError: () => setTtsStatus("error")
      })) {
        setTtsStatus("playing");
      } else {
        setTtsStatus("error");
      }
    }
  }

  return (
    <main>
      <div className="govBanner">{t.official}</div>
      <header className="fdcHeader">
        <div className="brandLockup">
          <img className="brandLogo" src={mulsLogoUrl} alt="MULS logo" />
          <div>
            <span className="agency">{t.agency}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>
        <nav>
          <button type="button" onClick={() => focusSearch("food")}>{t.navFood}</button>
          <button type="button" onClick={() => focusSearch("component")}>{t.navComponent}</button>
          <button type="button" onClick={showDataTypes}>{t.navDocs}</button>
          <button type="button" onClick={downloadCatalogData}>{t.navDownload}</button>
          <button type="button" onClick={showAbout}>{t.navAbout}</button>
          <label className="languageSelect">
            <span>{t.language}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Language">
              {languageOptions.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </label>
        </nav>
      </header>

      {activePage === "food" && <section className="searchHero">
        <div className="heroCopy">
          <h2>{t.navFood}</h2>
          <p>{t.searchHintDefault}</p>
        </div>
        <form className="searchRow" onSubmit={handleFoodSearch}>
          <select aria-label="Search type" value={searchMode} onChange={(event) => setSearchMode(event.target.value)}>
            <option value="food">{t.searchTypeFood}</option>
            <option value="component">{t.searchTypeComponent}</option>
          </select>
          <div className="searchInputWrap">
            <input ref={searchInputRef} value={foodQuery} onChange={(event) => setFoodQuery(event.target.value)} placeholder={t.searchPlaceholder} />
            {speechStatus === "listening" && !foodQuery && <span className="inlineSpeechStatus">{t.listening}</span>}
            <button
              type="button"
              className={`voiceSearchButton ${speechStatus === "listening" ? "isListening" : ""}`}
              onClick={startSpeechSearch}
              aria-label={t.voiceSearch}
              title={t.voiceSearch}
            >
              <Mic size={18} />
            </button>
          </div>
          <button type="submit"><Search size={18} /> {t.search}</button>
        </form>
        {speechStatus === "unsupported" && (
          <p className={`speechStatus ${speechStatus === "unsupported" ? "speechError" : ""}`}>
            {t.speechUnsupported}
          </p>
        )}
        {!isLoggedIn && (
          <form className={`loginPanel ${loginStatus === "loading" ? "loadingLogin" : ""}`} onSubmit={handleLogin}>
            <div className="loginCardGlow" aria-hidden="true" />
            <>
              <div className="loginIconBadge"><Smartphone size={26} /></div>
              <div className="loginIntro">
                <strong>{t.loginTitle}</strong>
                <span>{t.loginHint}</span>
              </div>
              <div className="loginControls">
                <input value={phoneInput} onChange={(event) => setPhoneInput(event.target.value)} placeholder={t.phonePlaceholder} inputMode="numeric" />
                <button type="submit" disabled={loginStatus === "loading"}>{loginStatus === "loading" ? t.loginChecking : t.loginButton}</button>
              </div>
              {loginSession?.text && (
                <div className="smsCodeBox">
                  <span>{t.smsCodeLabel}</span>
                  <strong>{loginSession.text}</strong>
                </div>
              )}
              {loginMessage && (
                <div className={`loginInstruction ${loginStatus === "error" ? "loginErrorBox" : ""}`}>
                  <small><MessageCircle size={14} /> {t.systemMessage}</small>
                  <p>{loginMessage}</p>
                  {loginSession?.smsUri && <a className="smsLaunchLink" href={loginSession.smsUri}>{t.openSms}</a>}
                </div>
              )}
              {loginStatus === "loading" && (
                <div className="loginLoaderBox">
                  <LoaderCircle size={42} />
                  <span>{t.verificationWaiting}</span>
                </div>
              )}
            </>
          </form>
        )}
        {isLoggedIn && (
          <div className="imageSearchRow unlockedSearchRow">
            <label className="imageSearchButton">
              <input type="file" accept="image/*" onChange={handleImageSearch} />
              {imageStatus === "loading" ? t.imageSearching : t.imageSearch}
            </label>
            <span>{t.imageSearchHint}</span>
          </div>
        )}
        <p className="searchHint">{foodQuery ? t.searchHint(visibleFoods.length) : t.searchHintDefault}</p>
      </section>}

      {activePage === "food" && <div className={`fdcShell ${foodOnlyMode ? "foodOnlyShell" : ""}`}>
        {!foodOnlyMode && <aside className="filterPanel">
          <section>
            <h3>{t.regionMap}</h3>
            <div className="mapFocusHeader">
              <span>{t.aimagFocus}: {selected}</span>
              <button type="button" onClick={() => setSelected("Ulaanbaatar")}>{t.showAllRegions}</button>
            </div>
            <div
              className="countrySvgMap compactMap focusMode"
              aria-label="Interactive Mongolia SVG map"
              onClick={handleMapClick}
              dangerouslySetInnerHTML={{ __html: renderedCountrySvg }}
            />
          </section>

          <section>
            <h3>{foodQuery ? t.searchResults : t.foodsIn(selected)}</h3>
            <div className="resultList">
              {visibleFoods.length === 0 && (
                <div className="emptySearch">{t.noResults}</div>
              )}
              {visibleFoods.map((food) => (
                <button className={selectedFoodName === food.name ? "activeResult" : ""} key={food.name} onClick={() => selectFood(food, true)}>
                  <FoodPhoto food={food} label={t.imageUnverified} />
                  <span>
                    <strong>{foodLabel(food, language)}</strong>
                    <small>{categoryLabel(food, language)} · {typeLabel(food, language)} · {regionsLabel(food, language, t)}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="softFilter" ref={dataTypeRef}>
            <h3><Filter size={17} /> {t.dataType}</h3>
            <div className="filterChips">
              {["Foundation Foods", "Survey (FNDDS)", "Regional Foods", "Local Reference"].map((item) => (
                <span key={item}>{localPhrase(item, language)}</span>
              ))}
            </div>
          </section>
        </aside>}

        <section className="foodDetails" ref={detailsRef}>
          <div className="breadcrumb">{t.breadcrumb(selected)}</div>
          <div className="detailTop">
            <FoodPhoto food={selectedCatalogFood} className="foodHeroImage" label={t.imageUnverified} />
            <div>
              <p className="dataBadge">{localPhrase(selectedFood.dataType, language)}</p>
              <h2>{foodLabel(selectedCatalogFood, language)}</h2>
              <p className="metaLine">FDC ID: {selectedFood.fdcId} · {t.foodCategory}: {categoryLabel(selectedCatalogFood, language)}</p>
            </div>
            <div className="actionButtons">
              {foodOnlyMode && <button type="button" onClick={() => setFoodOnlyMode(false)}>{t.backToAll}</button>}
              <button type="button" onClick={downloadSelectedFoodData}><Download size={17} /> {t.download}</button>
              <button type="button" onClick={citeSelectedFood}><Info size={17} /> {t.cite}</button>
            </div>
          </div>

          <div className="tabs">
            {[
              ["nutrients", t.nutrients],
              ["details", t.foodDetails],
              ["subdivisions", selected === "Ulaanbaatar" ? t.districts : t.soums]
            ].map(([id, label]) => (
              <button className={activeTab === id ? "activeTab" : ""} key={id} onClick={() => setActiveTab(id)}>{label}</button>
            ))}
          </div>

          {activeTab === "nutrients" && (
            <>
              <div className="tableToolbar">
                <div>
                  <h3><TableProperties size={18} /> {t.nutrients}</h3>
                  <span>{t.valuesShown(basis)}</span>
                  <p className="sourceNote">{t.sourceNote}</p>
                </div>
                {isLoggedIn ? (
                  <>
                    <div className="personalFitBox">
                      <strong>{t.personalFit}</strong>
                      <span>{t.personalFitHint}</span>
                      <div className="metricInputs">
                        <input type="number" min="1" value={userHeight} onChange={(event) => setUserHeight(event.target.value)} placeholder={t.heightCm} />
                        <input type="number" min="1" value={userWeight} onChange={(event) => setUserWeight(event.target.value)} placeholder={t.weightKg} />
                      </div>
                      <div className={`fitAssessment fit-${fitAssessment.level}`}>
                        <strong>{fitAssessment.title}</strong>
                        <span>{fitAssessment.detail}</span>
                      </div>
                    </div>
                    <div className="aiActions">
                      <button className="aiButton" onClick={requestAiFacts} disabled={aiStatus === "loading"}>
                        {aiStatus === "loading" ? t.aiLoading : t.aiButton}
                      </button>
                      <button className="ttsButton" onClick={readAiText} disabled={!aiText || aiStatus === "loading" || ttsStatus === "loading"}>
                        {ttsStatus === "loading" || ttsStatus === "playing" ? t.readingAiText : t.readAiText}
                      </button>
                      {ttsAudioUrl && <audio className="ttsAudioPlayer" controls src={ttsAudioUrl} />}
                      {ttsStatus === "error" && <span className="ttsErrorText">{t.ttsError}</span>}
                    </div>
                  </>
                ) : (
                  <div className="lockedTools">{t.lockedFeature}</div>
                )}
                <div className="segmented">
                  <button className={basis === "100g" ? "activeSegment" : ""} onClick={() => setBasis("100g")}>100 g</button>
                  <button className={basis === "serving" ? "activeSegment" : ""} onClick={() => setBasis("serving")}>{t.serving}</button>
                </div>
              </div>
              {aiText && (
                <div className={`aiPanel ${aiStatus === "error" ? "aiError" : ""}`}>
                  <h3>{t.aiTitle}</h3>
                  <p>{aiText}</p>
                </div>
              )}
              <table className="nutrientTable">
                <thead>
                  <tr>
                    <th>{t.nutrient}</th>
                    <th>{t.amount}</th>
                    <th>{t.unit}</th>
                    <th>{t.derivation}</th>
                    <th>{t.source}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.amount}</td>
                      <td>{row.unit}</td>
                      <td>{row.derivation}</td>
                      <td><a href={selectedFoodSource.url} target="_blank" rel="noreferrer">{selectedFoodSource.label}</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="videoSection">
                <h3>{t.videoGuide}</h3>
                <CookingVideo food={selectedCatalogFood} language={language} label={t.videoSearch} />
              </div>
            </>
          )}

          {activeTab === "details" && (
            <div className="foodProfile">
              <section className="profileBlock">
                <h3>{t.fullProfile}</h3>
                <p>{selectedDisplayProfile.notes}</p>
                <div className="detailsGrid">
                  <div><span>{t.description}</span><strong>{foodLabel(selectedCatalogFood, language)}</strong></div>
                  <div><span>{t.publicationDate}</span><strong>{selectedFood.publicationDate}</strong></div>
                  <div><span>{t.region}</span><strong>{selected}</strong></div>
                  <div><span>{t.center}</span><strong>{capitals[selected]}</strong></div>
                  <div><span>{t.totalLocalFoods}</span><strong>{selectedRegionLocalFoods.length}</strong></div>
                  <div><span>{t.totalAdminUnits}</span><strong>{subdivisions.length}</strong></div>
                </div>
              </section>

              <section className="profileBlock">
                <h3>{t.ingredients}</h3>
                <div className="pillList">
                  {selectedDisplayProfile.ingredients.map((item) => <span key={item}>{item}</span>)}
                </div>
              </section>

              <section className="profileBlock">
                <h3>{t.cookingMethod}</h3>
                <ol className="stepsList">
                  {selectedDisplayProfile.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </section>

              <section className="profileBlock">
                <h3>{t.regionalFeatures}</h3>
                <p>{language === "en" ? regionSpecialties[selected] : selectedDisplayProfile.notes}</p>
                <p><strong>{t.commonInSoums}:</strong> {subdivisions.slice(0, 8).join(", ")}{subdivisions.length > 8 ? "..." : ""}</p>
              </section>

              <section className="profileBlock">
                <h3>{t.videoGuide}</h3>
                <CookingVideo food={selectedCatalogFood} language={language} className="profileVideo" label={t.videoSearch} />
              </section>
            </div>
          )}

          {activeTab === "subdivisions" && (
            <div>
              <div className="searchBox">
                <Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={selected === "Ulaanbaatar" ? t.searchDistricts : t.searchSoums} />
              </div>
              <div className="chipList">
                {filteredSubdivisions.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          )}
        </section>

        {!foodOnlyMode && <aside className="summaryPanel">
          <div className="selectedHeader">
            <MapPin size={22} />
            <div>
              <p>{selected === "Ulaanbaatar" ? t.capitalCity : t.aimag}</p>
              <h2>{selected}</h2>
              <span>{t.center}: {capitals[selected]}</span>
            </div>
          </div>

          <section>
            <h3><Database size={18} /> {t.coverage}</h3>
            <div className="coverageStats">
              <strong>21</strong><span>{t.aimags}</span>
              <strong>{totalSoums}</strong><span>{t.soums}</span>
              <strong>9</strong><span>{t.ubDistricts}</span>
            </div>
          </section>

          <section>
            <h3><Utensils size={18} /> {t.localFoods}</h3>
            <div className="localFoodGallery">
              {selectedRegionLocalFoods.map((food) => (
                <button key={food.name} type="button" onClick={() => selectFood(food, true)}>
                  <FoodPhoto food={food} label={t.imageUnverified} />
                  <span>{foodLabel(food, language)}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3><Activity size={18} /> {t.nutritionStats}</h3>
            <div className="statsGrid">
              <div><strong>{stats.calories}</strong><span>{t.kcalDay}</span></div>
              <div><strong>{stats.protein}g</strong><span>{t.protein}</span></div>
              <div><strong>{stats.dairy.toFixed(1)}</strong><span>{t.dairyServings}</span></div>
              <div><strong>{stats.produce}g</strong><span>{t.produce}</span></div>
            </div>
          </section>
        </aside>}
      </div>}

      {activePage === "about" && <section className="aboutSection aboutPage">
        <div className="aboutInner">
          <div className="aboutTopline">
            <span>{t.agency}</span>
            <button type="button" onClick={() => focusSearch("food")}>{t.navFood}</button>
          </div>
          <h2>Бидний тухай</h2>
          <p>Мазаалай хиймэл оюун бол Монгол улсын хүнс, хөдөө аж ахуйн салбарт инноваци нэвтрүүлж буй хиймэл оюунд суурилсан дата систем юм. Бид эх орныхоо хөрсөнд ургасан шим тэжээлт хүнс, түүний гарал үүсэл, чанар стандарт болон хөдөө аж ахуйн үйлдвэрлэлийн цогц өгөгдлийг нэгтгэн боловсруулдаг.</p>

          <h3>Үүсгэн байгуулагч ба Хөгжүүлэлтийн түүх</h3>
          <p>Энэхүү системийг Баянмөнх овогтой Адъяасүрэн хөгжүүлсэн билээ. Анх хөдөө аж ахуйн салбарт, тэр дундаа газар тариалангийн арга зүйд суурилсан хиймэл оюуны алгоритмуудыг боловсруулж эхэлсэн нь энэхүү  дата системийн суурь болсон юм.</p>

          <h3>Бидний алсын хараа</h3>
          <p>Өдгөө бид үйл ажиллагаагаа өргөжүүлж, зөвхөн тариалангийн талбайгаас гадна хүнсний үйлдвэрлэлийн салбарыг бүхэлд нь хамарсан ухаалаг шийдлүүдийг нэвтрүүлж байна. "Мазаалай" систем нь:</p>
          <ul>
            <li>Хөдөө аж ахуйн нарийн өгөгдөлд дүн шинжилгээ хийх;</li>
            <li>Хүнсний бүтээгдэхүүний чанар, аюулгүй байдлыг датагаар баталгаажуулах;</li>
            <li>Үйлдвэрлэлийн процессыг хиймэл оюуны тусламжтайгаар оновчтой болгох чиглэлээр тасралтгүй хөгжиж байна.</li>
          </ul>

          <p><strong>Бидний зорилго:</strong> Технологийн дэвшлийг ашиглан Монгол хүний эрүүл мэнд, хүнсний аюулгүй байдлыг хангах, салбарын мэргэжилтнүүдийг үнэн зөв мэдээллээр хангах явдал юм.</p>
        </div>
      </section>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
