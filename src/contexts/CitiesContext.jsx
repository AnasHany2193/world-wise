import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL =
  "https://raw.githubusercontent.com/AnasHany219/data/main/worldWise-data/cities.json";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(BASE_URL);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("There was an error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  return (
    <CitiesContext.Provider value={{ cities, isLoading }}>
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
