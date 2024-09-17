import moment from "moment";

export function formatMessage(username, message) {
    const finalMessage = {
        username,
        message,
        time: moment().format("hh:mm a")
    }

    return finalMessage;
}

