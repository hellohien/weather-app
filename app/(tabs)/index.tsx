import { Image, StyleSheet, Platform, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BasicInput } from "@/components/BasicInput";
import { useState } from "react";
import { CheckIcon } from "@/components/Icons/CheckIcon";
import { geocode, RequestType, setDefaults } from "react-geocode";

// Set default response language and region (optional).
// This sets default values for language and region for geocoding requests.

setDefaults({
  key: "AIzaSyDJmBEg0Jcm_xTZaq2TakpBKVCAO3SDu-Y", // Your API key here.
  language: "en", // Default language for responses.
  region: "es", // Default region for responses.
} as any);

export default function HomeScreen() {
  const [city, setCity] = useState<string>("");
  const [listOfWeather, setListOfWeather] = useState<[]>([]);

  const handleSubmitCity = async () => {
    try {
      const resp = await geocode(RequestType.ADDRESS, city, {
        language: "en",
        region: "sp",
      } as any);
      const location = resp.results[0].geometry.location;
      // console.log("location here", JSON.stringify(location, null, 2));

      const weatherResp = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&appid=e647ab74bec31b26074d6896282970bf`
      );
      const data = await weatherResp.json();
      console.log("data here", JSON.stringify(data, null, 2));
      setListOfWeather(data);
    } catch (error) {
      console.log("err in handleSubmitCity", error);
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
  },
  titleContainer: {
    marginVertical: 16,
  },
});
