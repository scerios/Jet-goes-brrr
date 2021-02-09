import { Text } from '@pixi/text';
import { WorldDetail } from './WorldDetail.js';
import { StyledText } from './StyledText.js';

export class TextHandler {
    pointsText;
    pointsValue;

    getStartingTexts() {
        let readyStyle = new StyledText();
        let ready = new Text('Ready', readyStyle.getStartingText('#2f3640'));
        ready.position.set(WorldDetail.getGameWidth / 2 - 100, WorldDetail.getGameHeight / 2 - 40);

        let setStyle = new StyledText();
        let set = new Text('Set', setStyle.getStartingText('#eb2f06'));
        set.position.set(WorldDetail.getGameWidth / 2 - 70, WorldDetail.getGameHeight / 2 - 40);

        let goStyle = new StyledText();
        let go = new Text('GO', goStyle.getStartingText('#27ae60'));
        go.position.set(WorldDetail.getGameWidth / 2 - 60, WorldDetail.getGameHeight / 2 - 40);

        return [ready, set, go];
    }

    setPointsTexts() {
        let pointsTextStyle = new StyledText();
        this.pointsText = new Text('Points:', pointsTextStyle.getPointsText());
        this.pointsText.position.set(WorldDetail.getGameWidth - 250, 20);

        let pointsValueStyle = new StyledText();
        this.pointsValue = new Text('0', pointsValueStyle.getPointsTextValue());
        this.pointsValue.position.set(WorldDetail.getGameWidth - 80, 20);
    }

    setPointsValue(text) {
        this.pointsValue.text = text;
    }

    getPointsText() {
        return this.pointsText;
    }

    getPointsValue() {
        return this.pointsValue;
    }
}