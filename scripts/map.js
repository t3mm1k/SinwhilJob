
async function initMap() {
    await ymaps3.ready;
  
    const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapFeatureDataSource,
        YMapLayer,
        YMapMarker,
        YMapListener
    } = ymaps3;
    

    // ymaps3.import.loaders.unshift(async (pkg) => {
    //     if (!pkg.includes('@yandex/ymaps3-clusterer')) {
    //       return;
    //     }
      
    //     if (location.href.includes('localhost')) {
    //       await ymaps3.import.script(`/dist/index.js`);
    //     } else {
    //       await ymaps3.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
    //     }
      
    //     Object.assign(ymaps3, window[`${pkg}`]);
    //     return window[`${pkg}`];
    //   });
      

    const {YMapClusterer, clusterByGrid} = await ymaps3.import('@yandex/ymaps3-clusterer@0.0.1');


    const map = new YMap(
      document.getElementById('map'),
      {
        location: {
          center: [37.588144, 55.733842],
          zoom: 10
        }
      }
    );
  
    map.addChild(new YMapDefaultSchemeLayer());
  
    const dataSource = new YMapFeatureDataSource({ id: 'my-source' });
    map.addChild(dataSource);
    map.addChild(new YMapLayer({ source: 'my-source', type: 'markers', zIndex: 1800 }));
  
  
    function createMarketplaceMarker(marketplace, adInfo) {
      const markerElement = document.createElement('div');
      markerElement.classList.add('custom-marker');
  
      let logoSrc = '';
      switch (marketplace) {
        case 'Wildberries': logoSrc = '../assets/icons/wb-logo.svg'; break;
        case 'Yandex': logoSrc = '../assets/icons/yandex-market-logo.svg'; break;
        case 'Ozon': logoSrc = '../assets/icons/ozon-logo.svg'; break;
        case 'Avito': logoSrc = '../assets/icons/avito-logo.svg'; break;
        case 'Boxberry': logoSrc = '../assets/icons/boxberry-logo.svg'; break;
        default: logoSrc = '../assets/icons/logo-dark.svg'; 
      }
  
      markerElement.innerHTML = `
        <img src="${logoSrc}" alt="${marketplace}">
        <div class="marker-context">
          <p>${marketplace}</p>
          <p>${adInfo}</p>
        </div>
      `;
      return markerElement;
    }
  
  
    const markerRenderer = (feature) => {
      const { marketplace, adInfo } = feature.properties;
      const coordinates = feature.geometry.coordinates;
      const markerElement = createMarketplaceMarker(marketplace, adInfo);
  
      return new YMapMarker({ coordinates, source: 'my-source' }, markerElement);
    };
  
  
    function clusterRenderer(coordinates, features) {
      const count = features.length;
      const clusterElement = document.createElement('div');
      clusterElement.classList.add('cluster-circle');
      clusterElement.textContent = count;
      return new YMapMarker({ coordinates, source: 'my-source' }, clusterElement);
    }
  
    const data = [
      [37.6173, 55.7558, "Wildberries", "От 5500/в день"],
      [37.6273, 55.7658, "Yandex", "От 5500/в день"],
      [37.5, 55.6, "Ozon", "От 5500/в день"],
      [37.7, 55.8, "Avito", "От 5500/в день"],
      [37.4, 55.9, "Boxberry", "От 5500/в день"],
      [37.6373, 55.7758, "Wildberries", "От 5500/в день"],
      [37.6473, 55.7858, "Yandex", "От 5500/в день"],
      [37.51, 55.61, "Ozon", "От 5500/в день"],
      [37.71, 55.81, "Avito", "От 5500/в день"],
      [37.41, 55.91, "Boxberry", "От 5500/в день"]
    ];
  
  
    const points = data.map((item, i) => ({
      type: 'Feature',
      id: i,
      geometry: { coordinates: [item[0], item[1]] },
      properties: { marketplace: item[2], adInfo: item[3] }
    }));
  
  
    const clusterer = new YMapClusterer({
      method: clusterByGrid({ gridSize: 48 }),
      features: points,
      marker: markerRenderer,
      cluster: clusterRenderer
    });
  
    map.addChild(clusterer);
    
    const mapListener = new YMapListener({
      layer: 'any', 
      onUpdate: (event) => {
          const zoom = event.location.zoom;
          const markers = document.querySelectorAll('.custom-marker');

          markers.forEach(marker => {
              if (!marker.classList.contains('cluster-circle')) {
                  if (zoom < 12) {
                      marker.classList.add('icon-only');
                  } else {
                      marker.classList.remove('icon-only');
                  }
              }
          });
      }
  });

  map.addChild(mapListener);
}
  
document.addEventListener('DOMContentLoaded', function () {
  initMap();
});