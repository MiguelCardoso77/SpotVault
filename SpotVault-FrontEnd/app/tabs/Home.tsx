import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// ── Paste your Mapbox public token here ──────────────────────────────────────
export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';
// ─────────────────────────────────────────────────────────────────────────────

export type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  note?: string;
};

// Sample spots — replace with real data from your API later
export const SPOTS: Spot[] = [
  { id: '1', name: 'Lisbon',       lat: 38.7169,  lng: -9.1399,  note: 'Beautiful city by the sea' },
  { id: '2', name: 'Tokyo',        lat: 35.6762,  lng: 139.6503, note: 'Must visit Shibuya crossing' },
  { id: '3', name: 'New York',     lat: 40.7128,  lng: -74.0060, note: 'Central Park in autumn' },
  { id: '4', name: 'Santorini',    lat: 36.3932,  lng: 25.4615,  note: 'Sunset from Oia' },
  { id: '5', name: 'Machu Picchu', lat: -13.1631, lng: -72.5450, note: 'Sunrise hike' },
];

function buildMapHtml(spots: Spot[], token: string): string {
  const features = spots.map(s => ({
    type: 'Feature',
    properties: { name: s.name, note: s.note ?? '' },
    geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
  }));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
      <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; }

        .spot-marker {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ff5c5c;
          border: 2.5px solid #fff;
          box-shadow: 0 2px 8px rgba(255,92,92,0.5);
          cursor: pointer;
        }

        .mapboxgl-popup-content {
          font-family: -apple-system, sans-serif;
          border-radius: 12px;
          padding: 12px 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          min-width: 130px;
        }
        .mapboxgl-popup-tip { display: none; }
        .popup-name {
          font-size: 14px;
          font-weight: 700;
          color: #ff5c5c;
          margin-bottom: 4px;
        }
        .popup-note {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }
        .mapboxgl-ctrl-logo,
        .mapboxgl-ctrl-attrib { display: none !important; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        mapboxgl.accessToken = '${token}';

        const map = new mapboxgl.Map({
          container: 'map',
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

        const spots = ${JSON.stringify(features)};

        map.on('load', () => {
          spots.forEach(feature => {
            const el = document.createElement('div');
            el.className = 'spot-marker';

            const popup = new mapboxgl.Popup({ offset: 14, closeButton: false })
              .setHTML(
                '<div class="popup-name">' + feature.properties.name + '</div>' +
                (feature.properties.note
                  ? '<div class="popup-note">' + feature.properties.note + '</div>'
                  : '')
              );

            new mapboxgl.Marker(el)
              .setLngLat(feature.geometry.coordinates)
              .setPopup(popup)
              .addTo(map);
          });
        });
      </script>
    </body>
    </html>
  `;
}

export default function HomeScreen() {
  return (
    <WebView
      style={styles.map}
      source={{ html: buildMapHtml(SPOTS, MAPBOX_TOKEN) }}
      scrollEnabled={false}
      bounces={false}
      overScrollMode="never"
      cacheEnabled={false}
      incognito={true}
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
