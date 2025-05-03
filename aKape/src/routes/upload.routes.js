import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// Para obtener __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta destino
const uploadDir = path.join(__dirname, "../images/productos");

// Asegúrate de que exista la carpeta
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Usamos multer en modo memoria (en lugar de escribir directo al disco)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta con reescalado
router.post("/subir-imagen", upload.single("imagen"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ninguna imagen" });
        }

        const ext = path.extname(req.file.originalname); // extensión original
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        const outputPath = path.join(uploadDir, uniqueName);

        // Redimensionar la imagen (por ejemplo, 300x300)
        await sharp(req.file.buffer)
            .resize(350, 273, {
                fit: "cover", // puedes usar "contain" o "inside" según necesidad
            })
            .toFile(outputPath);

        res.json({ nombreArchivo: uniqueName });

    } catch (error) {
        console.error("Error al procesar la imagen:", error);
        res.status(500).json({ error: "Error al procesar la imagen" });
    }
});

export default router;
