export declare class InternalError extends Error {
  readonly type: string;
  readonly message: string;
  readonly data: Record<string, any>;
  constructor(type: string, message: string, data?: Record<string, any>);
}
//# sourceMappingURL=error.d.ts.map