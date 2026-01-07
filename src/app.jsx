import { useState } from "preact/hooks";

import "./app.css";
import Wordle from "./components/Wordle";

export function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Wordle />
		</>
	);
}
