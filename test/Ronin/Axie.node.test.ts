/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { RoninAxie } from '../nodes/Ronin/Axie/Ronin/Axie.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('RoninAxie Node', () => {
  let node: RoninAxie;

  beforeAll(() => {
    node = new RoninAxie();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Ronin/Axie');
      expect(node.description.name).toBe('roninaxie');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Axie Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api-gateway.skymavis.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getAxie operation', () => {
    it('should get Axie details successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAxie')
        .mockReturnValueOnce('123456');
      
      const mockResponse = { id: '123456', genes: 'test-genes', stage: 4 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAxieOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/axies/123456',
        headers: {
          'x-api-key': 'test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle getAxie errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAxie')
        .mockReturnValueOnce('invalid-id');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Axie not found'));

      await expect(executeAxieOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Axie not found');
    });
  });

  describe('listAxies operation', () => {
    it('should list Axies with filters successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listAxies')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      
      const mockResponse = { results: [], total: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAxieOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('owner=0x123'),
        })
      );
    });
  });

  describe('getAxieGenes operation', () => {
    it('should get Axie genes successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAxieGenes')
        .mockReturnValueOnce('123456');
      
      const mockResponse = { genes: 'test-genes-data' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAxieOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/axies/123456/genes',
        headers: {
          'x-api-key': 'test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle getAxieGenes errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAxieGenes')
        .mockReturnValueOnce('invalid-id');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Genes not found'));

      await expect(executeAxieOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Genes not found');
    });
  });
});

