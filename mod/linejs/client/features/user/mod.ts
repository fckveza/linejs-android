import type { GetContactV3Response } from "jsr:@evex/linejs-types@^2.2.0";

export interface UserInit {
	raw: GetContactV3Response;
}

export class User {
	readonly mid: string;
	readonly raw: GetContactV3Response;
	constructor(init: UserInit) {
		this.mid = init.raw.targetUserMid;
		this.raw = init.raw;
	}
}
