import { IAllEvents } from './allEvents.interface';

export interface IFavoriteEvents extends Omit<IAllEvents, 'transcript'> {}
