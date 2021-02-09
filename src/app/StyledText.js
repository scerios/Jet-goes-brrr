import { TextStyle } from '@pixi/text';

export class StyledText extends TextStyle {

    constructor() {
        super();
    }

    setDropShadow(alpha, angle, blur, distance) {
        this.dropShadow = true;
        this.dropShadowAlpha = alpha;
        this.dropShadowAngle = angle;
        this.dropShadowBlur = blur;
        this.dropShadowDistance = distance;
    }

    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily;
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize;
    }

    setFontStyle(fontStyle) {
        this.fontStyle = fontStyle;
    }

    setFontVariant(fontVariant) {
        this.fontVariant = fontVariant;
    }

    setFontWeight(fontWeight) {
        this.fontWeight = fontWeight;
    }

    setLetterSpacing(letterSpacing) {
        this.letterSpacing = letterSpacing;
    }

    setColor(color) {
        this.fill = color;
    }

    setStroke(color) {
        this.stroke = color;
    }

    setStrokeThickness(thickness) {
        this.strokeThickness = thickness;
    }

    getStartingText(color) {
        this.setDropShadow(true, 0.6, 0.6, 5, 3);
        this.setFontFamily('Roboto, sans-serif');
        this.setFontSize(40);
        this.setFontStyle('italic');
        this.setFontVariant('small-caps');
        this.setFontWeight('bold');
        this.setLetterSpacing(5);
        this.setColor(color);

        return this;
    }

    getPointsText() {
        this.setFontFamily('Roboto, sans-serif');
        this.setFontSize(40);
        this.setFontWeight('bold');
        this.setColor('#111111');
        this.setFontVariant('small-caps');
        this.setLetterSpacing(2);

        return this;
    }

    getPointsTextValue() {
        this.setFontFamily('Roboto, sans-serif');
        this.setFontSize(40);
        this.setFontWeight('bold');
        this.setColor('#27ae60');

        return this;
    }
}