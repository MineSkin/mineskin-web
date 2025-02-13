export function fileToBase64(file: Blob | File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function fileFromBase64(base64: string, filename: string, meta: FilePropertyBag): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
        ...meta,
        type: mime
    });
}

export async function fileToJson(file: File): Promise<FileJson> {
    return {
        data: await fileToBase64(file),
        type: file.type,
        name: file.name,
        size: file.size,
        lastModified: file.lastModified
    }
}

export async function fileFromJson(json: FileJson): Promise<File> {
    return fileFromBase64(json.data, json.name, json);
}

export type FileJson = FilePropertyBag & {
    data: string;
    name: string;
    size: number;
    lastModified: number;
}