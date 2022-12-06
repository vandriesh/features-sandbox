import React from 'react';
import './App.css';
import map from 'lodash/map';
import { MockContent } from './test/MockPubSubApp';
import { PubSubEntity, PubSubToWebSocketsProvider } from './pub-sub-ws';
import { PubSubService } from './PubSubService';
import { DisplaySubs } from './DisplaySubs';
import { AvailableFreebetsDevMonitor } from './feature-freebets/AvailableFreebetsDevMonitor';
import { Freebet, FreebetsProvider } from './feature-freebets/useFreebets';

function App() {
    const bonusCreditsMock: Freebet[] = [
        {
            id: 1286,
            amount: 5000,
            promotionId: '1111',
            friendlyDescription:
                'You can use this Free Bet on any Football market with odds above 1.8. Only single bets are eligible.',
            expiryDate: '2029-10-10T00:00:00.000Z',
        },
        {
            id: 1287,
            amount: 10000,
            promotionId: '1112',
            friendlyDescription:
                'You can use this Free Bet on any Football market with odds above 1.8. Only single bets are eligible.',
            expiryDate: '2024-10-10T00:00:00.000Z',
        },
        {
            id: 1288,
            amount: 20000,
            promotionId: '1113',
            friendlyDescription:
                'You can use this Free Bet on any Football market with odds above 1.8. Only single bets are eligible.',
            expiryDate: '2023-10-10T00:00:00.000Z',
        },
    ];
    const eventIds = [11, 22, 33];
    const mockEvents = map(eventIds, (id: number) => ({ id, name: `Event ${id}` }));
    const color = 'red';

    const pubSubService: PubSubService<PubSubEntity> = {
        subscribeEvents(events: PubSubEntity[]) {
            // console.info(`%c      SUB   +++ `, `color: ${color}`, map(events, 'id'));
        },
        unsubscribeEvents(events: PubSubEntity[]) {
            // console.info(`%c      UNSUB --- `, `color: ${color}`, map(events, 'id'));
        },
    };

    return (
        <FreebetsProvider freebets={bonusCreditsMock}>
            <PubSubToWebSocketsProvider pubSubService={pubSubService}>
                <table width="100%">
                    <tbody>
                        <tr style={{ verticalAlign: 'top' }}>
                            <td>
                                <MockContent fooParam={mockEvents} />
                            </td>
                            <td>
                                <DisplaySubs />
                                <hr />
                                <AvailableFreebetsDevMonitor />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </PubSubToWebSocketsProvider>
        </FreebetsProvider>
    );
}

export default App;
