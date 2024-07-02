import * as L from "leaflet";

L.Control.fixedView = L.Control.extend({
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-button fixedViewWindow');

        var link = L.DomUtil.create('a', 'fixedViewControlToggel', container);
        link.href = '#';
        link.title = 'Fixed View Window';

        var isFixed = false;
        var fixedCenter = null;
        var fixedZoom = null;

        L.DomEvent.on(link, 'click', function(e) {
            L.DomEvent.stopPropagation(e); 
            L.DomEvent.preventDefault(e); 

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

                var event = new CustomEvent('controlActivated', { detail: 'fixedView' });
                document.dispatchEvent(event);
            }
        });

         map.on('dragstart', function() {
            if (isFixed) {
                map.setView(fixedCenter);
                isFixed = false;
                link.classList.remove('fixed-inactive');
                link.classList.remove('active');
            }
        });

        map.on('zoomend', function() {
            if (isFixed) {
                map.setView(fixedCenter);
                isFixed = false;
                link.classList.remove('fixed-inactive');
                link.classList.remove('active');
            }     
        }); 

        document.addEventListener('controlActivated', function (e) {
            if (isFixed && e.detail !== 'fixedView') {
                console.log("Control activated - fixed view deactivated");
                isFixed = false;
                link.classList.remove('fixed-inactive');
                link.classList.remove('active');
            }
        });

        return container;
    },

    onRemove: function(map) {
        map.off('dragstart');
        map.off('zoomend');

        document.removeEventListener('controlActivated', function (e) {
            if (isFixed && e.detail !== 'fixedView') {
                isFixed = false;
                link.classList.remove('fixed-inactive');
                link.classList.remove('active');
            }
        });
    }
});

L.control.fixedView = function(opts) {
    return new L.Control.fixedView(opts);
}
