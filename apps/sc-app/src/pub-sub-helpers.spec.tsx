/* eslint @typescript-eslint/no-magic-numbers: 0 */
import { filterObsoleteEvents, omitEvents, PubSubState } from './pub-sub-ws';
import '@testing-library/jest-dom';
import { buildMockEvents } from './test/mock-event-utils';

const state = (): PubSubState => ({
    '*:Event:1': { list: true },
    '*:Event:4': { list: true },
    '*:Event:5': { list: true, bets: true },
    '*:Event:3': { list: true },
});

describe.skip('PubSub helpers', () => {
    it('should omit all but 1 channel', () => {
        const eventIds = [1, 3, 4];
        const events = buildMockEvents([1, 3, 4]);
        const whatIsLeft = omitEvents(state(), eventIds, 'list');
        const eventsToUnsubscribe = filterObsoleteEvents(whatIsLeft, events);

        expect(whatIsLeft).toEqual({ '*:Event:5': { list: true, bets: true } });
        expect(eventsToUnsubscribe).toEqual(events);
    });

    it('should not unsubscribe from channel', () => {
        const whatIsLeft = omitEvents(state(), [5], 'bets');
        const eventsToUnsubscribe = filterObsoleteEvents(whatIsLeft, buildMockEvents([5]));

        expect(whatIsLeft).toEqual({
            '*:Event:1': { list: true },
            '*:Event:4': { list: true },
            '*:Event:5': { list: true },
            '*:Event:3': { list: true },
        });
        expect(eventsToUnsubscribe).toEqual([]);
    });

    it('should unsubscribe all', () => {
        const eventIds = [5, 4, 3, 1];
        const whatIsLeft = omitEvents(
            {
                '*:Event:1': { list: true },
                '*:Event:4': { list: true },
                '*:Event:5': { list: true },
                '*:Event:3': { list: true },
            },
            eventIds,
            'list',
        );
        expect(whatIsLeft).toEqual({});

        const allEvents = buildMockEvents(eventIds);
        const eventsToUnsubscribe = filterObsoleteEvents(whatIsLeft, allEvents);


        expect(eventsToUnsubscribe).toEqual(allEvents);
    });
});
