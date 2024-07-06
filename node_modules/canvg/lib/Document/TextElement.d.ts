import { RenderingContext2D } from '../types';
import BoundingBox from '../BoundingBox';
import Document from './Document';
import Element from './Element';
import FontElement from './FontElement';
import GlyphElement from './GlyphElement';
import RenderedElement from './RenderedElement';
export default class TextElement extends RenderedElement {
    type: string;
    protected x: number;
    protected y: number;
    private leafTexts;
    private textChunkStart;
    private minX;
    private maxX;
    private measureCache;
    constructor(document: Document, node: HTMLElement, captureTextNodes?: boolean);
    setContext(ctx: RenderingContext2D, fromMeasure?: boolean): void;
    protected initializeCoordinates(): void;
    getBoundingBox(ctx: RenderingContext2D): BoundingBox;
    protected getFontSize(): number;
    protected getTElementBoundingBox(ctx: RenderingContext2D): BoundingBox;
    getGlyph(font: FontElement, text: string, i: number): GlyphElement;
    getText(): string;
    protected getTextFromNode(node?: ChildNode): string;
    renderChildren(ctx: RenderingContext2D): void;
    protected renderTElementChildren(ctx: RenderingContext2D): void;
    protected applyAnchoring(): void;
    protected adjustChildCoordinatesRecursive(ctx: RenderingContext2D): void;
    protected adjustChildCoordinatesRecursiveCore(ctx: RenderingContext2D, textParent: TextElement, parent: Element, i: number): void;
    protected adjustChildCoordinates(ctx: RenderingContext2D, textParent: TextElement, parent: Element, i: number): TextElement;
    protected getChildBoundingBox(ctx: RenderingContext2D, textParent: TextElement, parent: Element, i: number): BoundingBox;
    protected renderChild(ctx: RenderingContext2D, textParent: TextElement, parent: Element, i: number): void;
    protected measureText(ctx: RenderingContext2D): number;
    protected measureTargetText(ctx: RenderingContext2D, targetText: string): number;
    /**
     * Inherits positional attributes from {@link TextElement} parent(s). Attributes
     * are only inherited from a parent to its first child.
     * @param name - The attribute name.
     * @returns The attribute value or null.
     */
    protected getInheritedAttribute(name: string): string | null;
}
//# sourceMappingURL=TextElement.d.ts.map