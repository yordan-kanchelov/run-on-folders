const command = process.argv.slice(2).join(" ");

(async () => {
    const fs = require("fs");
    const util = require("util");
    const exec = util.promisify(require("child_process").exec);

    async function executeShellCommand(command, options) {
        try {
            const { stdout, stderr } = await exec(command, options);
            console.log("stdout:", stdout);
            console.log("stderr:", stderr);
        } catch (e) {
            console.error(e);
        }
    }

    const files = fs.readdirSync(__dirname);
    const directories = files.filter(path => {
        return fs.statSync(path).isDirectory();
    });

    for (let directoryIndex = 0; directoryIndex < directories.length; directoryIndex++) {
        const directory = directories[directoryIndex];

        console.log(
            "\x1b[31m%s\x1b[0m",
            `
        ${"-".repeat(directory.length + 4)}
        - ${directory} -
        ${"-".repeat(directory.length + 4)}
        `
        );

        await executeShellCommand(command, { cwd: directory });

        console.log(
            "\x1b[31m%s\x1b[0m",
            `
        ${"-".repeat(32)}
        `
        );
    }
})();
