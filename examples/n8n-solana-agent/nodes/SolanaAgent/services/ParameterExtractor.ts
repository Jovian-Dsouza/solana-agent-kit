import { IExecuteFunctions } from 'n8n-workflow';
import {
	BaseOperationParams,
	CreateTokenParams,
	TransferTokenParams,
	BalanceParams,
	OtherBalanceParams,
} from '../types';

/**
 * Service for extracting and mapping n8n parameters to operation parameters
 */
export class ParameterExtractor {
	/**
	 * Extracts parameters for create token operation
	 */
	static extractCreateTokenParams(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): CreateTokenParams {
		return {
			operation: 'createToken',
			tokenName: executeFunctions.getNodeParameter('tokenName', itemIndex) as string,
			tokenSymbol: executeFunctions.getNodeParameter('tokenSymbol', itemIndex) as string,
			decimals: executeFunctions.getNodeParameter('decimals', itemIndex) as number,
			initialSupply: executeFunctions.getNodeParameter('initialSupply', itemIndex) as number,
		};
	}

	/**
	 * Extracts parameters for transfer token operation
	 */
	static extractTransferTokenParams(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): TransferTokenParams {
		return {
			operation: 'transferToken',
			recipientAddress: executeFunctions.getNodeParameter('recipientAddress', itemIndex) as string,
			amount: executeFunctions.getNodeParameter('amount', itemIndex) as number,
			tokenAddress: executeFunctions.getNodeParameter('tokenAddress', itemIndex) as string,
		};
	}

	/**
	 * Extracts parameters for balance operations
	 */
	static extractBalanceParams(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): BalanceParams {
		return {
			operation: 'getTokenBalances',
			walletAddress: executeFunctions.getNodeParameter('walletAddress', itemIndex) as string,
			tokenAddress: executeFunctions.getNodeParameter('tokenAddress', itemIndex) as string,
		};
	}

	/**
	 * Extracts parameters for other wallet balance operation
	 */
	static extractOtherBalanceParams(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): OtherBalanceParams {
		return {
			operation: 'getOtherBalance',
			walletAddress: executeFunctions.getNodeParameter('walletAddress', itemIndex) as string,
			otherTokenAddress: executeFunctions.getNodeParameter('otherTokenAddress', itemIndex) as string,
		};
	}

	/**
	 * Extracts base parameters for simple operations
	 */
	static extractBaseParams(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		operation: string,
	): BaseOperationParams {
		return {
			operation,
		};
	}

	/**
	 * Factory method to extract parameters based on operation type
	 */
	static extractParameters(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		operation: string,
	): BaseOperationParams {
		switch (operation) {
			case 'createToken':
				return this.extractCreateTokenParams(executeFunctions, itemIndex);
			case 'transferToken':
				return this.extractTransferTokenParams(executeFunctions, itemIndex);
			case 'getTokenBalances':
			case 'getSingleBalance':
				return this.extractBalanceParams(executeFunctions, itemIndex);
			case 'getOtherBalance':
				return this.extractOtherBalanceParams(executeFunctions, itemIndex);
			default:
				return this.extractBaseParams(executeFunctions, itemIndex, operation);
		}
	}
}