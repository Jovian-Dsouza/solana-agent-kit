import { INodeProperties } from 'n8n-workflow';

/**
 * Node property definitions separated by concern
 */
export class NodeProperties {
	/**
	 * Main operation selector
	 */
	static getOperationProperty(): INodeProperties {
		return {
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Close Empty Token Accounts',
					value: 'closeEmptyTokenAccounts',
					action: 'Close empty token accounts',
				},
				{
					name: 'Create Token',
					value: 'createToken',
					action: 'Create a new token',
				},
				{
					name: 'Get Network TPS',
					value: 'getTPS',
					action: 'Get network TPS',
				},
				{
					name: 'Get Other Wallet Balance',
					value: 'getOtherBalance',
					action: 'Get other wallet balance',
				},
				{
					name: 'Get Single Token Balance',
					value: 'getSingleBalance',
					action: 'Get single token balance',
				},
				{
					name: 'Get Token Balances',
					value: 'getTokenBalances',
					action: 'Get token balances',
				},
				{
					name: 'Get Wallet Address',
					value: 'getWalletAddress',
					action: 'Get wallet address',
				},
				{
					name: 'Request Faucet Funds',
					value: 'requestFaucet',
					action: 'Request faucet funds',
				},
				{
					name: 'Transfer Token',
					value: 'transferToken',
					action: 'Transfer tokens',
				},
			],
			default: 'getWalletAddress',
		};
	}

	/**
	 * Token creation properties
	 */
	static getTokenCreationProperties(): INodeProperties[] {
		return [
			{
				displayName: 'Token Name',
				name: 'tokenName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['createToken'],
					},
				},
				default: '',
				description: 'Name of the token to create',
			},
			{
				displayName: 'Token Symbol',
				name: 'tokenSymbol',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['createToken'],
					},
				},
				default: '',
				description: 'Symbol of the token to create',
			},
			{
				displayName: 'Decimals',
				name: 'decimals',
				type: 'number',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						operation: ['createToken'],
					},
				},
				default: 9,
				description: 'Number of decimal places for the token',
			},
			{
				displayName: 'Initial Supply',
				name: 'initialSupply',
				type: 'number',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						operation: ['createToken'],
					},
				},
				default: 0,
				description: 'Initial supply of tokens to mint',
			},
		];
	}

	/**
	 * Transfer operation properties
	 */
	static getTransferProperties(): INodeProperties[] {
		return [
			{
				displayName: 'Recipient Address',
				name: 'recipientAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['transferToken'],
					},
				},
				default: '',
				description: 'Recipient wallet address',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['transferToken'],
					},
				},
				default: 0,
				description: 'Amount to transfer',
			},
			{
				displayName: 'Token Address',
				name: 'tokenAddress',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['transferToken', 'getSingleBalance'],
					},
				},
				default: '',
				description: 'SPL token address (leave empty for SOL)',
			},
		];
	}

	/**
	 * Balance operation properties
	 */
	static getBalanceProperties(): INodeProperties[] {
		return [
			{
				displayName: 'Wallet Address',
				name: 'walletAddress',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						operation: ['getTokenBalances', 'getOtherBalance'],
					},
				},
				default: '',
				description: 'Wallet address to check balances for (leave empty for own wallet)',
			},
			{
				displayName: 'Token Address for Other Wallet',
				name: 'otherTokenAddress',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						operation: ['getOtherBalance'],
					},
				},
				default: '',
				description: 'Token address to check balance for (leave empty for SOL)',
			},
		];
	}

	/**
	 * Get all properties combined
	 */
	static getAllProperties(): INodeProperties[] {
		return [
			this.getOperationProperty(),
			...this.getTokenCreationProperties(),
			...this.getTransferProperties(),
			...this.getBalanceProperties(),
		];
	}
}