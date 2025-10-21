import * as fs from "fs";
import * as path from "path";

export default function (dirPath: string): string[] {
    const files = fs.readdirSync(dirPath);
    const directories = files.filter((file) => {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });

    return directories;
}
