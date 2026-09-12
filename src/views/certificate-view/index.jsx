import React, { useState, useEffect, useRef } from "react";
import MainLogo from "../../components/icons/mainLogo";
import Divider from "@/components/ui/divider";
import InputCheck from "@/components/ui/inputs/input-check";
import { Input } from "@/components/ui/inputs/input";
import { InputPassWord } from "@/components/ui/inputs/input-password";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import validationErrors from "@/lib/validationErrors";
import { getByIdCertificate } from "@/services/user/DataControllerServices";
import { authLogin } from "@/store/actions";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { GeneralSettingList } from "@/constants/GeneralSettingConstant";
import Moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormStatusBadge from "@/components/common/FormStatusBadge";

export default function LoginPage(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState();
    const entityOptionList = {
        1: "Data Controller",
        2: "Data Processor",
        3: "Both",
    };
    useEffect(() => {
        if (id && id !== "") {
            getDataById(id);
        }
    }, [id]);

    const getDataById = (editId) => {
        setIsLoading(true);
        dispatch(getByIdCertificate(editId))
            .then((res) => {
                var formData = res?.data?.data;
                setDataSource(formData);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                navigate("/");
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{dataSource?.contact?.name}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium text-gray-700">DPA Number:</span> {dataSource?.dpaLicenceNumber}
                </p>

                <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <p className="text-gray-500 font-semibold">Type of Entity</p>
                        <p className="capitalize">{entityOptionList[dataSource?.entityType]}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">Registered Date</p>
                        <p className="text-blue-600 font-medium">{new Date(dataSource?.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">Status</p>
                        <FormStatusBadge label={dataSource?.status} />
                    </div>
                </div>
            </div>
        </div>
    );
}
