import React from "react";

export abstract class SetModifier<T, S = any> {

  protected component: React.Component<{}, S>;

   constructor(component: React.Component<{}, S>) {
    this.component = component;
  }

  readonly add = (value: T): void => {
    let data = this.get();
    if (data.has(value)) {
      return
    }
    data = new Set(data);
    data.add(value);
    this.set(data);
  };

  readonly remove = (value: T): void => {
    let data = this.get();
    if (!data.has(value)) {
      return
    }
    data = new Set(data);
    data.delete(value);
    this.set(data);
  };

  abstract get(): Set<T>;

  abstract set(data: Set<T>): void
}

export abstract class MapModifier<K, V, S = any> {

  protected readonly component: React.Component<{}, S>;

   constructor(component: React.Component<{}, S>) {
    this.component = component;
  }

  readonly add = (key: K, value: V): void => {
    let data = this.get();
    if (data.get(key) === value) {
      return
    }
    data = new Map(data);
    data.set(key, value);
    this.set(data);
  };

  readonly remove = (key: K): void => {
    let data = this.get();
    if (!data.has(key)) {
      return
    }
    data = new Map(data);
    data.delete(key);
    this.set(data);
  };

  abstract get(): Map<K, V>;

  abstract set(data: Map<K, V>): void
}
