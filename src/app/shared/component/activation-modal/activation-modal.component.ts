import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OnsNavigator } from "ngx-onsenui";
import { AccountActivationComponent } from "../../../pages/settings/forms/account-activation/account-activation.component";
import { SessionService } from "../../security/session.service";
import { User } from "../../model/security/session.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'activation-modal',
  templateUrl: './activation-modal.component.html',
  styleUrls: ['./activation-modal.component.css']
})

export class ActivationModalComponent implements OnInit, OnDestroy {
  @ViewChild('activationPromptDialog')
  promptDialog: ElementRef;

  private subscription: Subscription;

  constructor(
    private navigator: OnsNavigator,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    const user = this.sessionService.getUser();

    this.subscription = user.subscribe((user: User): void => {
      if (!user.isActivated) {
        this.promptDialog.nativeElement.show();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onProceed(): void {
    this.promptDialog.nativeElement.hide();
    this.navigator.element.pushPage(AccountActivationComponent);
  }

  onActivateLater(): void {
    this.promptDialog.nativeElement.hide();
  }
}
