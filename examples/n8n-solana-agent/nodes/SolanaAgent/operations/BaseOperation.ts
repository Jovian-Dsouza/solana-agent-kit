import { SolanaAgentKit } from 'solana-agent-kit';
import { BaseOperationParams, OperationHandler } from '../types';

/**
 * Abstract base class for all Solana operations
 */
export abstract class BaseOperation<T extends BaseOperationParams> implements OperationHandler<T> {
	/**
	 * Validates operation parameters
	 */
	abstract validate(params: T): void;

	/**
	 * Executes the operation
	 */
	abstract execute(params: T, agent: SolanaAgentKit): Promise<any>;

	/**
	 * Template method that validates and executes the operation
	 */
	async run(params: T, agent: SolanaAgentKit): Promise<any> {
		this.validate(params);
		return await this.execute(params, agent);
	}
}