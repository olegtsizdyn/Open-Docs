import React from 'react';
import { ReactComponent as Home } from '../../shared/images/svg/home.svg';
import { ReactComponent as Document } from '../../shared/images/svg/document.svg';
import { ReactComponent as Logo } from '../../shared/images/svg/logo.svg';
import { ReactComponent as Close } from '../../shared/images/svg/close.svg';
import { connect, useDispatch } from 'react-redux'
import { setNavToggle } from '../../store/nav/actions'
import { NavLink } from 'react-router-dom';

function Navigation({ nav, setNavToggle }) {

    const closeNav = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useDispatch(setNavToggle(false))
    }

    return (
        <div className="navigation_wrapper" style={{ left: `${nav.navToggle ? '0px' : '-999px'}` }}>
            <div className="logo_icon logo_icon_nav">
                <NavLink className="logo_svg" to="/home">
                    <Logo />
                </NavLink>
                <Close className="close_svg" onClick={closeNav} />
            </div>
            <div className="nav_btn_group">
                <NavLink to="/home" className="nav_btn" activeClassName="nav_btn_active">
                    <Home />
                    <p>Home</p>
                </NavLink>
                <NavLink to="/documents" className="nav_btn" activeClassName="nav_btn_active">
                    <Document />
                    <p>My Documents</p>
                </NavLink>
            </div>
        </div>
    );
}

const mapStateToProps = ({ nav }) => {
    return { nav }
}

const mapDispatchToProps = {
    setNavToggle
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
