import * as fs from 'fs';
import * as path from 'path';
import {WsException} from '@nestjs/websockets';

export class FinderService {
    async getFiles(dir: string): Promise<string[]> {
        const directoryPath = path.join(__dirname, '../../client', dir);

        let files: string[];
        try {
             files = fs.readdirSync(directoryPath);
        } catch (e) {
            throw new WsException(e.message);
        }
        files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

        return files;
    }
}
