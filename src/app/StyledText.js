import { TextStyle } from '@pixi/text';

export class StyledText extends TextStyle {

    constructor(color) {
        let style = {
            dropShadow: true,
            dropShadowAlpha: 0.6,
            dropShadowAngle: 0.6,
            dropShadowBlur: 5,
            dropShadowDistance: 3,
            fontFamily: "Roboto, sans-serif",
            fontSize: 40,
            fontStyle: "italic",
            fontVariant: "small-caps",
            fontWeight: "bold",
            letterSpacing: 5,
            fill: color
        };
        super(style)
    }
}