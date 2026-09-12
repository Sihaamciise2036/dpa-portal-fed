import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

const PrintInvoiceModal = ({ modelTitle, openModel, handleModelClose, addonsClass = "", modelHeaderHide = false, children }) => {
    return (
        <div className={cn("modal confirm-order ff-modal", addonsClass, openModel && "active")}>
            <div class="modal-dialog max-w-[340px] rounded-none">
                <button className="modal-close fa-regular fa-circle-xmark absolute top-5 right-5" onClick={() => handleModelClose()}></button>
                <div className="modal-body">
                    <div className="text-center pb-3.5 border-b border-dashed border-gray-400">
                        <h3 className="text-2xl font-bold mb-1">Mirpur-1 (main)</h3>
                        <h4 className="text-sm font-normal">House : 25, Road No: 2, Block A, Mirpur-1, Dhaka 1216</h4>
                        <h5 className="text-sm font-normal">Tel: 9998887777</h5>
                    </div>
                    <table className="w-full my-1.5">
                        <tbody>
                            <tr>
                                <td className="text-xs text-left py-0.5 text-heading">order #1512247</td>
                            </tr>
                            <tr>
                                <td className="text-xs text-left py-0.5 text-heading">15-12-2024</td>
                                <td className="text-xs text-right py-0.5 text-heading">11:41 PM</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="w-full">
                        <thead className="border-t border-b border-dashed border-gray-400">
                            <tr>
                                <th scope="col" className="py-1 font-normal text-xs capitalize text-left text-heading w-8">
                                    {" "}
                                    qty{" "}
                                </th>
                                <th scope="col" className="py-1 font-normal text-xs capitalize flex items-center justify-between text-heading">
                                    <span>item description</span>
                                    <span>price</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="border-b border-dashed border-gray-400">
                            {[...Array(5)].map((item, index) => (
                                <tr key={index}>
                                    <td className="text-left font-normal align-top py-1">
                                        <p className="text-xs leading-5 text-heading">1</p>
                                    </td>
                                    <td className="text-left font-normal align-top py-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-normal capitalize">Chicken Dumplings</h4>
                                            <p className="text-xs leading-5 text-heading">₹2.38</p>
                                        </div>
                                        <p className="text-xs leading-5 font-normal text-heading max-w-[200px]">
                                            <span> Size: : Regular - 8 pcs </span>
                                        </p>
                                        <p className="text-xs leading-5 font-normal text-heading max-w-[200px]">
                                            Extras :<span> Large</span>
                                        </p>
                                        <p className="text-xs leading-5 font-normal text-heading max-w-[200px]">instruction : instruction</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs leading-5 font-normal text-heading">VAT (5.00 %)</p>
                                            <p className="text-xs leading-5 font-normal text-heading">₹0.13</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="py-2 pl-7">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="text-xs text-left py-0.5 uppercase text-heading">Subtotal</td>
                                    <td className="text-xs text-right py-0.5 text-heading">₹25.82</td>
                                </tr>
                                <tr>
                                    <td className="text-xs text-left py-0.5 uppercase text-heading">Total Tax:</td>
                                    <td className="text-xs text-right py-0.5 text-heading">₹0.38</td>
                                </tr>
                                <tr>
                                    <td className="text-xs text-left py-0.5 font-bold uppercase text-heading">Total:</td>
                                    <td className="text-xs text-right py-0.5 font-bold text-heading">₹26.19</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="text-xs py-1 border-t border-b border-dashed border-gray-400 text-heading">
                        <table>
                            <tbody>
                                <tr>
                                    <td className="pt-1 pb-1 pr-1">Order Type : </td>
                                    <td className="pt-1 pb-1">Dining Table</td>
                                </tr>
                                <tr>
                                    <td className="pt-1 pb-1 pr-1">Payment Type : </td>
                                    <td className="pt-1 pb-1">Cash/Card</td>
                                </tr>
                                <tr>
                                    <td className="pt-1 pb-1 pr-1">Delivery Time : </td>
                                    <td className="pt-1 pb-1">11:41 PM, 15-12-2024</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center pt-2 pb-4">
                        <p className="text-[11px] leading-[14px] capitalize text-heading">thank you</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <h5 className="text-[8px] font-normal text-left w-[46px] leading-[10px]">Powered by</h5>
                        <h6 className="text-xs font-normal leading-4">FoodScan - QrCode Restaurant Menu Maker and Contactless Menu Ordering system</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintInvoiceModal;
