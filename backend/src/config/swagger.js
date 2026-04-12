import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment Wallet API",
      version: "1.0.0",
      description: "API for a digital wallet system with authentication and transactions"
    },
    servers: [
      {
        url: "http://localhost:3000"
      },
      {
        url: "https://payment-wallet-api.onrender.com"
      }
    ]
  },
  apis: ["./src/routes/*.js"] // onde vamos documentar
};

export const swaggerSpec = swaggerJSDoc(options);