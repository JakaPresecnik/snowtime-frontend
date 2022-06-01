import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import editLogo from '../images/edit.svg'

function OperatingLifts (props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    // Used to trigger re-render
    const [toggler, setToggler] = useState(false);
    const {weekdays, teden} = props;

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('http://127.0.0.1:5000/Golte/lifts')
                const resData = await res.json();
                setData(resData)
                setLoading(false)
            } catch(e) {
                console.log(e)
            }
        })();
    }, [])

    const handleLiftWorkingChange = (i) => {
        data.lifts[i].working = !data.lifts[i].working
        // Used to trigger rerender
        setToggler(!toggler)
    }
    const handleDayWorkingChange = (i, day) => {
        data.lifts[i].working_hours[day].working = !data.lifts[i].working_hours[day].working
        // Used to trigger re-render
        setToggler(!toggler)
    }
    const handleDayOpenChange = (e, i, day) => {
        data.lifts[i].working_hours[day].open = e.target.value
        // Used to trigger re-render
        setToggler(!toggler)
    }
    const handleDayCloseChange = (e, i , day) => {
        data.lifts[i].working_hours[day].close = e.target.value;
        // Used to trigger re-render
        setToggler(!toggler)
    }
    const handleTextChange = (e, i, len) => {
        data.lifts[i].notes[len] = e.target.value;
        if(e.target.value < 1) {
            data.lifts[i].notes.pop()
        }
    }
    const handleAddNote = (e, i) => {
        if(e.target.value.length > 0) {
            data.lifts[i].notes[data.lifts[i].notes_count] = e.target.value;
            data.lifts[i].notes_count += 1;
            e.target.value = '' 
            // Used to trigger re-render
            setToggler(!toggler)
        }
    }
    const handleDeleteNote = (i, j) => {
        data.lifts[i].notes.splice(j, 1);
        data.lifts[i].notes_count -= 1;
        setToggler(!toggler)
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await fetch('http://127.0.0.1:5000/Golte/lifts', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data.lifts)
            });
            const resData = await res.json()
            
            setData(resData)
            setLoading(false)
        }catch(e) {
            console.log(e);
        }
    }

    if(loading) {
        return (
            <div>
                <div className='loading'>
                    <ReactLoading type={'spokes'} color={'#4e515a'} height={225} width={225} />
                </div>
                <p className="loading-text" >Nalaganje ...</p>
            </div>
        )
        }else if(!data.success) {
            return (
                <div className='box'>
                    <h3 className="hrline">{data.error}</h3>
                    <p>{data.message}</p>
                    <p>Za vnos naprav pritisni spodnji gumb:</p>
                    <Link to={{pathname: '/addSlope'}}><button className='addFirst'>Dodaj progo</button></Link>
                </div>
            )
        }else {
            const {resort, lifts} = data;
            return (
            <div className='box'>
                <h3 className="hrline">{resort} - Naprave</h3>
                {lifts && lifts.map((lift, i) => (
                    <div key={lift.name}>
                        <div className='working'>
                            <label className="switchbox">
                                <input type="checkbox" checked={lift.working} onChange={() => handleLiftWorkingChange(i)}></input>
                                <span className="leverswitch"></span>
                                <span className="levertitle">{lift.id + '. ' +lift.name}</span>
                            </label>
                            <div className='table'>
                                {weekdays.map((day, j) => (
                                    <div key={lift.name + day} className='table-day'>
                                        <label className="switchbox">
                                            <input type="checkbox" checked={lift.working && lift.working_hours && lift.working_hours[day].working} onChange={() => handleDayWorkingChange(i, day)}></input>
                                            <span className="leverswitch"></span>
                                            <span className="levertitle">{teden[j]}</span>
                                        </label>
                                        <div>
                                            <input type="time" value={lift.working_hours[day].open} onChange={e => handleDayOpenChange(e, i, day)}></input>
                                            <input type="time" value={lift.working_hours[day].close} onChange={e => handleDayCloseChange(e, i, day)}></input>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="notesbox">
                            <input 
                                type="text" 
                                placeholder='Vnos obvestila'
                                value={lift.notes[lift.notes_count]}
                                onChange={e => handleTextChange(e, i, lift.notes_count)}
                                onBlur={e => handleAddNote(e, i)}
                            ></input>
                            <div className='notes'>
                            {lift.notes_count > 0 &&
                                lift.notes.map((note, j) => (
                                    <p key={note}><span onClick={() => handleDeleteNote(i, j)}>x</span>{note}</p>
                                ))}
                            </div>
                            <div></div>
                            <Link to={{pathname: `/lifts/${lift.name}`}}
                            ><button className='editChanges'><img src={editLogo} alt="edit" /></button></Link>
                        </div>
                    </div>
                ))}
                <Link to={{pathname: '/addLift'}}><button className='addNew'>+</button></Link>
                <button className='saveChanges' onClick={e => handleUpdate(e)}>Shrani spremembe</button>
            </div>
        )
    }
}

export default OperatingLifts;