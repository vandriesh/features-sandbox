import React from 'react';
import './App.css';
import map from 'lodash/map';
import { MockContent } from './test/MockPubSubApp';
import { PubSubEntity, PubSubToWebSocketsProvider } from './pub-sub-ws';
import { PubSubService } from './PubSubService';
import { DisplaySubs } from './DisplaySubs';

function App() {
    const eventIds = [11, 22, 33]
    const mockEvents = map(eventIds, (id: number) => ({ id, name: `Event ${ id }` }));
    const color = 'red';

    const pubSubService : PubSubService<PubSubEntity> = {
        subscribeEvents(events: PubSubEntity[]){
            console.info(`%c      SUB   +++ `, `color: ${color}`, map(events, 'id'));
        },
        unsubscribeEvents(events: PubSubEntity[]) {
            console.info(`%c      UNSUB --- `, `color: ${color}`, map(events, 'id'));
        }
    }

    return (
        <PubSubToWebSocketsProvider pubSubService={pubSubService}>
            <table width="100%">
                <tbody>
                <tr>
                    <td><MockContent fooParam={ mockEvents }/></td>
                    <td><DisplaySubs /></td>
                </tr>
                </tbody>
            </table>


        </PubSubToWebSocketsProvider>
    );
}

export default App;
