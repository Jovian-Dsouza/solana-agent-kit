import { SolanaAgentKit } from 'solana-agent-kit';
import { BalanceParams, OtherBalanceParams, SolanaAgentKitWithTokenPlugin } from '../../types';
import { ValidationUtils } from '../../utils/validation';
import { SolanaUtils } from '../../utils/solana';
import { BaseOperation } from '../BaseOperation';

/**
 * Handles getting all token balances for a wallet
 */
export class GetTokenBalancesOperation extends BaseOperation<BalanceParams> {
	validate(params: BalanceParams): void {
		// No specific validation needed for this operation
	}

	async execute(params: BalanceParams, agent: SolanaAgentKit): Promise<any> {
		if (!params.walletAddress) {
			throw new Error('walletAddress is required');
		}
		const walletPubkey = SolanaUtils.createPublicKeyFromString(params.walletAddress);
		return await (agent as any as SolanaAgentKitWithTokenPlugin).methods.get_token_balance(agent, walletPubkey);
	}
}

/**
 * Handles getting balance for a specific token
 */
export class GetBalanceOperation extends BaseOperation<BalanceParams> {
	validate(params: BalanceParams): void {
		// No specific validation needed for this operation
	}

	async execute(params: BalanceParams, agent: SolanaAgentKit): Promise<any> {
		if (!params.tokenAddress) {
			throw new Error('tokenAddress is required');
		}
		const mintAddress = SolanaUtils.createPublicKeyFromString(params.tokenAddress);
		return await (agent as any as SolanaAgentKitWithTokenPlugin).methods.get_balance(agent, mintAddress);
	}
}

/**
 * Handles getting balance for another wallet
 */
export class GetOtherBalanceOperation extends BaseOperation<OtherBalanceParams> {
	validate(params: OtherBalanceParams): void {
		ValidationUtils.validateRequiredString(params.walletAddress, 'Wallet address');
	}

	async execute(params: OtherBalanceParams, agent: SolanaAgentKit): Promise<any> {
		const walletAddress = ValidationUtils.validatePublicKey(
			params.walletAddress,
			'wallet address',
		);
		if (!params.otherTokenAddress) {
			throw new Error('otherTokenAddress is required');
		}
		const mintAddress = SolanaUtils.createPublicKeyFromString(params.otherTokenAddress);

		return await (agent as any as SolanaAgentKitWithTokenPlugin).methods.get_balance_other(agent, walletAddress, mintAddress);
	}
}