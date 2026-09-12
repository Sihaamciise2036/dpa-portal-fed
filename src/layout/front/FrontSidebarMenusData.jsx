import { MailIcon } from "lucide-react";
import ChatIcon from "@/components/icons/ChatIcon";
import DashboardIcon from "@/components/icons/DashboardIcon";
import DataBreachIcon from "@/components/icons/DataBreachIcon";
import ExpiryIcon from "@/components/icons/ExpiryIcon";
import StarIcon from "@/components/icons/StarIcon";
import UserProfileIcon from "@/components/icons/UserProfileIcon";
import UserRegistrationIcon from "@/components/icons/UserRegistrationIcon";
import DPOIcon from "@/components/icons/DPOIcon";

const frontSidebarMenusData = [
    {
        id: "1",
        text: "Dashboard",
        url: "home",
        icon: <DashboardIcon className="size-6" />,
        priority: 100,
        permission_name: "",
        status: 1,

        children: [],
    },
    {
        id: "2",
        text: "DC/DP Registration",
        url: "",
        icon: <DPOIcon className="size-6" />,
        priority: 100,
        permission_name: "",
        status: 1,
        children: [
            {
                text: "New Application",
                url: "dc-dp/registration",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
            {
                text: "Application Status",
                url: "dc-dp/list",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
            {
                text: "Replied Applications",
                url: "dc-dp/replied/list",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
        ],
    },
    {
        id: "3",
        text: "Data Breach",
        url: "",
        icon: <DataBreachIcon className="size-6" />,
        priority: 100,
        permission_name: "",
        status: 1,
        children: [
            {
                text: "New Application",
                url: "data-breach/registration",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
            {
                text: "Application Status",
                url: "data-breach/list",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
            {
                text: "Replied Applications",
                url: "data-breach/replied/list",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
        ],
    },
    {
        id: "4",
        text: "Complaint Handle",
        url: "",
        icon: <ChatIcon className="size-6" />,
        priority: 100,
        permission_name: "",
        status: 1,
        children: [
            {
                text: "New Application",
                url: "complaint-handle/registration",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
            {
                text: "Application Status",
                url: "complaint-handle/list",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
            {
                text: "Replied Applications",
                url: "complaint-handle/replied/list",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
        ],
    },
    {
        id: "5",
        text: "Payments & Receipts",
        url: "",
        icon: <ExpiryIcon className="size-6" />,
        priority: 100,
        permission_name: "",
        status: 1,
        children: [
            {
                text: "Unprocessed Payments",
                url: "transaction/pending/list",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
            {
                text: "Verified Payments",
                url: "transaction/list",
                icon: <UserRegistrationIcon className="size-6" />,
                priority: 100,
                permission_name: "",
                status: 1,
            },
        ],
    },
    {
        id: "6",
        text: "Enquiries",
        url: "enquiries",
        icon: <MailIcon className="size-6" />,
        priority: 100,
        permission_name: "",
        status: 1,
        children: [],
    },
    {
        id: "7",
        text: "Queries & Feedback",
        url: "faqs",
        icon: <StarIcon className="size-6" />,
        priority: 100,
        permission_name: "",
        status: 1,
        children: [],
    },
    {
        id: "8",
        text: "User Profile",
        url: "user-profile",
        icon: <UserProfileIcon className="size-6" />,
        priority: 100,
        permission_name: "",
        status: 1,
        children: [],
    },
];

export default frontSidebarMenusData;
