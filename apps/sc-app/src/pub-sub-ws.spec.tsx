import React, { PropsWithChildren, ReactElement } from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render as rtlRender, RenderResult, screen } from '@testing-library/react';
import map from 'lodash/map';

import { PubSubService } from './PubSubService';

import { PubSubEntity, PubSubToWebSocketsProvider } from './pub-sub-ws';

import { DisplaySubs } from './DisplaySubs';
import { MockContent } from './test/MockPubSubApp';
import { MockEvent } from './test/MockEvent';
import reject from 'lodash/reject';
import { buildMockEvent, buildMockEvents } from './test/mock-event-utils';

const AllTheProviders = ({
    children,
    pubSubService,
}: PropsWithChildren<{
    pubSubService: PubSubService<PubSubEntity>;
}>): ReactElement => {
    return <PubSubToWebSocketsProvider pubSubService={pubSubService}>{children}</PubSubToWebSocketsProvider>;
};

const customRender = (ui: ReactElement, options: any): RenderResult => {
    return rtlRender(ui, {
        wrapper: (props) => <AllTheProviders {...props} {...options.wrapperProps} />,
        ...options,
    });
};

function TestContent({ entities }: { entities: MockEvent[] }): ReactElement {
    return (
        <>
            <MockContent fooParam={entities} />
            <hr />
            <DisplaySubs />
        </>
    );
}

