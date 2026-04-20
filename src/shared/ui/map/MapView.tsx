import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const mapStyles = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#313236" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#49484d" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#49484d" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#5a5960" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#434248" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#5a5960" }],
  },
  {
    featureType: "label.text.fill",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4d5d8" }],
  },
  {
    featureType: "label.text.stroke",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#313236" }],
  },
]

type MapViewProps = {
  latitude: number
  longitude: number
  zoom?: number
}

export function MapView({
  latitude,
  longitude,
  zoom = 3,
}: MapViewProps) {
  const center = {
    lat: latitude,
    lng: longitude,
  }

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: mapStyles,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  )
}
