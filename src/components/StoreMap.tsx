'use client';

import { useEffect, useRef, useState } from 'react';
import L, { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Gunakan URL absolut untuk Turbopack
const markerIcon = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString();
const markerIcon2x = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString();
const markerShadow = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString();

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface StoreMapProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function StoreMap({ latitude, longitude, onLocationChange }: StoreMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'success' | 'denied' | 'unavailable'>('loading');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isRequestingGPS, setIsRequestingGPS] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const gpsAttemptedRef = useRef(false);

  const DEFAULT_LOCATION: [number, number] = [-7.358831, 110.260700]; // ✅ Temanggung default

  // =================== PERMINTAAN GPS ===================
  const requestGPSLocation = () => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('unavailable');
      setAlertMessage('❌ Browser ini tidak mendukung Geolocation API.');
      setShowAlert(true);
      return;
    }

    setIsRequestingGPS(true);
    setGpsStatus('loading');
    setAlertMessage('🔄 Mendeteksi lokasi GPS...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = new Date(position.timestamp).toLocaleTimeString('id-ID');

        // Jika hasil terlalu tidak akurat (> 100m), abaikan
        if (accuracy > 100) {
          setAlertMessage('⚠️ GPS terlalu tidak akurat. Aktifkan GPS perangkat dan coba lagi.');
          setGpsStatus('unavailable');
          setIsRequestingGPS(false);
          setShowAlert(true);
          return;
        }

        console.log('📍 GPS Detected:', { latitude, longitude, accuracy, timestamp });

        setCurrentLocation([latitude, longitude]);
        onLocationChange(latitude, longitude);
        if (mapRef.current) mapRef.current.setView([latitude, longitude], 17);

        setGpsStatus('success');
        setAlertMessage('✅ Lokasi GPS berhasil dideteksi!');
        setShowAlert(true);
        setIsRequestingGPS(false);
        setTimeout(() => setShowAlert(false), 4000);
      },
      (error) => {
        console.error('❌ GPS Error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setAlertMessage('🚫 Akses lokasi ditolak. Aktifkan GPS di pengaturan perangkat Anda.');
            setGpsStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setAlertMessage('❌ Lokasi tidak tersedia. Aktifkan GPS perangkat Anda.');
            setGpsStatus('unavailable');
            break;
          case error.TIMEOUT:
            setAlertMessage('⏱️ Timeout! Aktifkan GPS dan coba lagi.');
            setGpsStatus('unavailable');
            break;
          default:
            setAlertMessage('❌ Terjadi kesalahan saat mendeteksi lokasi.');
            setGpsStatus('unavailable');
        }
        setShowAlert(true);
        setIsRequestingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =================== INISIALISASI PETA ===================
  useEffect(() => {
    if (mapRef.current || typeof window === 'undefined') return;

    const mapEl = document.getElementById('store-map');
    if (!mapEl) return;

    const initialLat = latitude || DEFAULT_LOCATION[0];
    const initialLng = longitude || DEFAULT_LOCATION[1];

    const map = L.map(mapEl, {
      center: [initialLat, initialLng],
      zoom: 16,
      minZoom: 5,
      maxZoom: 18,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      setCurrentLocation([lat, lng]);
      onLocationChange(lat, lng);
    });

    map.on('click', (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCurrentLocation([lat, lng]);
      onLocationChange(lat, lng);
      marker.setLatLng([lat, lng]);
    });

    mapRef.current = map;
    markerRef.current = marker;

    // Coba GPS otomatis sekali
    if (!gpsAttemptedRef.current) {
      gpsAttemptedRef.current = true;
      requestGPSLocation();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker saat koordinat berubah
  useEffect(() => {
    const lat = currentLocation?.[0] || latitude || DEFAULT_LOCATION[0];
    const lng = currentLocation?.[1] || longitude || DEFAULT_LOCATION[1];
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
  }, [currentLocation, latitude, longitude]);

  const displayLat = currentLocation?.[0] || latitude || DEFAULT_LOCATION[0];
  const displayLng = currentLocation?.[1] || longitude || DEFAULT_LOCATION[1];

  return (
    <div className="space-y-2">
      {/* ALERT */}
      {showAlert && (
        <div className="p-3 rounded-lg border bg-yellow-50 border-yellow-300 text-yellow-800 text-sm">
          <div className="flex items-start justify-between">
            <p>{alertMessage}</p>
            <button onClick={() => setShowAlert(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MAP */}
      <div id="store-map" className="h-96 w-full rounded-md border shadow-sm" />

      {/* BUTTON GPS */}
      <div className="flex gap-2">
        <button
          onClick={requestGPSLocation}
          disabled={isRequestingGPS}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          {isRequestingGPS ? 'Mendeteksi...' : gpsStatus === 'success' ? 'Refresh GPS' : 'Gunakan Lokasi GPS'}
        </button>
      </div>

      {/* INFO */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>
          Status:{' '}
          {gpsStatus === 'loading'
            ? '⏳ Mendeteksi...'
            : gpsStatus === 'success'
            ? '✅ GPS Aktif'
            : '⚠️ GPS Tidak Aktif'}
        </p>
        <p>Koordinat: {displayLat.toFixed(6)}, {displayLng.toFixed(6)}</p>
      </div>
    </div>
  );
}
