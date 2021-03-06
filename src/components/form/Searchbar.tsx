import {useEffect, useState} from "react";

import BaseButton from "./BaseButton";

interface SearchbarProp {
	onSearchClick: (data: string) => void;
	placeholder?: string;
}
export default function Searchbar({
	onSearchClick,
	placeholder = "",
}: SearchbarProp) {
	const [search, setSearch] = useState<string>("");
	const handleSearchClick = () => {
		onSearchClick(search);
	};
	return (
		<div className="flex gap-x-1 md:w-[30rem] w-full mx-auto sm:mt-10 mt-7">
			<input
				className="bg-tim/60 md text-baseText flex-grow"
				name="search"
				value={search}
				placeholder={placeholder}
				onChange={e => {
					setSearch(e.target.value);
				}}
			/>
			<BaseButton
				className="border-2 border-tim bg-tim/20 hover:bg-tim hover:border-1 px-4 rounded-r-xl duration-500"
				onClick={handleSearchClick}
			>
				Tìm
			</BaseButton>
		</div>
	);
}