describe('RoninAddress Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api-gateway.skymavis.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getAddress', () => {
    it('should get address details successfully', async () => {
      const mockResponse = { address: '0x1234', balance: '100' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddress')
        .mockReturnValueOnce('0x1234567890abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRoninAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/addresses/0x1234567890abcdef',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });

    it('should handle error for getAddress', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddress')
        .mockReturnValueOnce('0x1234567890abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRoninAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAddressAxies', () => {
    it('should get address axies successfully', async () => {
      const mockResponse = { results: [], total: 0 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddressAxies')
        .mockReturnValueOnce('0x1234567890abcdef')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRoninAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/addresses/0x1234567890abcdef/axies',
        qs: { offset: 0, size: 20 },
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });

    it('should handle error for getAddressAxies', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddressAxies')
        .mockReturnValueOnce('0x1234567890abcdef')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRoninAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAddressItems', () => {
    it('should get address items successfully', async () => {
      const mockResponse = { items: [] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddressItems')
        .mockReturnValueOnce('0x1234567890abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRoninAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/addresses/0x1234567890abcdef/items',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
    });

    it('should handle error for getAddressItems', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAddressItems')
        .mockReturnValueOnce('0x1234567890abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRoninAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Leaderboard Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api-gateway.skymavis.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  describe('getLeaderboards operation', () => {
    it('should successfully get leaderboards', async () => {
      const mockResponse = {
        items: [
          { clientID: 'player1', rank: 1, mmr: 2000 },
          { clientID: 'player2', rank: 2, mmr: 1900 }
        ],
        total: 100
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLeaderboards')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeLeaderboardOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/leaderboards?offset=0&limit=20',
        headers: {
          'X-API-Key': 'test-api-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle getLeaderboards error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLeaderboards')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeLeaderboardOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getPlayerRanking operation', () => {
    it('should successfully get player ranking', async () => {
      const mockResponse = {
        clientID: 'player1',
        rank: 1,
        mmr: 2000,
        tier: 'challenger'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPlayerRanking')
        .mockReturnValueOnce('player1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeLeaderboardOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/leaderboards/player1',
        headers: {
          'X-API-Key': 'test-api-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle getPlayerRanking error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPlayerRanking')
        .mockReturnValueOnce('player1');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Player not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeLeaderboardOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: { error: 'Player not found' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Battle Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api-gateway.skymavis.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getBattleHistory operation', () => {
    it('should get battle history successfully', async () => {
      const mockResponse = { battles: [{ id: 1, result: 'win' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBattleHistory')
        .mockReturnValueOnce('test-client-id')
        .mockReturnValueOnce('pvp')
        .mockReturnValueOnce(10);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBattleOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/battles/test-client-id?type=pvp&offset=10',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getBattleHistory errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBattleHistory')
        .mockReturnValueOnce('test-client-id')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBattleOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBattleDetails operation', () => {
    it('should get battle details successfully', async () => {
      const mockResponse = { battle: { id: 'battle-uuid', players: [] } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBattleDetails')
        .mockReturnValueOnce('test-battle-uuid');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBattleOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/battles/test-battle-uuid',
        headers: { 'X-API-Key': 'test-key' },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getBattleDetails errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBattleDetails')
        .mockReturnValueOnce('test-battle-uuid');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Battle not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBattleOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Battle not found' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Item Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-api-key', 
        baseUrl: 'https://api-gateway.skymavis.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn() 
      },
    };
  });

  describe('getItem operation', () => {
    it('should successfully get item details', async () => {
      const mockItemData = { id: '123', name: 'Test Item', type: 'weapon' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getItem')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockItemData);

      const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/items/123',
        headers: { 'X-API-Key': 'test-api-key' },
        json: true,
      });
      expect(result).toEqual([{ json: mockItemData, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when getting item fails', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getItem')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('listItems operation', () => {
    it('should successfully list items with filters', async () => {
      const mockItemsList = { data: [{ id: '1', name: 'Item 1' }], total: 1 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listItems')
        .mockReturnValueOnce('weapon')
        .mockReturnValueOnce('sword')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(5);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockItemsList);

      const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api-gateway.skymavis.com/game-api/api/v2/items?itemType=weapon&itemAlias=sword&offset=10&size=5',
        headers: { 'X-API-Key': 'test-api-key' },
        json: true,
      });
      expect(result).toEqual([{ json: mockItemsList, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when listing items fails', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listItems')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Network Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('RoninTransaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api-gateway.skymavis.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTransactionByHash operation', () => {
    it('should get transaction by hash successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransactionByHash')
        .mockReturnValueOnce('0x123abc')
        .mockReturnValueOnce('eth_getTransactionByHash')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('2.0');

      const mockResponse = { result: { hash: '0x123abc', from: '0xabc123' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRoninTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api-gateway.skymavis.com/rpc',
        headers: {
          'X-API-Key': 'test-key',
          'Content-Type': 'application/json',
        },
        body: {
          method: 'eth_getTransactionByHash',
          id: 1,
          jsonrpc: '2.0',
          params: ['0x123abc'],
        },
        json: true,
      });
    });

    it('should handle errors for getTransactionByHash', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransactionByHash');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRoninTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTransactionReceipt operation', () => {
    it('should get transaction receipt successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransactionReceipt')
        .mockReturnValueOnce('0x123abc')
        .mockReturnValueOnce('eth_getTransactionReceipt')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('2.0');

      const mockResponse = { result: { transactionHash: '0x123abc', status: '0x1' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRoninTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors for getTransactionReceipt', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransactionReceipt');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Receipt not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRoninTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'Receipt not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlockByNumber operation', () => {
    it('should get block by number successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockByNumber')
        .mockReturnValueOnce('latest')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce('eth_getBlockByNumber')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('2.0');

      const mockResponse = { result: { number: '0x1', transactions: [] } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRoninTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors for getBlockByNumber', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockByNumber');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Block not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRoninTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'Block not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBalance operation', () => {
    it('should get balance successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('0xabc123')
        .mockReturnValueOnce('latest')
        .mockReturnValueOnce('eth_getBalance')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('2.0');

      const mockResponse = { result: '0x1bc16d674ec80000' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeRoninTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors for getBalance', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getBalance');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Address invalid'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeRoninTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'Address invalid' }, pairedItem: { item: 0 } }]);
    });
  });
});
});
