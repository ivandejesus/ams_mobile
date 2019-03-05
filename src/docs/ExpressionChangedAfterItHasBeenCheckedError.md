**What to do if you encountered ExpressionChangedAfterItHasBeenCheckedError?**

The error is probably cause by dynamic creation of components

To solve this, make sure that all initializiation is made on *ngOnInit*

Please read:

https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4