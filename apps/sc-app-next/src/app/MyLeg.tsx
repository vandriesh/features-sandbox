import React, { ReactElement, useEffect, useState } from 'react';
import isUndefined from 'lodash/isUndefined';
import { isNull } from 'lodash';

import * as FreebetUI from '@features/ui-ascii';

import { Freebet, useFreebets } from '@features/feature-freebets';
import { FreeBetContainer } from '@features/feature-freebets';

import { MockBet } from '@sc-app-legacy/test/MockEvent';

interface OwnProps {
    bet: MockBet;
    handleDelete: () => void;
}

export function MyLeg(props: OwnProps): ReactElement {
    const { bet, handleDelete } = props;
    const { state, getFreebet } = useFreebets();
    const [freebet, setFreebet] = useState<Freebet | null>(null);

    useEffect(() => {
        const selectedFreebet = getFreebet(`${bet.id}`);

        if (isUndefined(selectedFreebet)) {
            setFreebet(null);
            return;
        }

        setFreebet(selectedFreebet);
    }, [bet.id, state.timestamp]);

    return (
        <div style={{ textAlign: 'left', display: 'flex' }} data-testid={`bet-${bet.id}`}>
            <FreeBetContainer linkedEntityId={`${bet.id}`} UI={FreebetUI} />
            bet: {bet.event.name}
            {isNull(freebet) ? (
                <input
                    placeholder="stake"
                    key={`input-${bet.id}`}
                    type="text"
                    name={`bet-${bet.id}-stake`}
                    defaultValue=""
                    style={{ width: '50px' }}
                />
            ) : (
                <FreebetUI.Stake
                    key={`input-${bet.id}-ro`}
                    name={`bet-${bet.id}-stake`}
                    value={`${freebet.amount}`}
                    readOnly
                />
            )}
            <button data-testid={`remove-bet-${bet.id}`} onClick={handleDelete}>
                x
            </button>
            <hr />
        </div>
    );
}
