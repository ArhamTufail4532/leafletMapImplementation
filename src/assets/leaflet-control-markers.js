L.Control.customControl = L.Control.extend({
    initialize: function (options) {
        // Ensure options are correctly set
        L.setOptions(this, options);
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-button custom-Control-Window');

        var link = L.DomUtil.create('a', 'custom-control-toggle', container);
        link.href = '#';
        link.title = 'Toggle Markers';
        var markers = this.options.markers;  // Get the markers from options

        // Example functionality: Toggle visibility of markers
        L.DomEvent.on(link, 'click', function (e) {
            L.DomEvent.stopPropagation(e); // Prevent map click event from firing
            L.DomEvent.preventDefault(e);  // Prevent default link behavior

            if (map.hasLayer(markers)) {
                map.removeLayer(markers);
            } else {
                map.addLayer(markers);
            }
        });

        return container;
    },

    onRemove: function (map) {
        // Clean up control when removed from the map (optional)
    }
});

// Factory function to create instances of your custom control
L.control.customControl = function (opts) {
    return new L.Control.customControl(opts);
};
