import React, { ReactElement } from 'react';
import { MockBet } from './MockEvent';
//import * as FreebetUI from '../feature-freebets';
interface OwnProps {
    bet: MockBet;
    handleDelete: () => void;
}

export function MyLeg(props: OwnProps): ReactElement {
    const { bet } = props;

    return (
        <div style={{ textAlign: 'left', display: 'flex' }} data-testid={`bet-${bet.id}`}>
            <div>
                bet: {bet.event.name}
                <input
                    key={`input-${bet.id}-ro`}
                    type="text"
                    name={`bet-${bet.id}-stake`}
                    style={{ width: '50px' }}
                    readOnly
                />
{/*
                <FreebetUI.Stake value="1000" />
*/}
            </div>
            <button data-testid={`remove-bet-${bet.id}`} onClick={props.handleDelete}>
                x
            </button>
            <hr />
        </div>
    );
}
