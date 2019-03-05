import { PaginationResponse, InifiniteScrollableList, Pagination } from "./scrollable-list.model";
import { Date } from "../date.util";

export interface SkypeOutstandingBetsResponse {
  recordsTotal: number;
  bets: {
    id: number;
    winLoss: string;
    odds: string;
    stake: string;
    turnover: string;
    reason: string;
    status: boolean;
    handicap: boolean;
    event_date: Date;
    event_time: Date;
    score: string;
    home: string;
    away: string;
    league: string;
    halftimeBet: boolean;
    betOption: string;
    betRequestType: boolean;
    betType: string;
    currentScore: string;
    bet: string;
    result: string;
  }[],
}

export class Bet {
  id: number;
  winLoss: string;
  odds: string;
  stake: string;
  turnover: string;
  reason: string;
  status: boolean;
  handicap: boolean;
  event_date: Date;
  event_time: Date;
  score: string;
  home: string;
  away: string;
  league: string;
  halftimeBet: boolean;
  betOption: string;
  betRequestType: boolean;
  betType: string;
  currentScore: string;
  bet: string;
  result: string;
} 

export class SkypeOutstandingBets {
  recordsTotal: number;
  bets: Bet[];
    
  static fromResponse(response: SkypeOutstandingBetsResponse): SkypeOutstandingBets {
    const outstandingBetsDetails = new SkypeOutstandingBets();
    
    outstandingBetsDetails.recordsTotal = response.recordsTotal;

    if (response.hasOwnProperty('bets')) {
      outstandingBetsDetails.bets = response.bets.map((bet) => {
        return {
          id: bet.id,
          winLoss: bet.winLoss,
          odds: bet.odds,
          stake: bet.stake,
          turnover: bet.turnover,
          reason: bet.reason,
          status: bet.status,
          handicap: bet.handicap,
          event_date: bet.event_date,
          event_time: bet.event_time,
          score: bet.score,
          home: bet.home,
          away: bet.away,
          league: bet.league,
          halftimeBet: bet.halftimeBet,
          betOption: bet.betOption,
          betRequestType: bet.betRequestType,
          betType: bet.betType,
          currentScore: bet.currentScore,
          bet: bet.bet,
          result: bet.result,
        }
      });
  
    } else {
      outstandingBetsDetails.bets = [];
    }

    return outstandingBetsDetails;
  }
}

export interface SkypeOutstandingBetsPaginate extends PaginationResponse {
    items: Array<SkypeOutstandingBets>;
}

export class SkypeOutstandingBetsLoadMore extends InifiniteScrollableList<SkypeOutstandingBets> {
  private constructor(paginationResponse: PaginationResponse, items: Array<SkypeOutstandingBets>) {
    super(paginationResponse, items);
  }

  static fromResponse(response: SkypeOutstandingBetsPaginate): SkypeOutstandingBetsLoadMore {
    const items = response.items.map((value: SkypeOutstandingBetsResponse): SkypeOutstandingBets => {
      return SkypeOutstandingBets.fromResponse(value);
    });

    const skypeOutstandingBetsLoadMore = new SkypeOutstandingBetsLoadMore(response, items);

    return skypeOutstandingBetsLoadMore;
  }
}