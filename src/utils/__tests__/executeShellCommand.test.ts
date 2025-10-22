import { exec } from "child_process";

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import executeShellCommand from "../executeShellCommand";

jest.mock("child_process");
jest.mock("chalk");
jest.mock("fancy-log");

const mockedExec = exec as jest.MockedFunction<typeof exec>;

describe("executeShellCommand", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should execute command successfully with stdout", async () => {
        const mockStdout = "command output";
        mockedExec.mockImplementation(((
            _command: string,
            _options: unknown,
            callback: (
                error: Error | null,
                stdout: string,
                stderr: string
            ) => void
        ) => {
            callback(null, mockStdout, "");
            return {} as any;
        }) as any);

        await executeShellCommand("echo test", { cwd: "/test/path" });

        expect(mockedExec).toHaveBeenCalledWith(
            "echo test",
            { cwd: "/test/path" },
            expect.any(Function)
        );
    });

    it("should execute command successfully with stderr", async () => {
        const mockStderr = "warning message";
        mockedExec.mockImplementation(((
            _command: string,
            _options: unknown,
            callback: (
                error: Error | null,
                stdout: string,
                stderr: string
            ) => void
        ) => {
            callback(null, "", mockStderr);
            return {} as any;
        }) as any);

        await executeShellCommand("echo test", { cwd: "/test/path" });

        expect(mockedExec).toHaveBeenCalledWith(
            "echo test",
            { cwd: "/test/path" },
            expect.any(Function)
        );
    });

    it("should handle command execution without any output", async () => {
        mockedExec.mockImplementation(((
            _command: string,
            _options: unknown,
            callback: (
                error: Error | null,
                stdout: string,
                stderr: string
            ) => void
        ) => {
            callback(null, "", "");
            return {} as any;
        }) as any);

        await executeShellCommand("ls", { cwd: "/test/path" });

        expect(mockedExec).toHaveBeenCalledWith(
            "ls",
            { cwd: "/test/path" },
            expect.any(Function)
        );
    });

    it("should handle command execution errors gracefully", async () => {
        const mockError = new Error("Command failed");
        mockedExec.mockImplementation(((
            _command: string,
            _options: unknown,
            callback: (
                error: Error | null,
                stdout: string,
                stderr: string
            ) => void
        ) => {
            callback(mockError, "", "");
            return {} as any;
        }) as any);

        await executeShellCommand("invalid-command", { cwd: "/test/path" });

        expect(mockedExec).toHaveBeenCalledWith(
            "invalid-command",
            { cwd: "/test/path" },
            expect.any(Function)
        );
    });

    it("should pass through exec options correctly", async () => {
        mockedExec.mockImplementation(((
            _command: string,
            _options: unknown,
            callback: (
                error: Error | null,
                stdout: string,
                stderr: string
            ) => void
        ) => {
            callback(null, "output", "");
            return {} as any;
        }) as any);

        const options = {
            cwd: "/custom/path",
            env: { NODE_ENV: "test" },
            timeout: 5000,
        };

        await executeShellCommand("npm test", options);

        expect(mockedExec).toHaveBeenCalledWith(
            "npm test",
            options,
            expect.any(Function)
        );
    });

    it("should handle both stdout and stderr simultaneously", async () => {
        const mockStdout = "success output";
        const mockStderr = "warning output";

        mockedExec.mockImplementation(((
            _command: string,
            _options: unknown,
            callback: (
                error: Error | null,
                stdout: string,
                stderr: string
            ) => void
        ) => {
            callback(null, mockStdout, mockStderr);
            return {} as any;
        }) as any);

        await executeShellCommand("npm install", { cwd: "/test/path" });

        expect(mockedExec).toHaveBeenCalledWith(
            "npm install",
            { cwd: "/test/path" },
            expect.any(Function)
        );
    });
});
