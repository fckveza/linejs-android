function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
export class Polling {
  sync = {
    talk: {},
  };
  client;
  constructor(client) {
    this.client = client;
  }

  /**
   * Listens for talk events by polling the server at a specified interval.
   *
   * @param {Object} [options] - Configuration options for the polling.
   * @param {AbortSignal} [options.signal] - An AbortSignal to cancel the polling.
   * @param {(error: unknown) => void} [options.onError] - A callback function to handle errors.
   * @param {number} [options.pollingInterval=1000] - The interval in milliseconds between each poll.
   *
   * @yields {Operation} - Yields each operation event received from the server.
   *
   * @returns {AsyncGenerator<Operation, void, unknown>} - An async generator that yields operation events.
   */ async *listenTalkEvents(options = {}) {
    const { signal, onError, pollingInterval } = {
      pollingInterval: 100,
      ...options,
    };
    while (true) {
      try {
        const response = await this.client.talk.sync({
          ...this.sync.talk,
          limit: 100,
        });
        //console.log(this.sync.talk.revision);
        if (
          response.fullSyncResponse &&
          response.fullSyncResponse.nextRevision
        ) {
          this.sync.talk.revision = response.fullSyncResponse.nextRevision;
        }
        if (
          response.operationResponse &&
          response.operationResponse.globalEvents &&
          response.operationResponse.globalEvents.lastRevision
        ) {
          this.sync.talk.globalRev =
            response.operationResponse.globalEvents.lastRevision;
        }
        if (
          response.operationResponse &&
          response.operationResponse.individualEvents &&
          response.operationResponse.individualEvents.lastRevision
        ) {
          this.sync.talk.individualRev =
            response.operationResponse.individualEvents.lastRevision;
        }
        if (
          !(response.operationResponse && response.operationResponse.operations)
        ) {
          continue;
        }
        for (const event of response.operationResponse.operations) {
          this.sync.talk.revision = event.revision;
          yield event;
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
      await sleep(pollingInterval);
      if (signal?.aborted) {
        break;
      }
    }
  }
}
//# sourceMappingURL=mod.js.map
