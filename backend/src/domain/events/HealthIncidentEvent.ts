import { DomainEvent } from './DomainEvent';

export class HealthIncidentEvent extends DomainEvent {
  constructor(
    public readonly diagnosis: string,
    public readonly severity: string,
    public readonly payload: string,
    public readonly justification: string
  ) {
    super();
  }
}
