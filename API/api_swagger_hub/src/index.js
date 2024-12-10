const swaggerUi = require('swagger-ui-express');
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

const serviceEnv = process.env.NODE_ENV || 'default';
const getApiUrl = () => {
  switch (serviceEnv) {
    case 'development':
      return 'http://service_gtw:3000/api';
    case 'recette':
      return 'http://PRSY_rec_service_gtw:3000/api';
    case 'preproduction':
      return 'http://PRSY_service_gtw:3000/api';
    default:
      return 'http://gtw-service.prod-app.svc.cluster.local:3000/api';
  }
};
const services = [
  {
    name: 'PROSY',
    url: `${getApiUrl()}/swagger.json`,
  }
];

const getExtApiUrl = () => {
  switch (serviceEnv) {
    case 'development':
      return 'http://localhost:3000';
    case 'recette':
      return 'https://recette.snl-corp.fr';
    case 'preproduction':
      return 'https://preprod.snl-corp.fr';
    default:
      return 'https://www.snl-corp.fr';
  }
};
// Définition de la spécification Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Prosy API Documentation',
    version: '1.0.0',
    description: 'Documentation for Prosy API',
  },
  servers: [
    {
      url: `${getExtApiUrl()}`,
      //url: process.env.SNL_URL,getExtApiUrl
    },
  ],
  components: {
    securitySchemes: {
      KeycloakAuth: {
        type: 'openIdConnect',
        openIdConnectUrl: 'https://www.santia-tech.com/auth/realms/Developpement_REALM/.well-known/openid-configuration',
      },
    },
  },
  security: [
    {
      KeycloakAuth: [],
    },
  ],
};

const getCombinedSwaggerDocs = async () => {
  const swaggers = await Promise.all(
    services.map(service =>
      axios.get(service.url).then(response => response.data)
    )
  );

  // Consolidation des chemins et des composants
  const combinedPaths = swaggers.reduce((acc, swagger) => ({ ...acc, ...swagger.paths }), {});
  const combinedComponents = swaggers.reduce((acc, swagger) => ({
    ...acc,
    components: {
      ...acc.components,
      ...swagger.components,
    },
  }), { components: {} });

  return {
    ...swaggerDefinition,
    paths: combinedPaths,
    components: combinedComponents.components,
  };
};

// Point de terminaison de santé
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Expose JSON only
app.use('/api/docs/json', async (req, res) => {
  const swaggerDoc = await getCombinedSwaggerDocs();
  res.json(swaggerDoc);
});

// Expose Swagger UI
app.use('/api/docs/ui', swaggerUi.serve, async (req, res, next) => {
  const swaggerDoc = await getCombinedSwaggerDocs();
  swaggerUi.setup(swaggerDoc)(req, res, next);
});

app.listen(process.env.SNL_PORT, () => {
  console.log("--- SERVICE SWAGGER HUB UP! Listen on port: "+process.env.SNL_PORT+" ---");
});