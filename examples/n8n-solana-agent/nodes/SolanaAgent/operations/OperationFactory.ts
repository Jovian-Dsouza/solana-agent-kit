import { BaseOperationParams, OperationHandler } from '../types';
import { CreateTokenOperation } from './CreateTokenOperation';
import { TransferTokenOperation } from './TransferTokenOperation';
import {
	GetTokenBalancesOperation,
	GetSingleBalanceOperation,
	GetOtherBalanceOperation,
} from './BalanceOperations';
import {
	CloseEmptyTokenAccountsOperation,
	RequestFaucetOperation,
	GetTPSOperation,
	GetWalletAddressOperation,
} from './UtilityOperations';

/**
 * Factory for creating operation handlers
 */
export class OperationFactory {
	private static operations: Map<string, () => OperationHandler<BaseOperationParams>> = new Map<string, () => OperationHandler<BaseOperationParams>>([
		['createToken', () => new CreateTokenOperation()],
		['transferToken', () => new TransferTokenOperation()],
		['getTokenBalances', () => new GetTokenBalancesOperation()],
		['getSingleBalance', () => new GetSingleBalanceOperation()],
		['getOtherBalance', () => new GetOtherBalanceOperation()],
		['closeEmptyTokenAccounts', () => new CloseEmptyTokenAccountsOperation()],
		['requestFaucet', () => new RequestFaucetOperation()],
		['getTPS', () => new GetTPSOperation()],
		['getWalletAddress', () => new GetWalletAddressOperation()],
	]);

	/**
	 * Creates an operation handler for the given operation type
	 */
	static createOperation(operationType: string): OperationHandler<BaseOperationParams> {
		const operationFactory = this.operations.get(operationType);
		
		if (!operationFactory) {
			throw new Error(`Unsupported operation: ${operationType}`);
		}

		return operationFactory();
	}

	/**
	 * Gets all supported operation types
	 */
	static getSupportedOperations(): string[] {
		return Array.from(this.operations.keys());
	}

	/**
	 * Checks if an operation is supported
	 */
	static isOperationSupported(operationType: string): boolean {
		return this.operations.has(operationType);
	}
}