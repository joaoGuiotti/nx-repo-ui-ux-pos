import { Observable } from 'rxjs';
import { Speaker } from '../entities/speaker.entity';

/**
 * Port contract for CFP operations.
 *
 * @guardrail Defined as an abstract class for ergonomic Angular Dependency Injection.
 * Decoupled from concrete implementation (HTTP, InMemory, etc.).
 */
export abstract class CfpRepository {
  abstract submitProposal(speaker: Speaker): Observable<Speaker>;
}
