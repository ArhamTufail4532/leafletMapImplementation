import * as L from 'leaflet';

L.Control.ImageControl = L.Control.extend({
  onAdd: function(map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control image-button');

    const link = L.DomUtil.create('a', 'ImageControlToggle', container);
    link.href = '#';
    link.title = 'Picture view';
    this.markerClusterGroup = this.options.markerClusterGroup;

    link.classList.add('fixed-image');
    map.addLayer(this.markerClusterGroup);

    L.DomEvent.on(link, 'click', function(e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);

      if (!link.classList.contains('fixed-image')) {
        link.classList.add('fixed-image');
        if (this.markerClusterGroup) {
          map.addLayer(this.markerClusterGroup); // Show cluster markers
        }
      } else {
        link.classList.remove('fixed-image');
        if (this.markerClusterGroup) {
          map.removeLayer(this.markerClusterGroup); // Hide cluster markers
        }
      }  
      
    }, this);

    return container;
  },

  onRemove: function(map) {
    // Cleanup if necessary
  },

  updateMarkerClusterGroup: function(newMarkerClusterGroup) {
    if (this._map && this.markerClusterGroup) {
      this._map.removeLayer(this.markerClusterGroup);
    }
    this.markerClusterGroup = newMarkerClusterGroup;
    if (this._map) {
      this._map.addLayer(this.markerClusterGroup);
    }
  }
});

L.control.ImageControl = function(opts) {
  return new L.Control.ImageControl(opts);
};
