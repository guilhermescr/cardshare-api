import swaggerUI from 'swagger-ui-express';
import { Express } from 'express';
import * as swaggerDocument from './swagger.json';

export function setupSwagger(app: Express) {
  app.use(
    '/docs',
    swaggerUI.serve,
    swaggerUI.setup({
      ...swaggerDocument,
      info: {
        ...swaggerDocument.info,
        title: 'CardShare API',
      },
    })
  );
}