describe.skip('PubSub', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('PubSubProvider', async () => {
        const FIRST_EVENT_ID = 11;
        const SECOND_EVENT_ID = 22;
        const THIRD_EVENT_ID = 33;
        const eventIds = [FIRST_EVENT_ID, SECOND_EVENT_ID, THIRD_EVENT_ID];
        const mockEvents = buildMockEvents(eventIds);
        const PubSubService = {
            subscribeEvents: () => {},
            unsubscribeEvents: () => {},
        };
        const mockPubSubService = {
            subscribeEvents: vi.spyOn(PubSubService, 'subscribeEvents'),
            unsubscribeEvents: vi.spyOn(PubSubService, 'unsubscribeEvents'),
        };

        // "clean" spies
        expect(mockPubSubService.subscribeEvents).not.toHaveBeenCalled();
        expect(mockPubSubService.unsubscribeEvents).not.toHaveBeenCalled();

        const { rerender } = customRender(<TestContent entities={mockEvents} />, {
            wrapperProps: {
                pubSubService: PubSubService,
            },
        });

        // 0. check no events (events) are subscribed
        expect(mockPubSubService.subscribeEvents).not.toHaveBeenCalled();

        const subscriptionCount = screen.getByTestId('events-count');

        // no subscriptions "visually"
        expect(subscriptionCount).toHaveTextContent('0');

        // SCENARIO

        // 1. SHOW THE LIST                -> (total:3 | [ #list, #list     , #list          ])
        // 2. LIST -> MAKE A BET (#22)     -> (total:3 | [ #list, #list|#bet, #list          ])
        // 3. LIST -> EVENT#33             -> (total:2 | [        #bet      , #details       ])
        // 4. DETAILS -> MAKE A BET (#33)  -> (total:2 | [        #bet      , #details|#bet  ])
        // 5. EVENT#33 -> LIST             -> (total:3 | [ #list, #bet|#list, #bet|#list     ])
        // 6. HIDE THE LIST                -> (total:2 | [        #bet      , #bet           ])
        // 7. REMOVE BET#0(#22)            -> (total:1 | [                    #bet           ])
        // 8. REMOVE BET#1(#33)            -> (total:0 | [                                   ])

        // 1. SHOW THE LIST (subscribe to all from #list)
        userEvent.click(await screen.findByText(/show list/));

        // no subscriptions "visually"
        expect(subscriptionCount).toHaveTextContent(`${mockEvents.length}`);
        expect(mockPubSubService.subscribeEvents).toHaveBeenCalledWith(mockEvents);
        expect(mockPubSubService.unsubscribeEvents).not.toHaveBeenCalled();

        map(eventIds, (id) => expect(screen.getByTestId(`event-${id}-refs`)).toHaveTextContent(`${id}:#list`));

        // let's resets spies
        mockPubSubService.unsubscribeEvents.mockReset();
        mockPubSubService.subscribeEvents.mockReset();

        // 2. MAKE A BET (attempt to subscribe, already subscribed so only add new ref #bet => #list,#bet
        userEvent.click(await screen.findByTestId('list-event-22-bet'));
        expect(screen.getByTestId('event-22-refs')).toHaveTextContent('22:#list,#bet');

        // already subscribed
        expect(mockPubSubService.subscribeEvents).not.toHaveBeenCalled();
        // checking the "state" monitor

        // reset PUB_SUB
        mockPubSubService.unsubscribeEvents.mockReset();
        mockPubSubService.subscribeEvents.mockReset();

        // 3. SELECT AN EVENT (attempt to subscribe, already subscribed so only add new ref #details => #details
        userEvent.click(await screen.findByTestId('list-event-33'));

        // we should have 2 events to be subscribed to (22 - from bet page, 33 - from details page )
        expect(subscriptionCount).toHaveTextContent(`2`);
        expect(screen.getByTestId('event-22-refs')).toHaveTextContent('22:#bet');
        expect(screen.getByTestId('event-33-refs')).toHaveTextContent('33:#details');

        // already subscribed
        // we left list (unsubscribe all but the one we have in bet(22))

        expect(mockPubSubService.unsubscribeEvents).toHaveBeenCalledWith(reject(mockEvents, { id: 22 }));
        // and subscriber from new page #details
        expect(mockPubSubService.subscribeEvents).toHaveBeenCalledWith(buildMockEvents([33]));

        // reset PUB_SUB
        mockPubSubService.unsubscribeEvents.mockReset();
        mockPubSubService.subscribeEvents.mockReset();

        // 4. WE BET FROM EVENT#33 DETAILS PAGE (attempt to subscribe, only add #details tag)
        userEvent.click(await screen.findByTestId(`details-event-33-bet`));

        expect(mockPubSubService.unsubscribeEvents).toHaveBeenCalledWith(buildMockEvents([22]));
        expect(mockPubSubService.subscribeEvents).toHaveBeenCalledWith(buildMockEvents([22, 33]));

        expect(screen.getByTestId('event-33-refs')).toHaveTextContent('33:#details,#bet');

        // now lets move to the list
        // reset PUB_SUB
        mockPubSubService.unsubscribeEvents.mockReset();
        mockPubSubService.subscribeEvents.mockReset();

        // 5. CLICK ON BACK TO LIST
        userEvent.click(await screen.findByText(/backTo list/));

        expect(mockPubSubService.unsubscribeEvents).not.toHaveBeenCalled();
        expect(mockPubSubService.subscribeEvents).toHaveBeenCalledWith(mockEvents);

        expect(subscriptionCount).toHaveTextContent(`${mockEvents.length}`);
        expect(screen.getByTestId('event-22-refs').textContent).toEqual('22:#bet,#list');
        expect(screen.getByTestId('event-33-refs').textContent).toEqual('33:#bet,#list');

        // 6. HIDE THE LIST
        userEvent.click(await screen.findByText(/show list/));

        expect(subscriptionCount).toHaveTextContent(`2`);
        expect(screen.getByTestId('event-22-refs').textContent).toEqual('22:#bet');
        expect(screen.getByTestId('event-33-refs').textContent).toEqual('33:#bet');

        mockPubSubService.unsubscribeEvents.mockReset();
        mockPubSubService.subscribeEvents.mockReset();

        // 7. REMOVE BET#0 (EVENT#22)
        userEvent.click(await screen.findByTestId(`remove-bet-0`));
        // rerender 1. unsubscribe all (#22,#33)
        // rerender 2. subscribe remained  (#33)
        expect(mockPubSubService.unsubscribeEvents).toHaveBeenCalledWith([
            buildMockEvent(SECOND_EVENT_ID),
            buildMockEvent(THIRD_EVENT_ID),
        ]);
        expect(mockPubSubService.subscribeEvents).toHaveBeenCalledWith([buildMockEvent(THIRD_EVENT_ID)]);
        expect(subscriptionCount).toHaveTextContent(`1`);

        // 8. REMOVE BET#1 (EVENT#33)
        userEvent.click(await screen.findByTestId(`remove-bet-1`));

        expect(mockPubSubService.unsubscribeEvents).toHaveBeenCalledWith([buildMockEvent(THIRD_EVENT_ID)]);
        expect(subscriptionCount).toHaveTextContent(`0`);
    });
});
