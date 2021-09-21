import { MockEvent } from './MockEvent';
import map from 'lodash/map';

export const buildMockEvent = (id: number):MockEvent => ({ id, name: `Event ${ id }` })
export const buildMockEvents = (ids:number[]):MockEvent[] => map(ids, buildMockEvent);
