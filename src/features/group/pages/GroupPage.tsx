import {
	getGroup,
	getGroupError,
	getGroupFastSearch,
	getGroupLoading,
	groupActions,
} from "../groupSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useRef, useState} from "react";

import {Group} from "../../../models/group";
import GroupNode from "../components/GroupNode";
import {TiGroup} from "react-icons/ti";
import {startSectionBackgroundStyle} from "../../../components/StartSection";

export default function GroupPage() {
	const dispatch = useAppDispatch();
	const groupList = useAppSelector<Group[]>(getGroup);

	const loading = useAppSelector(getGroupLoading);
	const error = useAppSelector(getGroupError);

	const searchData = useAppSelector(getGroupFastSearch);

	// const [searchInput, setSearchInput] = useState<string>("");

	const [searchInput, setSearchInput] = useState<string>("");

	const handleSearchChange = (searchStr: string) => {
		dispatch(groupActions.fastSearch({searchStr}));
		setSearchInput(searchStr);
	};

	return (
		<div className={startSectionBackgroundStyle}>
			<div className="container mx-auto bg-mygreendark2 p-2 pb-10">
				<h1 className="pt-6 text-black text-2xl font-bold flex w-full justify-center gap-x-2 items-center">
					<TiGroup />
					<span>Danh sách các nhóm</span>{" "}
				</h1>
				{/* <Searchbar onSearchClick={() => {}} placeholder="Tìm nhóm" /> */}
				<div className="flex justify-center mt-3">
					<input
						className="bg-black text-white w-full md:w-[80%] lg:w-[40rem] rounded-md px-3 py-1"
						type="search"
						name="search"
						value={searchInput}
						onChange={e => handleSearchChange(e.target.value)}
						placeholder="Tìm kiếm..."
					/>
				</div>
				<ul className="flex justify-center gap-3 flex-wrap mt-5">
					<GroupNode isAdd={true} className="bg-black" />
					{searchInput === ""
						? groupList.map((group, index) => (
								<GroupNode
									className="bg-black"
									data={group}
									key={group._id ? group._id : index}
									disabled={group.type === "demo"}
								/>
						  ))
						: searchData.map((group, index) => (
								<GroupNode
									className="bg-black"
									data={group}
									key={group._id ? group._id : index}
									disabled={group.type === "demo"}
								/>
						  ))}
					{loading && <div>Loading ...</div>}
					{error && <div>{error}</div>}
				</ul>
			</div>
		</div>
	);
}
