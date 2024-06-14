import * as L from "leaflet";

L.Control.fixedView = L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-button fixedViewWindow');

        var link = L.DomUtil.create('a', 'fixedViewControlToggel', container);
        link.href = '#';
        link.title = 'Fixed View Window';

        // Variables to store the fixed view state
        var isFixed = false;
        var fixedCenter = null;
        var fixedZoom = null;

        L.DomEvent.on(link, 'click', function(e) {
            L.DomEvent.stopPropagation(e); 
            L.DomEvent.preventDefault(e);  // Prevent default link behavior

            if (isFixed) {
                // Unfix the view
                console.log("fixed off");
                link.classList.remove('fixed-inactive');
                isFixed = false;
                link.classList.remove('active');
            } else {
                // Fix the view
                fixedCenter = map.getCenter();
                fixedZoom = map.getZoom();
                isFixed = true;
                link.classList.add('active');
                link.classList.add('fixed-inactive');
                console.log("fixed on");
            }
        });

        map.on('dragstart', function() {
            if (isFixed) {
                // If the view is fixed, restore the fixed view
                map.setView(fixedCenter, fixedZoom);
            }
            link.classList.remove('active');
        });

        map.on('zoomend', function() {
            if (isFixed) {
                // If the view is fixed, restore the fixed view
                map.setView(fixedCenter, fixedZoom);
            }
            link.classList.remove('active');
        });

        return container;
    },

    onRemove: function(map) {
        // Clean up events when the control is removed
        map.off('dragstart');
        map.off('zoomend');
    }
});

L.control.fixedView = function(opts) {
    return new L.Control.fixedView(opts);
}
