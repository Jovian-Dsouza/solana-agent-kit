import { Keypair, PublicKey } from '@solana/web3.js';
import { KeypairWallet, SolanaAgentKit } from 'solana-agent-kit';
import TokenPlugin from '@solana-agent-kit/plugin-token';
import bs58 from 'bs58';
import { ApplicationError } from 'n8n-workflow';
import { SolanaAgentConfig } from '../types';

/**
 * Utility functions for Solana operations
 */
export class SolanaUtils {
	/**
	 * Creates a Keypair from a base58-encoded private key string
	 */
	static createKeypairFromPrivateKey(privateKeyString: string): Keypair {
		try {
			return Keypair.fromSecretKey(bs58.decode(privateKeyString));
		} catch (error) {
			throw new ApplicationError(
				`Invalid private key format: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	/**
	 * Initializes Solana Agent Kit with configuration
	 */
	static async initializeAgent(config: SolanaAgentConfig): Promise<SolanaAgentKit> {
		try {
			const wallet = new KeypairWallet(
				this.createKeypairFromPrivateKey(config.privateKey),
				config.rpcUrl,
			);

			const agent = new SolanaAgentKit(
				wallet,
				config.rpcUrl,
				{ OPENAI_API_KEY: config.openAiApiKey },
			).use(TokenPlugin);

			return agent;
		} catch (error) {
			throw new ApplicationError(
				`Failed to initialize Solana Agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	}

	/**
	 * Safely creates a PublicKey from a string address
	 */
	static createPublicKeyFromString(address: string): PublicKey | undefined {
		if (!address || address.trim() === '') {
			return undefined;
		}
		try {
			return new PublicKey(address.trim());
		} catch (error) {
			throw new ApplicationError(`Invalid public key format: ${address}`);
		}
	}
}