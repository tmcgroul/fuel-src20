# fuel-src20

This project shows how one can index Fuel SRC20 assets.

## Getting started

### Prerequisites

* Node.js (version 20.x and above)
* Docker

### Run indexer

```bash
# Install dependencies
npm ci

# Compile the project
npm run build

# Launch Postgres database to store the data
docker compose up -d

# Apply database migrations to create the target schema
npx squid-typeorm-migration apply

# Run indexer
node -r dotenv/config lib/main.js

# Run graphql-server (in a separate terminal)
npx squid-graphql-server
```

Visit the documentation page for more details on using subsquid for Fuel.
