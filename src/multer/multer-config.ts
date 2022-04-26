import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { randomBytes } from 'crypto';

import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export default class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './upload',
        filename: (_req, file, cb) => {
          const { mimetype } = file;
          const [, extension] = mimetype.split('/', 2);
          const fileHashName = randomBytes(16).toString('hex');
          const name = `${fileHashName}.${extension}`;
          return cb(null, name);
        },
      }),
      limits: { fileSize: Number(process.env.AVATAR_SIZE_FILE) * 1024 * 1024 },
      fileFilter: (
        _req: any,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new UnsupportedMediaTypeException(
              'Only use jpg jpeg or png files!',
            ),
            false,
          );
        }
      },
    };
  }
}
