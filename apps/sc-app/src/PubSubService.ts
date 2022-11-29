
export interface PubSubService<T> {
    subscribeEvents: (events: T[]) => void;
    unsubscribeEvents: (events: T[]) => void;
}
