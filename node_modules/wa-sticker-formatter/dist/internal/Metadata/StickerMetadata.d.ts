import { Categories, IStickerConfig, IStickerOptions } from '../../Types';
export default class StickerMetadata implements IStickerOptions {
    pack: string;
    author: string;
    categories: Categories[];
    id: string;
    crop: boolean;
    full: boolean;
    constructor(pack?: string, author?: string, categories?: Categories[], id?: string);
    static from: (object: Partial<StickerMetadata>) => StickerMetadata;
    setPack: (title: string) => this;
    setAuthor: (author: string) => this;
    setId: (id: string) => this;
    setCrop: (value: boolean) => this;
    setFull: (value: boolean) => this;
    setCategories: (categories: string | string[]) => this;
    toJSON: () => IStickerConfig;
}
