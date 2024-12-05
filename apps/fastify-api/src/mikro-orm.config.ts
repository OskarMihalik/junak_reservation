// import { type Options, SqliteDriver } from '@mikro-orm/sqlite'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migrator } from '@mikro-orm/migrations'
import { type Options, PostgreSqlDriver, GeneratedCacheAdapter } from '@mikro-orm/postgresql'
import { existsSync, readFileSync } from 'node:fs'
// import { defineConfig, GeneratedCacheAdapter, Options } from '@mikro-orm/sqlite';

const options = {} as Options

// if (process.env.NODE_ENV === 'production' && existsSync('./temp/metadata.json')) {
//   options.metadataCache = {
//     enabled: true,
//     adapter: GeneratedCacheAdapter,
//     // temp/metadata.json can be generated via `npx mikro-orm-esm cache:generate --combine`
//     options: {
//       data: JSON.parse(readFileSync('./temp/metadata.json', { encoding: 'utf8' })),
//     },
//   };
// } else {
//   options.metadataProvider = (await import('@mikro-orm/reflection')).TsMorphMetadataProvider;
// }

const config: Options = {
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  driver: PostgreSqlDriver,
  dbName: 'postgres',
  user: 'admin',
  host: 'postgres',
  port: 5435,
  password: 'admin',
  // folder-based discovery setup, using common filename suffix
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // for vitest to get around `TypeError: Unknown file extension ".ts"` (ERR_UNKNOWN_FILE_EXTENSION)
  dynamicImportProvider: id => import(id),
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  extensions: [Migrator],
  ...options,
}

export default config
