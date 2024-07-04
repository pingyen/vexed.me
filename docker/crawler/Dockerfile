FROM ghcr.io/puppeteer/puppeteer as base

WORKDIR /app


FROM base AS dev

CMD ["bash"]


FROM base as prod

COPY package.json .

RUN npm i

ENV NODE_ENV production

CMD ["bash", "-c", "npm run build && npm run start"]
