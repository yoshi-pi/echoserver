FROM node:18-bullseye AS builder

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

COPY package*.json ./

RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 

RUN npm install --dev

COPY . .

RUN npm run build

FROM node:18-slim 

RUN apt update && \
  apt install -y libcairo2 libpango1.0-0 libjpeg62-turbo libgif7 librsvg2-2 && \
  apt clean && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/public  ./apps/frontend/public
COPY --from=builder /app/apps/backend/server ./apps/backend/server

EXPOSE 5678

CMD [ "node", "apps/backend/server/server.js" ]
