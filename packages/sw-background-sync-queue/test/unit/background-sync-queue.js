/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/* eslint-env mocha, browser */
/* global chai, goog */

'use strict';

describe('background sync queue test', () => {
  function onRes() {}
  function onRetryFail() {}

  const QUEUE_NAME = 'QUEUE_NAME';
  const MAX_AGE = 6;
  const CALLBACKS = {
    onResponse: onRes,
    onRetryFail: onRetryFail,
  };

  const backgroundSyncQueue
    = new goog.backgroundSyncQueue.test.BackgroundSyncQueue({
      maxRetentionTime: MAX_AGE,
      queueName: QUEUE_NAME,
      callbacks: CALLBACKS,
    });

  it('check defaults', () => {
    const defaultsBackgroundSyncQueue
      = new goog.backgroundSyncQueue.test.BackgroundSyncQueue({});
    chai.assert.isObject(defaultsBackgroundSyncQueue._queue);
    chai.assert.isObject(defaultsBackgroundSyncQueue._requestManager);
    chai.assert.equal(defaultsBackgroundSyncQueue._queue._queueName,
      goog.backgroundSyncQueue.test.constants.defaultQueueName + '_0');
    chai.assert.equal(defaultsBackgroundSyncQueue._queue._config.maxAge,
      goog.backgroundSyncQueue.test.constants.maxAge);
    chai.assert.equal(
      JSON.stringify(
        defaultsBackgroundSyncQueue._requestManager._globalCallbacks),
      JSON.stringify({}));
  });

  it('check parameterised constructor', () =>{
    chai.assert.isObject(backgroundSyncQueue._queue);
    chai.assert.isObject(backgroundSyncQueue._requestManager);
    chai.assert.equal(backgroundSyncQueue._queue._queueName, QUEUE_NAME);
    chai.assert.equal(backgroundSyncQueue._queue._config.maxAge, MAX_AGE);
    chai.assert.equal(backgroundSyncQueue._requestManager._globalCallbacks,
      CALLBACKS);
  });

  it('check push proxy', () => {
    const currentLen = backgroundSyncQueue._queue.queue.length;
    backgroundSyncQueue.pushIntoQueue({request: new Request('http://lipsum.com')}).then( (e) => {
      chai.assert.equal(backgroundSyncQueue._queue.queue.length,
        currentLen + 1);
    });
  });

  it('check fetchDid fail proxy', () => {
    const currentLen = backgroundSyncQueue._queue.queue.length;
    backgroundSyncQueue.fetchDidFail({request: new Request('http://lipsum.com')}).then( (e) => {
      chai.assert.equal(backgroundSyncQueue._queue.queue.length,
        currentLen + 1);
    });
  });
});
