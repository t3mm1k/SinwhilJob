import { setupSearch } from "./search.js";

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
        case 'Wildberries': logoSrc = '../assets/icons/wb-logo.png'; break;
        case 'Yandex': logoSrc = '../assets/icons/yandex-market-logo.png'; break;
        case 'Ozon': logoSrc = '../assets/icons/ozon-logo.png'; break;
        case 'Avito': logoSrc = '../assets/icons/avito-logo.png'; break;
        case 'Boxberry': logoSrc = '../assets/icons/boxberry-logo.png'; break;
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
  
    const data = {
      "Москва": [
          { coordinates: [37.6173, 55.7558], marketplace: "Wildberries", adInfo: "От 5500/в день", vacancy_type: "full_time" },
          { coordinates: [37.6273, 55.7658], marketplace: "Yandex", adInfo: "От 5500/в день", vacancy_type: "part_time" },
          { coordinates: [37.5, 55.6], marketplace: "Ozon", adInfo: "От 5500/в день", vacancy_type: "part_time" },
          { coordinates: [37.7, 55.8], marketplace: "Avito", adInfo: "От 5500/в день", vacancy_type: "part_time" },
          { coordinates: [37.4, 55.9], marketplace: "Boxberry", adInfo: "От 5500/в день" },
          { coordinates: [37.4, 55.9], marketplace: "Wildberries", adInfo: "От 5500/в день", vacancy_type: "full_time" },
          { coordinates: [37.6473, 55.7858], marketplace: "Yandex", adInfo: "От 5500/в день", vacancy_type: "full_time" },
          { coordinates: [37.51, 55.61], marketplace: "Boxberry", adInfo: "От 5500/в день", vacancy_type: "full_time" },
          { coordinates: [37.71, 55.81], marketplace: "Avito", adInfo: "От 5500/в день", vacancy_type: "part_time" },
          { coordinates: [37.41, 55.81], marketplace: "Boxberry", adInfo: "От 5500/в день", vacancy_type: "full_time" }
      ]
  };

  function jitterCoordinates(coordinates, jitterAmount = 0.0001) {
      const [lng, lat] = coordinates;
      const jitteredLng = lng + (Math.random() - 0.5) * 2 * jitterAmount;
      const jitteredLat = lat + (Math.random() - 0.5) * 2 * jitterAmount;
      return [jitteredLng, jitteredLat];
  }
  const points = data["Москва"].map((item, i) => {
      const processedCoordinates = [];
      const existingPoint = processedCoordinates.find(coord => coord[0] === item.coordinates[0] && coord[1] === item.coordinates[1]);
      const coords = existingPoint ? jitterCoordinates(item.coordinates) : item.coordinates;
      processedCoordinates.push(coords);

      return {
          type: 'Feature',
          id: i,
          geometry: {
              type: 'Point',
              coordinates: coords
          },
          properties: {
              marketplace: item.marketplace,
              adInfo: item.adInfo,
              vacancy_type: item.vacancy_type
          }
      };
  });
  
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

  setupSearch(map, dataSource);
}
  
document.addEventListener('DOMContentLoaded', function () {
  initMap();
});