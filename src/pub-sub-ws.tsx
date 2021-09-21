import React, { PropsWithChildren, ReactElement, useCallback, useState } from 'react';
import reduce from 'lodash/reduce';
import omit from 'lodash/omit';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import filter from 'lodash/filter';
import { PubSubService } from './PubSubService';
import { merge } from 'lodash';

export interface PubSubState {
    [key: string]: Record<string, true>;
}

export const PubSubContext = React.createContext<PubSubContextType | null>(null);

export interface PubSubEntity {
    id: number;
    markets?: {id: number}[]; // TODO
}

export const buildEventChannel = (id: number): string => `*:Event:${ id }`;

export const omitChannels = (state: PubSubState, channels: string[], src: string): PubSubState => {
    return reduce(
        channels,
        (acc: PubSubState, channel: string) => {
            // TODO
            if (isEmpty(acc[channel])) {
                return acc;
            }

            const reducedListOfSubscribers = omit(acc[channel], src);

            if (isEmpty(reducedListOfSubscribers)) {
                return omit(acc, channel);
            }

            acc[channel] = reducedListOfSubscribers;

            return acc;
        },
        { ...state },
    );
};
export const omitEvents = (state: PubSubState, ids: number[], src: string): PubSubState =>
     omitChannels(state, map(ids, buildEventChannel), src)


export interface PubSubContextType {
    subscriptions: PubSubState;
    subscribeEvents: (events: PubSubEntity[], src: string) => void;
    unsubscribeEvents: (events: PubSubEntity[], src: string) => void;
}

export function filterObsoleteEvents(state: PubSubState, events: PubSubEntity[]): PubSubEntity[] {
    return filter(events, (event: PubSubEntity) => isEmpty(state[buildEventChannel(event.id)]));
}

export function filterNewEvents(state: PubSubState, events: PubSubEntity[]): PubSubEntity[] {
    return filter(events, ({ id }: PubSubEntity) => isEmpty(state[buildEventChannel(id)]));
}

export function PubSubToWebSocketsProvider({
                                               pubSubService,
                                               ...props
                                           }: PropsWithChildren<{pubSubService: PubSubService<PubSubEntity>}>): ReactElement {
    const [subscriptions, setSubscriptions] = useState<PubSubState>({});

    const subscribeEvents = useCallback((events: PubSubEntity[], src: string): void => {

        setSubscriptions((state) => {
            const eventsToSubscribeTo = filterNewEvents(state, events);
            const eventIds = map(eventsToSubscribeTo, 'id');

            if (!isEmpty(eventIds)) {
                pubSubService.subscribeEvents(events);
            }

            const newStateAddon = reduce(map(events, 'id'), (acc: PubSubState, id) => {
                acc[buildEventChannel(id)] = { [src]: true }
                return acc;
            }, {});

            return merge({}, state, newStateAddon)
        })
    },[pubSubService]);

    const unsubscribeEvents = useCallback((events: PubSubEntity[], src: string): void => {

        setSubscriptions((state) => {
            const ids = map(events, 'id');
            const whatIsLeft = omitEvents(state, ids, src);
            const notListenedEvents = filterObsoleteEvents(whatIsLeft, events);

            if (!isEmpty(notListenedEvents)) {
                pubSubService.unsubscribeEvents(notListenedEvents);
            }

            return whatIsLeft
        });
    },[pubSubService]);

    const value = { subscriptions, subscribeEvents, unsubscribeEvents };

    return <PubSubContext.Provider value={ value } { ...props } />;
}

