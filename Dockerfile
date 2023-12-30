# Use Node 18 with Debian Buster as a base image
FROM node:18-buster AS base

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Define environment variable
ENV NODE_ENV=production

# Run server.js when the container launches
CMD ["node", "server.js"]
