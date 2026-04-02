# n8n-nodes-ronin-axie

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Ronin blockchain and Axie Infinity ecosystem. This node provides 6 comprehensive resources for managing Axie data, Ronin addresses, leaderboards, battles, items, and blockchain transactions. Access real-time game data, player statistics, and on-chain information to build powerful automation workflows for the Axie Infinity metaverse.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Axie Infinity](https://img.shields.io/badge/Axie%20Infinity-Supported-green)
![Ronin Blockchain](https://img.shields.io/badge/Ronin-Blockchain-purple)
![Gaming](https://img.shields.io/badge/Gaming-NFT-orange)

## Features

- **Axie Management** - Retrieve, search, and manage Axie NFT data including stats, genes, and marketplace information
- **Ronin Address Operations** - Query wallet balances, transaction history, and address-related blockchain data
- **Leaderboard Integration** - Access player rankings, seasonal leaderboards, and competitive statistics
- **Battle Data Access** - Retrieve battle history, match results, and combat analytics
- **Item Management** - Handle in-game items, equipment, and NFT accessories
- **Transaction Monitoring** - Track Ronin blockchain transactions, transfers, and smart contract interactions
- **Real-time Data** - Access live game data and blockchain state information
- **Comprehensive Analytics** - Build detailed reports and automation workflows for gaming insights

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-ronin-axie`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-ronin-axie
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-ronin-axie.git
cd n8n-nodes-ronin-axie
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ronin-axie
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Ronin/Axie API key for authentication | Yes |
| Environment | API environment (production/staging) | No |
| Rate Limit | Custom rate limiting settings | No |

## Resources & Operations

### 1. Axie

| Operation | Description |
|-----------|-------------|
| Get Axie | Retrieve detailed information about a specific Axie by ID |
| List Axies | Get a list of Axies with filtering and pagination options |
| Search Axies | Search for Axies by various criteria including genes, class, and stats |
| Get Axie Genes | Retrieve genetic information and traits for an Axie |
| Get Axie Battles | Get battle history and performance data for a specific Axie |

### 2. Ronin Address

| Operation | Description |
|-----------|-------------|
| Get Address Info | Retrieve detailed information about a Ronin wallet address |
| Get Balance | Check token balances for a specific Ronin address |
| Get Transaction History | Retrieve transaction history for an address |
| Get NFT Holdings | List all NFTs owned by a Ronin address |
| Validate Address | Verify if a Ronin address is valid and active |

### 3. Leaderboard

| Operation | Description |
|-----------|-------------|
| Get Global Leaderboard | Retrieve global player rankings and statistics |
| Get Seasonal Rankings | Access current season leaderboard data |
| Get Player Rank | Find a specific player's ranking and position |
| Get Top Players | List top performing players with detailed stats |
| Get Historical Rankings | Access previous season and historical ranking data |

### 4. Battle

| Operation | Description |
|-----------|-------------|
| Get Battle Details | Retrieve comprehensive information about a specific battle |
| List Recent Battles | Get a list of recent battles with filtering options |
| Get Player Battles | Retrieve battle history for a specific player |
| Get Battle Statistics | Access aggregated battle stats and analytics |
| Search Battles | Search for battles by various criteria and date ranges |

### 5. Item

| Operation | Description |
|-----------|-------------|
| Get Item Details | Retrieve detailed information about a specific item |
| List Items | Get a list of items with category and rarity filtering |
| Search Items | Search for items by name, type, or attributes |
| Get Item Market Data | Access marketplace information and pricing for items |
| Get Crafting Recipes | Retrieve crafting requirements and recipes for items |

### 6. Ronin Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve detailed information about a specific transaction |
| List Transactions | Get recent transactions with filtering and pagination |
| Monitor Address | Set up monitoring for transactions involving specific addresses |
| Get Transaction Receipt | Access transaction receipt and execution details |
| Track Transfer | Monitor token and NFT transfers on the Ronin blockchain |

## Usage Examples

```javascript
// Get detailed Axie information
{
  "axie_id": "123456",
  "include_genes": true,
  "include_stats": true
}
```

```javascript
// Check Ronin address balance and NFTs
{
  "address": "ronin:1234567890abcdef1234567890abcdef12345678",
  "include_tokens": true,
  "include_nfts": true
}
```

```javascript
// Retrieve global leaderboard top 100
{
  "season": "current",
  "limit": 100,
  "sort_by": "mmr",
  "include_stats": true
}
```

```javascript
// Monitor recent battles for a player
{
  "player_address": "ronin:1234567890abcdef1234567890abcdef12345678",
  "limit": 50,
  "include_details": true,
  "date_from": "2024-01-01"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | The provided API key is invalid or expired | Verify your API key in credentials and ensure it's active |
| Rate Limit Exceeded | Too many requests sent to the API | Implement delays between requests or upgrade your API plan |
| Axie Not Found | The specified Axie ID does not exist | Verify the Axie ID is correct and the Axie exists |
| Invalid Address | The Ronin address format is incorrect | Ensure the address follows the correct ronin: format |
| Network Error | Connection issues with Ronin blockchain | Check network connectivity and try again |
| Insufficient Permissions | API key lacks required permissions | Contact support to verify your API key permissions |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ronin-axie/issues)
- **Axie Infinity API Documentation**: [Axie Developer Portal](https://axieinfinity.com/api)
- **Ronin Blockchain Documentation**: [Ronin Network Docs](https://docs.roninchain.com)