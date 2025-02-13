import type { SkinVariant } from "@mineskin/types";

export function renderSkinHead(texture: string): string {
    return renderSkinTexture(texture, {overlay: true, body: false, scale: 10});
}

export function renderSkinHeadIcon(texture: string): string {
    return renderSkinTexture(texture, {overlay: true, body: false, scale: 2});
}

export function renderSkinBody(texture: string, variant?: SkinVariant): string {
    return renderSkinTexture(texture, {
        overlay: true,
        body: true,
        scale: 10,
        slim: variant === 'slim'
    });
}

export interface SkinRenderOptions {
    overlay: boolean;
    body: boolean;
    scale: number;
    slim: boolean;
}

export function renderSkinTexture(texture: string, options: Partial<SkinRenderOptions>): string {
    if (!texture) {
        return;
    }
    const params = new URLSearchParams()
    params.set('overlay', `${ options.overlay || false }`)
    params.set('body', `${ options.body || false }`)
    params.set('scale', `${ options.scale || 10 }`)
    params.set('slim', `${ options.slim || false }`)
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