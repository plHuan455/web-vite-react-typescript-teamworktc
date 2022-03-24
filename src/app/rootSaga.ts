import {all} from "redux-saga/effects";
import {authSaga} from "../features/auth/authSaga";
import {docSaga} from "../features/doc/docSaga";
import {groupSaga} from "../features/group/groupSaga";
import noteSaga from "../features/note/noteSaga";
import todoSaga from "../features/todo/todoSaga";

export default function* rootSaga() {
	yield all([authSaga(), groupSaga(), docSaga(), noteSaga(), todoSaga()]);
}
