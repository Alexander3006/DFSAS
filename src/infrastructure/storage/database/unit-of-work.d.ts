import mysql from 'mysql2';

export declare class UnitOfWorkError extends Error {}

type connection = mysql.Connection | mysql.PoolConnection | mysql.Pool;
type model = <Repository>(connection: connection) => Repository;

export declare class UnitOfWork {
  private #isTransaction: boolean;
  private #models: {[key: string]: model};
  constructor(params: {
    models: {[key: string]: model};
    connection: connection;
    transaction?: boolean;
  });

  public get repositories(): {[key: string]: model};

  private #build(models: {[key: string]: model}, connection: connection): {[key: string]: model};

  public async transaction(): Promise<UnitOfWork>;

  public async commit(): Promise<UnitOfWork>;

  public async rollback(): Promise<UnitOfWork>;

  public release(): null;

  public async query(query: string, ...args: any[]): Promise<mysql.Query>;
}
