class Engine {
  filterCmd;
  constructor() {
    this.filterCmd = new Set();
    this.client = new Set();
    this.mclient = new Map();
  }
  add(cmd) {
    this.filterCmd.add(cmd);
  }
  has(cmd) {
    return this.filterCmd.has(cmd);
  }
  delete(cmd) {
    this.filterCmd.delete(cmd);
  }
  clear() {
    this.filterCmd.clear();
  }
  list() {
    return Array.from(this.filterCmd);
  }
  size() {
    return this.filterCmd.size;
  }
}

export let engine = new Engine();
