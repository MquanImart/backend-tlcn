FROM node:21.6.2

LABEL maintainer="trunghauad02@gmail.com"

WORKDIR /app

COPY package* ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "./bin/www"]