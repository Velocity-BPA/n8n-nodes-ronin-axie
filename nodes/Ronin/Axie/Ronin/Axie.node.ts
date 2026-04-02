/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-roninaxie/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class RoninAxie implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Ronin/Axie',
    name: 'roninaxie',
    icon: 'file:roninaxie.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Ronin/Axie API',
    defaults: {
      name: 'Ronin/Axie',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'roninaxieApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Axie',
            value: 'axie',
          },
          {
            name: 'RoninAddress',
            value: 'roninAddress',
          },
          {
            name: 'Leaderboard',
            value: 'leaderboard',
          },
          {
            name: 'Battle',
            value: 'battle',
          },
          {
            name: 'Item',
            value: 'item',
          },
          {
            name: 'RoninTransaction',
            value: 'roninTransaction',
          }
        ],
        default: 'axie',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['axie'] } },
  options: [
    { name: 'Get Axie', value: 'getAxie', description: 'Get detailed information about a specific Axie', action: 'Get axie' },
    { name: 'List Axies', value: 'listAxies', description: 'Get list of Axies with filtering options', action: 'List axies' },
    { name: 'Get Axie Genes', value: 'getAxieGenes', description: 'Get genetic information for an Axie', action: 'Get axie genes' }
  ],
  default: 'getAxie',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['roninAddress'] } },
  options: [
    { name: 'Get Address', value: 'getAddress', description: 'Get address details and associated data', action: 'Get address details' },
    { name: 'Get Address Axies', value: 'getAddressAxies', description: 'Get all Axies owned by an address', action: 'Get address axies' },
    { name: 'Get Address Items', value: 'getAddressItems', description: 'Get items owned by an address', action: 'Get address items' },
  ],
  default: 'getAddress',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['leaderboard'] } },
  options: [
    { name: 'Get Leaderboards', value: 'getLeaderboards', description: 'Get current season leaderboards', action: 'Get leaderboards' },
    { name: 'Get Player Ranking', value: 'getPlayerRanking', description: 'Get specific player\'s ranking information', action: 'Get player ranking' }
  ],
  default: 'getLeaderboards',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['battle'] } },
  options: [
    { name: 'Get Battle History', value: 'getBattleHistory', description: 'Get battle history for a player', action: 'Get battle history' },
    { name: 'Get Battle Details', value: 'getBattleDetails', description: 'Get detailed information about a specific battle', action: 'Get battle details' }
  ],
  default: 'getBattleHistory',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['item'] } },
  options: [
    { name: 'Get Item', value: 'getItem', description: 'Get detailed information about a specific item', action: 'Get item' },
    { name: 'List Items', value: 'listItems', description: 'Get list of items with filtering options', action: 'List items' }
  ],
  default: 'getItem',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['roninTransaction'] } },
  options: [
    { name: 'Get Transaction By Hash', value: 'getTransactionByHash', description: 'Get transaction details by hash', action: 'Get transaction by hash' },
    { name: 'Get Transaction Receipt', value: 'getTransactionReceipt', description: 'Get transaction receipt', action: 'Get transaction receipt' },
    { name: 'Get Block By Number', value: 'getBlockByNumber', description: 'Get block information by number', action: 'Get block by number' },
    { name: 'Get Balance', value: 'getBalance', description: 'Get account balance', action: 'Get account balance' },
  ],
  default: 'getTransactionByHash',
},
{
  displayName: 'Axie ID',
  name: 'axieId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['axie'], operation: ['getAxie', 'getAxieGenes'] } },
  default: '',
  description: 'The ID of the Axie to retrieve'
},
{
  displayName: 'Owner',
  name: 'owner',
  type: 'string',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: '',
  description: 'Filter Axies by owner address'
},
{
  displayName: 'Genes',
  name: 'genes',
  type: 'string',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: '',
  description: 'Filter Axies by genes'
},
{
  displayName: 'Pureness',
  name: 'pureness',
  type: 'number',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: 0,
  description: 'Filter Axies by pureness level'
},
{
  displayName: 'Stage',
  name: 'stage',
  type: 'options',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  options: [
    { name: 'Egg', value: 1 },
    { name: 'Larva', value: 2 },
    { name: 'Petite', value: 3 },
    { name: 'Adult', value: 4 }
  ],
  default: 4,
  description: 'Filter Axies by stage'
},
{
  displayName: 'Breed Count',
  name: 'breedCount',
  type: 'number',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: 0,
  description: 'Filter Axies by breed count'
},
{
  displayName: 'HP',
  name: 'hp',
  type: 'number',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: 0,
  description: 'Filter Axies by HP stat'
},
{
  displayName: 'Skill',
  name: 'skill',
  type: 'number',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: 0,
  description: 'Filter Axies by Skill stat'
},
{
  displayName: 'Speed',
  name: 'speed',
  type: 'number',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: 0,
  description: 'Filter Axies by Speed stat'
},
{
  displayName: 'Morale',
  name: 'morale',
  type: 'number',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: 0,
  description: 'Filter Axies by Morale stat'
},
{
  displayName: 'Size',
  name: 'size',
  type: 'number',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: 100,
  description: 'Number of Axies to return'
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['axie'], operation: ['listAxies'] } },
  default: 0,
  description: 'Number of Axies to skip'
},
{
  displayName: 'Ronin Address',
  name: 'roninAddress',
  type: 'string',
  required: true,
  default: '',
  placeholder: '0x1234...',
  description: 'The Ronin wallet address',
  displayOptions: { show: { resource: ['roninAddress'], operation: ['getAddress', 'getAddressAxies', 'getAddressItems'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of items to skip for pagination',
  displayOptions: { show: { resource: ['roninAddress'], operation: ['getAddressAxies'] } },
},
{
  displayName: 'Size',
  name: 'size',
  type: 'number',
  default: 20,
  description: 'Number of items to return per page',
  displayOptions: { show: { resource: ['roninAddress'], operation: ['getAddressAxies'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of records to skip',
  displayOptions: {
    show: {
      resource: ['leaderboard'],
      operation: ['getLeaderboards']
    }
  }
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 20,
  description: 'Maximum number of records to return',
  displayOptions: {
    show: {
      resource: ['leaderboard'],
      operation: ['getLeaderboards']
    }
  }
},
{
  displayName: 'Client ID',
  name: 'clientID',
  type: 'string',
  default: '',
  description: 'Client ID for filtering leaderboards',
  displayOptions: {
    show: {
      resource: ['leaderboard'],
      operation: ['getLeaderboards']
    }
  }
},
{
  displayName: 'Client ID',
  name: 'clientID',
  type: 'string',
  required: true,
  default: '',
  description: 'Client ID of the player to get ranking for',
  displayOptions: {
    show: {
      resource: ['leaderboard'],
      operation: ['getPlayerRanking']
    }
  }
},
{
  displayName: 'Client ID',
  name: 'clientID',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['battle'], operation: ['getBattleHistory'] } },
  default: '',
  description: 'The client ID of the player to get battle history for',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'string',
  displayOptions: { show: { resource: ['battle'], operation: ['getBattleHistory'] } },
  default: '',
  description: 'Type filter for battles',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['battle'], operation: ['getBattleHistory'] } },
  default: 0,
  description: 'Number of records to skip for pagination',
},
{
  displayName: 'Battle UUID',
  name: 'battleUuid',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['battle'], operation: ['getBattleDetails'] } },
  default: '',
  description: 'The UUID of the battle to get details for',
},
{
  displayName: 'Item ID',
  name: 'itemId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['item'], operation: ['getItem'] } },
  default: '',
  description: 'The unique identifier of the item',
},
{
  displayName: 'Item Type',
  name: 'itemType',
  type: 'string',
  displayOptions: { show: { resource: ['item'], operation: ['listItems'] } },
  default: '',
  description: 'Filter by item type',
},
{
  displayName: 'Item Alias',
  name: 'itemAlias',
  type: 'string',
  displayOptions: { show: { resource: ['item'], operation: ['listItems'] } },
  default: '',
  description: 'Filter by item alias',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['item'], operation: ['listItems'] } },
  default: 0,
  description: 'Number of items to skip',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'number',
  displayOptions: { show: { resource: ['item'], operation: ['listItems'] } },
  default: 20,
  description: 'Number of items to return',
},
{
  displayName: 'Transaction Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getTransactionByHash'] } },
  default: '',
  description: 'The hash of the transaction to retrieve',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getTransactionByHash'] } },
  default: 'eth_getTransactionByHash',
  description: 'RPC method name',
},
{
  displayName: 'ID',
  name: 'id',
  type: 'number',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getTransactionByHash'] } },
  default: 1,
  description: 'Request ID',
},
{
  displayName: 'JSON-RPC Version',
  name: 'jsonrpc',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getTransactionByHash'] } },
  default: '2.0',
  description: 'JSON-RPC version',
},
{
  displayName: 'Transaction Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getTransactionReceipt'] } },
  default: '',
  description: 'The hash of the transaction to get receipt for',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getTransactionReceipt'] } },
  default: 'eth_getTransactionReceipt',
  description: 'RPC method name',
},
{
  displayName: 'ID',
  name: 'id',
  type: 'number',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getTransactionReceipt'] } },
  default: 1,
  description: 'Request ID',
},
{
  displayName: 'JSON-RPC Version',
  name: 'jsonrpc',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getTransactionReceipt'] } },
  default: '2.0',
  description: 'JSON-RPC version',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBlockByNumber'] } },
  default: 'latest',
  description: 'Block number (hex string) or "latest", "earliest", "pending"',
},
{
  displayName: 'Full Transactions',
  name: 'fullTransactions',
  type: 'boolean',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBlockByNumber'] } },
  default: true,
  description: 'Whether to return full transaction objects or just hashes',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBlockByNumber'] } },
  default: 'eth_getBlockByNumber',
  description: 'RPC method name',
},
{
  displayName: 'ID',
  name: 'id',
  type: 'number',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBlockByNumber'] } },
  default: 1,
  description: 'Request ID',
},
{
  displayName: 'JSON-RPC Version',
  name: 'jsonrpc',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBlockByNumber'] } },
  default: '2.0',
  description: 'JSON-RPC version',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBalance'] } },
  default: '',
  description: 'The address to check balance for',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBalance'] } },
  default: 'latest',
  description: 'Block number (hex string) or "latest", "earliest", "pending"',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBalance'] } },
  default: 'eth_getBalance',
  description: 'RPC method name',
},
{
  displayName: 'ID',
  name: 'id',
  type: 'number',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBalance'] } },
  default: 1,
  description: 'Request ID',
},
{
  displayName: 'JSON-RPC Version',
  name: 'jsonrpc',
  type: 'string',
  displayOptions: { show: { resource: ['roninTransaction'], operation: ['getBalance'] } },
  default: '2.0',
  description: 'JSON-RPC version',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'axie':
        return [await executeAxieOperations.call(this, items)];
      case 'roninAddress':
        return [await executeRoninAddressOperations.call(this, items)];
      case 'leaderboard':
        return [await executeLeaderboardOperations.call(this, items)];
      case 'battle':
        return [await executeBattleOperations.call(this, items)];
      case 'item':
        return [await executeItemOperations.call(this, items)];
      case 'roninTransaction':
        return [await executeRoninTransactionOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAxieOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('roninaxieApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAxie': {
          const axieId = this.getNodeParameter('axieId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/axies/${axieId}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listAxies': {
          const queryParams: any = {};
          
          const owner = this.getNodeParameter('owner', i, '') as string;
          if (owner) queryParams.owner = owner;
          
          const genes = this.getNodeParameter('genes', i, '') as string;
          if (genes) queryParams.genes = genes;
          
          const pureness = this.getNodeParameter('pureness', i, 0) as number;
          if (pureness > 0) queryParams.pureness = pureness;
          
          const stage = this.getNodeParameter('stage', i, 4) as number;
          if (stage) queryParams.stage = stage;
          
          const breedCount = this.getNodeParameter('breedCount', i, 0) as number;
          if (breedCount > 0) queryParams.breedCount = breedCount;
          
          const hp = this.getNodeParameter('hp', i, 0) as number;
          if (hp > 0) queryParams.hp = hp;
          
          const skill = this.getNodeParameter('skill', i, 0) as number;
          if (skill > 0) queryParams.skill = skill;
          
          const speed = this.getNodeParameter('speed', i, 0) as number;
          if (speed > 0) queryParams.speed = speed;
          
          const morale = this.getNodeParameter('morale', i, 0) as number;
          if (morale > 0) queryParams.morale = morale;
          
          const size = this.getNodeParameter('size', i, 100) as number;
          queryParams.size = size;
          
          const offset = this.getNodeParameter('offset', i, 0) as number;
          queryParams.offset = offset;

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/axies?${queryString}`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAxieGenes': {
          const axieId = this.getNodeParameter('axieId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/axies/${axieId}/genes`,
            headers: {
              'x-api-key': credentials.apiKey,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeRoninAddressOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('roninaxieApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAddress': {
          const roninAddress = this.getNodeParameter('roninAddress', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/addresses/${roninAddress}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressAxies': {
          const roninAddress = this.getNodeParameter('roninAddress', i) as string;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const size = this.getNodeParameter('size', i, 20) as number;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/addresses/${roninAddress}/axies`,
            qs: {
              offset,
              size,
            },
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressItems': {
          const roninAddress = this.getNodeParameter('roninAddress', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/addresses/${roninAddress}/items`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeLeaderboardOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('roninaxieApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getLeaderboards': {
          const offset = this.getNodeParameter('offset', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const clientID = this.getNodeParameter('clientID', i) as string;

          const queryParams = new URLSearchParams();
          queryParams.append('offset', offset.toString());
          queryParams.append('limit', limit.toString());
          if (clientID) {
            queryParams.append('clientID', clientID);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/leaderboards?${queryParams.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPlayerRanking': {
          const clientID = this.getNodeParameter('clientID', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/leaderboards/${clientID}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBattleOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('roninaxieApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getBattleHistory': {
          const clientID = this.getNodeParameter('clientID', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams: string[] = [];
          if (type) {
            queryParams.push(`type=${encodeURIComponent(type)}`);
          }
          if (offset) {
            queryParams.push(`offset=${offset}`);
          }

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          const url = `${credentials.baseUrl}/game-api/api/v2/battles/${clientID}${queryString}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBattleDetails': {
          const battleUuid = this.getNodeParameter('battleUuid', i) as string;
          const url = `${credentials.baseUrl}/game-api/api/v2/battles/${battleUuid}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeItemOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('roninaxieApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getItem': {
          const itemId = this.getNodeParameter('itemId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/items/${itemId}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'listItems': {
          const itemType = this.getNodeParameter('itemType', i) as string;
          const itemAlias = this.getNodeParameter('itemAlias', i) as string;
          const offset = this.getNodeParameter('offset', i) as number;
          const size = this.getNodeParameter('size', i) as number;

          const queryParams: string[] = [];
          if (itemType) queryParams.push(`itemType=${encodeURIComponent(itemType)}`);
          if (itemAlias) queryParams.push(`itemAlias=${encodeURIComponent(itemAlias)}`);
          if (offset) queryParams.push(`offset=${offset}`);
          if (size) queryParams.push(`size=${size}`);

          const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/game-api/api/v2/items${queryString}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeRoninTransactionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('roninaxieApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTransactionByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const id = this.getNodeParameter('id', i) as number;
          const jsonrpc = this.getNodeParameter('jsonrpc', i) as string;

          const body = {
            method,
            id,
            jsonrpc,
            params: [hash],
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/rpc`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionReceipt': {
          const hash = this.getNodeParameter('hash', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const id = this.getNodeParameter('id', i) as number;
          const jsonrpc = this.getNodeParameter('jsonrpc', i) as string;

          const body = {
            method,
            id,
            jsonrpc,
            params: [hash],
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/rpc`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByNumber': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const fullTransactions = this.getNodeParameter('fullTransactions', i) as boolean;
          const method = this.getNodeParameter('method', i) as string;
          const id = this.getNodeParameter('id', i) as number;
          const jsonrpc = this.getNodeParameter('jsonrpc', i) as string;

          const body = {
            method,
            id,
            jsonrpc,
            params: [blockNumber, fullTransactions],
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/rpc`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const id = this.getNodeParameter('id', i) as number;
          const jsonrpc = this.getNodeParameter('jsonrpc', i) as string;

          const body = {
            method,
            id,
            jsonrpc,
            params: [address, blockNumber],
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/rpc`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
