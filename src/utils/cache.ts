interface Node<T> {
  value: T;
  lastAccessTime: number;
}

export class Cache<T> {
  private keyList: string[];
  private hashMap: { [key: string]: Node<T> } = {};
  private capacity: number;
  constructor(capacity = 0) {
    this.keyList = [];
    this.capacity = capacity;
  }

  /**
   * now - Return the current time timestamp.
   */
  private now() {
    return Date.now();
  }

  /**
   * get - Return the value associated with the specified key if it exists in the cache, else return -1 .
   *
   * @param key
   */
  get(key: string) {
    const node = this.hashMap[key];
    if (!node) return null;

    node.lastAccessTime = this.now();
    return node.value;
  }

  /**
   * put - Insert a node into the cache.
   * @param key
   * @param value
   */
  put(key: string, value: T) {
    if (!this.capacity) return;

    if (this.keyList.length === this.capacity) {
      this.handleCacheExcess();
    }
    const newNode = { value, lastAccessTime: this.now() };

    this.hashMap[key] = newNode;
    this.keyList.push(key);
  }

  update(key: string, value: T) {
    const node = this.hashMap[key];
    if (!node) return;
    node.value = value;
  }

  /**
   * handleCacheExcess - Delete the cache with the lowest weight.
   */
  private handleCacheExcess() {
    this.sortKeyListByScore();

    const droppedKey = this.keyList.pop();

    if (!droppedKey) return;
    delete this.hashMap[droppedKey];
  }

  /**
   * sortKeyListByScore - Sort the cache keys with lower scores to the back.
   */
  private sortKeyListByScore() {
    this.keyList.sort(
      (a, b) => this.hashMap[b].lastAccessTime - this.hashMap[a].lastAccessTime
    );
  }
}
