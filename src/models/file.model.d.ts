import {OwnerModel} from './owner.model';

export declare class FileModelError extends Error {}

type FileRaw = {
  id: number;
  name: string;
  hash: string;
  size: number;
  owners: OwnerModel[];
  createdAt: string;
};

export declare class FileModel {
  public readonly id: number;
  public readonly name: string;
  public readonly hash: string;
  public readonly size: number;
  public readonly owners: OwnerModel[];
  public readonly createdAt: string;
  constructor(raw: FileRaw);

  public static fromRaw(raw: FileRaw): FileModel;

  public static validate(raw: FileRaw): boolean;
}
