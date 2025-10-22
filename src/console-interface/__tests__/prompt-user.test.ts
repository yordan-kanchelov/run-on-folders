import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import prompts from "prompts";

import listDirectories from "../../utils/list-directories";
import promptUser from "../promp-user";

jest.mock("prompts");
jest.mock("../../utils/list-directories");

const mockedPrompts = prompts as jest.MockedFunction<typeof prompts>;
const mockedListDirectories = listDirectories as jest.MockedFunction<
    typeof listDirectories
>;

describe("promptUser", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.cwd = jest.fn().mockReturnValue("/test/cwd") as any;
    });

    it("should return CommandOptions with user input", async () => {
        mockedListDirectories.mockReturnValue(["dir1", "dir2", "node_modules"]);
        mockedPrompts.mockResolvedValue({
            command: "npm install",
            selectedDirectories: ["dir1", "dir2"],
        });

        const result = await promptUser();

        expect(result.command).toBe("npm install");
        expect(result.selectedDirectories).toEqual(["dir1", "dir2"]);
    });

    it("should call listDirectories with current working directory", async () => {
        mockedListDirectories.mockReturnValue(["dir1"]);
        mockedPrompts.mockResolvedValue({
            command: "test",
            selectedDirectories: ["dir1"],
        });

        await promptUser();

        expect(mockedListDirectories).toHaveBeenCalledWith("/test/cwd");
    });

    it("should filter out ignored directories from auto-selection", async () => {
        const directories = [
            "src",
            "tests",
            "node_modules",
            ".git",
            ".vscode",
            ".github",
        ];
        mockedListDirectories.mockReturnValue(directories);

        mockedPrompts.mockResolvedValue({
            command: "ls",
            selectedDirectories: ["src", "tests"],
        });

        await promptUser();

        expect(mockedPrompts).toHaveBeenCalled();
        const promptArgs = (mockedPrompts.mock.calls[0] as any)[0];
        const choices = promptArgs[1].choices;

        const nodeModulesChoice = choices.find(
            (c: any) => c.value === "node_modules"
        );
        const gitChoice = choices.find((c: any) => c.value === ".git");
        const srcChoice = choices.find((c: any) => c.value === "src");

        expect(nodeModulesChoice?.selected).toBe(false);
        expect(gitChoice?.selected).toBe(false);
        expect(srcChoice?.selected).toBe(true);
    });

    it("should include all directories as choices even if ignored", async () => {
        const directories = ["src", "node_modules", ".git"];
        mockedListDirectories.mockReturnValue(directories);

        mockedPrompts.mockResolvedValue({
            command: "ls",
            selectedDirectories: ["src"],
        });

        await promptUser();

        const promptArgs = (mockedPrompts.mock.calls[0] as any)[0];
        const choices = promptArgs[1].choices;

        expect(choices).toHaveLength(3);
        expect(choices.map((c: any) => c.value)).toEqual([
            "src",
            "node_modules",
            ".git",
        ]);
    });

    it("should create proper prompt structure", async () => {
        mockedListDirectories.mockReturnValue(["dir1"]);
        mockedPrompts.mockResolvedValue({
            command: "test",
            selectedDirectories: ["dir1"],
        });

        await promptUser();

        const promptArgs = (mockedPrompts.mock.calls[0] as any)[0];

        expect(promptArgs).toHaveLength(2);
        expect(promptArgs[0]).toMatchObject({
            type: "text",
            name: "command",
            message: "Enter command which will be executed on each folder",
        });
        expect(promptArgs[1]).toMatchObject({
            type: "multiselect",
            name: "selectedDirectories",
            message: "Select desired directories",
        });
    });

    it("should handle empty directory list", async () => {
        mockedListDirectories.mockReturnValue([]);
        mockedPrompts.mockResolvedValue({
            command: "echo test",
            selectedDirectories: [],
        });

        const result = await promptUser();

        expect(result.command).toBe("echo test");
        expect(result.selectedDirectories).toEqual([]);
    });

    it("should handle user selecting all directories including ignored ones", async () => {
        mockedListDirectories.mockReturnValue(["src", "node_modules", ".git"]);
        mockedPrompts.mockResolvedValue({
            command: "ls",
            selectedDirectories: ["src", "node_modules", ".git"],
        });

        const result = await promptUser();

        expect(result.selectedDirectories).toEqual([
            "src",
            "node_modules",
            ".git",
        ]);
    });

    it("should mark .vscode as not selected by default", async () => {
        mockedListDirectories.mockReturnValue([".vscode", "src"]);
        mockedPrompts.mockResolvedValue({
            command: "test",
            selectedDirectories: ["src"],
        });

        await promptUser();

        const promptArgs = (mockedPrompts.mock.calls[0] as any)[0];
        const choices = promptArgs[1].choices;
        const vscodeChoice = choices.find((c: any) => c.value === ".vscode");

        expect(vscodeChoice?.selected).toBe(false);
    });

    it("should mark .github as not selected by default", async () => {
        mockedListDirectories.mockReturnValue([".github", "src"]);
        mockedPrompts.mockResolvedValue({
            command: "test",
            selectedDirectories: ["src"],
        });

        await promptUser();

        const promptArgs = (mockedPrompts.mock.calls[0] as any)[0];
        const choices = promptArgs[1].choices;
        const githubChoice = choices.find((c: any) => c.value === ".github");

        expect(githubChoice?.selected).toBe(false);
    });
});
