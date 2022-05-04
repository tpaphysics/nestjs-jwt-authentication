import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function generateDocs(
  options: Omit<OpenAPIObject, 'paths'>,
  route: string,
  app: INestApplication,
  module: any,
) {
  const Document = SwaggerModule.createDocument(app, options, {
    include: [module],
  });
  SwaggerModule.setup(`api/${route}`, app, Document);
}
