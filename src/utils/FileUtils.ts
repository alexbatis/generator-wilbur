import * as fs from "fs";
const rmfr = require('rmfr');
const chalk = require('chalk');

export class FileUtils {
    
    /* Check if a file exists */
    verifyFileExists(filePath: string): boolean {
        return (fs.existsSync(filePath));
    }
    
    /* Deletes all contents within a directory : TODO: confirm deletion from user first */
    async removeDirectory(folderPath: string) {
        await rmfr(folderPath);
        console.log(`${chalk.red(`deleted`)} ${folderPath}\n`);
    }
}