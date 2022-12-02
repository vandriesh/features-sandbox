import React from 'react';
import map from 'lodash/map';

import { useFreebets } from './useFreebets';

export function AvailableFreebetsDevMonitor() {
    const { state } = useFreebets();

    return (
        <div style={{ backgroundColor: 'lightgray', textAlign: 'left' }}>
            <h3 style={{ margin: 0 }}>Freebets Monitor</h3>
            <hr/>

            <fieldset>
                <legend>existing freebets:</legend>
                { map(state.freebets, (fbets) => {
                    return <div key={ fbets.id }>W { fbets.amount }</div>;
                }) }
            </fieldset>
            <fieldset>
                <legend>available freebets:</legend>
                { map(state.availableFreebets, (fbets) => {
                    return <div key={ fbets.id }>W { fbets.amount }</div>;
                }) }
            </fieldset>
            <fieldset>
                <legend>state:</legend>
                { JSON.stringify(state.appliedFreebets) }
                <h3>all:</h3>
                { map(state.freebets, 'id').join(',') }
                <h3>availableFreebets:</h3>
                { map(state.availableFreebets, 'id').join(',') }
            </fieldset>
        </div>
    );
}
