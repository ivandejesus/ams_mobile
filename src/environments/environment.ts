// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://172.19.0.4:8080',
  amsSigninUrl: "http://ac66.local/sign-in?from=mob",
  websocketUrl: 'ws://172.24.0.3:9090/',
  websocketRealm: 'bo',
  ecopayzSuccessUrl: 'http://localhost:4200?ecopayz=success',
  ecopayzFailureUrl: 'http://localhost:4200?ecopayz=failure',
  ecopayzCancelUrl: 'http://localhost:4200?ecopayz=cancel',
  freshChatToken: '',
  freshChatHost: ''
};

export default environment;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
