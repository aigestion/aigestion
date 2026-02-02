import type { IEvent } from './DomainEvent';

export interface IEventHandler<T extends IEvent> {
  handle(event: T): Promise<void>;
}
