FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 

RUN npm install

COPY . .

EXPOSE 5678

CMD [ "npm", "run", "start" ]