type RequestRaw = {
  requestId: string;
  expirationTime: number;
  callbackUrl: string;
};

export declare class RequestDTO {
  public readonly requestId: string;
  public readonly expirationTime: number;
  public readonly callbackUrl: string;
  constructor(raw: RequestRaw);

  public static fromRaw(raw: RequestRaw): RequestDTO;

  public static validate(raw: RequestRaw): boolean;
}
