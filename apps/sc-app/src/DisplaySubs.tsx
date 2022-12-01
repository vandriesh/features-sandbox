import React, { ReactElement, useContext } from 'react';

import map from 'lodash/map';
import keys from 'lodash/keys';
import sortBy from 'lodash/sortBy';

import { PubSubContext, PubSubContextType } from './pub-sub-ws';

export function DisplaySubs(): ReactElement {
    const { subscriptions } = useContext(PubSubContext) as PubSubContextType;
    const ids = sortBy(keys(subscriptions));
    const extractEventId = (channel: string) => channel.split(':')[2];
    return (
        <div style={{ backgroundColor: 'lightgray', textAlign: 'left' }}>
            <h3 style={{ margin: 0 }}>Subscribe Monitor</h3>
            <hr/>
            ids: #refs (total:<span data-testid="events-count">{ids.length}</span>):
            {map(ids, (id: string) => (
                <article key={id} data-testid={id}>
                    <div data-testid={`event-${extractEventId(id)}-refs`}>
                        {extractEventId(id)}:{map(keys(subscriptions[id]), (ref: string) => `#${ref}`).join(',')}
                    </div>
                </article>
            ))}
        </div>
    );
}
