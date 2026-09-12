import React from "react";

function NotFoundPage() {
    return (
        <div className="NotFound-page">
            <section className="pt-16 pb-12 flex flex-col items-center justify-center text-center">
                <img className="mb-8 w-full max-w-[220px]" alt="404" src="/assets/images/accessible/404.gif" />
                <h3 className="capitalize text-[26px] font-medium leading-[40px] mb-2">404 Page Not Found!</h3>
                <p className="text-lg font-normal leading-[34px] mb-8">We can’t seem to find the page you're looking for.</p>
            </section>
        </div>
    );
}

export default NotFoundPage;
