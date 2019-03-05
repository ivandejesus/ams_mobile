import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OnsNavigator, OnsLazyRepeat } from 'ngx-onsenui';
import { SkypeOutstandingBetsService } from '../../../shared/api/service/skype-outstanding-bets.api';
import { SkypeOutstandingBetsResponse, SkypeOutstandingBets, SkypeOutstandingBetsLoadMore } from '../../../shared/model/skype-outstanding-bets.model';
import { ListComponent } from '../../../../app/shared/component/list.component';
import { User } from '../../../shared/model/security/session.model';
import { SessionService } from '../../../shared/security/session.service';
import { Observable, from } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
    selector: 'tab[skype-betting-outstanding]',
    templateUrl: './skype-betting-outstanding.tab.html',
    styleUrls: ['./skype-betting-outstanding.tab.css']
})
export class SkypeOutstandingTab extends ListComponent implements OnInit {
  @ViewChild(OnsLazyRepeat)
  lazyRepeat: OnsLazyRepeat;

  outstandingBetsRecord$: Observable<SkypeOutstandingBetsResponse>
  outstandingBetsRecords: SkypeOutstandingBets;
  outstandingRecordsPaginate: SkypeOutstandingBetsLoadMore;
  user$: Observable<User>;
  private user: any = [];

  constructor(private skypeOutstandingBetsService: SkypeOutstandingBetsService, private element: ElementRef, private sessionService: SessionService) {
    super(element.nativeElement);
  }
  
  ngOnInit(): void {
    super.onInit();
    this.user$ = this.sessionService.getUser();
    this.user$.subscribe((user: User) => {
      this.user = user;
    });
    this.showSpinner = true;
    const filter = {
      id: this.user.brokerageSyncId,
      status: 1,
      limit: 20,
      offset: 0,
      from: '',
      to: '',
      search: ''
    }

    this.outstandingBetsRecord$ = this.skypeOutstandingBetsService.getOutstandingBets(filter);
    this.outstandingBetsRecord$.subscribe((betRecords: SkypeOutstandingBets) => {
      this.outstandingBetsRecords = betRecords;
      this.showSpinner = false;
    });
    
    this.onInfiniteScroll((done: any) => {
      this.skypeOutstandingBetsService.getMoreOutstandingBets(filter, this.outstandingRecordsPaginate.nextPage()).pipe(
        first()
      ).subscribe((betRecord: SkypeOutstandingBets): void => {
        this.lazyRepeat.refresh();
        done();
      });
    })
  }

  getOutstandingRecords() {
    this.outstandingBetsRecord$.subscribe((betRecords: SkypeOutstandingBets) => {
      this.outstandingBetsRecords = betRecords;
    });
  }

  onPullHookRelease($event: any) {
    this.outstandingBetsRecord$ = this.skypeOutstandingBetsService.getOutstandingBets(this.user);
    this.outstandingBetsRecord$.subscribe((betRecords: SkypeOutstandingBetsResponse) => {
      this.lazyRepeat.ngOnDestroy();
      this.outstandingBetsRecords = betRecords;
      this.pullHookMessage = '';
      $event.done();
    });
  }
}