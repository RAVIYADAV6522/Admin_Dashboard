import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const cacheKeys = {
  sales: "sales:overall:v2",
  dashboard: "dashboard:stats:v2",
  geography: "geography:users",
};

export function getOrSet(key, ttlSeconds, factory) {
  const hit = cache.get(key);
  if (hit !== undefined) return Promise.resolve(hit);
  return Promise.resolve(factory()).then((data) => {
    cache.set(key, data, ttlSeconds);
    return data;
  });
}

export function invalidate(patternOrKey) {
  if (typeof patternOrKey === "string") {
    cache.del(patternOrKey);
    return;
  }
  const keys = cache.keys().filter((k) => k.includes(patternOrKey));
  keys.forEach((k) => cache.del(k));
}

export { cache };
