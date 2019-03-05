import { Injectable } from "ngx-onsenui";
import { environment } from "../../../environments/environment";

import { EventDispatcherService } from "../event/event-dispatcher.service";
import { TransactionProcessedEvent } from "../event/transaction-processed-event";
import { WebsocketTopics } from "./topics";
import { BitcoinExchangeRateEvent } from "../event/bitcoin-exchange-rate.event";
import {MemberPaymentOptionCreatedEvent} from "../event/member-payment-option/member-payment-option-created.event";
import {MemberPaymentOptionUpdatedEvent} from "../event/member-payment-option/member-payment-option-updated.event";
import {MemberPaymentOptionDeletedEvent} from "../event/member-payment-option/member-payment-option-deleted.event";

/**
 * We need this line coz we are not using autobabhn via 
 * npm and we just include it on script tag inside our html.
 * The reason is that one of the dependencies of autobahn which is
 * when.js throws an error when the dist/ has been compiled and 
 * the scripts is run in the browser. I already watched an issue
 * on github and will follow up on this once someone in the community fixed it.
 * When that day comes, we can now use autobahn via npm and use the provided
 * typings. Please see:
 * https://github.com/cujojs/when/issues/504
 */
declare var autobahn:any;

@Injectable()
export class WebsocketService {
  websocketUrl: string;
  websocketRealm: string;

  connection: any;
  session: any;

  constructor(private dispatcher: EventDispatcherService) {
    this.websocketUrl = environment.websocketUrl;
    this.websocketRealm = environment.websocketRealm;
  }

  initialize(websocketToken, websocketChannelId): void {
    this.connection = new autobahn.Connection({
      url: this.websocketUrl,
      realm: this.websocketRealm,
      authmethods: ['jwt'],
      onchallenge: (session: any, method: string, extra: any) => {
        return websocketToken;
      }
    });

    this.connection.onopen = (session: any) => {
      this.session = session;
      
      this.session.subscribe(WebsocketTopics.BTC_EXCHANGE_RATE, (args: any) => {
        let payload = args[0];
        this.dispatcher.dispatch(new BitcoinExchangeRateEvent(payload));
      });
      
      this.session.subscribe(WebsocketTopics.TRANSACTION_PROCESSED + '.' + websocketChannelId, (args: any) => {
        let payload = JSON.parse(args[0]);
        this.dispatcher.dispatch(new TransactionProcessedEvent(payload));
      });

      this.session.subscribe(WebsocketTopics.MEMBER_PAYMENT_OPTION_CREATED + '.' + websocketChannelId, (args: any) => {
        let payload = JSON.parse(args[0]);
        this.dispatcher.dispatch(new MemberPaymentOptionCreatedEvent(payload));
      });

      this.session.subscribe(WebsocketTopics.MEMBER_PAYMENT_OPTION_UPDATED + '.' + websocketChannelId, (args: any) => {
        let payload = JSON.parse(args[0]);
        this.dispatcher.dispatch(new MemberPaymentOptionUpdatedEvent(payload));
      });

      this.session.subscribe(WebsocketTopics.MEMBER_PAYMENT_OPTION_DELETED + '.' + websocketChannelId, (args: any) => {
        let payload = JSON.parse(args[0]);
        this.dispatcher.dispatch(new MemberPaymentOptionDeletedEvent(payload));
      });
    };

    // Do not try to open existing and opened connection.
    if (this.connection && !this.connection.isOpen) {
      this.connection.open();
    }
  }

  addSubscription(topic: string, callback: Function) {
    if (!this.connection.isConnected) {
      throw 'Cannot add subscription to closed connection.';
    }

    this.session.subscribe(topic, (args) => {
      let payload = args[0];
      callback(payload);
    });
  }

  close(): void {
    if (this.connection && this.connection.isConnected && this.session) {
      this.connection.close();
    }
  }
}
