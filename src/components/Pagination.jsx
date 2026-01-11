import React, { useEffect, useState } from "react";

export default function Pagination() {
	const [page, setPage] = useState(1);
	const [items, setItems] = useState([]);
	const [displayItems, setDisplayItems] = useState([]);

	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [pageSize, setPageSize] = useState(15);
	const [error, setError] = useState(null);

	const pageSizeOptions = [15, 10, 5];

	useEffect(() => {
		if (isLoading) return;
		if (error) return;
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		if (end <= items.length) {
			setDisplayItems(items.slice(start, end));
			return;
		}

		let cancelled = false;

		const fetchData = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const res = await fetch(
					`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${pageSize}&page=${page}&sparkline=false`
				);
				if (cancelled) return;
				if (!res.ok) {
					throw new Error(`Something went wrong`);
				}
				const data = await res.json();
				setHasMore(data.length === pageSize);
				const seenItems = [...items, ...data];
				const seenIds = new Set();
				const deDupeItems = seenItems.filter((i) => {
					const isDupe = seenIds.has(i.id);
					seenIds.add(i.id);
					return !isDupe;
				});
				setItems(deDupeItems);
				const toShowItems = deDupeItems.slice(start, end);
				setDisplayItems(toShowItems);
			} catch (err) {
				console.error(err);
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
		return () => {
			cancelled = true;
		};
	}, [page, items, isLoading, error, pageSize]);

	const handlePrevPage = () => {
		if (isLoading) return;
		if (page > 1) {
			setError(null);
			setPage((prev) => prev - 1);
		}
	};
	const handleNextPage = () => {
		if (isLoading) return;
		if (error) return;
		if (!hasMore) return;
		setPage((prev) => prev + 1);
	};
	const handlePageSizeChange = (e) => {
		e.preventDefault();
		setPageSize(Number(e.target.value));
		setError(null);
		setPage(1);
	};

	return (
		<div className="flex flex-col p-5 items-center gap-5">
			<h2 className="text-xl font-bold">Pagination</h2>
			<div className=" w-[1000px] border h-[700px] flex items-center justify-center">
				{!isLoading && !error && (
					<div className="grid grid-cols-5 w-full  h-full gap-3 m-auto p-2">
						{displayItems.map((item) => (
							<div
								className="flex flex-col border rounded-lg items-center h-50 self-center"
								key={item.id}
							>
								<div className="w-30 p-5">
									<img
										src={item?.image}
										alt={item?.name}
										loading="lazy"
										className="object-contain w-fit"
									/>
								</div>
								<h1>{item.name}</h1>
								<div>{item.id}</div>
								<div>Price: {item.current_price}</div>
							</div>
						))}
					</div>
				)}
				{isLoading && !error && <div>Loading...</div>}
				{error && !isLoading && (
					<div className="text-red-500 font-bold flex flex-col items-center justify-center gap-5">
						{error.message}
						<button onClick={() => setError(null)}>Retry</button>
					</div>
				)}
			</div>
			<div className="flex flex-row gap-5">
				<div className="flex flex-row gap-2 ">
					<span>Page Size</span>
					<select
						value={pageSize}
						className="border"
						onChange={handlePageSizeChange}
					>
						{pageSizeOptions.map((option) => (
							<option value={option} key={option}>
								{option}
							</option>
						))}
					</select>
				</div>
				<button onClick={handlePrevPage} disabled={page === 1}>
					Prev
				</button>
				<span>Page: {page}</span>
				<button onClick={handleNextPage}>Next</button>
			</div>
		</div>
	);
}
