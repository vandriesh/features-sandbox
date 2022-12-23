import React, { useState } from 'react';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '@testing-library/react';
import { fetch } from 'cross-fetch';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { Freebet, FreebetsProvider } from '@features/feature-freebets';
import { MockContent } from '../test/MockPubSubApp';
import map from 'lodash/map';
import isNull from 'lodash/isNull';
import join from 'lodash/join';
import values from 'lodash/values';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import startsWith from 'lodash/startsWith';
import get from 'lodash/get';

import { PubSubService } from '../PubSubService';
import { PubSubEntity, PubSubToWebSocketsProvider } from '../pub-sub-ws';


const CASINO_URL = 'http://myownthemeparkwithblackjack/bet';

const firstFreebetMock = {
    id: 1286,
    amount: 5000,
    promotionId: '1111',
    friendlyDescription:
        'You can use this Free Bet on any Football market with odds above 1.8. Only single bets are eligible.',
    expiryDate: '2029-10-10T00:00:00.000Z',
};
const secondFreebet = {
    id: 1287,
    amount: 10000,
    promotionId: '1112',
    friendlyDescription:
        'You can use this Free Bet on any Football market with odds above 1.8. Only single bets are eligible.',
    expiryDate: '2024-10-10T00:00:00.000Z',
};
const bonusCreditsMock: Freebet[] = [
    firstFreebetMock,
    secondFreebet,
    {
        id: 1288,
        amount: 20000,
        promotionId: '1113',
        friendlyDescription:
            'You can use this Free Bet on any Football market with odds above 1.8. Only single bets are eligible.',
        expiryDate: '2023-10-10T00:00:00.000Z',
    },
];

