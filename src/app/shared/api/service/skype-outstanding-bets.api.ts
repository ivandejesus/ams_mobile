import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { SkypeOutstandingBetsResponse, SkypeOutstandingBets } from '../../model/skype-outstanding-bets.model';
import { User, Session } from '../../../shared/model/security/session.model';
import { map, shareReplay, share } from 'rxjs/operators';

@Injectable()
export class SkypeOutstandingBetsService {
  constructor(private httpService: HttpService) {

  }

  getOutstandingBets(filter: any): Observable<SkypeOutstandingBets> {
    const params = this.httpService.buildQueryParamsFromPayload(filter);
    const makeOutstandingBets = map((response: SkypeOutstandingBetsResponse) => {
      return SkypeOutstandingBets.fromResponse(response);
    });

    return this.httpService.get(`/brokerage/get-bet-list?limit=20&${params}`).pipe(
      makeOutstandingBets,
      shareReplay(),
    );
  }

  getMoreOutstandingBets(filter: any, page: number): Observable<SkypeOutstandingBetsResponse>{
    const params = this.httpService.buildQueryParamsFromPayload(filter);
    const makeOutstandingBets = map((response: SkypeOutstandingBetsResponse) => {
      return SkypeOutstandingBets.fromResponse(response);
    });

    return this.httpService.get(`/brokerage/get-bet-list?limit=20&page=${page}&${params}`).pipe(
      makeOutstandingBets,
      shareReplay(),
    );
  }
}


