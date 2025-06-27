import { SolanaAgentKit } from 'solana-agent-kit';
import { BaseOperationParams, SolanaAgentKitWithTokenPlugin } from '../../types';
import { BaseOperation } from '../BaseOperation';

/**
 * Handles closing empty token accounts
 */
export class CloseEmptyTokenAccountsOperation extends BaseOperation<BaseOperationParams> {
	validate(params: BaseOperationParams): void {
		// No specific validation needed for this operation
	}

	async execute(params: BaseOperationParams, agent: SolanaAgentKit): Promise<any> {
		return await (agent as any as SolanaAgentKitWithTokenPlugin).methods.closeEmptyTokenAccounts(agent);
	}
}

/**
 * Handles requesting faucet funds
 */
export class RequestFaucetOperation extends BaseOperation<BaseOperationParams> {
	validate(params: BaseOperationParams): void {
		// No specific validation needed for this operation
	}

	async execute(params: BaseOperationParams, agent: SolanaAgentKit): Promise<any> {
		return await (agent as any as SolanaAgentKitWithTokenPlugin).methods.request_faucet_funds(agent);
	}
}

/**
 * Handles getting network TPS
 */
export class GetTPSOperation extends BaseOperation<BaseOperationParams> {
	validate(params: BaseOperationParams): void {
		// No specific validation needed for this operation
	}

	async execute(params: BaseOperationParams, agent: SolanaAgentKit): Promise<any> {
		return await (agent as any as SolanaAgentKitWithTokenPlugin).methods.getTPS(agent);
	}
}

/**
 * Handles getting wallet address
 */
export class GetWalletAddressOperation extends BaseOperation<BaseOperationParams> {
	validate(params: BaseOperationParams): void {
		// No specific validation needed for this operation
	}

	async execute(params: BaseOperationParams, agent: SolanaAgentKit): Promise<any> {
		return (agent.wallet.publicKey as any).toString();
	}
}