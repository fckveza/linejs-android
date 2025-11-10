// @ts-types="thrift-types"
import * as thrift from "thrift";
import { Buffer } from "node:buffer";
export const genHeader = {
  3: (name)=>{
    return Buffer.from([
      0x80,
      1,
      0,
      1,
      0,
      0,
      0,
      name.length,
      ...Buffer.from(name),
      0,
      0,
      0,
      0
    ]);
  },
  4: (name)=>{
    return Buffer.from([
      0x82,
      0x21,
      0,
      name.length,
      ...Buffer.from(name)
    ]);
  }
};
export const Protocols = {
  4: thrift.TCompactProtocol,
  3: thrift.TBinaryProtocol
};
//# sourceMappingURL=declares.js.map