# Usa uma imagem do Node.js
FROM node:20

# Define a pasta do seu código dentro do servidor
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala tudo
RUN npm install

# Copia o resto do código
COPY . .

# Compila o TypeScript (se você usa o tsc)
RUN npm run build

# Abre a porta 3333
EXPOSE 3333

# Comando para rodar
CMD ["node", "dist/server.js"]