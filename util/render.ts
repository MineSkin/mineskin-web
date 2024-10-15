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
    params.set('url', `http://textures.minecraft.net/texture/${ texture }`)
    return `https://render.mineskin.org/render?${ params.toString() }`
}

export function textureUrlForUuid(uuid: string) {
    return `https://crafatar.com/skins/${ uuid }`;
}