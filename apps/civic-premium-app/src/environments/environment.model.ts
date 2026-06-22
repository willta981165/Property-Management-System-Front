export interface AppEnvironment {
  production: boolean;
  apiBaseUrl: string;
  testAccount?: {
    account: string;
    password: string;
  };
}
