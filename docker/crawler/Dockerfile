FROM ghcr.io/puppeteer/puppeteer AS base

ENV TINI_VERSION v0.19.0

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini

USER root

RUN chmod +x /tini

USER pptruser

WORKDIR /app

ENTRYPOINT ["/tini", "--"]


FROM base AS dev

CMD ["bash"]


FROM base AS prod

COPY package.json .

RUN npm i

CMD ["npm", "run", "start"]
