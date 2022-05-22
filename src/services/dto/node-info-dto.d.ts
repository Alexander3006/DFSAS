type NodeInfoRaw = {
  ip: string;
  ws: string;
  http: string;
  version: string;
  address: string;
};

export declare class NodeInfoDTO {
  public readonly ip: string;
  public readonly ws: string;
  public readonly http: string;
  public readonly version: string;
  public readonly address: string;

  constructor(raw: NodeInfoRaw);

  public static fromRaw(raw: NodeInfoRaw): NodeInfoDTO;

  public static validate(raw: NodeInfoRaw): boolean;

  public toMessage(): string;
}
