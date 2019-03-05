import { LoginResponse } from "./login.model";
import { Currency } from "../currency.model";
import { Date } from "../../date.util";

/**
 * Our user model should be agnostic that
 * in our API there are Customer and User entities. 
 */

export class User {
  // We are using customer id here.
  id: number;
  username: string;
  displayName: string;
  authentication: string;
  currency: Currency;
  birthDate: Date;
  country: string;
  email: string;
  phoneNumber: string;
  skype: string;
  joinedDate: Date;
  verifiedAt?: Date;
  websocketToken: string;
  websocketChannelId: string;
  brokerageSyncId: number;
  activationCode: string;
  activationTimestamp: string;
  activationSentTimestamp: string;
  isAffiliate: boolean;
  zendeskId: number;

  get isAuthenticated(): boolean {
    return this.authentication === SESSION_AUTHENTICATED;
  }

  get isActivated(): boolean {
    let isActivated = true;

    if (this.activationCode && (this.activationSentTimestamp == this.activationTimestamp)) {
      isActivated = false;
    }

    return isActivated;
  }

  get isVerified(): boolean {
    return this.verifiedAt ? true : false;
  }

  get hasBrokerage(): boolean {
    return +this.brokerageSyncId !== 0;
  }
}

export const SESSION_AUTHENTICATED = 'authenticated';
export const SESSION_ANONYMOUS = 'anonymous';

export class Session {
  user: User;

  static create(): Session {
    const session = new Session();
    
    const user = new User();
    user.authentication = SESSION_ANONYMOUS;

    session.user = user;

    return session;
  }

  static fromResponse(response: LoginResponse): Session {
    const session = new Session();

    const user = new User();

    user.id = response.id;
    user.username = response.user.username;
    user.displayName = response.full_name;
    user.authentication = SESSION_AUTHENTICATED;
    user.currency = Currency.fromResponse(response.currency);
    user.birthDate = new Date(response.birth_date);
    user.country = response.country.name;
    user.email = response.user.email;
    user.brokerageSyncId = response.brokerage_sync_id;
    user.activationCode = response.user.activation_code;
    user.activationTimestamp = response.user.activation_timestamp;
    user.activationSentTimestamp = response.user.activation_sent_timestamp;
    user.zendeskId = response.zendesk_id;
    user.isAffiliate = response.tags.includes('AFF');
    
    for (let c of response.contacts) {
      if (c.type === 'mobile') {
        user.phoneNumber = c.value;
        break;
      }
    }

    for (let s of response.socials) {
      if (s.type === 'skype') {
        user.skype = s.value;
        break;
      }
    }
  
    user.joinedDate = new Date(response.joined_at);
    user.verifiedAt = response.verified_at? new Date(response.verified_at) : null;

    user.websocketToken = response.jwt_websocket_token;
    user.websocketChannelId = response.websocket.channel_id;

    session.user = user;

    return session;
  }

  static fromStorage(jsonData: string): Session {
    const parsedData = JSON.parse(jsonData);
    const parsedUser = parsedData.user;

    const session = new Session();
    const user = new User();

    user.id = parsedUser.id;
    user.username = parsedUser.username;
    user.displayName = parsedUser.displayName;
    user.authentication = SESSION_AUTHENTICATED;
    user.currency = Currency.fromResponse(parsedUser.currency);
    user.birthDate = new Date(parsedUser.birthDate.value);
    user.country = parsedUser.country;
    user.email = parsedUser.email;
    user.phoneNumber = parsedUser.phoneNumber;
    user.skype = parsedUser.skype;
    user.joinedDate = new Date(parsedUser.birthDate.joinedDate);
    user.verifiedAt = parsedUser.verifiedAt ? new Date(parsedUser.birthDate.joinedDate) : null;
    user.websocketToken = parsedUser.websocketToken;
    user.websocketChannelId = parsedUser.websocketChannelId;
    user.brokerageSyncId = parsedUser.brokerageSyncId;
    user.activationCode = parsedUser.activationCode;
    user.activationTimestamp = parsedUser.activationTimestamp;
    user.activationSentTimestamp = parsedUser.activationSentTimestamp;
    user.isAffiliate = parsedUser.isAffiliate;
    user.zendeskId = parsedUser.zendeskId;

    session.user = user;

    return session;
  }
}
