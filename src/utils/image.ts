export function resolveImagePath(src: string | undefined): string {
    if (!src) return "";
    if (src.startsWith("http") || src.startsWith("/")) {
        return src;
    }
    return `/images/${src}`;
}
