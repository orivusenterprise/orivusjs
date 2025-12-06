import fs from "fs";
import path from "path";

export function writeFileSafely(filePath: string, content: string) {
    const dir = path.dirname(filePath);

    // Crear carpeta si no existe
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Escribir archivo
    fs.writeFileSync(filePath, content, "utf-8");

    console.log(`📄 Archivo generado: ${filePath}`);
}