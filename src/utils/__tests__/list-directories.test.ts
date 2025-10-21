import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import listDirectories from "../list-directories";

describe("listDirectories", () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "list-directories-test-"));
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("should return an empty array when directory has no subdirectories", () => {
        fs.writeFileSync(path.join(tempDir, "file1.txt"), "content");
        fs.writeFileSync(path.join(tempDir, "file2.txt"), "content");

        const result = listDirectories(tempDir);

        expect(result).toEqual([]);
    });

    it("should return only directories, not files", () => {
        fs.mkdirSync(path.join(tempDir, "dir1"));
        fs.mkdirSync(path.join(tempDir, "dir2"));
        fs.writeFileSync(path.join(tempDir, "file.txt"), "content");

        const result = listDirectories(tempDir);

        expect(result).toHaveLength(2);
        expect(result).toContain("dir1");
        expect(result).toContain("dir2");
        expect(result).not.toContain("file.txt");
    });

    it("should return all directories in the path", () => {
        fs.mkdirSync(path.join(tempDir, "dir1"));
        fs.mkdirSync(path.join(tempDir, "dir2"));
        fs.mkdirSync(path.join(tempDir, "dir3"));

        const result = listDirectories(tempDir);

        expect(result).toHaveLength(3);
        expect(result).toContain("dir1");
        expect(result).toContain("dir2");
        expect(result).toContain("dir3");
    });

    it("should include hidden directories", () => {
        fs.mkdirSync(path.join(tempDir, ".hidden"));
        fs.mkdirSync(path.join(tempDir, "visible"));

        const result = listDirectories(tempDir);

        expect(result).toHaveLength(2);
        expect(result).toContain(".hidden");
        expect(result).toContain("visible");
    });

    it("should not include nested subdirectories", () => {
        fs.mkdirSync(path.join(tempDir, "dir1"));
        fs.mkdirSync(path.join(tempDir, "dir1", "nested"));
        fs.mkdirSync(path.join(tempDir, "dir2"));

        const result = listDirectories(tempDir);

        expect(result).toHaveLength(2);
        expect(result).toContain("dir1");
        expect(result).toContain("dir2");
        expect(result).not.toContain("nested");
    });

    it("should handle directory with special characters in names", () => {
        fs.mkdirSync(path.join(tempDir, "dir-with-dashes"));
        fs.mkdirSync(path.join(tempDir, "dir_with_underscores"));
        fs.mkdirSync(path.join(tempDir, "dir.with.dots"));

        const result = listDirectories(tempDir);

        expect(result).toHaveLength(3);
        expect(result).toContain("dir-with-dashes");
        expect(result).toContain("dir_with_underscores");
        expect(result).toContain("dir.with.dots");
    });
});
