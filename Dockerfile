FROM node:18

WORKDIR /frontend

COPY . .

RUN npm install
RUN npm run build
CMD ["npm", "start"]