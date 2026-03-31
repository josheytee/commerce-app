export interface CallbackHandler {
  handleCallback(data: any): Promise<void>;
}
