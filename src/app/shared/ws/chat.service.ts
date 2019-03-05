
import { SessionService } from '../security/session.service';
import { Injectable } from "ngx-onsenui";
import { User } from '../model/security/session.model';
import { environment } from '../../../environments/environment';

declare var window:any;
declare var zE:any;

@Injectable()
export class ChatService {

  freshChatToken: string;
  freshChatHost: string;

  constructor(private sessionService: SessionService) {
    this.freshChatToken = environment.freshChatToken;
    this.freshChatHost = environment.freshChatHost;
  }

  initialize(user: User): void {
    const userId = user.id;
    const fullName = user.displayName;
    const email = user.email; 

    window.fcWidget.init({
      token: this.freshChatToken,
      host: this.freshChatHost,
      externalId: userId,
    });

    window.fcWidget.user.get((resp) => {
      let status = resp && resp.status;

      if (status !== 200) {
        window.fcWidget.user.setProperties({
          firstName: fullName,
          email: email,
          externalId: userId
        });

        window.fcWidget.on('user:created', (resp) => {
          let status = resp && resp.status;
          let data = resp && resp.data;
        });
      }
    });
  }

  closeChatWidget(): void {
    window.fcWidget.destroy();
  }

  initializeZendeskWidget(user: User): void {
    const fullName = user.displayName;
    const email = user.email;

    zE(function() {
      zE.show();
      zE.identify({
        name: fullName,
        email: email
      });
    });
  }

  disableZendeskWidget(): void {
    zE(function() {
      zE.logout();
      zE.hide();
    });
  }
}