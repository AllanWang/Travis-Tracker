import {Slug} from "./travis-api";

type TravisStorageKey = 'subscriptions';

export default class TravisStorage {

  static clear(): void {
    localStorage.clear();
  }

  static getSubscriptions(): Set<Slug> {
    const s = this.getItem('subscriptions', (s) => new Set<Slug>(JSON.parse(s)));
    return s ? s : new Set<Slug>();
  }

  static setSubscriptions(subscriptions: Set<Slug>): void {
    this.setItem('subscriptions', JSON.stringify(Array.from(subscriptions)))
  }

  private static getItem<T>(key: TravisStorageKey, converter: (value: string) => T): T | null {
    const value = localStorage.getItem(key);
    return value ? converter(value) : null;
  }

  private static setItem(key: TravisStorageKey, value: string): void {
    localStorage.setItem(key, value)
  }
}

