import clsx from "clsx";
import Head from "next/head";
import { ChangeEvent, ReactText, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";

import CloudIcon from "@/assets/icons/cloud.svg";
import SunIcon from "@/assets/icons/sun.svg";
import SunriseIcon from "@/assets/icons/sunrise.svg";
import MoonIcon from "@/assets/icons/moon.svg";
import MinTempIcon from "@/assets/icons/thermometer-low.svg";
import MaxTempIcon from "@/assets/icons/thermometer-high.svg";
import DropletIcon from "@/assets/icons/droplet.svg";
import PressureIcon from "@/assets/icons/pressure.svg";
import WindIcon from "@/assets/icons/wind.svg";

import api from "@/modules/api";
import { API } from "@/types/api";
import {
  formatOMWDate,
  getMaxValue,
  getMeanValue,
  getMinValue,
  getModeValue,
} from "@/utils/misc";
import WeatherParam from "@/components/WeatherParam";
import { UnitsOfMeasurement } from "@/types/misc";
import { defaultLocation, unitsDict } from "@/constants";
import QueryResults from "@/components/QueryResults";

function Home() {
  const [selectedUnits, setSelectedUnits] =
    useState<UnitsOfMeasurement>("metric");
  // TODO: use router.query for searchPhrase instead of useState
  const [searchPhrase, setSearchPhrase] = useState("Wrocław");
  const [cityName] = useDebounce(searchPhrase, 500);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [location, setLocation] =
    useState<API.Types.Location | null>(defaultLocation);

  const units = unitsDict[selectedUnits];

  const locationQuery = useQuery(
    ["GET /direct (city-name)", cityName],
    () => api.geo.get<API.GetCoordinatesResponse>(`/direct?q=${cityName}`),
    {
      enabled: !!cityName,
      select: (res) => res.data,
    }
  );

  const forecastQuery = useQuery(
    ["GET /onecall (daily-forecast)", location, selectedUnits],
    () =>
      api.weather.get<API.GetWeatherForecastResponse>(
        `/onecall?lat=${location?.lat}&lon=${location?.lon}&exclude=current,minutely,hourly,alerts&units=${selectedUnits}`
      ),
    {
      keepPreviousData: true,
      enabled: !!location,
      select: (res) => res.data.daily.slice(0, 5),
    }
  );

  const tempValuesFor5Days = useMemo(() => {
    if (!forecastQuery.data) return [];

    return forecastQuery.data.flatMap((day) =>
      Object.values(day.temp).map((val) => Math.round(val))
    );
  }, [forecastQuery.data]);

  const queryResults = useMemo(() => {
    if (!locationQuery.data) return [];

    return locationQuery.data.map((result) => {
      return {
        label: result.name,
        value: result.lat + result.lon,
      };
    });
  }, [locationQuery.data]);

  const onSelectLocation = (option: { label: string; value: ReactText }) => {
    const location = locationQuery.data?.find(
      (result) => result.lat + result.lon === option.value
    );

    if (location) {
      setLocation(location);
      setSearchPhrase(location.name);
      setIsSearchActive(false);
    }
  };

  const handleSearchPhrase = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!isSearchActive) {
      setIsSearchActive(true);
    }

    setSearchPhrase(evt.target.value);
  };

  return (
    <>
      <Head>
        <title>Weather App</title>
      </Head>
      <main className="flex flex-col items-center self-center justify-center flex-grow w-full max-w-2xl p-4 font-sans">
        <section className="flex flex-col items-center w-full m-4 sm:m-8">
          <h1 className="mb-4 text-2xl">
            Find the local weather forecast for your location
          </h1>
          <div
            className="flex flex-col items-center w-full mb-20"
            style={{ maxWidth: "240px" }}
          >
            <input
              autoComplete="off"
              className="flex w-full px-4 py-1 text-lg text-gray-800 border border-gray-200 rounded-md shadow outline-none"
              onChange={handleSearchPhrase}
              placeholder="Search Location"
              type="text"
              value={searchPhrase}
            />
            {cityName && isSearchActive && (
              <QueryResults
                handleSelectItem={onSelectLocation}
                searchPhrase={searchPhrase}
                results={queryResults}
              />
            )}
          </div>
          <div className="flex items-center self-end">
            <button
              className={clsx(
                "text-sm",
                selectedUnits === "metric" ? "text-gray-800" : "text-gray-500"
              )}
              onClick={() => setSelectedUnits("metric")}
            >
              {unitsDict.metric.temperature}
            </button>
            /
            <button
              className={clsx(
                "text-sm",
                selectedUnits === "imperial" ? "text-gray-800" : "text-gray-500"
              )}
              onClick={() => setSelectedUnits("imperial")}
            >
              {unitsDict.imperial.temperature}
            </button>
          </div>
          <ul className="w-full max-w-2xl">
            {forecastQuery.data &&
              forecastQuery.data.map((forecast, idx) => (
                <li
                  key={idx}
                  className="flex flex-col mb-8 border-t border-blue-800"
                >
                  <div className="flex flex-col items-center justify-between pt-6 sm:flex-row">
                    <p className="text-lg font-bold">
                      {formatOMWDate(forecast.dt)}
                    </p>

                    {forecast.weather.length && (
                      <div className="flex items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="w-16 h-16"
                          alt="weather icon"
                          src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`}
                        />
                        <p className="capitalize">
                          {forecast.weather[0].description}
                        </p>
                        <strong className="ml-5 text-xl">
                          {Math.round(forecast.temp.max)}
                          {units.temperature}
                        </strong>
                        /
                        <p className="text-lg">
                          {Math.round(forecast.temp.min)}
                          {units.temperature}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-wrap justify-between w-full mt-4 sm:flex-row">
                    <div className="flex flex-col">
                      <WeatherParam
                        name="Morning"
                        icon={<SunriseIcon />}
                        units={units.temperature}
                        value={forecast.temp.morn}
                      />
                      <WeatherParam
                        name="Day"
                        icon={<SunIcon />}
                        units={units.temperature}
                        value={forecast.temp.day}
                      />
                      <WeatherParam
                        name="Night"
                        icon={<MoonIcon />}
                        units={units.temperature}
                        value={forecast.temp.night}
                      />
                    </div>
                    <div>
                      <WeatherParam
                        name="Min"
                        icon={<MinTempIcon />}
                        units={units.temperature}
                        value={forecast.temp.min}
                      />
                      <WeatherParam
                        name="Max"
                        icon={<MaxTempIcon />}
                        units={units.temperature}
                        value={forecast.temp.max}
                      />
                      <WeatherParam
                        name="Humidity"
                        icon={<DropletIcon />}
                        units="%"
                        value={forecast.humidity}
                      />
                    </div>
                    <div>
                      <WeatherParam
                        name="Pressure"
                        icon={<PressureIcon />}
                        units={units.pressure}
                        value={forecast.pressure}
                      />
                      <WeatherParam
                        name="Wind"
                        icon={<WindIcon />}
                        units={` ${units.wind}`}
                        value={forecast.wind_speed}
                      />
                      <WeatherParam
                        name="Cloudiness"
                        icon={<CloudIcon />}
                        units="%"
                        value={forecast.clouds}
                      />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </section>
        {location && (
          <section className="w-full pt-4 mt-10 border-t-2 border-red-700">
            <h2 className="text-xl">
              Stats for 5-day weather forecast for{" "}
              <span className="capitalize">{searchPhrase}</span>
            </h2>
            <ul>
              <li>
                Max temp: {getMaxValue(tempValuesFor5Days)}
                {units.temperature}
              </li>
              <li>
                Min temp: {getMinValue(tempValuesFor5Days)}
                {units.temperature}
              </li>
              <li>
                Mean value: {getMeanValue(tempValuesFor5Days)}
                {units.temperature}
              </li>
              <li>
                Mode value:{" "}
                {getModeValue(tempValuesFor5Days).map((val, idx) => (
                  <span key={idx}>
                    {idx > 0 && ", "}
                    {val}
                  </span>
                ))}
              </li>
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

export default Home;
