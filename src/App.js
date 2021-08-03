import React from "react";
import "./App.css";
import {
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Card,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  // const [mapCountries, setMapCountries] = useState([]);
  const [latLng, setLatLng] = useState([34.80746, -40.4796]);
  const [flagged, setFlagged] = useState("");
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //  the code runs once when the components loads and not again after
    //async => request, wait for the response and do sth with it
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          // setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        // All the data of the specified countryCode
        setCountryInfo(data);
        // url === "https://disease.sh/v3/covid-19/all"
        //   ? setLatLng([34.80746, -40.4796])
        //   : setLatLng([data.countryInfo.lat, data.countryInfo.long]);

        if (url === "https://disease.sh/v3/covid-19/all") {
          setLatLng([34.80746, -40.4796]);
        } else {
          if (url === `https://disease.sh/v3/covid-19/countries/${null}`) {
            setLatLng([34.80746, -40.4796]);
          } else {
            setLatLng([data.countryInfo.lat, data.countryInfo.long]);
            setFlagged(data.countryInfo.flag);
          }
        }
      });
  };

  // console.log("COUNTRY INFO >>>", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Loop through all the countries and show a dropdown list  */}
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          latitude={latLng[0]}
          longitude={latLng[1]}
          country={countryInfo.country}
          countryFlag={flagged}
          cases={countryInfo.cases}
          recovered={countryInfo.recovered}
          death={countryInfo.deaths}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live cases by countries</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
          {/*  Graph*/}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
