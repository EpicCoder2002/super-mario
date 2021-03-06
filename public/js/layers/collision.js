const createEntityLayer = (entities) => {
    return function drawBoundingBox(context, camera) {
        context.strokeStyle = '#800000';
        entities.forEach(entity => {
            context.beginPath();
            context.rect(entity.bounds.left - camera.pos.x, entity.bounds.top - camera.pos.y, entity.size.x, entity.size.y);
            context.stroke();
        });
    };
};

const createCandidateLayer = (tileResolver) => {
    const resolvedTiles = [];
    const tileSize = tileResolver.tileSize;
    const getByIndexOriginal = tileResolver.getByIndex;
    tileResolver.getByIndex = function getByIndexAlias(x, y) {
        resolvedTiles.push({
            x,
            y
        });
        return getByIndexOriginal.call(tileResolver, x, y);
    };
    return function drawTileCandidate(context, camera) {
        context.strokeStyle = '#1034A6';
        resolvedTiles.forEach(({
            x,
            y
        }) => {
            context.beginPath();
            context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
            context.stroke();
        });
        resolvedTiles.length = 0;
    };
};

export const createCollisionLayer = (level) => {

    const drawTileCandidates = level.tileCollider.resolvers.map(createCandidateLayer);
    const drawBoundingBoxes = createEntityLayer(level.entities);

    return function drawCollisionLayer(context, camera) {

        drawTileCandidates.forEach(draw => {
            draw(context, camera);
        });
        drawBoundingBoxes(context, camera);

    };
};