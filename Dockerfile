# Use the official Node.js image as the base image
FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
RUN npx prisma generate
EXPOSE 8080

# Define the command to run the application
CMD ["npm", "run", "start"]