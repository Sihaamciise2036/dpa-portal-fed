import { Navigate } from "react-router-dom";
import NotFoundPage from "../views/NotFoundPage";
import UserProtectedRoute from "./userProtectedRoute";

import AuthLayout from "../layout/auth/AuthLayout";
import MainLayout from "@/layout/front/MainLayout";

import LoginPage from "../views/auth/LoginPage";
import RegisterPage from "../views/auth/RegisterPage";
import RegisterVerifyOtpPage from "../views/auth/RegisterVerifyOtpPage";
import ForgotPasswordPage from "../views/auth/ForgotPasswordPage";
import VerifyEmailPage from "../views/auth/VerifyEmailPage";
import ResetPasswordPage from "../views/auth/ResetPasswordPage";
import CertificateViewPage from "../views/certificate-view";
import EcitizenCallbackPage from "../views/auth/EcitizenCallbackPage";

import HomePage from "../views/front/home";

import DataControllerPage from "../views/front/data-controller";
import DataControllerRepliedPage from "../views/front/data-controller/repliedList";
import DataControllerFormPage from "../views/front/data-controller/formPage";
import DataControllerViewPage from "../views/front/data-controller/viewPage";

import DataBreachPage from "../views/front/data-breach";
import DataBreachRepliedPage from "../views/front/data-breach/repliedList";
import DataBreachFormPage from "../views/front/data-breach/formPage";
import DataBreachViewPage from "../views/front/data-breach/viewPage";

import ComplaintHandlePage from "../views/front/complaint-handle";
import ComplaintHandleRepliedPage from "../views/front/complaint-handle/repliedList";
import ComplaintHandleFormPage from "../views/front/complaint-handle/formPage";
import ComplaintHandleViewPage from "../views/front/complaint-handle/viewPage";

import TransactionPage from "../views/front/transaction";
import PendingTransactionPage from "../views/front/transaction/pending";
import TransactionEditPage from "../views/front/transaction/edit";

import UserProfilePage from "../views/front/user-profile/index";

import PaymentsAndReceiptsPage from "../views/front/payments-and-receipts";
import EnquiriesPage from "../views/front/enquiries";
import EnquiriesAddPage from "../views/front/enquiries/createTicket";
import EnquiriesEditPage from "../views/front/enquiries/editTicket";
import FAQPage from "../views/front/faq/list";

import PaymentSuccessPage from "../views/payment/success";
import PaymentFailedPage from "../views/payment/failed";

const UserRoutes = (isAuthenticated, isType) => [
    {
        path: "/certificate/view/:id",
        element: <CertificateViewPage />,
    },
    /*
     * Where eCitizen sends a citizen it has already authenticated.
     *
     * Top level, and deliberately outside both the auth group and the protected
     * group: a citizen arriving here has no DPA session yet, so the protected
     * group would bounce them to /sign-in — the second sign-in this whole
     * integration exists to remove — and the auth group's own "*" would render
     * Not Found once they had one.
     */
    {
        path: "/ecitizen/callback",
        element: <EcitizenCallbackPage />,
    },
    {
        path: "/",
        element: !isAuthenticated ? <Navigate to="/sign-in" /> : <Navigate to="/home" />,
    },
    {
        path: "/",
        element: !isAuthenticated ? <AuthLayout /> : <Navigate to="/home" />,
        children: [
            { path: "/sign-in", element: <LoginPage /> },
            { path: "/sign-up", element: <RegisterPage /> },
            { path: "/verify-otp", element: <RegisterVerifyOtpPage /> },
            { path: "/forget-password", element: <ForgotPasswordPage /> },
            { path: "/forget-password/verify", element: <VerifyEmailPage /> },
            { path: "/reset-password", element: <ResetPasswordPage /> },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
    {
        path: "/success",
        element: (
            <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                <PaymentSuccessPage pageTitle="Payment Success" />
            </UserProtectedRoute>
        ),
    },
    {
        path: "/failed",
        element: (
            <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                <PaymentFailedPage pageTitle="Payment Failed" />
            </UserProtectedRoute>
        ),
    },
    {
        path: "/",
        element: (
            <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                <MainLayout />
            </UserProtectedRoute>
        ),
        children: [
            {
                path: "/home",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <HomePage pageTitle="Dashboard" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/dc-dp/registration",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataControllerFormPage pageTitle="Data Controllers & Processors" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/dc-dp/:id/edit",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataControllerViewPage pageTitle="Data Controllers & Processors" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/dc-dp/replied/list",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataControllerRepliedPage pageTitle="Data Controllers & Processors" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/dc-dp/list",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataControllerPage pageTitle="Data Controllers & Processors" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/data-breach/registration",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataBreachFormPage pageTitle="Data Breach" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/data-breach/:id/edit",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataBreachViewPage pageTitle="Data Breach" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/data-breach/replied/list",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataBreachRepliedPage pageTitle="Data Breach" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/data-breach/list",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataBreachPage pageTitle="Data Breach" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/complaint-handle/registration",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <ComplaintHandleFormPage pageTitle="Complaint Handle" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/complaint-handle/:id/edit",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <ComplaintHandleViewPage pageTitle="Complaint Handle" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/complaint-handle/replied/list",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <ComplaintHandleRepliedPage pageTitle="Complaint Handle" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/complaint-handle/list",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <ComplaintHandlePage pageTitle="Complaint Handle" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/transaction/pending/list",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <PendingTransactionPage pageTitle="Pending Transaction" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/transaction/list",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <TransactionPage pageTitle="Transaction" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/transaction/:id/view",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <TransactionEditPage pageTitle="Transaction View" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/user-profile",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <UserProfilePage pageTitle="User Profile" />
                    </UserProtectedRoute>
                ),
            },

            {
                path: "/payments-and-receipts",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <PaymentsAndReceiptsPage pageTitle="Payments And Receipts" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/enquiries",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <EnquiriesPage pageTitle="Enquiries" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/enquiries/add",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <EnquiriesAddPage pageTitle="ADD Enquiries" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/enquiries/:id/edit",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <EnquiriesEditPage pageTitle="View Enquiries" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/data-breach",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <DataBreachPage pageTitle="Data Breach" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "/faqs",
                element: (
                    <UserProtectedRoute isAuthenticated={isAuthenticated} isType={isType}>
                        <FAQPage pageTitle="Queries" />
                    </UserProtectedRoute>
                ),
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
];
export default UserRoutes;
