'use client';

import React, { useState } from 'react';
import { CiMenuFries } from 'react-icons/ci';
import dataList from "@/public/assets/dataList";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function RightLayout() {
    const [on, setOn] = useState(false);
    const [menu, setMenu] = useState(false);
    const pathname = usePathname();

    const toggleSound = () => {
        setOn(!on);
    };

    const toggleMenu = () => {
        setMenu(!menu);
    };

    const navItems = [
        { "page": 'Home', "link": "/" },
        { "page": 'About', "link": "/about" },
        { "page": 'Experience', "link": "/experience" },
        { "page": 'Projects', "link": "/projects" },
        { "page": 'Skills', "link": "/skills" },
        { "page": 'Contact Me', "link": "/contact" }
    ];

    return (
        <div className="right-menu">
            {!menu && (
                <>
                    <div className="menu-icon">
                        <CiMenuFries className='icon' onClick={toggleMenu} />
                    </div>

                    <div className="sound-controls">
                        <label className="switch">
                            <div className="round">
                                <input name="onoff" id="onoff" type="checkbox" onClick={toggleSound} />
                                <div className="back">
                                    <label htmlFor="onoff" className="but">
                                        <span className="on"></span>
                                        <span className="off">ON</span>
                                    </label>
                                </div>
                            </div>
                        </label>
                    </div>
                </>
            )}

            {menu && (
                <div className="sidebar-menu">
                    <div className="close-icon" onClick={toggleMenu}>
                        &times;
                    </div>
                    <nav>
                        <ul>
                            {navItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.link}
                                        className={`${
                                            pathname === item.link
                                                ? "bg-[#707fdd2f] text-[#5A6ACF]"
                                                : "bg-none text-[#273240]"
                                        } flex rounded-lg`}
                                    >
                                        {item.page}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}

            {on && <audio src={dataList.media.audio} autoPlay loop />}
        </div>
    );
}

export default RightLayout;