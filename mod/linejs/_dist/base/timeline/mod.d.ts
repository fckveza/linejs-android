import type { BaseClient } from "../mod.js";
export type TimelineResponse<T = any> = {
  code: number;
  message: string;
  result: T;
};
export declare class Timeline {
  protected timelineToken: string | undefined;
  public timelineHeaders: Record<string, string | undefined>;
  client: BaseClient;
  constructor(client: BaseClient);
  public initTimeline(): Promise<void>;
  public createPost(options: {
    homeId: string;
    text?: string;
    sharedPostId?: string;
    textSizeMode?: "AUTO" | "NORMAL";
    backgroundColor?: string;
    textAnimation?: "NONE" | "SLIDE" | "ZOOM" | "BUZZ" | "BOUNCE" | "BLINK";
    readPermissionType?: "ALL" | "FRIEND" | "GROUP" | "EVENT" | "NONE";
    readPermissionGids?: string[];
    holdingTime?: number;
    stickerIds?: string[];
    stickerPackageIds?: string[];
    locationLatitudes?: number[];
    locationLongitudes?: number[];
    locationNames?: string[];
    mediaObjectIds?: string[];
    mediaObjectTypes?: string[];
    sourceType?: string;
  }): Promise<TimelineResponse>;
  public deletePost(options: {
    homeId: string;
    postId: string;
  }): Promise<TimelineResponse>;
  public getPost(options: {
    homeId: string;
    postId: string;
  }): Promise<TimelineResponse>;
  public listPost(options: {
    homeId: string;
    postId?: string;
    updatedTime?: number;
    sourceType?: string;
  }): Promise<TimelineResponse>;
  public sharePost(options: {
    postId: string;
    chatMid: string;
    homeId: string;
  }): Promise<TimelineResponse>;
}
//# sourceMappingURL=mod.d.ts.map