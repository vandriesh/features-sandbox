import { MockEvent } from './MockEvent';
import React, { ReactElement, useContext, useEffect } from 'react';
import { PubSubContext, PubSubContextType } from '../pub-sub-ws';
import map from 'lodash/map';

interface MyEventDetailsProps {
    src: string;
    event: MockEvent;
    handleBet: (event: MockEvent) => void;
    handleDone: () => void;
}

export function MyEventDetails(props: MyEventDetailsProps): ReactElement {
    const { event, src, handleBet, handleDone } = props;
    const color = '#ff8c69';

    const { subscribeEvents, unsubscribeEvents } = useContext(PubSubContext) as PubSubContextType;

    useEffect(() => {
        const events = [event];
        console.log(`%c MyEventDetails sends for +++ ${ map(events, 'id') }`, `color: ${ color }`);
        subscribeEvents(events, src);

        return () => {
            console.log(`%c MyEventDetails sends for --- ${ map(events, 'id') }`, `color: ${ color }`);
            unsubscribeEvents(events, src)
        }
    }, [event, src, subscribeEvents, unsubscribeEvents])

    return (
        <div style={ { color } }>
            <button onClick={ handleDone }> backTo list</button>
            <h1>My Event Details </h1>
            <div>
                my event: { event.name }
                <button
                    data-testid={ `details-event-${ event.id }-bet` }
                    onClick={ () => handleBet(event) }> bet on this one
                </button>
            </div>

        </div>
    );
}
