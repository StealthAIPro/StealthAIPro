FROM node:22-slim

WORKDIR /app

COPY package.json ./
# Docker doesn't care if there is no lockfile!
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]
