import { BaseClient } from "./mod/linejs/base/mod.js";
import { FileStorage } from "./mod/linejs/base/storage/mod.js";

import { engine } from "./lib/config.js";

const tokens = [
  "u36a5507f62e375470c69549aa3599261:aWF....",
  "u938e8528ab18011cf140a552b1ed1cb2:aWF....",
];

async function startClient(token, id, host) {
  const storage = new FileStorage(`./storage-${id}.json`);
  const client = new BaseClient({
    device: "ANDROID",
    endpoint: host,
    storage,
  });

  await client.loginProcess.login({ authToken: token });
  console.log(
    `Polling started for [${id}] ${client.profile?.displayName} ${client.profile?.mid}`
  );
  engine.client.add(client);
  engine.mclient.set(client.profile?.mid, client);

  const polling = client.createPolling();

  for await (const op of polling.listenTalkEvents()) {
    try {
      if (op.type === "RECEIVE_MESSAGE" || op.type === "SEND_MESSAGE") {
        const message = await client.e2ee.decryptE2EEMessage(op.message);
        if (!engine.filterCmd.has(message.createdTime)) {
          engine.filterCmd.add(message.createdTime);
          console.log(
            `[${id}] Message from ${client.profile?.mid}: ${message.text}`
          );

          if (message.text === "ping") {
            for (const vez of engine.client) {
              await vez.talk.sendMessage({
                to:
                  message.to === client.profile?.mid
                    ? message.from
                    : message.to,
                text: "pong!",
                e2ee: !!op.message.chunks,
              });
            }
          } else if (message.text === "me") {
            await client.talk.sendMessage({
              to:
                message.to === client.profile?.mid ? message.from : message.to,
              text: "Hallo",
              e2ee: !!op.message.chunks,
            });
          }
        }
        console.log(
          `[${id}] Message from ${client.profile?.mid}: ${message.text}`
        );
      }
    } catch (err) {
      console.error(`[${id}] Error handlePolling:`, err);
    }
  }
}

function main() {
  const host = "gwx.line.naver.jp";

  for (let i = 0; i < tokens.length; i++) {
    // jalankan tanpa menunggu, biarkan tiap client jalan sendiri
    startClient(tokens[i], i + 1, host).catch((err) =>
      console.error(`[${i + 1}] Failed startClient:`, err)
    );
  }
}

main();
