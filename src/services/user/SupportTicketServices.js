import { apiService } from "../apiService";
import ToastMe from "@/components/ui/ToastMe";

export function getSupportTicketService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/support-ticket/list",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function getByIdSupportTicketService(id) {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/support-ticket/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addSupportTicketService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/support-ticket/add",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function updateSupportTicketService(id, data) {
    return apiService({
        userType: "user",
        method: "PUT",
        url: "/support-ticket/" + id,
        data,
        onSuccess: (dispatch, res) => {
            ToastMe(res.data.message, "success");
        },
        onFailure: () => {},
    });
}

export function getSupportTicketChatService(id) {
    return apiService({
        userType: "user",
        method: "GET",
        url: "/support-ticket/chat/" + id,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}

export function addSupportTicketChatService(data) {
    return apiService({
        userType: "user",
        method: "POST",
        url: "/support-ticket/chat",
        data,
        onSuccess: (dispatch, res) => {},
        onFailure: () => {},
    });
}
