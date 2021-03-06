import * as React from "react";

import {useAppDispatch, useAppSelector} from "../../../app/hooks";

import BaseButton from "../../../components/form/BaseButton";
import {authActions} from "../authSlice";
import {callConfirmAlert} from "../../../components/notifices/ConfirmAlert";
import {startSectionBackgroundStyle} from "../../../components/StartSection";

export default function InvitePage() {
	const dispatch = useAppDispatch();
	const inviteData = useAppSelector(state => state.auth.invite.data);
	const loading = useAppSelector(state => state.auth.invite.loading);

	const handleDisagreeAll = () => {
		if (inviteData.length === 0) return;
		callConfirmAlert("Bạn có chắc muốn từ chối tất cả lời mời không ?", () => {
			dispatch(authActions.disagreeAllInvite());
		});
	};

	return (
		<div className={startSectionBackgroundStyle}>
			<div className="container mx-auto bg-mygreendark2 p-3 text-black">
				<div className="text-right w-full">
					<BaseButton
						className="px-3 rounded-md whitespace-nowrap bg-myorange"
						type="button"
						onClick={handleDisagreeAll}
						disabled={inviteData.length === 0 ? true : false}
					>
						Từ chối tất cả
					</BaseButton>
				</div>
				<h1 className="mb-5 font-bold">Lời mời của bạn</h1>
				<ul className="divide-y-2 divide-black/50">
					{loading && "Loading..."}
					{!loading && inviteData.length === 0 && (
						<li>Bạn không có lời mời nào</li>
					)}
					{!loading &&
						inviteData.map(invite => (
							<InviteItem key={invite._id} {...invite} />
						))}
				</ul>
			</div>
		</div>
	);
}

function InviteItem({
	userInvite,
	groupName,
	loading,
	_id,
}: {
	_id: string;
	loading?: boolean;
	userInvite: string;
	groupName: string;
}) {
	const dispatch = useAppDispatch();

	const handleAccept = (inviteId: string) => {
		if (!inviteId) return;
		dispatch(authActions.acceptInvite({inviteId}));
	};
	const handleDisagree = (inviteId: string) => {
		if (!inviteId) return;
		dispatch(authActions.disagreeInvite({inviteId}));
	};
	return (
		<li className="flex flex-wrap gap-2 py-2">
			<b>{userInvite}</b>{" "}
			<span className="text-myorangedark"> mời bạn vào nhóm</span>{" "}
			<i>{groupName}</i>
			<BaseButton
				className="bg-myorange ml-5 rounded-lg px-3 text-sm "
				onClick={() => {
					handleAccept(_id);
				}}
				loading={loading}
			>
				Chấp nhận
			</BaseButton>
			<BaseButton
				className="bg-myorange rounded-lg px-3 text-sm "
				onClick={() => {
					handleDisagree(_id);
				}}
				loading={loading}
			>
				Từ chối
			</BaseButton>
		</li>
	);
}
