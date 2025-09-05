import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import style from './Navbar.module.css';
import { Button } from '../index';
import logo from '../../assets/youtube.png';
import { IoIosSearch } from "react-icons/io";

export const Navbar = () => {

    const user = useSelector((state) => state.user.isLoggedIn);

    const Navbar = [
        {
            name: 'Login',
            path: '/login',
            active: !user
        },
        {
            name: 'Signup',
            path: '/signup',
            active: !user
        },
        {
            name: 'Logout',
            path: '/logout',
            active: user
        },
        {
            name: 'Create',
            path: '/create',
            active: user
        }
    ]
    return (
    <div className={style.Navbar}>

        <div className={style.logo}>
            <Link to="/"><img src={logo} alt="Logo" /></Link>
        </div>

        <div className={style.Searchbar}>
            <input type="text" placeholder="Search..." /> 
            <button><IoIosSearch /></button>

        </div>

        <div className={style.navlinks}>
            {Navbar.map((item, index) => (
                item.active && <Link key={index} to={item.path} className={style.navlink}>
                    <Button>{item.name}</Button>
                </Link>
            ))}
        </div>
    </div>
);
}