import React, { ReactElement, useEffect, useState } from 'react';
import isUndefined from 'lodash/isUndefined';
import { isNull } from 'lodash';

import { MockBet } from './MockEvent';
import { FreeBet } from '../feature-freebets/FreeBet';
import { Freebet, useFreebets } from '../feature-freebets/useFreebets';
import * as FreebetUI from '../feature-freebets';

interface OwnProps {
    bet: MockBet;
    handleDelete: () => void;
}

export function MyLeg(props: OwnProps): ReactElement {
    const { bet } = props;
    const { state, getFreebet } = useFreebets();
    const [freebet, setFreebet] = useState<Freebet | null>(null);

    useEffect(() => {
        const fbet = getFreebet(`${bet.id}`);

        if (isUndefined(fbet)) {
            return;
        }

        setFreebet(fbet);
    }, [bet.id, state.timestamp]);

    return (
        <div style={{ textAlign: 'left', display: 'flex' }} data-testid={`bet-${bet.id}`}>
            <FreeBet linkedEntityId={`${bet.id}`} />
            <div>
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
            </div>
            <button data-testid={`remove-bet-${bet.id}`} onClick={props.handleDelete}>
                x
            </button>
            <hr />
        </div>
    );
}
