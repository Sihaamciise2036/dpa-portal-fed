import React from "react";
import { Link } from "react-router-dom";

function UnauthorizedPage() {
    return (
        <section class="pt-16 pb-12 flex flex-col items-center justify-center text-center">
            <img class="mb-8 w-full max-w-[220px]" alt="gif" src="/assets/images/accessible/403.gif" />
            <h3 class="capitalize text-[26px] font-medium leading-[40px] mb-2">403 Access Denied!</h3>
            <p class="text-lg font-normal leading-[34px] mb-8">You tried to access a page you did not have prior authorization for.</p>
            <Link to={`/admin/dashboard`} class="w-full max-w-[250px] py-3 rounded-3xl capitalize text-base font-medium leading-6 text-center bg-primary text-white">
                Dashboard
            </Link>
        </section>
    );
}

export default UnauthorizedPage;
