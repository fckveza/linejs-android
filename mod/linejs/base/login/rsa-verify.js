import { Key } from "node-bignumber";
export function getRSACrypto(message, json) {
  const rsa = new Key();
  rsa.setPublic(json.nvalue, json.evalue);
  const credentials = rsa.encrypt(message).toString("hex");
  const keyname = json.keynm;
  return {
    keyname,
    credentials,
    message
  };
}
//# sourceMappingURL=rsa-verify.js.map