import {BuildInfo, Slug} from "./travis-api";
import {JsonConvert} from "json2typescript";
import StringUnion from "./string-union";
import {TravisPanel} from "./const";

export const TravisStorageKey = StringUnion('subscriptions', 'builds', 'panel');
export type TravisStorageKey = typeof TravisStorageKey.type;

const jsonConvert = new JsonConvert();

export type TravisEntry<T> = {
  key: TravisStorageKey
  set: (value: T) => void
  get: () => T
}

abstract class Entry<T> {
  key: TravisStorageKey;

  protected constructor(key: TravisStorageKey) {
    this.key = key;
  }

  abstract serialize(value: T): string

  abstract deserialize(value: string | null): T

  set = (value: T): void => localStorage.setItem(this.key, this.serialize(value));

  get = (): T => this.deserialize(localStorage.getItem(this.key));
}

class PanelEntry extends Entry<TravisPanel> {

  constructor() {
    super('panel');
  }

  deserialize(value: string | null): TravisPanel {
    if (value && TravisPanel.guard(value)) {
      return value
    }
    return 'main';
  }

  serialize(value: TravisPanel): string {
    return value;
  }
}

class SubscriptionEntry extends Entry<Set<Slug>> {

  constructor() {
    super('subscriptions')
  }

  deserialize(value: string | null): Set<Slug> {
    if (value === null) {
      return new Set<Slug>();
    }
    return new Set<Slug>(JSON.parse(value));
  }

  serialize(value: Set<Slug>): string {
    return JSON.stringify(Array.from(value));
  }

}

class BuildEntry extends Entry<Map<Slug, BuildInfo>> {

  constructor() {
    super('builds')
  }

  deserialize(value: string | null): Map<Slug, BuildInfo> {
    if (!value) {
      return new Map<Slug, BuildInfo>();
    }
    try {
      const v = jsonConvert.deserializeArray(JSON.parse(value), BuildInfo);
      return v.reduce((m, b) => {
        return m.set(b.build.repository.slug, b);
      }, new Map<Slug, BuildInfo>())
    } catch (e) {
      return new Map<Slug, BuildInfo>();
    }
  }

  serialize(value: Map<Slug, BuildInfo>): string {
    try {
      return JSON.stringify(jsonConvert.serializeArray(Array.from(value.values())));
    } catch (e) {
      return ''
    }
  }

}

export default class TravisStorage {

  static clear(): void {
    localStorage.clear();
  }

  static subscriptions: TravisEntry<Set<Slug>> = new SubscriptionEntry();

  static builds: TravisEntry<Map<Slug, BuildInfo>> = new BuildEntry();

  static panel: TravisEntry<TravisPanel> = new PanelEntry()

}
