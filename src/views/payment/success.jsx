import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import CustomCard from "@/components/common/CustomCard";
import { useSelector, useDispatch } from "react-redux";
import { getCallbackPaymentGatewayService } from "@/services/payment/PaymentServices";
import validationErrors from "@/lib/validationErrors";

export default function PaymentSuccessPage() {
    const { isAuthenticated, isType } = useSelector((state) => state?.Auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get("order_no");
    const [countdown, setCountdown] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCountdown(10);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    useEffect(() => {
        if (isAuthenticated && orderNo) {
            if (isType == "admin") {
                getCallbackDataCall(orderNo, "admin");
            } else {
                getCallbackDataCall(orderNo, "user");
            }
        }
    }, []);

    const getCallbackDataCall = (orderNo, userType) => {
        setIsLoading(true);
        dispatch(getCallbackPaymentGatewayService({ status: "success", order_no: orderNo }, userType))
            .then((res) => {
                if (isType == "admin") {
                    navigate("/admin/data-controllers");
                } else {
                    navigate("/dc-dp/list");
                }
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                if (isType == "admin") {
                    navigate("/admin/data-controllers");
                } else {
                    navigate("/dc-dp/list");
                }
                setIsLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <CustomCard className="w-full max-w-md p-8 text-center space-y-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-primary">Payment Successful</h1>
                    <p className="text-muted-foreground">Thank you for your payment! Your transaction has been processed successfully.</p>
                </div>

                {/* Countdown and Button */}
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Redirecting in {countdown} seconds...</p>
                </div>
            </CustomCard>
        </div>
    );
}
