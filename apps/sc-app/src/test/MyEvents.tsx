import { MockEvent } from './MockEvent';
import React, { ReactElement, useContext, useEffect } from 'react';
import { PubSubContext, PubSubContextType } from '../pub-sub-ws';
import map from 'lodash/map';

interface MyEventsProps {
    src: string;
    events: MockEvent[];
    handleBet: (event: MockEvent) => void;
    handleSelect: (event: MockEvent) => void;
}

export function MyEvents(props: MyEventsProps): ReactElement {
    const { events, src, handleBet, handleSelect } = props;
    const color = 'green';

    const { subscribeEvents, unsubscribeEvents } = useContext(PubSubContext) as PubSubContextType;

    useEffect(() => {
        console.log(`%c MyEvents sends for +++ ${ map(events, 'id') }`, `color: ${ color }`);
        subscribeEvents(events, src);

        return () => {
            console.log(`%c MyEvents sends for --- ${ map(events, 'id') }`, `color: ${ color }`);
            unsubscribeEvents(events, src)
        }
    }, [events, src, color, subscribeEvents, unsubscribeEvents])



    return (
        <div style={ { color } }>
            <h1>My Events ({ events.length })</h1>
            { map(events, (event: MockEvent) => (
                <div
                    key={ event.id }

                >
                    <button
                        data-testid={ `list-event-${ event.id }-bet` }
                        onClick={ () => handleBet(event) }> bet
                    </button>
                    <span
                        data-testid={ `list-event-${ event.id }` }
                        onClick={ () => handleSelect(event) }>event: { event.name }</span>
                </div>
            )) }
        </div>
    );
}

