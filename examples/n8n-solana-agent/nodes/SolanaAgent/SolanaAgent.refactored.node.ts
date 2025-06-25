import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { SolanaAgentConfig, OperationResult } from './types';
import { SolanaUtils } from './utils/solana';
import { OperationFactory } from './operations/OperationFactory';
import { ParameterExtractor } from './services/ParameterExtractor';
import { NodeProperties } from './config/nodeProperties';

/**
 * n8n node for Solana Agent Kit integration
 * Provides blockchain operations for Solana including token management,
 * transfers, balance checking, and network utilities
 */
class SolanaAgentRefactored implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Solana Token Agent',
		name: 'solanaAgent',
		icon: 'file:solana.svg',
		group: ['blockchain'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Solana tokens using AI',
		defaults: {
			name: 'Solana Token Agent',
		},
		inputs: ["main" as any],
		outputs: ["main" as any],
		credentials: [
			{
				name: 'solanaApi',
				required: true,
			},
		],
		properties: NodeProperties.getAllProperties(),
	};

	/**
	 * Validates and extracts credentials
	 */
	private async getValidatedCredentials(executeFunctions: IExecuteFunctions): Promise<SolanaAgentConfig> {
		const credentials = await executeFunctions.getCredentials('solanaApi');

		if (!credentials.privateKey || !credentials.rpcUrl || !credentials.openAiApiKey) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Missing required credentials. Please ensure Private Key, RPC URL, and OpenAI API Key are provided.',
			);
		}

		return {
			privateKey: credentials.privateKey as string,
			rpcUrl: credentials.rpcUrl as string,
			openAiApiKey: credentials.openAiApiKey as string,
		};
	}

	/**
	 * Processes a single operation
	 */
	private async processOperation(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
		operation: string,
		agent: any,
	): Promise<OperationResult> {
		try {
			// Extract parameters based on operation type
			const params = ParameterExtractor.extractParameters(executeFunctions, itemIndex, operation);

			// Get operation handler
			const operationHandler = OperationFactory.createOperation(operation);

			// Execute operation
			const result = await operationHandler.execute(params, agent);

			return {
				operation,
				success: true,
				result,
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

			return {
				operation,
				success: false,
				error: errorMessage,
			};
		}
	}

	/**
	 * Main execution method
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const self = this as unknown as SolanaAgentRefactored;
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		// Validate operation is supported
		if (!OperationFactory.isOperationSupported(operation)) {
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not supported!`,
			);
		}

		// Get and validate credentials
		const config = await self.getValidatedCredentials(this);

		// Initialize Solana Agent
		const agent = await SolanaUtils.initializeAgent(config);

		// Process each input item
		for (let i = 0; i < items.length; i++) {
			const operationResult = await self.processOperation(this, i, operation, agent);

			if (!operationResult.success && !this.continueOnFail()) {
				throw new NodeOperationError(
					this.getNode(),
					`Failed to execute ${operation}: ${operationResult.error}`,
				);
			}

			returnData.push({
				json: operationResult,
			});
		}

		return [returnData];
	}
}

// Export the class
export { SolanaAgentRefactored };