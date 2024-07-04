import * as L from 'leaflet';

L.Control.ImageControl = L.Control.extend({
  onAdd: function(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control image-button');

    const link = L.DomUtil.create('a', 'ImageControlToggle', container);
    link.href = '#';
    link.title = 'Picture view';
    var markerClusterGroup = this.options.markerClusterGroup;


    link.classList.add('fixed-image');
    map.addLayer(markerClusterGroup);

    L.DomEvent.on(link, 'click', function(e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);

      if (!link.classList.contains('fixed-image')) {
        link.classList.add('fixed-image');
        if (markerClusterGroup) {
          map.addLayer(markerClusterGroup); // Show cluster markers
        }
      } else {
        link.classList.remove('fixed-image');
        if (markerClusterGroup) {
          map.removeLayer(markerClusterGroup); // Hide cluster markers
        }
      }  
      
    });

    return container;
  },

  onRemove: function(map) {
    // Cleanup if necessary
  }
});

L.control.ImageControl = function(opts) {
  return new L.Control.ImageControl(opts);
};
