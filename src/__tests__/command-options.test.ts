import { describe, expect, it } from "@jest/globals";
import CommandOptions from "../command-options";

describe("CommandOptions", () => {
    it("should create instance with command and directories", () => {
        const command = "npm install";
        const directories = ["dir1", "dir2", "dir3"];

        const options = new CommandOptions(command, directories);

        expect(options.command).toBe(command);
        expect(options.selectedDirectories).toEqual(directories);
    });

    it("should store empty directories array", () => {
        const command = "ls";
        const directories: string[] = [];

        const options = new CommandOptions(command, directories);

        expect(options.command).toBe(command);
        expect(options.selectedDirectories).toEqual([]);
    });

    it("should store single directory", () => {
        const command = "git status";
        const directories = ["single-dir"];

        const options = new CommandOptions(command, directories);

        expect(options.command).toBe(command);
        expect(options.selectedDirectories).toEqual(directories);
    });

    it("should handle complex commands with arguments", () => {
        const command = "npm run build --production";
        const directories = ["frontend", "backend"];

        const options = new CommandOptions(command, directories);

        expect(options.command).toBe(command);
        expect(options.selectedDirectories).toEqual(directories);
    });

    it("should preserve directory order", () => {
        const command = "test";
        const directories = ["z-dir", "a-dir", "m-dir"];

        const options = new CommandOptions(command, directories);

        expect(options.selectedDirectories).toEqual(["z-dir", "a-dir", "m-dir"]);
    });

    it("should handle directories with special characters", () => {
        const command = "ls -la";
        const directories = [
            "dir-with-dashes",
            "dir_with_underscores",
            "dir.with.dots",
        ];

        const options = new CommandOptions(command, directories);

        expect(options.selectedDirectories).toEqual(directories);
    });

    it("should allow duplicate directories in array", () => {
        const command = "echo test";
        const directories = ["dir1", "dir1", "dir2"];

        const options = new CommandOptions(command, directories);

        expect(options.selectedDirectories).toHaveLength(3);
        expect(options.selectedDirectories).toEqual(["dir1", "dir1", "dir2"]);
    });

    it("should handle empty command string", () => {
        const command = "";
        const directories = ["dir1"];

        const options = new CommandOptions(command, directories);

        expect(options.command).toBe("");
        expect(options.selectedDirectories).toEqual(directories);
    });

    it("should handle command with quotes", () => {
        const command = 'echo "hello world"';
        const directories = ["dir1"];

        const options = new CommandOptions(command, directories);

        expect(options.command).toBe('echo "hello world"');
    });

    it("should handle paths with slashes", () => {
        const command = "npm test";
        const directories = ["src/components", "src/utils", "tests"];

        const options = new CommandOptions(command, directories);

        expect(options.selectedDirectories).toEqual([
            "src/components",
            "src/utils",
            "tests",
        ]);
    });
});
