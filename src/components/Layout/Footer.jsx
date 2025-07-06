import React from "react";

export default function Footer(){
    return(
        <footer className="bg-dark text-white text-center py-3 mt-auto border-top">
           <small>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</small>
        </footer>
    );
}