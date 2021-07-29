import ReactMapGl from "react-map-gl";
import { useState } from "react";
import "./Map.css";

function Map() {
  const [viewPort, setViewPort] = useState({
    latitude: 34.80746,
    longitude: -40.4796,
    width: "1100px",
    height: "500px",
    zoom: 3,
  });

  return (
    <div className="map">
      <ReactMapGl
        {...viewPort}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/cipher01/ckrmtltq523jf19o1zexfzq10"
        onViewportChange={(viewPort) => {
          setViewPort(viewPort);
        }}
      ></ReactMapGl>
    </div>
  );
}

export default Map;
