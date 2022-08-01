import type { NextPage } from "next";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

type Marker = {
  name: string;
  latCoord: number;
  longCoord: number;
};

export const markers: Marker[] = [
  {
    name: "天神駅",
    latCoord: 33.5914,
    longCoord: 130.3989,
  },
  {
    name: "博多駅",
    latCoord: 33.5897,
    longCoord: 130.4207,
  },
];

const Home: NextPage = () => {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | any>(null);
  const geojson = {
    type: "Feature",
    features: markers.map((marker) => ({
      properties: {
        name: marker.name,
      },
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
      center: [130.4017, 33.5902], // center map on Chad
      zoom: 15,
    });
    map.current.on("load", () => {
      geojson.features.forEach((marker) => {
        // create a DOM element for the marker
        const markerIcon = document.createElement("div");
        markerIcon.className =
          "w-[30px] h-[30px] rounded-full bg-pink-500 border-2 border-white";

        new mapboxgl.Marker(markerIcon)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(
            // add pop out to map
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<p style="font-size: 15px; ">Name: ${marker.properties.name}</p>
              <button style="font-size: 15px; color: #fff; background-color: #000; width: 100%; padding: 10px; margin-top: 20px; border-radius: 10px;">Evaluate</button>
              `
            )
          )
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
