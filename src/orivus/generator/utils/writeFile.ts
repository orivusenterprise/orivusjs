import fs from "fs";
import path from "path";
import crypto from "crypto";
// import { chalk } from "@orivus/cli/chalk"; // Removed missing import

/**
 * Calculates a short SHA-256 hash of the content
 */
function calculateHash(content: string): string {
    const normalized = content.replace(/\r\n/g, "\n").trim();
    return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 12);
}

interface WriteOptions {
    overwrite?: boolean; // Force overwrite regardless of changes
    dryRun?: boolean; // Don't write, just simulate
}

type WriteResult = "created" | "updated" | "skipped" | "conflict";

export function writeFileSafely(filePath: string, content: string, options: WriteOptions = {}): WriteResult {
    const dir = path.dirname(filePath);

    // 1. Create directory if not exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // 2. Prepare content with hash header
    // Helper to add hash only if file type supports comments (simplistic for now: ts/tsx/js/css)
    const ext = path.extname(filePath);
    const supportsComments = [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"].includes(ext);

    let finalContent = content;
    let newHash = "";

    if (supportsComments) {
        newHash = calculateHash(content);
        const hashHeader = `// @orivus-hash: ${newHash}\n`;
        finalContent = hashHeader + content;
    }

    // 3. Check for existing file
    if (fs.existsSync(filePath)) {
        const existingContent = fs.readFileSync(filePath, "utf-8");

        // Try to parse existing hash
        const hashMatch = existingContent.match(/^\/\/ @orivus-hash: ([a-f0-9]+)\n/);

        if (hashMatch) {
            const storedHash = hashMatch[1];
            const contentWithoutHeader = existingContent.replace(hashMatch[0], "");
            const currentHash = calculateHash(contentWithoutHeader);

            // CASE A: User has NOT modified the file (Hashes match)
            if (storedHash === currentHash) {
                // Safe to update!
                if (contentWithoutHeader === content) {
                    // No changes from generator side either
                    return "skipped";
                }
                // Generator has new content, user hasn't touched file -> UPDATE
                fs.writeFileSync(filePath, finalContent, "utf-8");
                console.log(`🔄 Updated: ${filePath} (Safe update)`);
                return "updated";
            }

            // CASE B: User HAS modified the file (Hash mismatch)
            // But if force option is on, we overwrite
            if (options.overwrite) {
                fs.writeFileSync(filePath, finalContent, "utf-8");
                console.log(`⚠️  Overwritten (Force): ${filePath}`);
                return "updated";
            }

            // Conflict! User modified code vs New Generated code
            // Write a .new file
            const newFilePath = filePath + ".new";
            fs.writeFileSync(newFilePath, finalContent, "utf-8");
            console.log(`🛑 Conflict: ${filePath} (User modifications detected)`);
            console.log(`   -> Created: ${path.basename(newFilePath)}`);
            return "conflict";
        } else {
            // CASE C: File exists but no hash (Legacy or User created)
            // Treat as Conflict unless forced
            if (options.overwrite) {
                fs.writeFileSync(filePath, finalContent, "utf-8");
                console.log(`⚠️  Overwritten (Force): ${filePath}`);
                return "updated";
            }

            // Check if content is actually identical (ignoring hash) to avoid noisy conflicts
            if (existingContent === content) {
                return "skipped";
            }

            const newFilePath = filePath + ".new";
            fs.writeFileSync(newFilePath, finalContent, "utf-8");
            console.log(`🛑 Conflict: ${filePath} (No hash found)`);
            console.log(`   -> Created: ${path.basename(newFilePath)}`);
            return "conflict";
        }
    }

    // 4. File doesn't exist - Just write it
    fs.writeFileSync(filePath, finalContent, "utf-8");
    console.log(`✨ Created: ${filePath}`);
    return "created";
}