import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL =
  "https://raw.githubusercontent.com/AnasHany219/data/main/worldWise-data/cities.json";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  // Helper function to fetch cities from API
  async function fetchCitiesFromAPI() {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch cities from API", error);
      return [];
    }
  }

  // useEffect to initialize cities data
  useEffect(() => {
    async function fetchCities() {
      setIsLoading(true);
      try {
        // Check local storage for cities data
        const storedCities = localStorage.getItem("cities");
        if (storedCities) {
          setCities(JSON.parse(storedCities));
        } else {
          // Fetch from API if no data is in local storage
          const data = await fetchCitiesFromAPI();
          setCities(data);
          localStorage.setItem("cities", JSON.stringify(data));
        }
      } catch {
        alert("There was an error fetching cities.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  // Function to get a single city by id
  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    try {
      setIsLoading(true);
      const storedCities = localStorage.getItem("cities");
      let data = storedCities
        ? JSON.parse(storedCities)
        : await fetchCitiesFromAPI();

      const city = data.find((city) => String(city.id) === id);
      setCurrentCity(city);
    } catch {
      alert("There was an error fetching city details.");
    } finally {
      setIsLoading(false);
    }
  }

  // Function to create a new city
  async function createCity(newCity) {
    try {
      setIsLoading(true);

      // Get existing cities from local storage
      const storedCities = localStorage.getItem("cities");
      const data = storedCities ? JSON.parse(storedCities) : [];

      // Add the new city
      const updatedData = [...data, newCity];
      setCities(updatedData);
      localStorage.setItem("cities", JSON.stringify(updatedData));
    } catch {
      alert("There was an error creating the city.");
    } finally {
      setIsLoading(false);
    }
  }

  // Function to delete a city by id
  async function deleteCity(id) {
    try {
      setIsLoading(true);

      // Get existing cities from local storage
      const storedCities = localStorage.getItem("cities");
      const data = storedCities ? JSON.parse(storedCities) : [];

      // Remove the city
      const updatedData = data.filter((city) => String(city.id) !== id);
      setCities(updatedData);
      localStorage.setItem("cities", JSON.stringify(updatedData));
    } catch {
      alert("There was an error deleting the city.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        getCity,
        isLoading,
        createCity,
        deleteCity,
        currentCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === "undefined")
    throw new Error("CitiesContext was used outside of the CitiesProvider");

  return context;
}

export { useCities, CitiesProvider };
