export class CollisionDetector {
    static isDetected(elementA, elementB) {
        let isHit = false;

        if (elementA != undefined && elementB != undefined) {

            if (elementA.x + elementA.width >= elementB.x && elementA.x <= elementB.x + elementB.width) {

                if (elementA.y == elementB.y) {
                    isHit = true;

                } else if (elementA.y < elementB.y && elementA.y + elementA.height >= elementB.y) {
                    isHit = true;

                } else if (elementB.y < elementA.y && elementB.y + elementB.height >= elementA.y) {
                    isHit = true;
                }
            }
        }

        return isHit;
    };
}