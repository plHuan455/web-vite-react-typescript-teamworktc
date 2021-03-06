import {Note, NoteFormValue} from "../../models/Note";
import {PayloadAction, createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {ErrorStatus} from "../../models";
import {RootState} from "../../app/store";
import {toast} from "react-toastify";

export interface GetNotePayload {
	year: number;
	month: number;
}

export interface NoteState {
	loading: boolean;
	error?: string;
	data: Note[];
	selectedNote?: Note;
	status: {
		createNote?: ErrorStatus;
		update?: ErrorStatus;
	};
}

const initialState: NoteState = {
	loading: true,
	data: [],
	error: undefined,
	status: {},
};

const noteSlice = createSlice({
	name: "note",
	initialState,
	reducers: {
		setSelectedNote: (state, action: PayloadAction<Note | undefined>) => {
			state.selectedNote = action.payload;
		},

		// Saga
		getNote(state, action: PayloadAction<GetNotePayload>) {
			state.loading = true;
			state.error = undefined;
		},
		getNoteSuccess(state, action: PayloadAction<Note[]>) {
			state.loading = false;
			state.error = undefined;
			state.data = action.payload;
		},
		getNoteFailed(state, action: PayloadAction<{message: string}>) {
			state.loading = false;
			state.error = action.payload.message;

			toast.error(`Gặp lỗi khi tải sự kiện (${action.payload.message})`);
		},

		// CREATE
		createNote(state, action: PayloadAction<Note>) {
			state.status.createNote = {loading: true, error: undefined};
			if (state.data) {
				action.payload.loading = true;
				// action.payload._id = "sadkj";
				state.data.push(action.payload);
				return state;
			}
			state.data = [action.payload];

			return state;
		},
		createNoteSuccess(state, action: PayloadAction<Note>) {
			// console.log(action.payload);
			const foundNoteIndex = state.data?.findIndex(
				note => note.loading === true && note.name === action.payload.name
			);
			if (foundNoteIndex === undefined || foundNoteIndex === -1) return state;

			state.status.createNote = {loading: false, error: undefined};
			state.data && (state.data[foundNoteIndex] = action.payload);
		},
		createNoteFailed(state, action: PayloadAction<string>) {
			state.data = state.data.filter(note => note.loading !== true);
			toast.error(`Tạo sự kiện thất bại ${action.payload}`);
			state.status.createNote = {loading: false, error: undefined};
			return state;
		},
		// UPDATE
		update(state, action: PayloadAction<{noteId: string; data: Note}>) {
			state.status.update = {loading: true};
			return state;
		},
		updateSuccess(
			state,
			action: PayloadAction<{noteId: string; updatedNote: Note}>
		) {
			const {noteId, updatedNote} = action.payload;
			state.status.update = undefined;

			const foundNoteIndex = state.data.findIndex(note => note._id === noteId);
			if (foundNoteIndex !== -1) state.data[foundNoteIndex] = updatedNote;

			if (state.selectedNote?._id === noteId) state.selectedNote = updatedNote;

			return state;
		},
		updateFailed(state, action: PayloadAction<{message: string}>) {
			state.status.update = undefined;
			toast.error(`Cập nhật không thành công ${action.payload.message}`);

			return state;
		},
		// DELETE NOTE
		deleteNote(state, action: PayloadAction<(string | undefined)[]>) {
			if (!state.data) return state;

			const {payload} = action;
			if (payload.length === 1) {
				const foundNoteIndex = state.data.findIndex(
					note => note._id === payload[0]
				);
				if (foundNoteIndex !== -1) state.data[foundNoteIndex].loading = true;
			} else {
				state.data = state.data.map((note, index) =>
					note._id === action.payload[index] ? {...note, loading: true} : note
				);
			}

			if (state.selectedNote) {
				state.selectedNote = undefined;
			}

			return state;
		},
		deleteNoteSuccess(state, action: PayloadAction<(string | undefined)[]>) {
			if (!state.data) return state;
			const {payload} = action;
			if (payload.length === 1) {
				const foundNoteIndex = state.data.findIndex(
					note => note._id === payload[0]
				);
				if (foundNoteIndex !== -1) state.data.splice(foundNoteIndex, 1);
				return state;
			}

			state.data = state.data.filter(
				(note, index) => note._id !== payload[index]
			);
			return state;
		},
		deleteNoteFailed(state, action: PayloadAction<(string | undefined)[]>) {
			if (!state.data) return state;
			const {payload} = action;
			if (payload.length === 1) {
				const foundNoteIndex = state.data.findIndex(
					note => note._id === payload[0]
				);
				if (foundNoteIndex !== -1)
					state.data[foundNoteIndex].loading = undefined;

				return state;
			}

			state.data = state.data.map((note, index) =>
				note._id === payload[index] ? {...note, loading: undefined} : note
			);
			return state;
		},
		clearState(state) {
			state = initialState;
			return state;
		},
	},
	extraReducers: {},
});

export const getNoteLoading = (state: RootState) => state.note.loading;
export const getNoteData = (state: RootState) => state.note.data;
export const getNoteError = (state: RootState) => state.note.error;

export const getNoteCreateStatusLoading = (state: RootState) =>
	state.note.status.createNote?.loading;
export const getNoteUpdateStatusLoading = (state: RootState) =>
	state.note.status.update?.loading;

export const getNoteSelectedNoteId = (state: RootState) =>
	state.note.selectedNote?._id;
export const getNoteSelectedNote = (state: RootState) =>
	state.note.selectedNote;

export const isSelectNote = (state: RootState): boolean =>
	state.note.selectedNote ? true : false;

const {reducer: noteReducer, actions} = noteSlice;

export const noteActions = noteSlice.actions;

export default noteReducer;
