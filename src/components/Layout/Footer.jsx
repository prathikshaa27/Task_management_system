import React from "react";

export default function Footer(){
    return(
        <footer className="bg-info bg-opacity-10 py-3 border-top text-center"
         style={{
            backgroundColor: "#f8f9fa"
         }}
        >
        <div className="small text-muted">
          © {new Date().getFullYear()} Taskify. All rights reserved.
        </div>
        </footer>
    );
}