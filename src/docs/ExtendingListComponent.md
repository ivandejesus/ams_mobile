**Extending ListComponent**

The ListComponent is under app/shared/component/list.component.
Extend this component if you want a default behavior for infinite scrolling behavior with scroll to top functionality built in with Onsen UI.

1. Create a class that extends ListComponent

```
export class TransactionHistoryPage extends ListComponent 
```

By doing this, you give TransactionHistoryPage access to functions provided by ListComponent. 

2. Call *super.onInit()* on your components' onInit function.

By calling ListComponent's onInit function, you will implicitly activate the scrolling feature of it. E.g subscribing to Scroll Events and providing default functions.

3. Provide callback for *super.onInifiniteScroll()* inside the component's onInit function. E.g

```
this.onInfiniteScroll((done) => {
  this.transactionApi.getMoreTransactions(this.transactionHistory.nextPage()).pipe(
    first()
  ).subscribe((transactions: Array<Transaction>): void => {
    this.transactionHistory.addItems(transactions);
    this.lazyRepeat.refresh();
    done();
  });
})
```

4. Provide a Speed Dial and Pull Hook components on your template like so:

Pull Hook Implementation:

```
  <ons-pull-hook height="64px" threshold-height="128px" (changestate)="onPullHookChangeState($event)" (action)="onPullHookRelease($event)">
    {{ pullHookMessage }}  
  </ons-pull-hook>
```

Note that **pullHookMessage** and **onPullHookChangeState** is already available on ListComponent.

Speed Dial Implementation

```
  <ons-speed-dial position="right bottom" direction="up" #speedDial>
      <ons-fab (click)="scrollToTop()"><ons-icon icon="md-chevron-up"></ons-icon></ons-fab>
  </ons-speed-dial>
```

Note that **scrollToTop()** is also available on ListComponent

5. Provide Pull Hook's onRelease function like so:

```
onPullHookRelease($event) {
  this.transactionHistory$ = this.transactionApi.getTransactionHistoryList();
  this.transactionHistory$.subscribe((history: TransactionHistory) => {
    this.transactionHistory = history;
    this.pullHookMessage = '';
    $event.done();
  });  
}
```

That's it. You can now easily create pages with built in infinite scrollable feature and scroll to top function.


