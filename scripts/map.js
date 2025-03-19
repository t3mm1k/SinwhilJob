
async function initMap() {
    await ymaps3.ready;
  
    const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapFeatureDataSource,
        YMapLayer,
        YMapMarker
    } = ymaps3;
    

    ymaps3.import.loaders.unshift(async (pkg) => {
        if (!pkg.includes('@yandex/ymaps3-clusterer')) {
          return;
        }
      
        if (location.href.includes('localhost')) {
          await ymaps3.import.script(`/dist/index.js`);
        } else {
          // You can use another CDN
          await ymaps3.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
        }
      
        Object.assign(ymaps3, window[`${pkg}`]);
        return window[`${pkg}`];
      });
      

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
  
  
    // Функция для создания HTML-элемента маркера на основе marketplace
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
        default: logoSrc = '../assets/icons/logo-dark.svg'; // Fallback
      }
  
      markerElement.innerHTML = `
        <img src="${logoSrc}" alt="${marketplace}">
        <div class="marker-context">
          <span>${marketplace}</span>
          <span>${adInfo}</span>
        </div>
      `;
      return markerElement;
    }
  
  
    // Функция для рендеринга обычных маркеров
    const markerRenderer = (feature) => {
      const { marketplace, adInfo } = feature.properties;
      const coordinates = feature.geometry.coordinates;
      const markerElement = createMarketplaceMarker(marketplace, adInfo);
  
      return new YMapMarker({ coordinates, source: 'my-source' }, markerElement);
    };
  
  
    // Функция рендеринга кластера
    function clusterRenderer(coordinates, features) {
      const count = features.length;
      const clusterElement = document.createElement('div');
      clusterElement.classList.add('cluster-circle');
      clusterElement.textContent = count;
      return new YMapMarker({ coordinates, source: 'my-source' }, clusterElement);
    }
  
    // Предполагаемый массив данных
    const data = [
      [37.6173, 55.7558, "Wildberries", "От 5500/в день"],
      [37.6273, 55.7658, "Yandex", "Доставка сегодня"],
      [37.5, 55.6, "Ozon", "Срочная вакансия"],
      [37.7, 55.8, "Avito", "Подработка на выходные"],
      [37.4, 55.9, "Boxberry", "Гибкий график"],
      [37.6373, 55.7758, "Wildberries", "От 6000/в день"],
      [37.6473, 55.7858, "Yandex", "Доставка завтра"],
      [37.51, 55.61, "Ozon", "Супер работа"],
      [37.71, 55.81, "Avito", "Подработка на будни"],
      [37.41, 55.91, "Boxberry", "Удобный график"]
    ];
  
  
    // Преобразование данных в формат GeoJSON Feature
    const points = data.map((item, i) => ({
      type: 'Feature',
      id: i,
      geometry: { coordinates: [item[0], item[1]] },
      properties: { marketplace: item[2], adInfo: item[3] }
    }));
  
  
    // Создаем кластеризатор
    const clusterer = new YMapClusterer({
      method: clusterByGrid({ gridSize: 48 }),
      features: points,
      marker: markerRenderer,
      cluster: clusterRenderer
    });
  
    map.addChild(clusterer);
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    initMap();
  });