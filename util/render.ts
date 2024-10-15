export function renderSkinHead(texture: string): string {
    return renderSkinTexture(texture, {overlay: false, body: false});
}

export function renderSkinBody(texture: string): string {
    return renderSkinTexture(texture, {overlay: false, body: true});
}

export function renderSkinTexture(texture: string, options: { overlay: boolean, body: boolean }): string {
    if (!texture) {
        return;
    }
    const params = new URLSearchParams()
    params.set('overlay', `${ options.overlay || false }`)
    params.set('body', `${ options.body || false }`)
    if (!texture.startsWith('http') && !texture.startsWith('data')) {
        texture = `http://textures.minecraft.net/texture/${ texture }`
    }
    params.set('url', texture)
    return `https://render.mineskin.org/render?${ params.toString() }`
}

export function textureUrlForUuid(uuid: string) {
    return `https://crafatar.com/skins/${ uuid }`;
}

export function fileAsBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}