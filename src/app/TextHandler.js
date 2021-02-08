import { Text } from '@pixi/text';
import { WorldDetail } from './WorldDetail.js';
import { StyledText } from './StyledText.js';

export class TextHandler {
    static get getStartingTexts() {
        let ready = new Text('Ready', new StyledText('#2f3640'));
        ready.position.set(WorldDetail.getGameWidth / 2 - 100, WorldDetail.getGameHeight / 2 - 40);

        let set = new Text('Set', new StyledText('#eb2f06'));
        set.position.set(WorldDetail.getGameWidth / 2 - 70, WorldDetail.getGameHeight / 2 - 40);

        let go = new Text('GO', new StyledText('#27ae60'));
        go.position.set(WorldDetail.getGameWidth / 2 - 60, WorldDetail.getGameHeight / 2 - 40);

        return [ready, set, go];
    }
}