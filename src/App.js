
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import './styles/nav.css';
import Operating from './components/Operating';
import AddLift from './components/AddLift';
import EditLift from './components/EditLift';
import AddSlope from './components/AddSlope';
import EditSlope from './components/EditSlope';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import { NavLink } from 'react-router-dom';
import AddResort from './components/AddResort';

function App() {
  const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const teden = ['PON', 'TOR', 'SRE', 'ČET', 'PET', 'SOB', 'NED']

  const { user, isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) {
    return <div>Loading ...</div>;
  }
  
  return (
    <Router>
      <div className="App">
        <header className="App-header">

          <nav className='right-nav'>
            {isAuthenticated && 
              <ul className='navbar'>
                <NavLink to='/'><li className='resort-icon'>{user.resort}</li></NavLink>
                <NavLink to='/operating'><li>Obratovanje</li></NavLink>
              </ul>
            }
            <ul className='profile'>
              {isAuthenticated ? <>
                <li>{user.name}</li>
                <li><LogoutButton /></li>
              </> : <li><LoginButton /></li>}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" exact element={<p>hello</p>} />
          <Route path="/addResort" element={<AddResort 
            resort={user?.resort} 
            user={user?.email} />} />
          <Route 
            path='/operating/*' 
            exact 
            element={<Operating 
              weekdays={weekdays} 
              teden={teden} 
              resort={user?.resort} 
              user={user?.email} />}/>
          <Route path='/addLift' element={<AddLift resort={user?.resort} />} />
          <Route path='/addSlope' element={<AddSlope resort={user?.resort} />} />
          <Route path='/lifts/:liftName' element={<EditLift resort={user?.resort} />} />
          <Route path='/slopes/:slopeName' element={<EditSlope resort={user?.resort} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
