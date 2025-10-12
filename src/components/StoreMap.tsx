'use client';

import { useEffect, useRef, useState } from 'react';
import L, { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, LocateFixed, Loader2, X } from 'lucide-react';

// ✅ Gunakan URL absolut agar tidak error di Turbopack
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
  readonly?: boolean;
}

export default function StoreMap({
  latitude,
  longitude,
  onLocationChange,
  readonly = false,
}: StoreMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const gpsAttemptedRef = useRef(false);

  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'denied' | 'unavailable'>('idle');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isRequestingGPS, setIsRequestingGPS] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  const DEFAULT_LOCATION: [number, number] = [-7.358831, 110.2607];

  // =================== PERMINTAAN GPS ===================
  const requestGPSLocation = () => {
    if (readonly) return;
    if (!('geolocation' in navigator)) {
      setGpsStatus('unavailable');
      setAlertMessage('Browser ini tidak mendukung Geolocation API.');
      setShowAlert(true);
      return;
    }

    setIsRequestingGPS(true);
    setGpsStatus('loading');
    setAlertMessage('Mendeteksi lokasi GPS...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy > 100) {
          setGpsStatus('unavailable');
          setAlertMessage('GPS tidak akurat. Coba aktifkan GPS perangkat Anda.');
          setIsRequestingGPS(false);
          setShowAlert(true);
          return;
        }

        setCurrentLocation([latitude, longitude]);
        onLocationChange(latitude, longitude);
        if (mapRef.current) mapRef.current.setView([latitude, longitude], 17);

        setGpsStatus('success');
        setAlertMessage('Lokasi GPS berhasil ditemukan!');
        setShowAlert(true);
        setIsRequestingGPS(false);
        setTimeout(() => setShowAlert(false), 4000);
      },
      (error) => {
        console.error('GPS Error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsStatus('denied');
            setAlertMessage('Akses lokasi ditolak.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsStatus('unavailable');
            setAlertMessage('Lokasi tidak tersedia.');
            break;
          case error.TIMEOUT:
            setGpsStatus('unavailable');
            setAlertMessage('Timeout mendeteksi lokasi.');
            break;
          default:
            setGpsStatus('unavailable');
            setAlertMessage('Terjadi kesalahan saat mendeteksi lokasi.');
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
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      keyboard: false,
      
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], { draggable: !readonly }).addTo(map);

    if (!readonly) {
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
    }

    mapRef.current = map;
    markerRef.current = marker;

    if (!readonly && !gpsAttemptedRef.current) {
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
  }, [readonly]);

  // =================== UPDATE MARKER ===================
  useEffect(() => {
    const lat = currentLocation?.[0] || latitude || DEFAULT_LOCATION[0];
    const lng = currentLocation?.[1] || longitude || DEFAULT_LOCATION[1];
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
  }, [currentLocation, latitude, longitude]);

  const displayLat = currentLocation?.[0] || latitude || DEFAULT_LOCATION[0];
  const displayLng = currentLocation?.[1] || longitude || DEFAULT_LOCATION[1];

  // =================== UI ===================
  return (
    <div className="space-y-3 leaflet-container-fix">
      {/* ALERT */}
      {!readonly && showAlert && (
        <div className="p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100 text-sm flex justify-between items-start">
          <p className="font-medium">{alertMessage}</p>
          <button onClick={() => setShowAlert(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={16} />
          </button>
        </div>
      )}

      {/* MAP */}
      <div
        id="store-map"
        className="h-96 w-full rounded-xl border shadow-inner overflow-hidden relative z-0"
      />

      {/* BUTTON GPS */}
      {!readonly && (
        <button
          onClick={requestGPSLocation}
          disabled={isRequestingGPS}
          className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground font-medium shadow-sm"
        >
          {isRequestingGPS ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mendeteksi Lokasi...
            </>
          ) : (
            <>
              <LocateFixed className="w-4 h-4" />
              {gpsStatus === 'success' ? 'Perbarui Lokasi GPS' : 'Gunakan Lokasi GPS'}
            </>
          )}
        </button>
      )}

      {/* INFO */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        {!readonly && (
          <p className="flex items-center justify-center gap-1">
            <MapPin size={14} />
            {gpsStatus === 'loading'
              ? 'Mendeteksi lokasi...'
              : gpsStatus === 'success'
              ? 'GPS Aktif'
              : 'GPS Tidak Aktif'}
          </p>
        )}
        <p className="font-mono">
          Koordinat: {displayLat.toFixed(6)}, {displayLng.toFixed(6)}
        </p>
        {readonly && <p className="italic text-gray-400">Mode tampilan saja</p>}
      </div>
    </div>
  );
}
