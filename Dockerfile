FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
# RUN pnpm deploy --filter=next --prod /prod/next
# RUN pnpm deploy --filter=fastify-api --prod /prod/fastify-api

FROM base AS next
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app/apps/next
EXPOSE 3000
CMD ["pnpm", "start"]

FROM base AS fastify-api
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app/apps/fastify-api
EXPOSE 3939
CMD [ "pnpm", "start" ]
