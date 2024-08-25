// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import Spinner from "./Spinner";
import Message from "./Message";
import ButtonBack from "./ButtonBack";
import styles from "./Form.module.css";
import useUrlPosition from "../hooks/useUrlPosition";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlPosition();

  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [cityName, setCityName] = useState("");
  const [geocodingError, setgeocodingError] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  useEffect(() => {
    if (!lng || !lat) return;

    async function fetctCityData() {
      try {
        setgeocodingError("");
        setIsLoadingGeocoding(true);
        console.log(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        console.log(data);

        if (data.status === 402)
          throw new Error("Your quota limit has been exceeded");

        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else!"
          );

        setEmoji(convertToEmoji(data.countryCode));
        setCountry(data.countryName);
        setCityName(data.city || data.location || "");
      } catch (err) {
        setgeocodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetctCityData();
  }, [lat, lng]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      date,
      emoji,
      notes,
      country,
      cityName,
      position: { lat, lng },
    };
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (!lng || !lat)
    return <Message message="Start by Clicking on somewhere on the map" />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          dateFormat="dd/mm/yyyy"
          onChange={(data) => setDate(data)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
