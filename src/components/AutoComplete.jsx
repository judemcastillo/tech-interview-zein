import { useEffect, useRef, useState } from "react";

const DATA = [
	{ id: 1, value: "orange", type: "fruit" },
	{ id: 2, value: "apple", type: "fruit" },
	{ id: 3, value: "mango", type: "fruit" },
	{ id: 4, value: "banana", type: "fruit" },
	{ id: 5, value: "cabbage", type: "vegetable" },
	{ id: 6, value: "broccoli", type: "vegetable" },
	{ id: 7, value: "lettuce", type: "vegetable" },
];

export default function AutoComplete() {
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [dropDown, setDropDown] = useState(false);

	const dropDownRef = useRef(null);

	const handleInput = (e) => {
		setQuery(e.target.value);
	};

	useEffect(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) {
			setDropDown(false);
			setSuggestions([]);
			return;
		}
		const filteredItems = DATA.filter((d) => {
			const value = d.value.toLowerCase();
			return value.includes(query);
		});

		setSuggestions(filteredItems);
		setDropDown(filteredItems.length > 0);
	}, [query]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
				setActiveIndex(-1);
				return setDropDown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleKeyDown = (e) => {
		if (suggestions.length === 0) return;
		switch (e.key) {
			case "ArrowUp":
				e.preventDefault();
				setActiveIndex((prev) => {
					const index = prev === 0 ? 0 : prev - 1;
					return index;
				});
				break;
			case "ArrowDown":
				e.preventDefault();
				setActiveIndex((prev) => {
					const index =
						prev < suggestions.length - 1 ? prev + 1 : suggestions.length - 1;
					return index;
				});
				break;
		}
	};

	return (
		<div className="flex flex-col items-center p-5" ref={dropDownRef}>
			<input
				type="text"
				onChange={handleInput}
				value={query}
				className="border p-2 w-60"
				onKeyDown={handleKeyDown}
			/>

			{dropDown && (
				<div className="flex flex-col w-60 h-fit" ref={dropDownRef}>
					{suggestions.map((item, idx) => {
						const style = activeIndex === idx ? "bg-gray-300" : "";
						return (
							<span className={`border ${style}`} key={item.id}>
								{item.value}
							</span>
						);
					})}
				</div>
			)}
		</div>
	);
}
