ymaps.ready(init);

let map, placemark;

function isMobile() {
    return window.innerWidth < 768;
}

function getCenterCoords() {
    return isMobile() ? [55.106800, 61.619700] : [55.107000, 61.621500];
}

function getPlacemarkCoords() {
    return isMobile() ? [55.106900, 61.619400] : [55.106920, 61.619370];
}

function getZoomLevel() {
    return isMobile() ? 16 : 17;
}

function init() {
    map = new ymaps.Map('map', {
        center: getCenterCoords(),
        zoom: getZoomLevel(),
        controls: ['zoomControl', 'fullscreenControl']
    });

    placemark = new ymaps.Placemark(
        getPlacemarkCoords(),
        {},
        {
            balloonVisible: false,
            openBalloonOnClick: false,
            hasHint: false,
            iconLayout: 'default#image',
            iconImageHref: '/assets/icons/icon.png',
            iconImageSize: [60, 60],
            iconImageOffset: [-20, -40]
        }
    );

    map.geoObjects.add(placemark);
}

window.addEventListener('resize', function () {
    if (map && placemark) {
        const newCenter = getCenterCoords();
        const newPlacemarkCoords = getPlacemarkCoords();
        const newZoom = getZoomLevel();

        map.setCenter(newCenter);
        placemark.geometry.setCoordinates(newPlacemarkCoords);
        map.setZoom(newZoom);
    }
});


// переключение актив на мобильной шапке
document.querySelectorAll('.mobile-brand .mobile-navigate a').forEach(link => {
    const img = link.querySelector('img');
    const activeSrc = img.dataset.active;
    const defaultSrc = img.getAttribute('src');

    if (link.classList.contains('active') && activeSrc) {
      img.setAttribute('src', activeSrc);
    } else {
      img.setAttribute('src', defaultSrc);
    }
});