
# Dgraph Dg-Auth-Proxy

A lightweight authentication proxy for Dgraph databases that adds an authentication layer between clients and your Dgraph instance.

## Features

- Acts as a secure middleware between clients and Dgraph
- Simple configuration via environment variables
- Docker-ready with multi-platform support
- Built with modern Node.js (using H3 for HTTP handling)

## Prerequisites

- Node.js (v18+ recommended)
- Yarn (v4+)
- Docker (for containerized deployment)
- A Dgraph instance (local or remote)

## Installation

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ezyostudio/dgraph-dg-auth-proxy.git
   cd dgraph-dg-auth-proxy
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file with your Dgraph configuration:
   ```env
   DGRAPH_URL=https://your-dgraph-instance.url
   DGRAPH_AUTH_TOKEN=your-dgraph-auth-token
   ```

4. Start the development server:
   ```bash
   yarn dev
   ```

### Docker Deployment

The included `docker-compose.yml` sets up:
- Dgraph Zero service
- Dgraph Alpha service
- This auth proxy service

1. Replace the placeholder tokens in `docker-compose.yml` with your actual tokens:
- `your-admin-token` (Dgraph admin API key)
- `your-client-token` (Dgraph client API key, also set in proxy environment)


2. Start the services:
   ```bash
   docker-compose up -d
   ```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|-------------------|--------------------------------------|----------|---------------|
| `PORT` | Port to listen on | No | 80 |
| `HOST` | Host to bind to | No | 0.0.0.0 |
| `DGRAPH_URL` | URL to your Dgraph instance | Yes | - |
| `DGRAPH_AUTH_TOKEN` | Authentication token for Dgraph | Yes | - |

## Deployment

### Docker Image

The project includes a GitHub Actions workflow that automatically builds and pushes a Docker image to GitHub Container Registry when a new release is published.

To manually build and push:

2. Pull the image
   ```bash
   docker pull ghcr.io/ezyostudio/dgraph-dg-auth-proxy:latest
   docker run -p 3000:3000 -e PORT=3000 -e DGRAPH_URL=http://<dgraph-alpha-url> -e DGRAPH_AUTH_TOKEN=<client-token> ghcr.io/ezyostudio/dgraph-dg-auth-proxy
   ```

### Cloudflare Workers

The project includes a `wrangler.toml` configuration for deploying to Cloudflare Workers. To deploy:

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```

2. Deploy:
   ```bash
   wrangler deploy
   ```

## Development

- **Dev server**: `yarn dev` (watches for changes)
- **Production server**: `yarn start`

## Dependabot

The project uses Dependabot to automatically check for dependency updates daily for both npm packages and GitHub Actions.

## License

[MIT](LICENSE)

