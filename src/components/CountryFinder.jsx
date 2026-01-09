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
		return currencies.map((c) => c.symbol + " " + c.name).join(",  ");
	}
	function formatLanguages(item) {
		const languages = Object.values(item);
		return languages.map((language) => language).join(",");
	}
	function addToFavorites(c) {
		if (favorites.some((favorite) => favorite.country === c.name.common))
			return;

		setFavorites((prev) => [
			...prev,
			{
				country: c.name.common,
				capital: c.capital.join(),
				currencies: formatCurrencies(c.currencies),
				languages: formatLanguages(c.languages),
			},
		]);
	}
	function deleteFavorite(c) {
		if (!c) return;
		setFavorites((prev) => prev.filter((p) => p.country !== c.country));
	}
	return (
		<div className="h-screen w-screen flex items-center p-5 flex-col">
			<form onSubmit={handleSubmit} className="border rounded-lg pl-1">
				<input
					type="text"
					className=" h-fit focus:outline-0"
					onChange={(e) => setQuery(e.target.value)}
					value={query}
				/>
				<button
					className="p-2 cursor-pointer border-none
				 bg-blue-300 rounded-r-lg border-l-2 border-black"
					type="submit"
				>
					Search
				</button>
			</form>
			<div className="flex flex-row flex-wrap h-100 p-5 gap-4 ">
				{countries.map((country) => (
					<div className="overflow-x-hidden border-2 h-70 p-5 w-60 rounded-lg flex flex-col justify-between">
						<div>
							<div>Country: {country.name.common}</div>
							<div>Capital: {country.capital.join()}</div>
							<div>Currencies: {formatCurrencies(country.currencies)}</div>
							<div >
								Languages: {formatLanguages(country.languages)}
							</div>
						</div>
						<button
							className="border p-2 text-sm rounded bg-red-400"
							onClick={() => addToFavorites(country)}
						>
							Add to Favorites
						</button>
					</div>
				))}
			</div>
			<h1 className="font-bold text-3xl mb-10">Favorites: </h1>
			<div className="w-full  flex flex-row gap-4 flex-wrap justify-center items-center">
				{favorites.map((favorite) => (
					<div className="overflow-x-hidden border-2 h-70 p-5 w-60 rounded-lg flex flex-col justify-between">
						<div>
							<div>Country: {favorite.country}</div>
							<div>Capital: {favorite.capital}</div>
							<div>Currencies: {favorite.currencies}</div>
							<div>Languages: {favorite.languages}</div>
						</div>
						<button
							className="border p-2 text-sm rounded bg-slate-500 cursor-pointer"
							onClick={() => deleteFavorite(favorite)}
						>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
