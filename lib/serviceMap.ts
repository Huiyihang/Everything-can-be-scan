import type {
  ObjectCategory,
  ObjectCondition,
  ServiceProduct,
  ServiceRecommendation,
  ServiceType
} from "@/lib/types";

type ServiceTemplate = Omit<ServiceRecommendation, "id">;

function createTaobaoSearchUrl(keyword: string) {
  return `https://main.m.taobao.com/search/index.html?q=${encodeURIComponent(keyword)}`;
}

function createProducts(items: Array<Omit<ServiceProduct, "href">>): ServiceProduct[] {
  return items.map((item) => ({
    ...item,
    href: createTaobaoSearchUrl(item.keyword)
  }));
}

const serviceByCategory: Record<ObjectCategory, ServiceTemplate> = {
  drinkware: {
    type: "shopping",
    title: "给它找个接班杯",
    description: "看看耐热马克杯、随行杯和高颜值水杯，让旧物安心退休。",
    buttonText: "去看看新杯子",
    href: "/service/drinkware-shopping",
    reason: "识别到杯具类物品，若有缺口或老化，继续装热饮可能不太安心。",
    providerName: "淘系好物",
    serviceItems: ["耐热马克杯", "随行保温杯", "旧杯改造灵感"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "耐热马克杯",
    externalUrl: createTaobaoSearchUrl("耐热马克杯"),
    products: createProducts([
      {
        title: "耐热马克杯",
        description: "适合热饮和日常办公，杯口更安心。",
        tag: "替换首选",
        keyword: "耐热马克杯"
      },
      {
        title: "随行保温杯",
        description: "通勤随身带水，适合旧杯退休后的新搭档。",
        tag: "通勤好物",
        keyword: "随行保温杯"
      },
      {
        title: "杯子收纳架",
        description: "把常用杯具集中收纳，桌面更清爽。",
        tag: "收纳搭配",
        keyword: "杯子收纳架"
      }
    ])
  },
  footwear: {
    type: "cleaning",
    title: "安排一次鞋履护理",
    description: "清洁、除味、修补或换一双新鞋，都能让脚步轻一点。",
    buttonText: "查看鞋履服务",
    href: "/service/footwear-cleaning",
    reason: "鞋履常见磨损、灰尘和异味问题，适合推荐清洁护理或维修服务。",
    providerName: "本地生活",
    serviceItems: ["深度清洁", "除味护理", "鞋底修补"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "鞋子清洗护理",
    externalUrl: createTaobaoSearchUrl("鞋子清洗护理"),
    products: createProducts([
      {
        title: "鞋子清洗护理",
        description: "适合旧鞋、运动鞋和日常穿着鞋履。",
        tag: "护理服务",
        keyword: "鞋子清洗护理"
      },
      {
        title: "运动鞋除味喷雾",
        description: "日常维护更轻量，减少鞋内异味。",
        tag: "日常维护",
        keyword: "运动鞋除味喷雾"
      },
      {
        title: "鞋底修补胶",
        description: "小磨损先救一救，延长使用周期。",
        tag: "维修工具",
        keyword: "鞋底修补胶"
      }
    ])
  },
  bag: {
    type: "repair",
    title: "给包包做次体检",
    description: "肩带、拉链、皮面护理都有办法，先别急着告别。",
    buttonText: "查看养护方案",
    href: "/service/bag-repair",
    reason: "包袋类物品容易出现拉链、肩带和表面磨损，适合先做养护判断。",
    providerName: "维修养护",
    serviceItems: ["拉链维修", "肩带加固", "皮面护理"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "包包维修养护",
    externalUrl: createTaobaoSearchUrl("包包维修养护"),
    products: createProducts([
      {
        title: "包包维修养护",
        description: "拉链、肩带、五金和表面护理一站式搜索。",
        tag: "维修养护",
        keyword: "包包维修养护"
      },
      {
        title: "包包肩带替换",
        description: "肩带老化或断裂时更容易快速恢复使用。",
        tag: "配件替换",
        keyword: "包包肩带替换"
      },
      {
        title: "皮具护理套装",
        description: "适合皮面包袋的日常清洁和保养。",
        tag: "护理工具",
        keyword: "皮具护理套装"
      }
    ])
  },
  book: {
    type: "content",
    title: "继续这段阅读缘分",
    description: "找相似书单、电子书和读书笔记，让故事往下走。",
    buttonText: "发现相关内容",
    href: "/service/book-content",
    reason: "识别到书本或阅读物，适合承接到内容推荐和阅读服务。",
    providerName: "内容推荐",
    serviceItems: ["相似书单", "电子书入口", "读书笔记模板"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "同类书籍",
    externalUrl: createTaobaoSearchUrl("同类书籍"),
    products: createProducts([
      {
        title: "同类书籍",
        description: "延续当前阅读兴趣，发现相似主题。",
        tag: "继续阅读",
        keyword: "同类书籍"
      },
      {
        title: "读书笔记本",
        description: "把灵感和摘录留下来，让阅读更有回声。",
        tag: "记录工具",
        keyword: "读书笔记本"
      },
      {
        title: "书架收纳",
        description: "给读过的书找一个更舒服的位置。",
        tag: "整理收纳",
        keyword: "书架收纳"
      }
    ])
  },
  electronics: {
    type: "repair",
    title: "检查数码小状态",
    description: "配件、维修、回收和焕新服务都可以从这里开始。",
    buttonText: "查看数码服务",
    href: "/service/electronics-repair",
    reason: "数码物品的状态会影响使用体验，适合推荐维修、配件或回收服务。",
    providerName: "数码服务",
    serviceItems: ["故障检测", "配件选购", "回收估价"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "数码维修 配件",
    externalUrl: createTaobaoSearchUrl("数码维修 配件"),
    products: createProducts([
      {
        title: "数码维修",
        description: "先查维修和检测服务，再决定是否换新。",
        tag: "维修检测",
        keyword: "数码维修"
      },
      {
        title: "数码配件",
        description: "充电线、保护套、支架等常用补给。",
        tag: "配件补充",
        keyword: "数码配件"
      },
      {
        title: "二手数码回收",
        description: "闲置或损坏设备可以先估个价。",
        tag: "回收估价",
        keyword: "二手数码回收"
      }
    ])
  },
  lighting: {
    type: "local-life",
    title: "点亮它的新任务",
    description: "灯泡替换、维修安装或新台灯推荐，给夜晚补一点光。",
    buttonText: "查看照明服务",
    href: "/service/lighting-local-life",
    reason: "灯具类物品常关联安装、维修和耗材替换，适合连接本地生活服务。",
    providerName: "家政安装",
    serviceItems: ["灯泡替换", "上门安装", "护眼台灯推荐"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "护眼台灯 灯泡",
    externalUrl: createTaobaoSearchUrl("护眼台灯 灯泡"),
    products: createProducts([
      {
        title: "护眼台灯",
        description: "适合学习、办公和床头阅读场景。",
        tag: "换新推荐",
        keyword: "护眼台灯"
      },
      {
        title: "LED 灯泡",
        description: "灯具不亮时，先考虑替换耗材。",
        tag: "耗材替换",
        keyword: "LED 灯泡"
      },
      {
        title: "灯具安装服务",
        description: "需要上墙或接线时更适合找专业服务。",
        tag: "本地安装",
        keyword: "灯具安装服务"
      }
    ])
  },
  kitchenware: {
    type: "shopping",
    title: "补齐厨房小工具",
    description: "从替换件到顺手厨具，给下一顿饭多一点从容。",
    buttonText: "逛逛厨房好物",
    href: "/service/kitchenware-shopping",
    reason: "厨具和餐厨用品常有耗损或补充需求，适合推荐替换和升级好物。",
    providerName: "厨房好物",
    serviceItems: ["同类替换", "收纳配件", "厨房升级清单"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "厨房小工具",
    externalUrl: createTaobaoSearchUrl("厨房小工具"),
    products: createProducts([
      {
        title: "厨房小工具",
        description: "补齐高频使用的小物件，让做饭更顺手。",
        tag: "顺手好物",
        keyword: "厨房小工具"
      },
      {
        title: "厨房收纳架",
        description: "锅铲、杯具和调味品都能更有秩序。",
        tag: "收纳升级",
        keyword: "厨房收纳架"
      },
      {
        title: "餐厨替换件",
        description: "旧物损耗后，找同类替换更省心。",
        tag: "替换补充",
        keyword: "餐厨替换件"
      }
    ])
  },
  home: {
    type: "local-life",
    title: "让家里更顺手",
    description: "清洁、维修、收纳和替换好物，都适合安排上。",
    buttonText: "查看家居服务",
    href: "/service/home-local-life",
    reason: "家居物品通常关联清洁、维修和收纳，适合接入本地生活服务。",
    providerName: "家居服务",
    serviceItems: ["上门清洁", "小修小补", "收纳整理"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "家居清洁 收纳",
    externalUrl: createTaobaoSearchUrl("家居清洁 收纳"),
    products: createProducts([
      {
        title: "家居清洁用品",
        description: "适合日常除尘、去污和维护。",
        tag: "清洁维护",
        keyword: "家居清洁用品"
      },
      {
        title: "收纳整理工具",
        description: "让常用物品有位置，生活动线更轻松。",
        tag: "整理收纳",
        keyword: "收纳整理工具"
      },
      {
        title: "家居维修工具",
        description: "小修小补常备工具，处理日常松动损耗。",
        tag: "维修备用",
        keyword: "家居维修工具"
      }
    ])
  },
  clothing: {
    type: "cleaning",
    title: "给衣物一点照顾",
    description: "清洗、护理、修补或搭配推荐，让它再体面出门。",
    buttonText: "查看衣物护理",
    href: "/service/clothing-cleaning",
    reason: "衣物类物品适合推荐清洗、护理、修补和搭配类服务。",
    providerName: "衣物护理",
    serviceItems: ["专业洗护", "缝补改衣", "搭配建议"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "衣物护理 清洗",
    externalUrl: createTaobaoSearchUrl("衣物护理 清洗"),
    products: createProducts([
      {
        title: "衣物护理清洗",
        description: "适合外套、毛衣和易损衣物的专业护理。",
        tag: "专业洗护",
        keyword: "衣物护理 清洗"
      },
      {
        title: "缝补改衣服务",
        description: "小破损、裤脚和尺寸问题可以继续修。",
        tag: "修补改造",
        keyword: "缝补改衣服务"
      },
      {
        title: "衣物收纳袋",
        description: "换季收纳更规整，也能减少灰尘。",
        tag: "换季收纳",
        keyword: "衣物收纳袋"
      }
    ])
  },
  beauty: {
    type: "shopping",
    title: "补充日常护理",
    description: "找到同类美妆个护用品，给小瓶罐们安排接班。",
    buttonText: "看看个护好物",
    href: "/service/beauty-shopping",
    reason: "美妆个护物品常有补货、替换和同类推荐需求。",
    providerName: "个护好物",
    serviceItems: ["同款补货", "替代推荐", "收纳工具"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "美妆个护",
    externalUrl: createTaobaoSearchUrl("美妆个护"),
    products: createProducts([
      {
        title: "美妆个护补货",
        description: "找到同类用品，给日常护理不断档。",
        tag: "日常补货",
        keyword: "美妆个护"
      },
      {
        title: "化妆品收纳盒",
        description: "瓶瓶罐罐集中收纳，桌面更清爽。",
        tag: "收纳搭配",
        keyword: "化妆品收纳盒"
      },
      {
        title: "旅行分装瓶",
        description: "把常用品带出门，更轻便也更整洁。",
        tag: "出行好物",
        keyword: "旅行分装瓶"
      }
    ])
  },
  toy: {
    type: "shopping",
    title: "发现更多陪伴感",
    description: "玩具、潮玩和收纳配件，让快乐继续有地方住。",
    buttonText: "看看有趣好物",
    href: "/service/toy-shopping",
    reason: "玩具类物品适合承接到潮玩、亲子和收纳相关服务。",
    providerName: "趣味好物",
    serviceItems: ["相似玩具", "展示收纳", "亲子玩法"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "创意玩具",
    externalUrl: createTaobaoSearchUrl("创意玩具"),
    products: createProducts([
      {
        title: "创意玩具",
        description: "发现更多有陪伴感的小物件。",
        tag: "趣味推荐",
        keyword: "创意玩具"
      },
      {
        title: "潮玩展示盒",
        description: "让收藏和展示更有仪式感。",
        tag: "展示收纳",
        keyword: "潮玩展示盒"
      },
      {
        title: "亲子互动玩具",
        description: "把玩具变成一段可以一起玩的时间。",
        tag: "互动陪伴",
        keyword: "亲子互动玩具"
      }
    ])
  },
  plant: {
    type: "plant-care",
    title: "看看植物照护建议",
    description: "浇水、换盆、补光和营养土，让它继续认真长大。",
    buttonText: "查看养护灵感",
    href: "/service/plant-care",
    reason: "植物状态会受到光照、水分和土壤影响，适合给出养护服务入口。",
    providerName: "植物养护",
    serviceItems: ["浇水提醒", "换盆工具", "补光和营养土"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "植物营养土 补光灯",
    externalUrl: createTaobaoSearchUrl("植物营养土 补光灯"),
    products: createProducts([
      {
        title: "植物营养土",
        description: "换盆或补土时，让根系住得更舒服。",
        tag: "基础养护",
        keyword: "植物营养土"
      },
      {
        title: "植物补光灯",
        description: "光照不足时，给植物补一点能量。",
        tag: "补光工具",
        keyword: "植物补光灯"
      },
      {
        title: "自动浇水器",
        description: "出差或忘浇水时，帮植物稳住日常。",
        tag: "懒人养护",
        keyword: "自动浇水器"
      }
    ])
  },
  pet: {
    type: "pet-care",
    title: "安排宠物相关服务",
    description: "用品、护理、清洁和健康服务，照顾它的小日常。",
    buttonText: "查看宠物服务",
    href: "/service/pet-care",
    reason: "宠物相关识别适合承接用品、护理、清洁和健康服务。",
    providerName: "宠物生活",
    serviceItems: ["用品补给", "清洁护理", "健康提醒"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "宠物用品 清洁",
    externalUrl: createTaobaoSearchUrl("宠物用品 清洁"),
    products: createProducts([
      {
        title: "宠物用品补给",
        description: "日常消耗品和小配件都可以快速补齐。",
        tag: "用品补给",
        keyword: "宠物用品"
      },
      {
        title: "宠物清洁护理",
        description: "清洁、除味和护理用品让家里更清爽。",
        tag: "清洁护理",
        keyword: "宠物清洁护理"
      },
      {
        title: "宠物健康用品",
        description: "日常健康观察和基础护理工具。",
        tag: "健康关注",
        keyword: "宠物健康用品"
      }
    ])
  },
  unknown: {
    type: "generic",
    title: "发现相关服务",
    description: "根据识别结果探索购买、维修、清洁和内容推荐。",
    buttonText: "看看能做什么",
    href: "/service/unknown-generic",
    reason: "暂时无法精确分类时，先提供通用服务入口，方便继续探索。",
    providerName: "万能服务台",
    serviceItems: ["相似商品", "维修咨询", "内容灵感"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "生活好物",
    externalUrl: createTaobaoSearchUrl("生活好物"),
    products: createProducts([
      {
        title: "生活好物",
        description: "先从通用好物里找找相似选择。",
        tag: "通用推荐",
        keyword: "生活好物"
      },
      {
        title: "维修工具",
        description: "如果它还能修，先找一点工具和灵感。",
        tag: "维修备用",
        keyword: "维修工具"
      },
      {
        title: "收纳整理",
        description: "给暂时不知道去哪的小物件找个位置。",
        tag: "整理收纳",
        keyword: "收纳整理"
      }
    ])
  }
};

const serviceByCondition: Partial<Record<ObjectCondition, ServiceTemplate>> = {
  dirty: {
    type: "cleaning",
    title: "先给它洗个清爽澡",
    description: "优先处理灰尘、污渍和异味，让它不用急着退休。",
    buttonText: "查看清洁护理",
    href: "/service/status-dirty-cleaning",
    reason: "识别到物品有待清洁迹象，先做清洁护理通常比直接换新更划算。",
    providerName: "清洁护理",
    serviceItems: ["去污清洁", "除味护理", "日常维护"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "清洁护理 去污",
    externalUrl: createTaobaoSearchUrl("清洁护理 去污"),
    products: createProducts([
      {
        title: "清洁护理套装",
        description: "适合多数日常物品的灰尘、污渍和表面维护。",
        tag: "优先处理",
        keyword: "清洁护理套装"
      },
      {
        title: "多功能去污湿巾",
        description: "随手擦拭，适合桌面小物、鞋包和家居用品。",
        tag: "轻量清洁",
        keyword: "多功能去污湿巾"
      },
      {
        title: "除味清新喷雾",
        description: "对鞋履、布艺和收纳物件更友好。",
        tag: "气味维护",
        keyword: "除味清新喷雾"
      }
    ])
  },
  damaged: {
    type: "repair",
    title: "先判断还能不能修",
    description: "小破损、缺口、松动或故障，可以先找维修和替换件。",
    buttonText: "查看维修方案",
    href: "/service/status-damaged-repair",
    reason: "识别到明显损坏迹象，优先推荐维修、替换件或安全换新方案。",
    providerName: "维修急救",
    serviceItems: ["故障检测", "配件替换", "安全换新"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "维修 配件 替换",
    externalUrl: createTaobaoSearchUrl("维修 配件 替换"),
    products: createProducts([
      {
        title: "维修工具套装",
        description: "处理松动、开裂和小故障时先备一套基础工具。",
        tag: "先修修看",
        keyword: "维修工具套装"
      },
      {
        title: "替换配件",
        description: "能替换的小部件，通常比整件换新更省心。",
        tag: "配件补救",
        keyword: "替换配件"
      },
      {
        title: "同类换新",
        description: "如果影响安全或卫生，可以直接找更安心的替代品。",
        tag: "安全换新",
        keyword: "同类换新"
      }
    ])
  },
  worn: {
    type: "repair",
    title: "给磨损做次保养",
    description: "边角磨损、表面老化和使用痕迹，适合先养护再决定换新。",
    buttonText: "查看养护工具",
    href: "/service/status-worn-repair",
    reason: "识别到使用磨损，推荐保养、修补和替换易耗配件。",
    providerName: "养护修补",
    serviceItems: ["表面护理", "易耗件替换", "修补工具"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "修补 养护 工具",
    externalUrl: createTaobaoSearchUrl("修补 养护 工具"),
    products: createProducts([
      {
        title: "修补养护工具",
        description: "适合边角磨损、掉色和表面小伤的日常维护。",
        tag: "延长寿命",
        keyword: "修补养护工具"
      },
      {
        title: "表面护理剂",
        description: "让皮面、塑料、金属等材质恢复一点精神。",
        tag: "表面保养",
        keyword: "表面护理剂"
      },
      {
        title: "易耗配件替换",
        description: "把最容易磨损的小配件先换掉，整件还能继续用。",
        tag: "配件替换",
        keyword: "易耗配件替换"
      }
    ])
  },
  idle: {
    type: "recycle",
    title: "给闲置找个新去处",
    description: "回收、转卖、收纳或改造，让它从角落重新出发。",
    buttonText: "查看闲置处理",
    href: "/service/status-idle-recycle",
    reason: "识别到闲置状态，优先推荐回收、转卖和整理方案，减少无效囤积。",
    providerName: "闲置循环",
    serviceItems: ["二手回收", "收纳整理", "旧物改造"],
    actionHint: "将跳转到淘宝移动端搜索结果页",
    taobaoKeyword: "闲置回收 收纳",
    externalUrl: createTaobaoSearchUrl("闲置回收 收纳"),
    products: createProducts([
      {
        title: "闲置回收",
        description: "先看看有没有回收或转卖价值。",
        tag: "循环利用",
        keyword: "闲置回收"
      },
      {
        title: "收纳整理工具",
        description: "暂时不处理的物品，也可以先放得更有秩序。",
        tag: "整理归位",
        keyword: "收纳整理工具"
      },
      {
        title: "旧物改造材料",
        description: "不想丢掉的话，把它变成另一个用途。",
        tag: "改造灵感",
        keyword: "旧物改造材料"
      }
    ])
  }
};

function createService(
  id: string,
  service: ServiceTemplate
): ServiceRecommendation {
  return {
    id,
    ...service
  };
}

export function getServiceRecommendation(
  category: ObjectCategory,
  condition: ObjectCondition = "unknown"
): ServiceRecommendation {
  const conditionService = serviceByCondition[condition];

  if (conditionService) {
    return createService(`status-${condition}-${conditionService.type}`, conditionService);
  }

  const categoryService = serviceByCategory[category] ?? serviceByCategory.unknown;

  return createService(`${category}-${categoryService.type}`, categoryService);
}

export function getServiceById(serviceId: string): ServiceRecommendation | null {
  const categoryServices = Object.entries(serviceByCategory).map(
    ([category, service]) => createService(`${category}-${service.type}`, service)
  );
  const conditionServices = Object.entries(serviceByCondition).map(
    ([condition, service]) =>
      createService(`status-${condition}-${service.type}`, service)
  );
  const services = [...categoryServices, ...conditionServices];

  return services.find((service) => service.id === serviceId) ?? null;
}

export function getAllServiceIds() {
  return [
    ...Object.entries(serviceByCategory).map(([category, service]) => ({
      serviceId: `${category}-${service.type}`
    })),
    ...Object.entries(serviceByCondition).map(([condition, service]) => ({
      serviceId: `status-${condition}-${service.type}`
    }))
  ];
}
