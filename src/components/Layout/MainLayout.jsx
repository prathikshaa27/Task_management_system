import React from "react";
import PropTypes from "prop-types"
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({children}){
    return(
        <div className="d-flex flex-column min-vh-100">
            <Header/>
            <main className="flex-grow-1">{children}</main>
            <Footer/>
        </div>
    );
}
MainLayout.PropTypes = {
    children: PropTypes.node.isRequired
};