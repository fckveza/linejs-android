import { Protocols } from "../thrift/mod.js";
import { InternalError } from "../core/mod.js";

import http2 from "node:http2";
import { Console } from "node:console";

const square = ["/SQ1", "/SQLV1"];
/**
 * Request Client
 */ /**
 * @class RequestClient
 * @description A client for making requests to the LINE API.
 *
 * @property {BaseClient} client - The base client instance.
 * @property {string} endpoint - The endpoint for the API requests.
 * @property {string} userAgent - The user agent string for the requests.
 * @property {string} systemType - The system type string for the requests.
 * @property {Record<string, string | undefined>} EXCEPTION_TYPES - A static record of exception types based on request paths.
 *
 * @constructor
 * @param {BaseClient} client - The base client instance.
 */ export class RequestClient {
  client;
  endpoint;
  userAgent;
  systemType;
  static EXCEPTION_TYPES = {
    "/S3": "TalkException",
    "/S4": "TalkException",
    "/SYNC4": "TalkException",
    "/SYNC3": "TalkException",
    "/CH3": "ChannelException",
    "/CH4": "ChannelException",
    "/SQ1": "SquareException",
    "/LIFF1": "LiffException",
    "/api/v3p/rs": "TalkException",
    "/api/v3/TalkService.do": "TalkException",
  };
  constructor(client) {
    const deviceDetails = client.deviceDetails;
    console.log(" client.endpoint;", client.endpoint);
    this.endpoint = client.endpoint;
    this.systemType = `${deviceDetails.device}\t${deviceDetails.appVersion}\t${deviceDetails.systemName}\t${deviceDetails.systemVersion}`;
    this.userAgent = `Line/${deviceDetails.appVersion}`;
    this.client = client;
  }
  /**
   * @description Request to LINE API.
   *
   * @param value - The thrift value(argument) to request.
   * @param methodName - The method name of the request.
   * @param protocolType - The protocol type of the request.
   * @param parse - Whether to parse the response.
   * @param path - The path of the request.
   * @param headers - The headers of the request.
   * @param timeout - The timeout milliseconds of the request.
   * @returns The response.
   */ async request(
    value,
    methodName,
    protocolType = 3,
    parse = true,
    path = "/S3",
    headers = {},
    timeout = this.client.config.timeout
  ) {
    const res = await this.requestCore(
      path,
      value,
      methodName,
      protocolType,
      headers,
      undefined,
      parse,
      undefined,
      timeout
    );
    return res.data.success;
  }
  /**
   * @description Request to LINE API by raw.
   *
   * @param {string} [path] - The path of the request.
   * @param {NestedArray} [value] - The value to request.
   * @param {string} [methodName] - The method name of the request.
   * @param {ProtocolKey} [protocolType] - The protocol type of the request.
   * @param {object} [appendHeaders={}] - The headers to append to the request.
   * @param {string} [overrideMethod="POST"] - The method of the request.
   * @param {boolean | string} [parse=true] - Whether to parse the response.
   * @param {boolean} [isReRequest=false] - Is Re-Request.
   * @param {number} [timeout=this.timeOutMs] - The timeout milliseconds of the request.
   * @returns {Promise<ParsedThrift>} The response.
   * @throws {InternalError} If the request fails or timeout.
   */ async requestCore(
    path,
    value,
    methodName,
    protocolType,
    appendHeaders = {},
    overrideMethod = "POST",
    parse = true,
    isReRequest = false,
    timeout = 1000
  ) {
    const protocol = Protocols[protocolType];
    const headers = {
      ...this.getHeader(overrideMethod),
      ...appendHeaders,
    };
    this.client.log("writeThrift", {
      value,
      methodName,
      protocolType,
    });
    const Trequest = this.client.thrift.writeThrift(
      value,
      methodName,
      protocol
    );
    this.client.log("request", {
      methodName,
      path: `https://${this.endpoint}${path}`,
      method: overrideMethod,
      headers,
      timeout,
      body: Trequest,
    });
    // const response = await this.client.fetch(
    //   `https://${this.endpoint}${path}`,
    //   {
    //     method: overrideMethod,
    //     headers,
    //     signal: AbortSignal.timeout(timeout),
    //     body: Trequest,
    //   }
    // );
    const response = await fetchHttp2(`https://${this.endpoint}${path}`, {
      method: overrideMethod,
      headers,
      body: Trequest,
    });
    const nextToken = response.headers.get("x-line-next-access");
    if (nextToken) {
      this.client.emit("update:authtoken", nextToken);
    }
    const body = await response.arrayBuffer();
    const parsedBody = new Uint8Array(body);
    this.client.log("response", {
      ...response,
      parsedBody,
      methodName,
    });
    let res;
    let hasError = false;
    try {
      res = this.client.thrift.readThrift(parsedBody, protocol);
    } catch {
      throw new Error(
        `Request internal failed: Invalid response buffer <${[...parsedBody]
          .map((e) => e.toString(16))
          .join(" ")}>`
      );
    }
    if (!res.data[0] && Object.keys(res.data).length) {
      hasError = true;
    }
    if (parse === true) {
      this.client.thrift.rename_data(res, square.includes(path));
    } else if (typeof parse === "string") {
      res.data.success = this.client.thrift.rename_thrift(parse, res.data[0]);
      delete res.data[0];
      if (res.data[1]) {
        const structName =
          RequestClient.EXCEPTION_TYPES[path] || "TalkException";
        if (structName) {
          res.data.e = this.client.thrift.rename_thrift(
            structName,
            res.data[1]
          );
        } else {
          res.data.e = res.data[1];
        }
        delete res.data[1];
      }
    } else {
      res.data.success = res.data[0];
      delete res.data[0];
      if (res.data[1]) {
        const structName =
          RequestClient.EXCEPTION_TYPES[path] || "TalkException";
        if (structName) {
          res.data.e = this.client.thrift.rename_thrift(
            structName,
            res.data[1]
          );
        } else {
          res.data.e = res.data[1];
        }
        delete res.data[1];
      }
    }
    this.client.log("readThrift", {
      res,
    });
    const isRefresh = Boolean(
      res.data.e &&
        res.data.e["code"] === "MUST_REFRESH_V3_TOKEN" &&
        (await this.client.storage.get("refreshToken"))
    );
    if (res.data.e && !isRefresh) {
      throw new InternalError(
        "RequestError",
        `Request internal failed, ${methodName}(${path}) -> ` +
          JSON.stringify(res.data.e),
        res.data.e
      );
    }
    if (hasError && !isRefresh) {
      throw new InternalError(
        "RequestError",
        `Request internal failed, ${methodName}(${path}) -> ` +
          JSON.stringify(res.data),
        res.data
      );
    }
    if (isRefresh && !isReRequest) {
      await this.client.auth.tryRefreshToken();
      return this.requestCore(
        path,
        value,
        methodName,
        protocolType,
        appendHeaders,
        overrideMethod,
        parse,
        true
      );
    }
    return res;
  }
  /**
   * Get HTTP headers for a request.
   * @param {string} [overrideMethod="POST"] The HTTP method to use in the `x-lhm` header.
   * @returns {Record<string, string>} An object with the headers as key-value pairs.
   * @throws {InternalError} If the client has not been setup yet.
   */ getHeader(overrideMethod = "POST") {
    const header = {
      Host: this.endpoint,
      accept: "application/x-thrift",
      "user-agent": this.userAgent,
      "x-line-application": this.systemType,
      "content-type": "application/x-thrift",
      "x-lal": "ja_JP",
      "x-lpv": "1",
      "x-lhm": overrideMethod,
      "accept-encoding": "gzip",
    };
    if (this.client.authToken) {
      header["x-line-access"] = this.client.authToken;
    }
    return header;
  }
}
//# sourceMappingURL=mod.js.map

