import { SolanaAgentKit } from 'solana-agent-kit';
import { TransferTokenParams } from '../types';
import { ValidationUtils } from '../utils/validation';
import { SolanaUtils } from '../utils/solana';
import { BaseOperation } from './BaseOperation';

/**
 * Handles token transfer operations
 */
export class TransferTokenOperation extends BaseOperation<TransferTokenParams> {
	validate(params: TransferTokenParams): void {
		ValidationUtils.validateTransfer(params.recipientAddress, params.amount);
	}

	async execute(params: TransferTokenParams, agent: SolanaAgentKit): Promise<any> {
		const recipientAddress = ValidationUtils.validatePublicKey(
			params.recipientAddress,
			'recipient address',
		);
		if (!params.tokenAddress) {
			throw new Error('tokenAddress is required');
		}
		const mintAddress = SolanaUtils.createPublicKeyFromString(params.tokenAddress);

		return await (agent as any).transfer(recipientAddress, params.amount, mintAddress);
	}
}