
function findSearchResultBoundsRange(searchResult) {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLon = Infinity;
    let maxLon = -Infinity;
	if (!searchResult) return

    searchResult.forEach((item) => {
        const coordinates = item.geometry.coordinates;

        if (coordinates[0] < minLon) minLon = coordinates[0];
        if (coordinates[0] > maxLon) maxLon = coordinates[0];
        if (coordinates[1] < minLat) minLat = coordinates[1];
        if (coordinates[1] > maxLat) maxLat = coordinates[1];
    });

    if(minLat === maxLat && minLon === maxLon){
	   minLat = minLat - 0.01
	   maxLat = maxLat + 0.01
	   minLon = minLon - 0.01
	   maxLon = maxLon + 0.01
	}
    return [
        [minLon, minLat],
        [maxLon, maxLat]
    ];
}

export async function setupSearch(map, dataSource) {
    const {YMapDefaultMarker, YMapSearchControl} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
    const searchControl = new YMapSearchControl({});
     map.addChild(
      new YMapControls({position: 'top'}).addChild(
        searchControl
      )
    );

    searchControl.events.add('request', async (event) => {
        const request = event.get('request');
        if (!request) return;

        try {
            const searchResponse = await ymaps3.search(request);

            dataSource.data = { type: 'FeatureCollection', features: [] };

            const searchFeatures = searchResponse.features.map((feature) => {
              const marker = new YMapDefaultMarker({
                coordinates: feature.geometry.coordinates,
                title: feature.properties.name,
                subtitle: feature.properties.description,

              });
              map.addChild(marker);

                return {
                    type: 'Feature',
                    id: feature.properties.id,
                    geometry: {
                        type: 'Point',
                        coordinates: feature.geometry.coordinates
                    },
                    properties: feature.properties
                };
            });

            if (searchFeatures.length > 0) {
                const bounds = findSearchResultBoundsRange(searchResponse.features);
                map.setBounds(bounds, { duration: 500 });
            }


        } catch (error) {
            console.error("Ошибка поиска:", error);
            alert("Ошибка при выполнении поиска.");
        }
    });
}