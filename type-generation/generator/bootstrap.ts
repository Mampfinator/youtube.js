import { mkdir, access, constants, rm } from "fs/promises";
import { join } from "path";

export const BASE_OUT_DIR = join(__dirname, "..", "out");

export async function bootstrap() {
    async function exists(path: string): Promise<boolean> {
        return access(path, constants.F_OK)
            .then(() => true)
            .catch(() => false);
    }
    async function ensureDir(path: string): Promise<void> {
        if (!(await exists(path))) await mkdir(path);
    }

    await rm(BASE_OUT_DIR, { recursive: true, force: true });

    await ensureDir(BASE_OUT_DIR);
    await ensureDir(join(BASE_OUT_DIR, "ytInitialData"));
    await ensureDir(join(BASE_OUT_DIR, "ytCfg"));
    await ensureDir(join(BASE_OUT_DIR, "ytInitialPlayerResponse"));
}
