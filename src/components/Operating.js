import '../styles/leverSwitch.css';
import '../styles/lifts.css';
import '../styles/buttons.css';
import '../styles/subnav.css';
import { Routes, Route, NavLink } from 'react-router-dom';

import OperatingLifts from './OperatingLifts';
import OperatingResort from './OperatingResort';
import OperatingSlopes from './OperatingSlopes';

function Operating(props) {
    return (
        <div>
            <div className='subheader'>
                <h2>Obratovanje</h2>
                <nav>
                <ul>
                    <li><NavLink to='/operating/' className={(navData) => navData.isActive ? "selected" : "" } >Domov</NavLink></li>
                    <li><NavLink to='/operating/lifts' className={(navData) => navData.isActive ? "selected" : "" }>Naprave</NavLink></li>
                    <li><NavLink to='/operating/slopes' className={(navData) => navData.isActive ? "selected" : "" }>Proge</NavLink></li>
                </ul>
            </nav>
            </div>
            <Routes>
                <Route path='/' element={<OperatingResort weekdays={props.weekdays} teden={props.teden}/>} />
                <Route path='/lifts' element={<OperatingLifts weekdays={props.weekdays} teden={props.teden}/>} />
                <Route path='/slopes' element={<OperatingSlopes />} />
            </Routes>
        </div>
    )
}

export default Operating