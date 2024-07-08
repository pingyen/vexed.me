FROM node:22-alpine AS base

USER node

WORKDIR /app


FROM base AS dev

CMD ["/bin/sh"]


FROM base AS prod

RUN mkdir /app/.next
RUN chown node:node /app/.next

COPY package.json .

RUN npm i

ENV NODE_ENV production

CMD ["npm", "run", "start"]
