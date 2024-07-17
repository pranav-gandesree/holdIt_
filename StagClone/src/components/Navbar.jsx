import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import ImageUploader from "./ImageUploader";
import TextArea from "./TextArea";
import Table from "./Table";
import axios from "axios";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav>
        <h1>
          <NavLink to="/">Textshare</NavLink>
        </h1>
        <div>
          <ul>
            <li>
              <NavLink to="/textarea">textarea</NavLink>
            </li>

            <li>
              <NavLink to="/imageuploader">image uploader</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
