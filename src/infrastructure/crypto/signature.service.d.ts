export declare class SignatureService {
  constructor();

  public async generateKeyPair(): Promise<{
    privateKey: string;
    publicKey: string;
  }>;

  public publicKeyToAddress(publicKey: string): string;

  public async getPublicKey(privateKey: string): Promise<string>;

  public async signMessage(message: string, privateKey: string): Promise<string>;

  public async verify(message: string, signature: string, publicKey: string): Promise<boolean>;

  public generateNonce(): string;
}
