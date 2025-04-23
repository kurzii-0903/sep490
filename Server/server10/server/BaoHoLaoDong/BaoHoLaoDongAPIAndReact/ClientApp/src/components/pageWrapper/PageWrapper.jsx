import React from "react";
import { Helmet } from "react-helmet";

const PageWrapper = ({ title, children }) => {
    return (
        <>
            <Helmet>
                <title>{title} </title>
            </Helmet>
            {children}
        </>
    );
};

export default PageWrapper;
