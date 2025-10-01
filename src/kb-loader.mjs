// Lightweight KB loader (ES module)
export class KB {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.index = null;
    this.cache = new Map(); // chunk path -> data
  }

  async loadIndex() {
    const url = `${this.baseUrl}/kb/v1/index.json`;
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`Failed to load index.json (${res.status})`);
    this.index = await res.json();
    return this.index;
  }

  async loadChunk(relativePath) {
    if (this.cache.has(relativePath)) return this.cache.get(relativePath);
    const url = `${this.baseUrl}/kb/v1/${relativePath}`;
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`Failed to load chunk: ${relativePath} (${res.status})`);
    const data = await res.json();
    this.cache.set(relativePath, data);
    return data;
  }

  async loadAllProducts() {
    if (!this.index) await this.loadIndex();
    const chunks = this.index.chunks || [];
    const all = await Promise.all(chunks.map(p => this.loadChunk(p)));
    const merged = all.flatMap(x => (x.products || []));
    return merged;
  }

  // Example search by tags
  async search({ rooms = [], surfaces = [], issues = [] } = {}) {
    const all = await this.loadAllProducts();
    const has = (arr, tags) => tags.length === 0 || (arr && tags.every(t => (arr||[]).includes(t)));
    return all.filter(p => has(p.rooms, rooms) && has(p.surfaces, surfaces) && has(p.issues, issues));
  }

  async getRules() {
    const url = `${this.baseUrl}/kb/v1/rules.json`;
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`Failed to load rules.json (${res.status})`);
    return res.json();
  }

  async getFaqs() {
    const url = `${this.baseUrl}/kb/v1/faqs.json`;
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`Failed to load faqs.json (${res.status})`);
    return res.json();
  }

  async getFallback() {
    const url = `${this.baseUrl}/kb/v1/fallback.json`;
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`Failed to load fallback.json (${res.status})`);
    return res.json();
  }
}
