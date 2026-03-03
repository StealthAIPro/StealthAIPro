# Use a slightly larger base if you run into memory issues with the rewriters
FROM node:22-slim

# Set environment to production
ENV NODE_ENV=production

WORKDIR /app

# Install basic build tools (sometimes needed for native proxy dependencies)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json ./

# Install dependencies
RUN npm install --include=dev

# Copy the rest of your files
COPY . .

# Run the postinstall manually if it didn't trigger, 
# ensuring /uv and /scramjet folders exist
# ... after COPY . .
RUN npm install
RUN npm run postinstall
# ... before EXPOSE 8000

EXPOSE 8000

# Use a non-root user for better security in a proxy environment
USER node

CMD ["node", "index.js"]
