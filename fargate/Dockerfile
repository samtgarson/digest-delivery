FROM node:15 AS builder

RUN mkdir -p /opt/calibre
WORKDIR /opt/calibre

RUN curl -s https://api.github.com/repos/kovidgoyal/calibre/releases/latest \
  | grep "browser_download_url.*64.txz" \
  | cut -d : -f 2,3 \
  | tr -d \" \
  | wget -qi -

RUN tar -xf calibre-*.txz \
  && rm calibre-*.txz

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
RUN npm ci

COPY . .
RUN node_modules/.bin/ncc build ./fargate/entrypoint.ts -s -m

FROM timbru31/node-chrome:14-slim

RUN mkdir /app
WORKDIR /app

RUN mkdir /opt/bin
COPY --from=builder /opt/calibre/* /opt/bin/
COPY --from=builder /app/dist/index.js /app/dist/index.js.map /app/dist/sourcemap-register.js ./

ENV PATH=/opt/bin:$PATH
ENV CHROME_PATH=/usr/bin/google-chrome

CMD node ./index.js
