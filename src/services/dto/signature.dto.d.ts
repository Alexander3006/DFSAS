type SignatureRaw = {
  nonce: string;
  publicKey: string;
  signature: string;
  message: string;
};

export declare class SignatureDTO {
  public readonly nonce: string;
  public readonly publicKey: string;
  public readonly signature: string;
  public readonly message: string;
  constructor(raw: SignatureRaw);

  public static fromRaw(raw: SignatureRaw): SignatureDTO;
  public static validate(raw: SignatureRaw): boolean;
}
