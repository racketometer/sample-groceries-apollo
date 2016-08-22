import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs/Rx";

import { BackendService } from "../../shared";
import { Grocery } from "./grocery.model";

@Injectable()
export class GroceryService {
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);

  private allItems: Array<Grocery> = [];

  constructor(private zone: NgZone, private backend: BackendService) { }

  load() {
    return new Promise((resolve, reject) => {
      this.loadItems()
        .then(() => { resolve(); })
        .catch(() => { reject(); });
    });
  }

  private loadItems() {
    return Promise.resolve();
  }

  add(name: string) {
    let newGrocery = new Grocery("", name, false, false);
    this.allItems.unshift(newGrocery);
    this.publishUpdates();
    return Promise.resolve();
  }

  setDeleteFlag(item: Grocery) {
    const newItem = new Grocery(item.id, item.name, false, true);
    this.updateSingleItem(item, newItem);

    this.publishUpdates();
    return this.syncItem(newItem);
  }

  toggleDoneFlag(item: Grocery, skipSync: boolean = false) {
    const newItem = new Grocery(item.id, item.name, !item.done, item.deleted);
    this.updateSingleItem(item, newItem);

    this.publishUpdates();
    if (skipSync) {
      return Promise.resolve(true);
    } else {
      return this.syncItem(newItem);
    }
  }

  restore() {
    let indeces = [];
    this.allItems.forEach((grocery) => {
      if (grocery.deleted && grocery.done) {
        grocery.done = false;
        grocery.deleted = false;
        indeces.push(grocery.id);
      }
    });

    let headers = {
      "X-Everlive-Filter": JSON.stringify({
        "Id": { "$in": indeces }
      })
    };

    this.publishUpdates();
    return Promise.resolve();
  }

  private updateSingleItem(item: Grocery, newItem: Grocery) {
    const index = this.allItems.indexOf(item);
    this.allItems.splice(index, 1, newItem);
  }

  private syncItem(item: Grocery) {
    return Promise.resolve();
  }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      this.items.next([...this.allItems]);
    });
  }

  private handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}