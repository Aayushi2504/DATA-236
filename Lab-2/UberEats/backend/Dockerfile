# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
