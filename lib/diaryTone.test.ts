import { describe, expect, it } from "vitest";
import { rewriteScanResultDiary } from "@/lib/diaryTone";
import { MAX_DIARY_LENGTH, type ScanResult } from "@/lib/types";

const baseResult: ScanResult = {
  id: "scan-test",
  objectName: "缺口马克杯",
  category: "drinkware",
  condition: "damaged",
  conditionText: "杯口有缺口",
  diary: "旧日记",
  emotionTags: ["神秘"],
  createdAt: "2026-05-07T00:00:00.000Z",
  service: {
    id: "drinkware-shopping",
    type: "shopping",
    title: "给它找个接班杯",
    description: "看看新杯子",
    buttonText: "去看看",
    href: "/service/drinkware-shopping",
    reason: "杯具有损耗",
    providerName: "淘系好物",
    serviceItems: ["耐热马克杯"],
    actionHint: "跳转搜索",
    taobaoKeyword: "耐热马克杯",
    externalUrl: "https://main.m.taobao.com/search/index.html?q=%E8%80%90%E7%83%AD%E9%A9%AC%E5%85%8B%E6%9D%AF",
    products: []
  }
};

describe("rewriteScanResultDiary", () => {
  it("rewrites diary by tone without changing the original result", () => {
    const rewritten = rewriteScanResultDiary(baseResult, "roast");

    expect(rewritten).not.toBe(baseResult);
    expect(rewritten.diary).toContain("缺口马克杯");
    expect(rewritten.diary).toContain("身上有点小伤");
    expect(rewritten.emotionTags).toEqual(["摆烂", "委屈", "神秘"]);
    expect(baseResult.diary).toBe("旧日记");
  });

  it("keeps generated diary within the product copy limit", () => {
    const rewritten = rewriteScanResultDiary(
      {
        ...baseResult,
        objectName: "名字特别特别特别长的测试物品"
      },
      "healing"
    );

    expect(Array.from(rewritten.diary).length).toBeLessThanOrEqual(
      MAX_DIARY_LENGTH
    );
  });
});
