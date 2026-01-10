import { useState } from "preact/hooks";

import "./app.css";
import Wordle from "./components/Wordle";
import CountryFinder from "./components/CountryFinder";
import AutoComplete from "./components/AutoComplete";

export function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			{/* <Wordle /> */}
			{/* <CountryFinder /> */}
			<AutoComplete />
		</>
	);
}
