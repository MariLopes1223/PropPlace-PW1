import crypto from 'node:crypto';
import multer from 'multer';
import { resolve } from 'node:path';

export default {
    upload(folder: string) {
        return {
            storage: multer.diskStorage({
                destination: resolve(__dirname, "..", "..", 'tmp', 'imovelImage'),
                filename: (request, file, callback) => {
                    const filename = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`;

                    return callback(null, filename);
                },
            }),
        };
    },
}