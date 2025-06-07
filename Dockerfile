FROM node:22-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    fontconfig \
    debconf-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Microsoft Core Fonts (includes Trebuchet MS)
RUN echo "deb http://deb.debian.org/debian bullseye contrib non-free" >> /etc/apt/sources.list \
    && apt-get update \
    && echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections \
    && apt-get install -y ttf-mscorefonts-installer \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

COPY . .

USER node
CMD ["node", "src/server.js"]