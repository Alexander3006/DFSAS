export declare class OwnerModelError extends Error {}

export enum FileAccessType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  HIDDEN = 'HIDDEN',
}

type OwnerRaw = {
  id: number;
  accessType: FileAccessType;
  address: string;
  metadata: object;
  ttl: number;
  fileId: number;
  createdAt: string;
};

export declare class OwnerModel {
  public readonly id: number;
  public readonly accessType: FileAccessType;
  public readonly address: string;
  public readonly metadata: object;
  public readonly ttl: number;
  public readonly fileId: number;
  public readonly createdAt: string;
  constructor(raw: OwnerRaw);

  public static fromRaw(raw: OwnerRaw): OwnerModel;

  public static validate(raw: OwnerRaw): boolean;
}
