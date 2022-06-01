
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Operating from './components/Operating';
import AddLift from './components/AddLift';
import EditLift from './components/EditLift';
import AddSlope from './components/AddSlope';
import EditSlope from './components/EditSlope';

function App() {
  const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const teden = ['PON', 'TOR', 'SRE', 'ČET', 'PET', 'SOB', 'NED']

  return (
    <Router>
      <div className="App">
        <header className="App-header"></header>
        <Routes>
          <Route 
            path='/operating/*' 
            exact 
            element={<Operating weekdays={weekdays} teden={teden} />}/>
          <Route path='/addLift' element={<AddLift />} />
          <Route path='/addSlope' element={<AddSlope />} />
          <Route path='/lifts/:liftName' element={<EditLift />} />
          <Route path='/slopes/:slopeName' element={<EditSlope />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
