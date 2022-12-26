import React, { ReactElement, useContext, useEffect } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import { PubSubContext, PubSubContextType } from '../pub-sub-ws';
import { MockBet } from './MockEvent';
import { MyLeg } from './MyLeg';

interface MyBetsProps {
    src: string;
    bets: MockBet[];
    handleDelete: (id: number) => void;
}

export function MyBets(props: MyBetsProps): ReactElement {
    const { bets, src, handleDelete } = props;

    const color = 'violet';

    const { subscribeEvents, unsubscribeEvents } = useContext(PubSubContext) as PubSubContextType;

    useEffect(() => {
        if (isEmpty(bets)) {
            return;
        }
        const events = map(bets, 'event');
        subscribeEvents(events, src);

        return () => {
            unsubscribeEvents(events, src);
        };
    }, [bets, src, color, subscribeEvents, unsubscribeEvents]);

    if (isEmpty(bets)) {
        return (
            <div style={{ color, textAlign: 'left' }}>
                <h1>MyBets (none so far). Do you feel lucky?</h1>
            </div>
        );
    }

    return (
        <div style={{ color, textAlign: 'left' }}>
            <h1 data-testid="betslip-heading">MyBets ({bets.length})</h1>
            {map(bets, (bet: MockBet) => (
                <MyLeg key={bet.id} bet={bet} handleDelete={() => handleDelete(bet.id)} />
            ))}
        </div>
    );
}
