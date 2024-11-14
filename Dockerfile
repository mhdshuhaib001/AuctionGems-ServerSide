FROM node:alpine

# Set the working directory
WORKDIR /src

# Install build dependencies for bcrypt
RUN apk add --no-cache --virtual .build-deps build-base python3

# Copy package.json and package-lock.json first to leverage Docker's cache
COPY package*.json ./

# Install dependencies, including bcrypt
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your application will run on
EXPOSE 8001

# Clean up build dependencies to reduce image size
RUN apk del .build-deps

# Start the app
CMD ["npm", "start"]
