import { ApplicationError } from 'n8n-workflow';
import { PublicKey } from '@solana/web3.js';

/**
 * Validation utilities for Solana operations
 */
export class ValidationUtils {
	/**
	 * Validates that a string is not empty or whitespace
	 */
	static validateRequiredString(value: string, fieldName: string): void {
		if (!value || value.trim() === '') {
			throw new ApplicationError(`${fieldName} is required and cannot be empty`);
		}
	}

	/**
	 * Validates that a number is positive
	 */
	static validatePositiveNumber(value: number, fieldName: string): void {
		if (value <= 0) {
			throw new ApplicationError(`${fieldName} must be greater than 0`);
		}
	}

	/**
	 * Validates Solana public key format
	 */
	static validatePublicKey(address: string, fieldName: string): PublicKey {
		try {
			return new PublicKey(address.trim());
		} catch (error) {
			throw new ApplicationError(`Invalid ${fieldName} format: ${address}`);
		}
	}

	/**
	 * Safely creates a PublicKey from a string, returns undefined if empty
	 */
	static createOptionalPublicKey(address?: string): PublicKey | undefined {
		if (!address || address.trim() === '') {
			return undefined;
		}
		return this.validatePublicKey(address, 'address');
	}

	/**
	 * Validates token creation parameters
	 */
	static validateTokenCreation(name: string, symbol: string): void {
		this.validateRequiredString(name, 'Token name');
		this.validateRequiredString(symbol, 'Token symbol');
	}

	/**
	 * Validates transfer parameters
	 */
	static validateTransfer(recipientAddress: string, amount: number): PublicKey {
		this.validateRequiredString(recipientAddress, 'Recipient address');
		this.validatePositiveNumber(amount, 'Transfer amount');
		return this.validatePublicKey(recipientAddress, 'recipient address');
	}
}