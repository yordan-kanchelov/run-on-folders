import * as fs from "fs";

export default function(path: string): string[] {
    const files = fs.readdirSync(path);
    const directories = files.filter(path => {
        return fs.statSync(path).isDirectory();
    });

    return directories;
}
