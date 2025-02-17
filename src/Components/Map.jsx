import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const locations = [
  { id: 1, name: "Sanctuary A", position: [37.7749, -122.4194], description: "A wildlife sanctuary located in the heart of the city." },
  { id: 2, name: "Sanctuary B", position: [34.0522, -118.2437], description: "Another rescue center located in the south." },
  // Add more locations as needed
];

const Map = () => {
  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={6} style={{ width: '100%', height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker key={location.id} position={location.position}>
          <Popup>
            <strong>{location.name}</strong><br />
            {location.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
