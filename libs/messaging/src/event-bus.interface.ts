export interface EventBus {
  publish: (eventName: string, payload: any) => void;
}
