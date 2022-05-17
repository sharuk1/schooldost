import { FETCHING ,STOP_LOADER,SHOW_ALERT,HIDE_ALERT,SHOW_DIALOG,HIDE_DIALOG,SHOW_SNACK_BAR,HIDE_SNACK_BAR} from "../Constant/Reducer/Reducer.js"

export function fetchingData(message) {
        return {
                type: FETCHING,
                data: { fetching: true, loaderMessage: message }
        }
}

export function stopLoader() {
        return {
                type: STOP_LOADER,
                data: { fetching: false, loaderMessage: "" }
        }
}
export function showAlert(title, message) {
        return {
                type: SHOW_ALERT,
                data: { title, message }
        }
}
export function hideAlert() {
        return {
                type:HIDE_ALERT,
                data: { title: "", message: "" }
        }
}

export function showDialog(title, messsage, callbackFun) {
        return {
                type: SHOW_DIALOG,
                data: { title: title, message: messsage, callback: callbackFun }
        }
}

export function hideDialog() {
        return {
                type:HIDE_DIALOG,
                data: {}
        }
}

export function showSnackBar(message) {
        return {
                type:SHOW_SNACK_BAR,
                message: message
        }
}

export function hideSnackBar() {
        return {
                type: HIDE_SNACK_BAR,
        }
}