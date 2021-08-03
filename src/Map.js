import ReactMapGl, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import { useEffect, useState } from "react";
import "./Map.css";
import numeral from "numeral";

function Map({
  latitude,
  longitude,
  country,
  countryFlag,
  cases,
  recovered,
  death,
}) {
  const [viewport, setViewPort] = useState({
    latitude: latitude,
    longitude: longitude,
    width: "1100px",
    height: "500px",
    zoom: 3,
  });
  const [selectedPark, setSelectedPark] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  const newViewPort = {
    latitude: latitude,
    longitude: longitude,
    width: "1100px",
    height: "500px",
    zoom: 4,
  };

  return (
    <div className="map">
      <ReactMapGl
        {...newViewPort}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/cipher01/ckrmtltq523jf19o1zexfzq10"
        onViewportChange={(viewport) => {
          setViewPort(viewport);
        }}
      >
        <Marker
          className="map__marker"
          key={country}
          latitude={latitude}
          longitude={longitude}
          offsetLeft={-30}
          offsetTop={-50}
        >
          <button
            className="marker__btn"
            onClick={(e) => {
              e.preventDefault();
              setSelectedPark(country);
            }}
          >
            <RoomIcon color={"error"} fontSize={"large"} />
          </button>
        </Marker>
        {selectedPark ? (
          <Popup
            className="map__popup"
            latitude={latitude}
            longitude={longitude}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div className="info-container">
              <div
                className="info-flag"
                style={{ backgroundImage: `url(${countryFlag})` }}
              />
              <div>
                <h2 className="info-name">{country}</h2>
                <p className="info-confirmed">
                  Cases: {numeral(cases).format("0,0")}
                </p>
                <p className="info-recovered">
                  Recovered: {numeral(recovered).format("0,0")}
                </p>
                <p className="info-deaths">
                  Death: {numeral(death).format("0,0")}
                </p>
              </div>
            </div>
          </Popup>
        ) : null}
      </ReactMapGl>
    </div>
  );
}

export default Map;
