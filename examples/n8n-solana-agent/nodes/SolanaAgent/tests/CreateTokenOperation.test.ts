import { CreateTokenOperation } from '../operations/CreateTokenOperation';
import { CreateTokenParams } from '../types';

/**
 * Example test file demonstrating how the modular structure improves testability
 * This would typically use a testing framework like Jest
 */

describe('CreateTokenOperation', () => {
	let operation: CreateTokenOperation;

	beforeEach(() => {
		operation = new CreateTokenOperation();
	});

	describe('validate', () => {
		it('should pass validation with valid parameters', () => {
			const params: CreateTokenParams = {
				operation: 'createToken',
				tokenName: 'Test Token',
				tokenSymbol: 'TEST',
				decimals: 9,
				initialSupply: 1000,
			};

			expect(() => operation.validate(params)).not.toThrow();
		});

		it('should throw error for empty token name', () => {
			const params: CreateTokenParams = {
				operation: 'createToken',
				tokenName: '',
				tokenSymbol: 'TEST',
				decimals: 9,
				initialSupply: 1000,
			};

			expect(() => operation.validate(params)).toThrow('Token name is required');
		});

		it('should throw error for empty token symbol', () => {
			const params: CreateTokenParams = {
				operation: 'createToken',
				tokenName: 'Test Token',
				tokenSymbol: '',
				decimals: 9,
				initialSupply: 1000,
			};

			expect(() => operation.validate(params)).toThrow('Token symbol is required');
		});

		it('should throw error for invalid decimals', () => {
			const params: CreateTokenParams = {
				operation: 'createToken',
				tokenName: 'Test Token',
				tokenSymbol: 'TEST',
				decimals: 15, // Invalid: too high
				initialSupply: 1000,
			};

			expect(() => operation.validate(params)).toThrow('Decimals must be between 0 and 9');
		});

		it('should throw error for negative initial supply', () => {
			const params: CreateTokenParams = {
				operation: 'createToken',
				tokenName: 'Test Token',
				tokenSymbol: 'TEST',
				decimals: 9,
				initialSupply: -100, // Invalid: negative
			};

			expect(() => operation.validate(params)).toThrow('Initial supply cannot be negative');
		});
	});

	describe('execute', () => {
		it('should call agent.deployToken with correct parameters', async () => {
			const mockAgent = {
				deployToken: jest.fn().mockResolvedValue({ mint: 'mock-mint-address' }),
			};

			const params: CreateTokenParams = {
				operation: 'createToken',
				tokenName: '  Test Token  ', // With whitespace
				tokenSymbol: '  TEST  ', // With whitespace
				decimals: 9,
				initialSupply: 1000,
			};

			const result = await operation.execute(params, mockAgent as any);

			expect(mockAgent.deployToken).toHaveBeenCalledWith({
				name: 'Test Token', // Trimmed
				symbol: 'TEST', // Trimmed
				decimals: 9,
				initialSupply: 1000,
			});

			expect(result).toEqual({ mint: 'mock-mint-address' });
		});
	});
});