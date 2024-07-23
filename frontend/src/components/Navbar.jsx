import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import '../index.css'

const StyledNavLink = styled(NavLink)({
  color: "white",
  textDecoration: "none",
  padding: "0.5rem 1rem",
  "&:hover": {
    textDecoration: "underline",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "0.375rem",
  },
});

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center relative">
      <h1 className="text-white text-2xl pl-4 font-serif">
        <NavLink to="/">holdIt_</NavLink>
      </h1>
      <div className="hidden md:flex space-x-4">
        <Button
          component={StyledNavLink}
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Home
        </Button>
        <Button
          component={StyledNavLink}
          to="/imageuploader"
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Image Uploader
        </Button>
        <Button
          component={StyledNavLink}
          to="/excelsheet"
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Excelsheet
        </Button>
      </div>

      
      <div className="md:hidden">
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu}>
          {isMenuOpen ? (
            <CloseIcon className="text-white" />
          ) : (
            <MenuIcon className="text-white" />
          )}
        </IconButton>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 right-0 h-full w-64 bg-gray-900 flex flex-col items-center animate-slide-in-right z-50 p-4">
          <div className="self-end mb-4">
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu}>
              <CloseIcon className="text-white" />
            </IconButton>
          </div>
          <Button
            component={StyledNavLink}
            to="/"
            className="bg-blue-500 hover:bg-blue-700 text-white w-full text-center mb-2"
            onClick={toggleMenu}
          >
            Home
          </Button>
          <Button
            component={StyledNavLink}
            to="/imageuploader"
            className="bg-blue-500 hover:bg-blue-700 text-white w-full text-center"
            onClick={toggleMenu}
          >
            Image Uploader
          </Button>
          <Button
            component={StyledNavLink}
            to="/excelsheet"
            className="bg-blue-500 hover:bg-blue-700 text-white w-full text-center"
            onClick={toggleMenu}
          >
            Excelsheet
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
