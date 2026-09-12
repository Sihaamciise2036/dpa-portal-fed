import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

const ConfirmOrderModal = ({ modelTitle, openModel, handleModelClose, addonsClass = "", modelHeaderHide = false, children }) => {
    return (
        <div className={cn("modal confirm-order ff-modal", addonsClass, openModel && "active")}>
            {modelHeaderHide && modelHeaderHide == true ? (
                <>{children}</>
            ) : (
                <div class="modal-dialog max-w-[360px] relative">
                    <button className="modal-close fa-regular fa-circle-xmark absolute top-5 right-5" onClick={() => handleModelClose()}></button>
                    <div className="modal-body">
                        <h3 className="capitalize text-base font-medium text-center mt-2 mb-3">Thank you for your order!</h3>
                        <img className="w-[120px] mx-auto mb-3" src={"/assets/images/cart/confirm.gif"} alt="gif" />
                        <h3 className="capitalize text-lg font-medium text-center mb-3 text-primary">Order Confirmed</h3>
                        <p className="text-sm leading-6 mb-4">
                            Your order is currently confirmed as
                            <b className="font-medium"> Dining Table.</b>
                            {/* <strong className="font-normal">
                                choosing payment options
                            </strong> */}
                        </p>
                        {/* <div className="flex gap-6">
                            <Link to={{ pathname: `/table/tableOrder/details` }} className="w-full rounded-3xl text-center font-medium leading-6 py-3 border border-primary text-primary bg-white" >Go to Order</Link>
                            <button className="w-full rounded-3xl text-center font-medium leading-6 py-3 text-white bg-primary" >Pay Now </button>
                        </div> */}
                        <Link to={"/menu/order-detail"} className="w-full rounded-3xl text-center font-medium leading-6 py-3 text-white bg-primary">
                            Go to Details
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmOrderModal;
