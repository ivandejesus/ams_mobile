import { CurrencyResponse } from "../currency.model";

// A util function to convert what the default form payload produces to payload the api is 
// interested with.
export function makeLoginPayload(formPayload: {username: string, password: string}): LoginPayload {
  return { _username: formPayload.username, _password: formPayload.password, ip: '' };
}

export interface LoginPayload {
  _username: string;
  _password: string;
  ip: string;
}

interface UserResponse {
  username: string;
  email: string;
  activation_code: string;
  activation_timestamp: string;
  activation_sent_timestamp: string;
}

interface WebsocketResponse {
  channel_id: string;
}

export interface LoginResponse {
  id: number;
  full_name: string;
  user: UserResponse;
  websocket: WebsocketResponse;
  currency: CurrencyResponse;
  is_enabled: boolean;
  is_activated: boolean;
  brokerage_sync_id: number;
  birth_date: string;
  country: {
    id: number;
    code: string;
    name: string;
  };
  contacts: Array<{type: string, value: string}>;
  socials: Array<{type: string, value: string}>;
  joined_at: string;
  verified_at?: string;
  jwt_websocket_token: string;
  tags: string[];
  zendesk_id: number;
}
