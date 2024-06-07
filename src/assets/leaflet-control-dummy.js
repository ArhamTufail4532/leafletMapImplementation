import * as L from "leaflet";

L.Control.fixedView = L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-button fixedViewWindow');

        var link = L.DomUtil.create('a', 'fixedViewControlToggel', container);
        link.href = '#';
        link.title = 'Fixed View Window';

        L.DomEvent.on(link, 'click', function(e) {
            L.DomEvent.stopPropagation(e); 
            map.setView(map.getCenter()); 
            link.classList.toggle('active');
        });

        map.on('dragstart', function() {
            link.classList.remove('active');
        });

        return container;
    },

    onRemove: function(map) {
        map.off('dragstart');
    }
});

L.control.fixedView = function(opts) {
    return new L.Control.fixedView(opts);
}




