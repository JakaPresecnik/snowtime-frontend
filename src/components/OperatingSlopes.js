import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import { Link } from "react-router-dom";
import editLogo from '../images/edit.svg';
import { useAuth0 } from '@auth0/auth0-react';


function OperatingSlopes(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggler, setToggler] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`https://api.jpdum.com/${props.resort}/slopes`)
                const resData = await res.json();
                setData(resData)
                setLoading(false)
            } catch(e) {
                console.log(e)
            }
        })();
    }, [])

    const slopeWorkingChange = (i) => {
        data.slopes[i].working = !data.slopes[i].working;
        setToggler(!toggler);
    }
    const handleSnowmakingChange = (i) => {
        data.slopes[i].snowmaking = !data.slopes[i].snowmaking;
        setToggler(!toggler);
    }
    const handleTextChange = (e, i, len) => {
        data.slopes[i].notes[len] = e.target.value;
        if(e.target.value < 1) {
            data.slopes[i].notes.pop()
        }
    }
    const handleAddNote = (e, i) => {
        if(e.target.value.length > 0) {
            data.slopes[i].notes[data.slopes[i].notes_count] = e.target.value;
            data.slopes[i].notes_count += 1;
            e.target.value = '' 
            // Used to trigger re-render
            setToggler(!toggler)
        }
    }
    const handleDeleteNote = (i, j) => {
        data.slopes[i].notes.splice(j, 1);
        data.slopes[i].notes_count -= 1;
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
            const res = await fetch(`https://api.jpdum.com//${props.resort}/slopes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:`Bearer ${token}`
                },
                body: JSON.stringify(data.slopes)
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
                    <p>Za vnos prog pritisni spodnji gumb:</p>
                    <Link to={{pathname: '/addSlope'}}><button className='addFirst'>Dodaj progo</button></Link>
                </div>
            )
        }else {
            const {resort, slopes} = data;
            return (
                <div className='box'>
                    <h3 className="hrline">{resort} - Proge</h3>
                    {slopes && slopes.map((slope, i) => (
                        <div key={slope.name} className={{
                                '1': 'easy',
                                '2': 'medium',
                                '3': 'hard'
                                }[slope.difficulty]}>
                            <div className='working'>
                                <label className="switchbox">
                                    <input type="checkbox" checked={slope.working} onChange={() => slopeWorkingChange(i)}></input>
                                    <span className="leverswitch"></span>
                                    <span className="levertitle">{slope.id + '. ' + slope.name}</span>
                                </label>
                                <div className='table'>
                                    <label className="switchbox">
                                        <input type="checkbox" checked={slope.snowmaking} onChange={() => handleSnowmakingChange(i)}></input>
                                        <span className="leverswitch"></span>
                                        <span className="levertitle">Zasneževanje</span>
                                    </label>
                                </div>
                            </div>
                            <div className="notesbox">
                                <input 
                                    type="text" 
                                    placeholder='Vnos obvestila'
                                    value={slope.notes[slope.notes_count]}
                                    onChange={e => handleTextChange(e, i, slope.notes_count)}
                                    onBlur={e => handleAddNote(e, i)}
                                ></input>
                                <div className='notes'>
                                    {slope.notes_count > 0 &&
                                    slope.notes.map((note, j) => (
                                        <p key={note}><span onClick={() => handleDeleteNote(i, j)}>x</span>{note}</p>
                                    ))}
                                </div>
                                <div></div>
                                <Link to={{pathname: `/slopes/${slope.name}`}}
                                 ><button className='editChanges'><img src={editLogo} alt="edit" /></button></Link>
                            </div>
                        </div>
                    ))
                    }
                    <Link to={{pathname: '/addSlope'}}><button className='addNew'>+</button></Link>
                    <button className='saveChanges' onClick={e => handleUpdate(e)}>Shrani spremembe</button>
                </div>
            )
        }
}

export default OperatingSlopes;