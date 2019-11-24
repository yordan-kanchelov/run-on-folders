import chalk from "chalk";
import executeShellCommand from "./utils/executeShellCommand";
import listDirectories from "./utils/listDirectories";

const command = process.argv.slice(2).join(" ");

try {
    process.chdir(__dirname);
    console.log(`New directory: ${process.cwd()}`);
} catch (err) {
    console.error(`chdir: ${err}`);
}

(async () => {
    const directories = listDirectories(__dirname);

    await Promise.all(
        directories.map(directory => {
            return executeShellCommand(command, { cwd: directory });
        })
    );
})();
