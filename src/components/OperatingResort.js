import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ReactLoading from 'react-loading';

function OperatingResort (props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggler, setToggler] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState(null);

    const {weekdays, teden, resort, resortData} = props;
    
    useEffect(() => {
        setData(resortData)
        setLoading(false)
    }, [resortData])

    const handleWorkingChange = () => {
        data.working = !data.working
        // Used to trigger rerender
        setToggler(!toggler)
    }
    const handleDayWorkingChange = (day) => {
        data.working_hours[day].working = !data.working_hours[day].working
        // Used to trigger re-render
        setToggler(!toggler)
    }
    const handleDayOpenChange = (e, day) => {
        data.working_hours[day].open = e.target.value
        // Used to trigger re-render
        setToggler(!toggler)
    }
    const handleDayCloseChange = (e, day) => {
        data.working_hours[day].close = e.target.value;
        // Used to trigger re-render
        setToggler(!toggler)
    }
    const handleClosedUntilChange = e => {
        data.closed_until = e.target.value;
        setToggler(!toggler);
    }
    const handleOpenedUntilChange = e => {
        data.opened_until = e.target.value;
        setToggler(!toggler);
    }
    const handleTemperoralyClosedChange = () => {
        data.temporarily_closed.closed = !data.temporarily_closed.closed;
        setToggler(!toggler);
    }
    const handleTempClosedReasonChange = e => {
        data.temporarily_closed.reason = e.target.value;
        setToggler(!toggler);
    }
    const handleTempClosedTimeChange = e => {
        data.temporarily_closed.new_info = e.target.value;
        setToggler(!toggler);
    }
    const handleTextChange = (e, len) => {
        data.notes[len] = e.target.value;
        if(e.target.value < 1) {
            data.notes.pop()
        }
    }
    const handleAddNote = (e) => {
        if(e.target.value.length > 0) {
            data.notes[data.notes_count] = e.target.value;
            data.notes_count += 1;
            e.target.value = '' 
            // Used to trigger re-render
            setToggler(!toggler)
        }
    }
    const handleDeleteNote = (i) => {
        data.notes.splice(i, 1);
        data.notes_count -= 1;
        setToggler(!toggler)
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const token = await getAccessTokenSilently({
                audience: 'resorts'
            });
            setToken(token)

            const res = await fetch(`http://api.jpdum.com/${resort}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:`Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const resData = await res.json()
            setData(resData.updated_resort)
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
    }else {
        return (
            <div className='box'>
                <h3 className="hrline">{data.name}</h3>
                <div className='working'>
                    <label className="switchbox">
                        <input type="checkbox" checked={data.working} onChange={() => handleWorkingChange()}></input>
                        <span className="leverswitch"></span>
                        <span className="levertitle"> Obratovanje</span>
                    </label>
                    <div className='table'>
                        {weekdays.map((day, i) => (
                            <div key={day} className='table-day'>
                                <label className="switchbox">
                                    <input 
                                        type="checkbox" 
                                        checked={data.working && data.working_hours && data.working_hours[day].working}
                                        onChange={() => handleDayWorkingChange(day)}
                                    ></input>
                                    <span className="leverswitch"></span>
                                    <span className="levertitle">{teden[i]}</span>
                                </label>
                                <div>
                                    <input type="time" value={data.working_hours[day].open} onChange={e => handleDayOpenChange(e, day)}></input>
                                    <input type="time" value={data.working_hours[day].close} onChange={e => handleDayCloseChange(e, day)}></input>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="home-resortbox">
                    <br />
                    <p>Obratuje od: </p>
                    <input 
                        type="date" 
                        value={data.closed_until ? data.closed_until : ''} 
                        onChange={e => handleClosedUntilChange(e)}
                    ></input>
                    <br />
                    <p>Obratuje do: </p>
                    <input 
                        type="date" 
                        value={data.opened_until ? data.opened_until : ''} 
                        onChange={e => handleOpenedUntilChange(e)}
                    ></input>
                    <br />
                    <label className="switchbox justify-start">
                        <input 
                            type="checkbox" 
                            checked={data.temporarily_closed && data.temporarily_closed.closed}
                            onChange={() => handleTemperoralyClosedChange()}
                        ></input>
                        <span className="leverswitch"></span>
                    </label>
                    <p>Začasno zaprto</p>
                    <p>Razlog: </p>
                    <input 
                        type="text" 
                        placeholder='Vzrok za prekinitev '
                        value={data.temporarily_closed && data.temporarily_closed.reason ? data.temporarily_closed.reason : '' }
                        onChange={e => handleTempClosedReasonChange(e)}
                    ></input>
                    <p>Posodobitev ob: </p>
                    <input 
                        type="time" 
                        placeholder='Konec obratovanja: '
                        value={data.temporarily_closed && data.temporarily_closed.new_info ? data.temporarily_closed.new_info : ''}
                        onChange={e => handleTempClosedTimeChange(e)}
                    ></input>
                </div>
                <div className="notesbox">
                    <input 
                        type="text" 
                        placeholder='Vnos obvestila'
                        value={data.notes[data.notes_count]}
                        onChange={e => handleTextChange(e, data.notes_count)}
                        onBlur={e => handleAddNote(e)}
                    ></input>
                    <div className='notes'>
                        {data.notes_count > 0 &&
                            data.notes.map((note, i) => (
                                <p key={note}><span onClick={() => handleDeleteNote(i)}>x</span>{note}</p>
                        ))}
                    </div>
                </div>
                <button 
                    style={{marginTop: "3em"}} 
                    className='saveChanges'
                    onClick={e => handleUpdate(e)}
                >Shrani spremembe</button>
            </div>
        )
    }
}

export default OperatingResort;