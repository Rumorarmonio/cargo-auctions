import { defineConfig } from 'orval'

export default defineConfig({
  auctions: {
    input: './openapi.auctions.v0.json',
    output: {
      mode: 'tags-split',
      target: './src/shared/api/generated/index.ts',
      schemas: './src/shared/api/generated/model',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
    },
  },
})
