import Head from "next/head";
import { useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";

import SunIcon from "@/assets/icons/sun.svg";
import SunriseIcon from "@/assets/icons/sunrise.svg";
import SunsetIcon from "@/assets/icons/sunset.svg";
import MinTempIcon from "@/assets/icons/thermometer-low.svg";
import MaxTempIcon from "@/assets/icons/thermometer-high.svg";
import DropletIcon from "@/assets/icons/droplet.svg";
import api from "@/modules/api";
import { API } from "@/types/api";
import { formatOMWDate } from "@/utils/misc";

function Home() {
  // TODO: use router.query for searchPhrase instead of useState
  const [searchPhrase, setSearchPhrase] = useState("Wrocław");
  const [cityName] = useDebounce(searchPhrase, 500);

  const locationQuery = useQuery(
    ["GET /direct (city-name)", cityName],
    () => api.geo.get<API.GetCoordinatesResponse>(`/direct?q=${cityName}`),
    {
      keepPreviousData: true,
      enabled: !!cityName,
      select: (res) => res.data,
    }
  );

  const forecastQuery = useQuery(
    ["GET /onecall (daily-forecast)", locationQuery.data?.length],
    () =>
      api.weather.get<API.GetWeatherForecastResponse>(
        `/onecall?lat=${locationQuery.data?.[0].lat}&lon=${locationQuery.data?.[0].lon}&exclude=minutely,hourly,alerts`
      ),
    {
      keepPreviousData: true,
      enabled: !!locationQuery.data?.length,
      select: (res) => res.data.daily.slice(0, 5),
    }
  );

  return (
    <>
      <Head>
        <title>Weather App</title>
      </Head>
      <main className="flex flex-col items-center flex-grow p-4 font-sans bg-blue-50">
        <section className="w-full p-4 m-4 bg-white rounded-lg">
          <div className="flex items-center">
            <h1 className="">What&apos;s weather like in, </h1>
            <input
              className="px-1 text-gray-800 border-b border-gray-200 outline-none w-28"
              onChange={(evt) => setSearchPhrase(evt.target.value)}
              placeholder="City name"
              value={locationQuery.data?.[0]?.name || searchPhrase}
            />
          </div>
          <ol>
            {forecastQuery.data &&
              forecastQuery.data.map((forecast, idx) => (
                <li key={idx} className="flex flex-col">
                  <p className="text-lg font-bold">
                    {formatOMWDate(forecast.dt)}
                  </p>

                  {forecast.weather.map((weather) => (
                    <div className="flex items-center" key={weather.id}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-16 h-16"
                        alt="weather icon"
                        src={`http://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                      />
                      {weather.description}
                    </div>
                  ))}

                  <div className="flex flex-col">
                    <div className="flex items-center text-lg">
                      <SunriseIcon className="w-5 h-5" />
                      <p className="ml-2 text-red-600">
                        {Math.round(forecast.temp.morn)}&#8451;
                      </p>
                    </div>
                    <div className="flex items-center text-lg">
                      <SunIcon className="w-5 h-5" />
                      <p className="ml-2 text-red-600">
                        {Math.round(forecast.temp.day)}&#8451;
                      </p>
                    </div>
                    <div className="flex items-center text-lg">
                      <SunsetIcon className="w-5 h-5" />
                      <p className="ml-2 text-red-600">
                        {Math.round(forecast.temp.eve)}&#8451;
                      </p>
                    </div>
                    <div className="flex items-center text-lg">
                      <MinTempIcon className="w-5 h-5" />
                      <p className="ml-2 text-blue-500">
                        {Math.round(forecast.temp.min)}&#8451;
                      </p>
                    </div>
                    <div className="flex items-center text-lg">
                      <MaxTempIcon className="w-5 h-5" />
                      <p className="ml-2 text-red-600">
                        {Math.round(forecast.temp.max)}&#8451;
                      </p>
                    </div>
                    <div className="flex items-center text-lg">
                      <DropletIcon className="w-5 h-5" />
                      <p className="ml-2 text-red-600">
                        {Math.round(forecast.humidity)}%
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ol>
          {/* {(locationQuery.isLoading ||
          locationQuery.isFetching ||
          forecastQuery.isLoading ||
          forecastQuery.isFetching) &&
          "...Loading"} */}
        </section>
      </main>
    </>
  );
}

export default Home;
