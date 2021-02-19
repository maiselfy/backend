import { diskStorage } from 'multer';

import { resolve } from 'path';
import { randomBytes } from 'crypto';
const tmpFolder = resolve(__dirname, '..', '..', 'tmp');
export default {
  directory: tmpFolder,
  storage: diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = randomBytes(10).toString('HEX');
      const filename = `${fileHash}-${file.originalname}`;
      return callback(null, filename);
    },
  }),
};
