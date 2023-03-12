FROM node:18.15.0-alpine

COPY . .

RUN npm i

CMD ["npm","start"]

EXPOSE 3000
