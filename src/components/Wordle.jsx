import { useEffect, useState } from "react";

const WORDS = ["hello", "world", "start", "which"];

export default function Wordle() {
	const [solution, setSolution] = useState("hello");
	const [guesses, setGuesses] = useState(Array(6).fill(null));
	const [answer, setAnswer] = useState("");
	const [activeLine, setActiveLine] = useState(0);
	const [gameOver, setGameOver] = useState(false);

	useEffect(() => {
		if (gameOver) return;
		const index = Math.floor(Math.random() * WORDS.length + 1);
		setSolution(WORDS[index].toLowerCase());
	}, [gameOver, solution]);

	function handleSubmit(e) {
		e.preventDefault();

		const temp = [...guesses];
		temp[activeLine] = answer;
		setGuesses(temp);
		if (temp.includes(solution)) return setGameOver(true);
		const tempLine = activeLine + 1;
		setActiveLine((prev) => prev + 1);
		if (tempLine > 5) return setGameOver(true);

		setAnswer("");
	}
	function handleReset() {
		setGameOver(false);
		setGuesses(Array(6).fill(null));
		setAnswer("");
		setActiveLine(0);
	}
	return (
		<div className="flex flex-col p-10 h-screen w-screen items-center gap-5">
			<h1 className="text-4xl font-bold">Wordle!</h1>
			<div className="flex flex-col gap-5">
				{guesses.map((guess, idx) => {
					const isCurrentLine = idx === activeLine ? true : false;
					return (
						<Line
							guess={guess}
							answer={answer}
							solution={solution}
							isCurrentLine={isCurrentLine}
							setGameOver={setGameOver}
							key={idx}
						/>
					);
				})}
			</div>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					className="border p-2 rounded-xl"
					maxLength={5}
					value={answer}
					onChange={(e) => {
						const str = e.target.value.toLowerCase();
						return setAnswer(str);
					}}
					disabled={gameOver}
				/>
			</form>
			{gameOver ? (
				<div>
					<h1>Game Over</h1>
					<button
						onClick={handleReset}
						className="bg-blue-300 border-none p-2 px-4 rounded-2xl cursor-pointer hover:text-amber-50"
					>
						Try Again
					</button>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}

function Line(props) {
	const tiles = Array(5).fill(null);
	const isCurrentLine = props.isCurrentLine;
	const solution = props.solution;
	const guess = props.guess ? props.guess : "";
	if (guess === solution) {
		props.setGameOver(true);
	}

	const style = (idx) => {
		if (!guess) return "";
		if (guess[idx] === solution[idx]) {
			return "bg-green-300";
		} else if (solution.includes(guess[idx])) {
			return "bg-yellow-300";
		} else {
			return "bg-gray-300";
		}
	};

	return (
		<div className="flex flex-row gap-5">
			{tiles.map((tile, idx) => {
				return (
					<div
						className={`size-15 border flex items-center justify-center uppercase font-bold text-lg ${style(
							idx
						)}`}
					>
						{isCurrentLine ? (
							<div>{props.answer[idx]}</div>
						) : (
							<div>{guess[idx]}</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
