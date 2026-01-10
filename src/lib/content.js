import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/content.json');

export async function getContent() {
    try {
        const fileContents = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading content file:', error);
        return null;
    }
}

export async function saveContent(data) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing content file:', error);
        return false;
    }
}
