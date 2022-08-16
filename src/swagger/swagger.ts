import { INestApplication } from '@nestjs/common';
import {
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'API Urban Shaves Docs',
};

export function generateDocs(
  options: Omit<OpenAPIObject, 'paths'>,
  route: string,
  app: INestApplication,
  module: any,
) {
  const Document = SwaggerModule.createDocument(app, options, {
    include: [...module],
  });
  SwaggerModule.setup(`api/${route}`, app, Document, customOptions);
}
