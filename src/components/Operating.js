import '../styles/leverSwitch.css';
import '../styles/lifts.css';
import '../styles/buttons.css';
import '../styles/subnav.css';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

import OperatingLifts from './OperatingLifts';
import OperatingResort from './OperatingResort';
import OperatingSlopes from './OperatingSlopes';

function Operating(props) {
    const { resort, user } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`https://api.jpdum.com/${resort}`)
                const resData = await res.json();

                setData(resData)
                setLoading(false)
            } catch(e) {
                console.log(e)
            }
        })();
    }, [])

    if(loading) {
        return (
            <div>
                <div className='loading'>
                    <ReactLoading type={'spokes'} color={'#4e515a'} height={225} width={225} />
                </div>
                <p className="loading-text" >Nalaganje ...</p>
            </div>
        )
    }

    if(data?.error === 404) {
        return (<Navigate to="/addResort" resort={resort} user={user} />)
    }
    
    return (
        <div>
            <div className='subheader'>
                <h2>Obratovanje</h2>
                <nav>
                <ul>
                    <li><NavLink end to='/operating/' className={(navData) => navData.isActive ? "selected" : "" } >Domov</NavLink></li>
                    <li><NavLink to='/operating/lifts' className={(navData) => navData.isActive ? "selected" : "" }>Naprave</NavLink></li>
                    <li><NavLink to='/operating/slopes' className={(navData) => navData.isActive ? "selected" : "" }>Proge</NavLink></li>
                </ul>
            </nav>
            </div>
            <Routes>
                <Route path='/' exact element={<OperatingResort weekdays={props.weekdays} teden={props.teden} resort={resort} resortData={data} />} />
                <Route path='/lifts' element={<OperatingLifts weekdays={props.weekdays} teden={props.teden} resort={resort}/>} />
                <Route path='/slopes' element={<OperatingSlopes  weekdays={props.weekdays} teden={props.teden} resort={resort} />} />
            </Routes>
        </div>
    )
}

export default Operating