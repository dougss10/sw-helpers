/* eslint-env worker, serviceworker */
/* global goog */

importScripts(
  '../build/routing.min.js',
  '../../sw-runtime-caching/build/runtime-caching.min.js',
  '../../sw-broadcast-cache-update/build/broadcast-cache-update.min.js'
);

// Have the service worker take control as soon as possible.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const requestWrapper = new goog.runtimeCaching.RequestWrapper({
  cacheName: 'text-files',
  plugins: [
    new goog.broadcastCacheUpdate.Plugin({channelName: 'cache-updates'}),
  ],
});

const route = new goog.routing.RegExpRoute({
  regExp: /\.txt$/,
  handler: new goog.runtimeCaching.StaleWhileRevalidate({requestWrapper}),
});

const router = new goog.routing.Router();
router.registerRoute({route});
router.setDefaultHandler({handler: new goog.runtimeCaching.NetworkFirst()});
