export class GeminiCache {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static TTL = 1000 * 60 * 15; // 15 minutes

  static get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  static set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static has(key: string) {
    return this.get(key) !== null;
  }
}
