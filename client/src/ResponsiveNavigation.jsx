import React, { useState, useEffect } from 'react';
import './menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { withRouter, Link, useHistory } from 'react-router-dom'
function ResponsiveNavigation({ background, hoverBackground, linkColor, navLinks, logo, userName, isLoggedIn, onLogout, navOpen2, hadleNavOpen }) {
    const [navOpen, setNavOpen] = useState(0)
    const [hoverIndex, setHoverIndex] = useState(-1)
    const [ActiveId, setActiveId] = useState("")
    const history = useHistory();

    const LoginPage = () => {
            history.push("/login");
    }

    useEffect(() => {
        hadleNavOpen(navOpen);
    }, [navOpen])

    return (
        <nav
            className="responsive-toolbar"
            style={{ background: background }}>

            <ul
                style={{ background: background }}
                id={navOpen ? 'active' : ''}
            >
                {isLoggedIn ? <div className="login d-none d-sm-block">{userName} ,שלום</div> :
                    <div className="login d-none d-sm-block" onClick={() => { LoginPage() }}>התחברות, הרשמה</div>}
                {isLoggedIn ? <span className="logout d-none d-sm-block" onClick={onLogout}><FontAwesomeIcon icon={faSignOutAlt} /> | התנתק</span> : null}
                <figure className="image-logo d-none d-sm-block" onClick={() => { setNavOpen(!navOpen) }}>
                    <FontAwesomeIcon icon={faBars} />
                    {/* <img src={logo} height="40px" width="40px" alt="toolbar-logo" /> */}
                </figure>

                {navLinks.map((link, index) =>
                    <li
                        key={index}
                        onMouseEnter={() => { setHoverIndex(index) }}
                        onMouseLeave={() => { setHoverIndex(-1) }}
                        style={{ background: hoverIndex === index ? (hoverBackground || '#999') : '' }}
                    >
                        <Link
                            to={link.path}
                            style={{ color: ActiveId === index ? 'red' : linkColor}}
                            onClick={() => setNavOpen(!navOpen)}
                            onClick={()=>setActiveId(index)}
                        >
                            <i className={link.icon} />
                            {link.text}

                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default withRouter(ResponsiveNavigation)