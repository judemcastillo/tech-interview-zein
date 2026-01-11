import { useCallback, useEffect, useRef, useState } from "react";

const PER_PAGE = 15;
const API_URL =
	"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false";

export default function InfiniteScroll() {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const bottomRef = useRef(null);
	const [dataLength, setDataLength] = useState("");

	useEffect(() => {
		if (!hasMore) return;
		if (error) return;
		setIsLoading(true);
		setError(null);
		fetch(
			`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${PER_PAGE}&page=${page}&sparkline=false`
		)
			.then(async (res) => {
				// parse once
				const data = await res.json();

				// handle non-2xx (CoinGecko often sends JSON error objects)
				if (!res.ok) {
					const msg =
						(data && (data.error || data.message)) ||
						`Request failed: ${res.status}`;
					throw new Error(msg);
				}

				// guard: must be an array
				if (!Array.isArray(data)) {
					throw new Error("Unexpected API response (not an array).");
				}

				return data;
			})
			.then((data) => {
				setItems((prev) => [...prev, ...data]);
				setDataLength(data.length);
				setHasMore(data.length === PER_PAGE);
			})
			.catch((err) => {
				setError(err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [page, hasMore]);

	useEffect(() => {
		if (!bottomRef.current) return;
		const observer = new IntersectionObserver((entries) => {
			const first = entries[0];
			if (first.isIntersecting && hasMore && !isLoading) {
				setPage((prev) => prev + 1);
			}
		});
		{
			rootMargin: "200px";
		}
		observer.observe(bottomRef.current);

		return () => observer.disconnect();
	}, [hasMore, isLoading]);
	return (
		<div className="flex flex-col p-5 items-center gap-5">
			<div className="text-xl font-bold">Crypto</div>
			<div className="grid grid-cols-5 gap-5 ">
				{items.map((item) => (
					<div className="flex flex-col border rounded-lg items-center h-60">
						<div className="w-40 p-5">
							<img
								src={item?.image}
								alt={item.name}
								loading="lazy"
								className="object-contain w-fit"
							/>
						</div>
						<h1>{item.name}</h1>
						<div>Price: {item.current_price}</div>
					</div>
				))}
			</div>
			{error && (
				<div className="text-red-500 font-bold">
					{error.message}
					<button
						className="text-white bg-blue-300 p-1 mx-1 rounded-2xl px-3"
						onClick={() => {
							setIsLoading(false);
							setError(null);
						}}
					>
						Retry
					</button>
				</div>
			)}
			{hasMore && isLoading && (
				<div className="border-t-blue-500 h-10 w-10 border-10 rounded-full animate-spin border-transparent"></div>
			)}

			<div ref={bottomRef}></div>
		</div>
	);
}
