import { Account } from '../../domain/account';

export interface AccountRepository {
  getAccount(userId: string): Promise<Account | null>;
  verifyAccount(userId: string, password: string): Promise<boolean>;
}
