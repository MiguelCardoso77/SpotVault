import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SPOTS, MAPBOX_TOKEN } from './Home';

export default function HomeScreen() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically inject Mapbox GL JS CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
    document.head.appendChild(link);

    // Dynamically load Mapbox GL JS
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
    script.onload = () => {
      const mapboxgl = (window as any).mapboxgl;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [0, 20],
        zoom: 1.8,
        minZoom: 1.8,
        maxBounds: [[-180, -85], [180, 85]],
        projection: 'mercator',
        dragRotate: false,
        touchPitch: false,
      });

      map.touchZoomRotate.disableRotation();

      const style = document.createElement('style');
      style.textContent = `
        .spot-marker {
          width: 14px; height: 14px; border-radius: 50%;
          background: #ff5c5c; border: 2.5px solid #fff;
          box-shadow: 0 2px 8px rgba(255,92,92,0.5); cursor: pointer;
        }
        .mapboxgl-popup-content {
          font-family: -apple-system, sans-serif;
          border-radius: 12px; padding: 12px 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15); min-width: 130px;
        }
        .mapboxgl-popup-tip { display: none; }
        .popup-name { font-size: 14px; font-weight: 700; color: #ff5c5c; margin-bottom: 4px; }
        .popup-note { font-size: 12px; color: #666; line-height: 1.4; }
        .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }
      `;
      document.head.appendChild(style);

      map.on('load', () => {
        SPOTS.forEach(s => {
          const el = document.createElement('div');
          el.className = 'spot-marker';

          const popup = new mapboxgl.Popup({ offset: 14, closeButton: false })
            .setHTML(
              `<div class="popup-name">${s.name}</div>` +
              (s.note ? `<div class="popup-note">${s.note}</div>` : '')
            );

          new mapboxgl.Marker(el)
            .setLngLat([s.lng, s.lat])
            .setPopup(popup)
            .addTo(map);
        });
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <View style={styles.container}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
