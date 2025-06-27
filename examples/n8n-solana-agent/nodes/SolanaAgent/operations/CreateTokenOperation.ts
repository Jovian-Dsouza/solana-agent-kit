import { SolanaAgentKit } from 'solana-agent-kit';
import { CreateTokenParams } from '../types';
import { ValidationUtils } from '../utils/validation';
import { BaseOperation } from './BaseOperation';

/**
 * Handles token creation operations
 */
export class CreateTokenOperation extends BaseOperation<CreateTokenParams> {
	validate(params: CreateTokenParams): void {
		ValidationUtils.validateTokenCreation(params.tokenName, params.tokenSymbol);
		
		if (params.decimals < 0 || params.decimals > 9) {
			throw new Error('Decimals must be between 0 and 9');
		}
		
		if (params.initialSupply < 0) {
			throw new Error('Initial supply cannot be negative');
		}
	}

	async execute(params: CreateTokenParams, agent: SolanaAgentKit): Promise<any> {
		//TODO test this
		return await (agent as any).deployToken({
			name: params.tokenName.trim(),
			symbol: params.tokenSymbol.trim(),
			decimals: params.decimals,
			initialSupply: params.initialSupply,
		});
	}
}