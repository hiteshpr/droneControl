// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  rest_proto: 'https://',
  socket_proto: 'wss://',
  apiurl : 'dev.flytbase.com',
  rest_parm : '/rest',
  socket_parm : '/websocket',
  stream_start_url : 'https://dev.flytbase.com/stream/start/',
  stream_stop_url : 'https://dev.flytbase.com/stream/stop/',
  namespace_url : '/ros/get_global_namespace',
  arourl : 'http://localhost:8080/index.php',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
