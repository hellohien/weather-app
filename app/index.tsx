import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BasicInput } from "@/components/BasicInput";
import { useState } from "react";
import { CheckIcon } from "@/components/Icons/CheckIcon";
import { geocode, RequestType, setDefaults } from "react-geocode";
import Constants from "expo-constants";
import { format } from "date-fns";

const GOOGLE_MAPS_API = Constants.expoConfig?.extra?.GOOGLE_MAPS_API;
const OPEN_WEATHER_MAP_API = Constants.expoConfig?.extra?.OPEN_WEATHER_MAP_API;

setDefaults({
  key: GOOGLE_MAPS_API, // Your API key here.
  language: "en", // Default language for responses.
  region: "es", // Default region for responses.
} as any);

type WeatherData = {
  main: {
    temp: number;
  };
  dt: number;
  weather: {
    description: string;
  }[];
  dt_txt: string;
};

export default function HomeScreen() {
  const [city, setCity] = useState<string>("");
  const [listOfDailyWeather, setListOfDailyWeather] = useState<[]>([]);
  const [listOfHourlyWeather, setListOfHourlyWeather] = useState<[]>([]);

  const handleSubmitCity = async () => {
    try {
      const resp = await geocode(RequestType.ADDRESS, city, {
        language: "en",
        region: "sp",
      } as any);
      const location = resp.results[0].geometry.location;

      const weatherResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&appid=${OPEN_WEATHER_MAP_API}`
      );
      const data = await weatherResp.json();
      if (!data) {
        return Alert.alert("Error", "Cannot find address");
      }

      // Filter data to get one forecast per day (around midday)
      const dailyData = data.list.filter((item: WeatherData) =>
        item.dt_txt.includes("12:00:00")
      );

      const hourlyData = data.list
        .reverse()
        .filter((item: WeatherData) =>
          item.dt_txt.includes(format(data.list[0].dt_txt, "yyyy-MM-dd"))
        );

      // console.log("Hourly data:", JSON.stringify(hourlyData, null, 2));
      // console.log("Daily data:", JSON.stringify(dailyData, null, 2));
      setListOfHourlyWeather(hourlyData);
      setListOfDailyWeather(dailyData.slice(0, 7)); // limit to the next 5 days
    } catch (error) {
      console.log("err in handleSubmitCity", error);
      return Alert.alert("Error", "Cannot find address");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Weather App</ThemedText>
      </ThemedView>
      <ThemedView style={styles.inputContainer}>
        <BasicInput
          value={city}
          setValue={setCity}
          style={styles.input}
          onKeyPress={handleSubmitCity}
        />
        <TouchableOpacity
          style={styles.checkIconContainer}
          onPress={handleSubmitCity}
        >
          <CheckIcon />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.hourlyWeatherContainer}>
        {listOfHourlyWeather.map((weatherItem: WeatherData, key) => {
          return (
            <ThemedView key={key} style={styles.hourlyWeather}>
              <ThemedText style={styles.weatherItem}>
                {format(new Date(weatherItem?.dt_txt), "ha")}
              </ThemedText>
              <ThemedText style={styles.weatherItem}>
                {weatherItem?.main?.temp}°
              </ThemedText>
              <ThemedText style={styles.weatherItem}>
                {weatherItem?.weather[0].description}
              </ThemedText>
            </ThemedView>
          );
        })}
      </ThemedView>
      <ThemedView>
        {listOfDailyWeather.map((weatherItem: WeatherData, key) => {
          return (
            <ThemedView key={key} style={styles.dailyWeather}>
              <ThemedText style={styles.weatherItem}>
                {format(new Date(weatherItem?.dt * 1000), "E")}
              </ThemedText>
              <ThemedText style={styles.weatherItem}>
                {weatherItem?.main?.temp}°
              </ThemedText>
              <ThemedText style={styles.weatherItem}>
                {weatherItem?.weather[0].description}
              </ThemedText>
            </ThemedView>
          );
        })}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  inputContainer: {
    marginBottom: 18,
    position: "relative",
  },
  checkIconContainer: {
    position: "absolute",
    right: 12,
    top: 8,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    // borderColor: "gray",
    // color: "#fff",
  },
  titleContainer: {
    marginVertical: 16,
  },
  dailyWeather: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  hourlyWeatherContainer: {
    flexDirection: "row",
    gap: 18,
  },
  hourlyWeather: {
    flex: 1,
    alignItems: "center", // center items horizontally within each column
  },
  weatherItem: {
    flex: 1,
    alignItems: "center", // optional, to center content within each column
  },
});
