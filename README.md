

# monorepo
install pnpm https://pnpm.io/installation
```
pnpm install
```

# frontend
```
cd apps/next
pnpm run dev
```

# backend
```
cd apps/fastify-api
pnpm run dev
```
backend is running on http://localhost:3939

## DB and ORM

### when you change or add entity
```
npx mikro-orm-esm schema:drop --run
npx mikro-orm-esm schema:create --run
```
or 
```
# first check what gets generated
npx mikro-orm-esm schema:update --dump

# and when its fine, sync the schema
npx mikro-orm-esm schema:update --run
```

### Migrations 
not needed now

