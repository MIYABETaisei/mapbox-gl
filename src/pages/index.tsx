import type { NextPage } from "next";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

type Marker = {
  city: string;
  country: string;
  latCoord: number;
  longCoord: number;
};

export const markers: Marker[] = [
  {
    city: "Sydney",
    country: "Australia",
    latCoord: 33.64679726505224,
    longCoord: 130.67388822375185,
  },
];

const Home: NextPage = () => {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | any>(null);
  const geojson = {
    type: "Feature",
    features: markers.map((marker) => ({
      geometry: {
        type: "Point",
        coordinates: {
          lat: marker.latCoord,
          lng: marker.longCoord,
        },
      },
    })),
  };
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? "";
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [130.67388822375185, 33.64679726505224], // center map on Chad
      zoom: 15,
    });
    map.current.on("load", () => {
      geojson.features.forEach((marker) => {
        // create a DOM element for the marker
        const markerIcon = document.createElement("div");
        markerIcon.className =
          "w-[30px] h-[30px] rounded-full bg-emerald-500 border-2 border-white";

        new mapboxgl.Marker(markerIcon)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map.current);
      });
    });
  }, []);

  return (
    <main>
      <div className="w-screen h-screen" ref={mapContainer} />
    </main>
  );
};
export default Home;
