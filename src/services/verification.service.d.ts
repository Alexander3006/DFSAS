import {SignatureService} from '../infrastructure/crypto/signature.service';
import {MemoryCache} from '../system/memory-cache';
import {SignatureDTO} from './dto/signature.dto';

export declare class VerificationServiceError extends Error {}

export declare class VerificationService {
  private readonly memoryCache: MemoryCache;
  private readonly signatureService: SignatureService;
  constructor(container: {memoryCache: MemoryCache; signatureService: SignatureService});

  public static getKeyNonce(address: string): string;

  public static getSignatureMessage(message: string, nonce: string): string;

  public async generateNonce(params: {address: string}): Promise<string>;

  public async verify(signatureDTO: SignatureDTO): Promise<string | null>;

  public async generateSignature(params: {
    message: string;
    nonce: string;
    privateKey: string;
  }): Promise<string>;
}
