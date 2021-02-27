FROM node:15.10.0-alpine3.10
# Create Directory for the Container
WORKDIR /usr/flight_ap
# Only copy the package.json file to work directory
COPY package.json .
# Install all Packages
RUN npm install
# Copy all other source code to work directory
COPY . .
# TypeScript
RUN npm run prestart
EXPOSE 5000
# Start
CMD [ "npm", "start" ]