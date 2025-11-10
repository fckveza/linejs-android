import { Buffer } from "node:buffer";
import type { Location, Message } from "@jsr/evex__linejs-types";
import * as LINETypes from "@jsr/evex__linejs-types";
import type { BaseClient } from "../core/mod.js";
interface GroupKey {
  privKey: string;
  keyId: number;
}
export declare class E2EE {
  readonly client: BaseClient;
  constructor(client: BaseClient);
  public getE2EESelfKeyData(mid: string): Promise<any>;
  public getE2EESelfKeyDataByKeyId(keyId: string | number): Promise<any>;
  public saveE2EESelfKeyDataByKeyId(keyId: string | number, value: any): Promise<void>;
  public saveE2EESelfKeyData(value: any): Promise<void>;
  public getE2EELocalPublicKey(mid: string, keyId?: string | number | undefined): Promise<Buffer | GroupKey>;
  public tryRegisterE2EEGroupKey(chatMid: string): Promise<LINETypes.Pb1_U3>;
  public generateSharedSecret(privateKey: Buffer, publicKey: Buffer): Uint8Array;
  public xor(buf: Buffer): Buffer;
  public getSHA256Sum(...args: (string | Buffer)[]): Buffer;
  public encryptAESECB(aesKey: Buffer, plainData: Buffer): Buffer;
  public decodeE2EEKeyV1(data: any, secret: Buffer): Promise<{
    keyId: any;
    privKey: Buffer;
    pubKey: Buffer;
    e2eeVersion: any;
  } | undefined>;
  public decryptKeyChain(publicKey: Buffer, privateKey: Buffer, encryptedKeyChain: Buffer): Buffer[];
  public encryptDeviceSecret(publicKey: Buffer, privateKey: Buffer, encryptedKeyChain: Buffer): Buffer;
  public generateAAD(a: string, b: string, c: number, d: number, e?: number, f?: number): Buffer;
  public getIntBytes(i: number): Uint8Array;
  public encryptE2EEMessage(to: string, data: string | Location | Record<string, any>, contentType?: LINETypes.ContentType, specVersion?: number): Promise<Buffer[]>;
  public encryptE2EETextMessage(senderKeyId: number, receiverKeyId: number, keyData: Buffer, specVersion: number, text: string, to: string, _from: string): Buffer[];
  public encryptE2EEMessageByData(senderKeyId: number, receiverKeyId: number, keyData: Buffer, specVersion: number, rawdata: Record<string, any>, to: string, _from: string, contentType: number): Buffer[];
  public encryptE2EELocationMessage(senderKeyId: number, receiverKeyId: number, keyData: Buffer, specVersion: number, location: Location, to: string, _from: string): Buffer[];
  public encryptE2EEMessageV2(data: Buffer, gcmKey: Buffer, nonce: Buffer, aad: Buffer): Buffer;
  public decryptE2EEMessage(messageObj: Message): Promise<Message>;
  public decryptE2EETextMessage(messageObj: Message, isSelf?: boolean): Promise<[string, Record<string, string>]>;
  public decryptE2EELocationMessage(messageObj: Message, isSelf?: boolean): Promise<Location>;
  public decryptE2EEDataMessage(messageObj: Message, isSelf?: boolean): Promise<Record<string, any>>;
  public decryptE2EEMessageV1(chunks: Buffer[], privK: Buffer, pubK: Buffer): any;
  public decryptE2EEMessageV2(to: string, _from: string, chunks: Buffer[], privK: Buffer, pubK: Buffer, specVersion?: number, contentType?: number): any;
  private e2eeLog: any;
  public createSqrSecret(base64Only?: boolean): [Uint8Array, string];
  _encryptAESCTR(aesKey: Buffer, nonce: Buffer, data: Buffer): Buffer;
  __encryptAESCTR(aesKey: Buffer, nonce: Buffer, data: Buffer): Promise<Buffer>;
  ___encryptAESCTR(aesKey: Buffer, nonce: Buffer, data: Buffer): Buffer;
  _decryptAESCTR(aesKey: Buffer, nonce: Buffer, data: Buffer): Buffer;
  __decryptAESCTR(aesKey: Buffer, nonce: Buffer, data: Buffer): Buffer;
  signData(data: Buffer, key: Buffer): Buffer;
  deriveKeyMaterial(keyMaterial: Buffer): Promise<{
    encKey: Buffer;
    macKey: Buffer;
    nonce: Buffer;
  }>;
  encryptByKeyMaterial(rawData: Buffer, keyMaterial?: Buffer): Promise<{
    keyMaterial: string;
    encryptedData: Buffer;
  }>;
  decryptByKeyMaterial(rawData: Buffer, keyMaterial: Buffer | string): Promise<Buffer>;
}
//# sourceMappingURL=mod.d.ts.map