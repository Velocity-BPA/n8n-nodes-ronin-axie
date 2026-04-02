import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class RoninAxieApi implements ICredentialType {
	name = 'roninAxieApi';
	displayName = 'Ronin/Axie API';
	documentationUrl = 'https://developers.skymavis.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key for Ronin/Axie Infinity API. Register at https://developers.skymavis.com to obtain an API key.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api-gateway.skymavis.com',
			required: true,
			description: 'Base URL for the Ronin/Axie Infinity API',
		},
	];
}