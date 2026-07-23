FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies (only production dependencies can be installed using --omit=dev if preferred, but npm install is fine)
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the port your backend runs on (usually 5000 based on common setups)
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