const NO_FREEBETS_USED = `You could've used the freebets, instead of your {amount} money`;
const BET_RECEIVED = `Bet received.`;
const server = setupServer(
    rest.post(CASINO_URL, async (req: any, res, ctx) => {
        const data: Record<string, string> = {};

        forEach(req.body, (value, key) => {
            if (!isEmpty(value)) {
                data[key] = value;
            }
        });

        if (isEmpty(data)) {
            return res(ctx.status(400), ctx.json({ message: 'NO_BETS_AT_ALL' }));
        }

        const bets: Record<string, string> = {};
        const freebets: Record<string, string> = {};

        forEach(data, (value, key) => {
            if (startsWith(key, 'bet-')) {
                bets[key] = value;
            }
            if (startsWith(key, 'freebet-')) {
                freebets[key] = value;
            }
        });

        if (isEmpty(freebets)) {
            const stakes = values(bets);
            return res(ctx.json({ message: NO_FREEBETS_USED.replace('{amount}', join(stakes, ',')) }));
        }

        const [freebetId] = values(freebets);
        const freebet = find(bonusCreditsMock, { id: +freebetId });

        return res(ctx.json({ message: `${freebet?.amount} ${BET_RECEIVED}` }));
        // return res(ctx.json({ message: `oops` }));
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const fromFormToJson = (form: HTMLFormElement) => {
    let formData = new FormData();

    if (!isNull(form)) {
        formData = new FormData(form);
    }

    const object: Record<string, string> = {};
    formData.forEach(function (value: any, key: string) {
        object[key] = value;
    });
    return JSON.stringify(object);
};
const ShutUpAndTakeMyMoney = () => {
    //const { state } = useFreebets();
    const headers = new Headers();
    const [message, setMessage] = useState<string>();
    const [error, setError] = useState<string>();

    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    const takeMyChance = async () => {
        //const freebets = get(state, 'appliedFreebets');

        const form = document.querySelector<HTMLFormElement>('form');
        let body = ''; //let formData = new FormData();

        if (!isNull(form)) {
            body = fromFormToJson(form); //JSON.stringify(object);
            //formData = new FormData(form);
        }

        /*  const object: Record<string, string> = {};
          formData.forEach(function (value: any, key: string) {
              object[key] = value;
          });

          //const body = JSON.stringify({ freebets });*/

        try {
            setMessage('start fetching');
            const response = await fetch(CASINO_URL, {
                method: 'POST',
                headers,
                body,
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (e: unknown) {
            setError(get(e, 'message', 'unknown errors'));
        }
    };

    const repeat = () => setMessage('');

    if (error) {
        return (
            <>
                <div data-testid="bet-response"> Oops, I did it again {error}</div>
                <button onClick={repeat}>Again</button>
            </>
        );
    }

    if (message) {
        return (
            <>
                <div data-testid="bet-response">{message}</div>
                <button onClick={repeat}>Again</button>
            </>
        );
    }

    return <button onClick={takeMyChance}>I'm feeling lucky!</button>;
};
const eventIds = [11, 22, 33];

const MockAppWithFreebets = ({ freeBets }: any) => {
    const mockEvents = map(eventIds, (id: number) => ({ id, name: `Event ${id}` }));

    const pubSubService: PubSubService<PubSubEntity> = {
        subscribeEvents(events: PubSubEntity[]) {},
        unsubscribeEvents(events: PubSubEntity[]) {},
    };

    return (
        <FreebetsProvider freebets={freeBets}>
            <PubSubToWebSocketsProvider pubSubService={pubSubService}>
                <MockContent fooParam={mockEvents} />
                {/*
                <AvailableFreebetsDevMonitor />
*/}
                <ShutUpAndTakeMyMoney />
            </PubSubToWebSocketsProvider>
        </FreebetsProvider>
    );
};

const scenarios = {
    checkAllFreebetsAreDisplayed: (betIndex: number) => {
        const firstFreebetWrapper = screen.getByTestId(`bet-${betIndex}`);
        const freebetsElement = within(firstFreebetWrapper).getByRole('combobox');

        expect(freebetsElement).toHaveTextContent(
            map(bonusCreditsMock, ({ amount, friendlyDescription }) => `${amount} | ${friendlyDescription}`).join(''),
        );
    },
    submitBetslip: async () => {
        await userEvent.click(await screen.findByText(/I'm feeling lucky!/));
    },
    trySubmitBetslipAgain: async () => {
        await userEvent.click(await screen.findByText(/again/i));
    },
    serverResponseIs: async (response: string) => {
        expect(await screen.findByTestId('bet-response')).toHaveTextContent(response);
    },
    makeSureServerReceivedABet: async (amount: number) => {
        expect(await screen.findByTestId('bet-response')).toHaveTextContent(`${amount} ${BET_RECEIVED}`);
    },
    makeSureServerDidNotReceivedFreebetsStake: async (amount: number) => {
        expect(await screen.findByTestId('bet-response')).toHaveTextContent(
            NO_FREEBETS_USED.replace('{amount}', `${amount}`),
        );
    },
    insertSelection: async (eventId: string) => {
        await userEvent.click(screen.getByTestId(`list-event-${eventId}-bet`));
    },
    toggleFreebet: async (betIndex: number) => {
        const firstBetWrapper = screen.getByTestId(`bet-${betIndex}`);
        const firstFreebetDOMElement = within(firstBetWrapper).getByRole('checkbox');

        await userEvent.click(firstFreebetDOMElement);
    },
    stakeIsNotEditable: async (betIndex: number) => {
        const firstBetWrapper = screen.getByTestId(`bet-${betIndex}`);
        const stake = within(firstBetWrapper).getByRole('textbox');

        await expect(stake).toHaveAttribute(`readonly`, '');
    },
    stakeIs: async (betIndex: number, amount: number) => {
        const firstBetWrapper = screen.getByTestId(`bet-${betIndex}`);
        const stake = within(firstBetWrapper).getByRole('textbox');

        await expect(stake).toHaveValue(`${amount || ''}`);
    },
    stakeIsEmpty: async (betIndex: number) => {
        const firstBetWrapper = screen.getByTestId(`bet-${betIndex}`);
        const stake = within(firstBetWrapper).getByRole('textbox');

        await expect(stake).toHaveValue(``);
    },
    enterStake: async (betIndex: number, amout: number) => {
        const firstBetWrapper = screen.getByTestId(`bet-${betIndex}`);
        const stake = within(firstBetWrapper).getByRole('textbox');

        await userEvent.type(stake, `${amout}`);
    },
    stakeIsEditable: async (betIndex: number) => {
        const firstBetWrapper = screen.getByTestId(`bet-${betIndex}`);
        const stake = within(firstBetWrapper).getByRole('textbox');

        await expect(stake).not.toHaveAttribute(`readonly`);
    },
};
describe('FreeBets', () => {
    it('should bet with freebets', async () => {
        render(<MockAppWithFreebets freeBets={bonusCreditsMock} />);

        await scenarios.insertSelection('11');
        await scenarios.insertSelection('22');
        await scenarios.insertSelection('33');

        expect(screen.getByTestId('betslip-heading')).toHaveTextContent('MyBets (3)');

        const elements = screen.queryAllByText(/freebet \$/i);
        expect(elements.length).toBe(3);

        await scenarios.enterStake(0, 1000);
        await scenarios.submitBetslip();
        await scenarios.makeSureServerDidNotReceivedFreebetsStake(1000);

        await scenarios.trySubmitBetslipAgain();
        await scenarios.toggleFreebet(0);
        await scenarios.submitBetslip();
        await scenarios.makeSureServerReceivedABet(firstFreebetMock.amount);
    });

    it.todo('AC#1 Customer has one valid freebet token');
    it.todo('AC#2 Customer has a non-eligible freebet token');
    it('AC#3 Customer has more valid freebet tokens', async () => {
        // Given I am a customer
        // And I have logged into BetEast Sportsbook
        render(<MockAppWithFreebets freeBets={bonusCreditsMock} />);
        // And I have available Freebet Tokens
        // And I insert a selection in betslip
        await userEvent.click(screen.getByTestId('list-event-11-bet'));
        // And the selection is eligible for all available freebet token’s eligibility conditions
        // And I investigate the betslip
        // When I click on down arrow next to the Freebet Token Label
        // Then all available freebets are displayedAnd all amounts are visible
        await scenarios.checkAllFreebetsAreDisplayed(0);
        // And friendly description is show for each individual Freebet Token
    });

    it('AC#4 Customer selects freebet token as stake', async () => {
        const betIndex = 0;
        render(<MockAppWithFreebets freeBets={bonusCreditsMock} />);
        await scenarios.insertSelection('11');
        await scenarios.stakeIsEditable(betIndex);
        await scenarios.stakeIsEmpty(betIndex);
        await scenarios.toggleFreebet(betIndex);
        await scenarios.stakeIs(betIndex, firstFreebetMock.amount);
        await scenarios.stakeIsNotEditable(betIndex);
        await scenarios.submitBetslip();
        await scenarios.makeSureServerReceivedABet(firstFreebetMock.amount);
    });

    it.todo('AC#5 Stake Field not editable after inserting Freebet Token as stake');
    it('AC#6 Un-ticking the freebet token checkbox will remove the freebet token amount from stake field', async () => {
        render(<MockAppWithFreebets freeBets={bonusCreditsMock} />);
        const betIndex = 0;
        await scenarios.insertSelection('11');
        await scenarios.toggleFreebet(betIndex);
        await scenarios.stakeIsNotEditable(betIndex);
        await scenarios.stakeIs(betIndex, firstFreebetMock.amount);
        await scenarios.toggleFreebet(betIndex);
        await scenarios.stakeIsEditable(betIndex);
    });

    it.todo('AC#7 Freebet Token is automatically ticked when selected from the dropdown list');
    it.todo(
        'AC#8 Selecting a freebet token for a selection that already has an amount in stake field' +
            ', will automatically overwrite the cash stake',
    );
    it.todo('AC#9 Stake Buttons are hidden if all selections have freebet as stake');
});