async function fetchHttp2(url, options = {}) {
  const parsed = new URL(url);

  const origin = parsed.origin; // https://gwx.line.naver.jp
  const path = parsed.pathname; // /S4
  const agent = new CustomHttp2Agent(1000);
  return new Promise((resolve, reject) => {
    const client = agent.getConnection(origin);
    //const client = http2.connect(url.origin);
    const req = client.request({
      ":method": "POST",
      ":path": path,
      ...options.headers,
    });

    let chunks = [];
    req.on("response", (headers) => {
      const resHeaders = {};
      for (const name in headers) {
        resHeaders[name] = headers[name];
      }
      //req.setEncoding("binary");

      req.on("data", (chunk) => chunks.push(chunk));

      req.on("end", () => {
        client.close();
        resolve({
          status: headers[":status"],
          headers: {
            get(name) {
              name = name.toLowerCase();
              return headers[name] || headers[name.toLowerCase()] || null;
            },
            // optional: buat mudah iterasi (mirip Map)
            entries() {
              return Object.entries(headers);
            },
          },
          arrayBuffer: async () => {
            const buf = Buffer.concat(chunks);
            return buf.buffer.slice(
              buf.byteOffset,
              buf.byteOffset + buf.byteLength
            );
          },
        });
      });
    });

    req.on("error", reject);

    if (options.body) req.write(options.body);
    req.end();
  });
}

class CustomHttp2Agent {
  constructor(maxIdleConnsPerHost) {
    this.maxIdleConnsPerHost = maxIdleConnsPerHost;
    this.connections = {};
  }

  getConnection(authority) {
    if (!this.connections[authority]) {
      this.connections[authority] = [];
    }

    if (this.connections[authority].length < this.maxIdleConnsPerHost) {
      const session = http2.connect(authority);
      session.setMaxListeners(1000); // Mengatur MaxListeners sesuai kebutuhan
      this.connections[authority].push(session);

      session.on("close", () => {
        const index = this.connections[authority].indexOf(session);
        if (index !== -1) {
          this.connections[authority].splice(index, 1);
        }
      });

      return session;
    } else {
      return this.connections[authority][0];
    }
  }
  closeConnections() {
    for (const authority in this.connections) {
      this.connections[authority].forEach((session) => session.close());
      this.connections[authority] = [];
    }
  }
}
