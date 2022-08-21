import type { NextPage } from "next";
import mapboxgl from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { FirebaseApp, getApp } from "firebase/app";
import "../lib/firebase/init";
import { Button, Dialog } from "@mantine/core";
import { addShop, Shop } from "../lib/firebase/shops";

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
  const [info, setInfo] = useState<Shop>();
  const [regist, setRegist] = useState<boolean>(false);
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
  const handleInfo = useCallback((e: any) => {
    setInfo((prevstate) => {
      return {
        ...prevstate,
        id: Math.round(Math.random() * 10000000000),
        name: e.result.text_ja,
        category: e.result.properties.category,
        postcode: e.result.context[0].text_ja,
        address:
          e.result.context[3].text_ja +
          e.result.context[2].text_ja +
          e.result.context[1].text_ja +
          e.result.properties.address,
        latitude: e.result.geometry.coordinates[1],
        longitude: e.result.geometry.coordinates[0],
      };
    });
  }, []);
  // const geocoder = new MapboxGeocoder({
  //   accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? "",
  //   mapboxgl: mapboxgl,
  //   language: "ja",
  //   types: "poi",
  // });
  // map.addControl(geocoder);
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? "";
    map.current = new mapboxgl.Map({
      logoPosition: "bottom-left",
      attributionControl: false,
      container: mapContainer.current,
      style: "mapbox://styles/taisei-m/cl6lh9446000h14pebx8w9o75",
      center: [139.6503, 35.6762], // center map on Chad
      zoom: 10,
    });
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any,
      types: "poi",
    });
    map.current.addControl(geocoder, "top-left");
    map.current.on("load", () => {
      geojson.features.forEach((marker) => {
        new mapboxgl.Marker({
          color: "#FF3333",
        })
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
    geocoder.on("result", function (e) {
      setRegist(true);
      handleInfo(e);
    });
  }, []);

  const app: FirebaseApp = getApp();
  return (
    <main>
      <div className="w-screen h-screen" ref={mapContainer} />
      {info !== undefined && regist && (
        <Dialog
          opened={regist}
          withCloseButton
          onClose={() => setRegist(false)}
          size="lg"
          radius={0}
          position={{ left: "20px", bottom: "20px" }}
        >
          <div className="absolute top-0 left-0 -translate-y-full w-full h-[200px] bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <h3 className="text-xl font-bold">{info.name}</h3>
          <p className="text-sm">{info.category}</p>
          <p className="text-sm">{info.postcode}</p>
          <p className="text-sm">{info.address}</p>
          <p className="text-sm">{info.latitude}</p>
          <p className="text-sm">{info.longitude}</p>
          <div className="flex justify-around mt-5">
            <Button
              className="flex w-[calc(50%-10px)] h-[40px] justify-center items-center text-sm font-bold text-[#333] border border-[#333] hover:bg-inherit"
              onClick={() => setRegist(false)}
            >
              CANCEL
            </Button>
            <Button
              radius={0}
              onClick={() => addShop(info)}
              className="flex w-[calc(50%-10px)] h-[40px] justify-center items-center text-sm font-bold bg-[#333] text-white hover:bg-[#333]"
            >
              REGISTER
            </Button>
          </div>
        </Dialog>
      )}
    </main>
  );
};
export default Home;
