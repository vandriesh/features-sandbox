import React, { ReactElement, useContext, useEffect } from 'react';
import { PubSubContext, PubSubContextType } from '../pub-sub-ws';
import map from 'lodash/map';
import { MockBet } from './MockEvent';

interface MyBetsProps {
    src: string;
    bets: MockBet[];
    handleDelete: (id: number) => void
}

export function MyBets(props: MyBetsProps): ReactElement {
    const { bets, src, handleDelete } = props;

    const color = 'violet';

    const { subscribeEvents, unsubscribeEvents } = useContext(PubSubContext) as PubSubContextType;

    //
    useEffect(() => {
        const events = map(bets, 'event');
        console.log(`%c MyBets send for +++ ${ map(events, 'id') }`, `color: ${ color }`);
        subscribeEvents(events, src);

        return () => {
            console.log(`%c MyBets send for --- ${ map(events, 'id') }`, `color: ${ color }`);
            unsubscribeEvents(events, src)
        }
    }, [bets, src, color, subscribeEvents, unsubscribeEvents])


    return (
        <div style={ { color } }>
            <h1>MyBets ({ bets.length })</h1>
            { map(bets, (bet: MockBet) => (
                <div key={ bet.id }>
                    <button
                        data-testid={ `remove-bet-${ bet.id }` }
                        onClick={ () => handleDelete(bet.id) }>x
                    </button>
                    bet: { bet.event.name }
                </div>
            )) }
        </div>
    );
}