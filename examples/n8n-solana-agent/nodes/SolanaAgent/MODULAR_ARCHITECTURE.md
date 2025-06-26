# Modular Architecture for Solana Agent Node

This document describes the modular architecture implemented for the Solana Agent n8n node.

## Architecture Overview

The codebase has been refactored to a modular, maintainable architecture following SOLID principles and separation of concerns.

## Directory Structure

```
nodes/SolanaAgent/
├── types/
│   └── index.ts                    # Type definitions and interfaces
├── utils/
│   ├── index.ts                    # Utility exports
│   ├── validation.ts               # Validation utilities
│   └── solana.ts                   # Solana-specific utilities
├── operations/
│   ├── index.ts                    # Operation exports
│   ├── BaseOperation.ts            # Abstract base class for operations
│   ├── CreateTokenOperation.ts     # Token creation logic
│   ├── TransferTokenOperation.ts   # Token transfer logic
│   ├── BalanceOperations.ts        # Balance checking operations
│   ├── UtilityOperations.ts        # Utility operations (TPS, faucet, etc.)
│   └── OperationFactory.ts         # Factory for creating operations
├── services/
│   └── ParameterExtractor.ts       # Service for extracting n8n parameters
├── config/
│   └── nodeProperties.ts           # n8n node property definitions
├── tests/
│   └── CreateTokenOperation.test.ts # Example test file
├── SolanaAgent.node.ts             # Original monolithic implementation
├── SolanaAgent.refactored.node.ts  # New modular implementation
└── MODULAR_ARCHITECTURE.md         # This file
```

## Key Benefits

### 1. **Separation of Concerns**
- **Types**: All interfaces and type definitions in one place
- **Validation**: Centralized validation logic
- **Operations**: Each operation is a separate, testable class
- **Configuration**: UI properties separated from business logic
- **Services**: Reusable services for common tasks

### 2. **Improved Testability**
- Each operation can be unit tested independently
- Mock dependencies easily
- Clear interfaces make testing straightforward
- Example test file provided

### 3. **Better Maintainability**
- Single Responsibility Principle: Each class has one job
- Open/Closed Principle: Easy to add new operations without modifying existing code
- Dependency Inversion: Operations depend on abstractions, not concretions

### 4. **Enhanced Extensibility**
- Adding new operations is simple: create new operation class and register in factory
- Easy to modify validation rules per operation
- Clear extension points for new functionality

### 5. **Code Reusability**
- Validation utilities can be reused across operations
- Base operation class provides common functionality
- Solana utilities can be used by any operation

## Core Components

### BaseOperation Abstract Class
```typescript
abstract class BaseOperation<T extends BaseOperationParams> {
    abstract validate(params: T): void;
    abstract execute(params: T, agent: SolanaAgentKit): Promise<any>;
    async run(params: T, agent: SolanaAgentKit): Promise<any>;
}
```

### Operation Factory Pattern
```typescript
class OperationFactory {
    static createOperation(operationType: string): OperationHandler<BaseOperationParams>;
    static getSupportedOperations(): string[];
    static isOperationSupported(operationType: string): boolean;
}
```

### Validation Utilities
```typescript
class ValidationUtils {
    static validateRequiredString(value: string, fieldName: string): void;
    static validatePositiveNumber(value: number, fieldName: string): void;
    static validatePublicKey(address: string, fieldName: string): PublicKey;
    // ... more validation methods
}
```

## Usage Examples

### Adding a New Operation

1. **Create the operation class:**
```typescript
// operations/NewOperation.ts
export class NewOperation extends BaseOperation<NewOperationParams> {
    validate(params: NewOperationParams): void {
        // Validation logic
    }

    async execute(params: NewOperationParams, agent: SolanaAgentKit): Promise<any> {
        // Execution logic
    }
}
```

2. **Register in factory:**
```typescript
// operations/OperationFactory.ts
private static operations: Map<string, () => OperationHandler<any>> = new Map([
    // ... existing operations
    ['newOperation', () => new NewOperation()],
]);
```

3. **Add UI properties:**
```typescript
// config/nodeProperties.ts
// Add to options array and create specific properties
```

### Testing an Operation

```typescript
describe('NewOperation', () => {
    let operation: NewOperation;

    beforeEach(() => {
        operation = new NewOperation();
    });

    it('should validate parameters correctly', () => {
        const params = { /* test params */ };
        expect(() => operation.validate(params)).not.toThrow();
    });

    it('should execute operation correctly', async () => {
        const mockAgent = { /* mock methods */ };
        const params = { /* test params */ };
        const result = await operation.execute(params, mockAgent);
        expect(result).toEqual(/* expected result */);
    });
});
```

## Migration Strategy

To migrate from the monolithic to modular structure:

1. **Phase 1**: Create modular structure alongside existing code
2. **Phase 2**: Implement and test new operations using modular approach
3. **Phase 3**: Gradually migrate existing operations
4. **Phase 4**: Replace main node file with refactored version
5. **Phase 5**: Remove old monolithic code

## Performance Considerations

- **Factory Pattern**: Minimal overhead, operations created on-demand
- **Validation**: Early validation prevents unnecessary processing
- **Memory**: Each operation instance is lightweight
- **Caching**: Agent initialization cached per execution

## Future Enhancements

1. **Plugin System**: Allow external operation plugins
2. **Configuration Validation**: Schema-based parameter validation
3. **Async Operations**: Support for long-running operations
4. **Batch Processing**: Process multiple operations in parallel
5. **Metrics**: Add operation timing and success metrics

## Conclusion

This modular architecture provides a solid foundation for maintaining and extending the Solana Agent node. It follows software engineering best practices while maintaining the simplicity needed for n8n integration.