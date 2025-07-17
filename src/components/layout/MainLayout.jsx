import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <Header />
      <main
        className="flex-grow-1 bg-light position-relative "
        style={{
          overflow: "hidden",
          minHeight: 0,
          width: "100%",
        }}
      >
        <div className="h-100" style={{ overflow: "auto", width: "100%" }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
