import { describe, expect, it } from "vitest";
import {
  getAllServiceIds,
  getServiceById,
  getServiceRecommendation
} from "@/lib/serviceMap";

describe("serviceMap", () => {
  it("uses condition recommendations before category recommendations", () => {
    const service = getServiceRecommendation("drinkware", "damaged");

    expect(service.id).toBe("status-damaged-repair");
    expect(service.type).toBe("repair");
    expect(service.products).toHaveLength(3);
  });

  it("falls back to category recommendations when condition is unknown", () => {
    const service = getServiceRecommendation("plant", "unknown");

    expect(service.id).toBe("plant-plant-care");
    expect(service.taobaoKeyword).toContain("植物");
    expect(service.externalUrl).toContain(encodeURIComponent(service.taobaoKeyword));
  });

  it("can resolve every generated service id", () => {
    const ids = getAllServiceIds();

    expect(ids.length).toBeGreaterThan(10);
    expect(ids.every(({ serviceId }) => getServiceById(serviceId))).toBe(true);
  });
});
