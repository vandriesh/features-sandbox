import React, { ReactElement, useState } from 'react';
import { MockBet, MockEvent } from './MockEvent';
import reject from 'lodash/reject';
import { MyEvents } from './MyEvents';
import { MyBets } from './MyBets';
import { MyEventDetails } from './MyEventDetails';

export function MockContent({ fooParam }: { fooParam: MockEvent[] }): ReactElement {
    const [events] = useState<MockEvent[]>(fooParam);
    const [bets, setBets] = useState<MockBet[]>([]);
    const [betId, setBetId] = useState(0);

    const [state, setState] = useState<{
        currentEvent: null | MockEvent;
        listVisible: boolean;
    }>({
        currentEvent: null,
        listVisible: true,
    });

    const { currentEvent, listVisible } = state;

    function setCurrentEvent(currentEvent: MockEvent | null) {
        setState({
            ...state,
            listVisible: currentEvent === null,
            currentEvent,
        });
    }

    // const [list, toggleList] = useState(false);

    function placeBet(event: MockEvent): void {
        let aBet = { event, id: betId };

        setBets([...bets, aBet]);
        setBetId(betId + 1);
    }

    function showEventDetails(event: MockEvent) {
        setCurrentEvent(event);
    }

    function removeBar(id: number) {
        const reducedBars = reject(bets, { id });

        setBets(reducedBars);
    }

    function toggleList() {
        setState({
            ...state,
            listVisible: !listVisible,
        });
    }

    return (
        <div>
            {!currentEvent && <button onClick={toggleList}>show list</button>}
            {currentEvent && (
                <MyEventDetails
                    event={currentEvent}
                    src="details"
                    handleDone={() => setCurrentEvent(null)}
                    handleBet={placeBet}
                />
            )}

            {listVisible && (
                <MyEvents events={events} src="list" handleBet={placeBet} handleSelect={showEventDetails} />
            )}
            <hr />
            <form>
                <MyBets bets={bets} src="bet" handleDelete={removeBar} />
            </form>
        </div>
    );
}
