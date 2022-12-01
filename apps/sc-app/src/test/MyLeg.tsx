import React, { ReactElement } from 'react';

import { MockBet } from './MockEvent';

interface OwnProps {
    bet: MockBet;
    handleDelete: () => void;
}

export function MyLeg(props: OwnProps): ReactElement {
    const { bet, handleDelete } = props;

    return (
        <div style={{ textAlign: 'left', display: 'flex' }} data-testid={`bet-${bet.id}`}>
            <div>
                bet: {bet.event.name}
                <input type="text" name={`bet-${bet.id}-stake`} />
            </div>
            <button data-testid={`remove-bet-${bet.id}`} onClick={handleDelete}>
                x
            </button>
            <hr />
        </div>
    );
}
