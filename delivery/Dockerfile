FROM node:15 AS builder

# === Install Calibre ===
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

RUN mkdir delivery

# === Install Node deps ===
COPY package.json package-lock.json ./
COPY delivery/package.json ./delivery/
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
RUN npm ci

# === Build function ===
COPY . ./
RUN node_modules/.bin/ncc build ./delivery/entrypoint.ts -sm
RUN node_modules/.bin/ncc build ./delivery/worker.ts -smo worker

# === Production Image ===
FROM node:15-slim AS worker

# === Install dependencies ===
RUN apt-get update && apt-get install -y chromium libgl1-mesa-glx

RUN mkdir /app
WORKDIR /app

# === Copy build files over
COPY --from=builder /opt/calibre /opt/calibre
COPY --from=builder /app/dist/index.js /app/dist/index.js.map /app/dist/sourcemap-register.js ./
COPY --from=builder /app/worker/index.js ./worker.js
COPY --from=builder /app/worker/index.js.map ./worker.js.map

ENV PATH=/opt/calibre:$PATH
ENV CHROME_PATH=chromium

CMD node /app/index.js
