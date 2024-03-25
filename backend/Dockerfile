# Dockerfile for Node + Express backend

FROM node:alpine

# Working dir

WORKDIR /usr/src/app

COPY package*.json ./

### Installing dependencies

RUN npm install --silent --force

# Copy local files to app folder

COPY . .

# Exports

EXPOSE 3001

CMD ["npm", "run", "start"]
