import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";

const PermissionCheck = ({ permsission, children }) => {
    const { isSuperAdmin, permissions } = useSelector((state) => state?.Auth);
    if (permissions.includes(permsission)) {
        return <>{children}</>;
    } else {
        return <></>;
    }
};

export default PermissionCheck;
