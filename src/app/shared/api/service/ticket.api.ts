import { Injectable } from "ngx-onsenui";
import { HttpService } from '../http/http.service';
import { TicketPayload,  TicketList, TicketResponse, ZendeskTicketList, ZendeskTicketResponse, TicketCommentsReponse, TicketCommentList, ZendeskTicketPayload } from '../../model/ticket.model';
import { Observable } from "rxjs";
import { map, shareReplay } from 'rxjs/operators';

Injectable()
export class TicketApi {
  constructor(private httpService: HttpService) {

  }

  fetchTickets(payload: TicketPayload): Observable<TicketList> {
    const makeTickets = map((response: TicketResponse[]) => {
      return TicketList.fromResponse(response);
    });

    return this.httpService.post(`/customer/fetch/tickets`, payload).pipe(
      makeTickets,
      shareReplay()
    );
  }

  fetchZendeskTickets(): Observable<ZendeskTicketList> {
    const makeZendeskTickets = map((response: ZendeskTicketResponse) => {
      return ZendeskTicketList.fromResponse(response);
    });

    return this.httpService.get(`/zendesk/ticket`).pipe(
      makeZendeskTickets,
      shareReplay()
    );
  }

  fetchZendeskTicketDetails(payload: ZendeskTicketPayload): Observable<TicketCommentList> {
    const queryParams = this.httpService.buildQueryParamsFromPayload(payload);
    const makeZendeskTicketsDetails = map((response: TicketCommentsReponse) => {
      return TicketCommentList.fromResponse(response, payload.ticketId);
    });

    return this.httpService.get(`/zendesk/ticket-details?${queryParams}`).pipe(
      makeZendeskTicketsDetails,
      shareReplay()
    );
  }


}