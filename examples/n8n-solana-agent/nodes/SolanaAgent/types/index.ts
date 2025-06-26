import type { SolanaAgentKit } from 'solana-agent-kit';
import TokenPlugin from '@solana-agent-kit/plugin-token';

export type SolanaAgentKitWithTokenPlugin = SolanaAgentKit<typeof TokenPlugin["methods"]>;
/**
 * Base interface for all operation parameters
 */
export interface BaseOperationParams {
	operation: string;
}

/**
 * Parameters for token creation
 */
export interface CreateTokenParams extends BaseOperationParams {
	tokenName: string;
	tokenSymbol: string;
	decimals: number;
	initialSupply: number;
}

/**
 * Parameters for token transfer
 */
export interface TransferTokenParams extends BaseOperationParams {
	recipientAddress: string;
	amount: number;
	tokenAddress?: string;
}

/**
 * Parameters for balance operations
 */
export interface BalanceParams extends BaseOperationParams {
	walletAddress?: string;
	tokenAddress?: string;
}

/**
 * Parameters for other wallet balance check
 */
export interface OtherBalanceParams extends BaseOperationParams {
	walletAddress: string;
	otherTokenAddress?: string;
}

/**
 * Standard operation result structure
 */
export interface OperationResult {
  [key: string]: any;
	operation: string;
	success: boolean;
	result?: any;
	error?: string;
}

/**
 * Solana Agent configuration
 */
export interface SolanaAgentConfig {
	privateKey: string;
	rpcUrl: string;
	openAiApiKey: string;
}

/**
 * Operation handler interface
 */
export interface OperationHandler<T extends BaseOperationParams> {
	validate(params: T): void;
	execute(params: T, agent: any): Promise<any>;
}