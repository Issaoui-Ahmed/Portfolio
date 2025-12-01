import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const filename = formData.get("filename") as string || file.name;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const relativePath = `/images/${Date.now()}-${filename}`;
        const absolutePath = path.join(process.cwd(), "public", relativePath);

        await fs.promises.writeFile(absolutePath, buffer);

        return NextResponse.json({ url: relativePath });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
