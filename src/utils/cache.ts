import { ReqUrlPreviewInfo } from '@/type/api';

interface NodeStructure {
  key: string;
  value: ReqUrlPreviewInfo;
  lastAccessTime: number;
  [key: string]: any;
}

export class Node implements NodeStructure {
  key: string;
  value: ReqUrlPreviewInfo;
  lastAccessTime: number;

  constructor(key = '', value: ReqUrlPreviewInfo, lastAccessTime = 0) {
    this.key = key;
    this.value = value;
    this.lastAccessTime = lastAccessTime;
  }
}

export class Cache {
  keyList: string[];
  hashMap: NodeStructure | undefined;
  capacity: number;
  constructor(capacity = 0) {
    this.keyList = [];
    this.capacity = capacity;
  }

  /**
   * now - Return the current time timestamp.
   */
  now() {
    return Date.now();
  }

  /**
   * get - Return the value associated with the specified key if it exists in the cache, else return -1 .
   *
   * @param key
   */
  get(key: string) {
    try {
      if (!this.hashMap) throw new Error(`hashMap is empty`);
      const node = this.hashMap[key] as NodeStructure;
      node.lastAccessTime = this.now();
      return node.value;
    } catch (error) {
      return null;
    }
  }

  /**
   * put - Insert a node into the cache.
   * @param key
   * @param value
   */
  put(key: string, value: ReqUrlPreviewInfo) {
    if (!this.capacity) return;

    if (this.keyList.length === this.capacity) {
      this.handleCacheExcess();
    }
    const newNode = new Node(key, value, this.now());

    this.hashMap
      ? (this.hashMap[newNode.key] = newNode)
      : (this.hashMap = newNode);
    // this.hashMap[newNode.key] = newNode;
    this.keyList.push(newNode.key);
  }

  update(key: string, value: ReqUrlPreviewInfo) {
    if (!this.hashMap) return;
    const node = this.hashMap[key] as Node;
    node.value = value;
  }

  /**
   * handleCacheExcess - Delete the cache with the lowest weight.
   */
  handleCacheExcess() {
    if (!this.hashMap) return;
    this.sortKeyListByScore();

    const droppedKey = this.keyList.pop() as string;
    delete this.hashMap[droppedKey];
  }

  /**
   * sortKeyListByScore - Sort the cache keys with lower scores to the back.
   */
  sortKeyListByScore() {
    if (this.hashMap) return;
    this.keyList.sort(
      (a, b) =>
        (this.hashMap?.[b] as NodeStructure).lastAccessTime -
        (this.hashMap?.[a] as NodeStructure).lastAccessTime
    );
  }
}
