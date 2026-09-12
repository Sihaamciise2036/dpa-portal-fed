import NotFoundPage from "../views/NotFoundPage";
import MainLayout from "@/layout/publicView/MainLayout";
import DataControllerPage from "../views/publicView/data-controller";

const PublicViewRoutes = () => [
    {
        path: "/data",
        element: <MainLayout />,
        children: [
            {
                path: "/data",
                element: <DataControllerPage pageTitle="Data Controllers & Processors" />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
];
export default PublicViewRoutes;
