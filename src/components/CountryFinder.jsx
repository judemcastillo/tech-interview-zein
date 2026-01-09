//  Display country details (name, capital,currencies, languages) in a grid,
// each country correspond to a card
// Input field for search at the top of the page
// ✅ Button to “Add to Favorites” on each country card
// ✅ Ability to remove a country from favorites
// Bonus: ✅ Show a list of favorites countries

// {
//        "name": {
//            "common": "Dominican Republic",
//            "official": "Dominican Republic",
//            "nativeName": {
//                "spa": {
//                    "official": "República Dominicana",
//                    "common": "República Dominicana"
//                }
//            }
//        },
//        "currencies": {
//            "DOP": {
//                "name": "Dominican peso",
//                "symbol": "$"
//            }
//        },
//        "capital": [
//            "Santo Domingo"
//        ],
//        "languages": {
//            "spa": "Spanish"
//        },
//        "area": 48671.0
//    }

import { useState } from "react";

export default function CountryFinder() {
	const [query, setQuery] = useState("");
	const [countries, setCountries] = useState([]);
	const [favorites, setFavorites] = useState([]);
	function handleSubmit(e) {
		e.preventDefault();
		fetch(
			`https://restcountries.com/v3.1/name/${query}?fields=area,capital,currencies,languages,name&fullText=false`
		)
			.then((res) => res.json())
			.then((data) => setCountries(data));
		setQuery("");
	}

	function formatCurrencies(currency) {
		if (!currency) return "-";
		const currencies = Object.values(currency);
		return currencies.map((c) => c.symbol + " " + c.name).join(", ");
	}
	function formatLanguages(item) {
		const languages = Object.values(item);
		return languages.map((language) => language).join(",");
	}
	function addToFavorites(c) {
		if (favorites.some((favorite) => favorite.country === c.name.common))
			return;
		setFavorites((prev) => [...prev, { country: c.name.common }]);
	}
	return (
		<div className="h-screen w-screen flex items-center p-5 flex-col">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					className="border-2 h-fit"
					onChange={(e) => setQuery(e.target.value)}
					value={query}
				/>
				<button className="cursor-pointer border-2" type="submit">
					Search
				</button>
			</form>
			<div className="flex flex-row flex-wrap h-full p-5">
				{countries.map((country) => (
					<div className="border-2 h-60 p-5 w-50 rounded-lg">
						<div>Country: {country.name.common}</div>
						<div>Capital: {country.capital.join()}</div>
						<div>Currencies: {formatCurrencies(country.currencies)}</div>
						<div>Languages: {formatLanguages(country.languages)}</div>
						<button
							className="border p-2 text-sm rounded bg-red-400"
							onClick={() => addToFavorites(country)}
						>
							Add to Favorites
						</button>
					</div>
				))}
			</div>
			<div>
				{" "}
				<h1>Favorites: </h1>
				{favorites.map((favorite) => (
					<div>{favorite.country}</div>
				))}
			</div>
		</div>
	);
}
