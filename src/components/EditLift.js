import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactLoading from 'react-loading';

function EditLift (props) {
    const [data, setData] = useState(null);
    const [name, setName] = useState(null);
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [capacity, setCapacity] = useState(null);

    let liftName = useParams()

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleTypeChange = (e) => {
        setType(e.target.value);
    }
    const handleCapacityChange = (e) => {
        setCapacity(e.target.value);
    }
    const handleIdChange = (e) => {
        setId(e.target.value);
    }
console.log(props)
    const handleUpdate = async (e, liftName) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await fetch(`http://127.0.0.1:5000/${props.resort}/lifts`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'name': liftName,
                    'newName': name,
                    'id': id,
                    'type': type,
                    'capacity': capacity
                })
            });
            const resData = await res.json()
            setData(resData)
            setLoading(false)
        }catch(e) {
            console.log(e);
        }
    }

    if(data) {
        if(data.success) {
            return (
                <section>
                    <div className='subheader'>
                        <h2>Naprava posodobljena!</h2>
                    </div>
                    <div className='box'>
                        <p className="hrline">Posodobljeno!</p>
                    </div>
                    <Link to='/operating/lifts'><button className='back'>Nazaj na naprave</button></Link>
                </section>
            )
        }else {
            return(
                <section className='form-new'>
                    <div className='subheader'>
                        <h2>{data.error}</h2>
                    </div>
                    <div className='box'>
                        <p className="hrline">{data.message}</p>
                    </div>
                    <Link to='/operating/lifts'><button className='back'>Nazaj na naprave</button></Link>
                </section>
            )
        }
    }
    
    return (
        <div>
            <div className='subheader'>
                <h2>Uredi napravo {liftName.liftName}</h2>
            </div>
            {loading ? (
                <div>
                    <div className='loading'>
                        <ReactLoading type={'spokes'} color={'#4e515a'} height={225} width={225} />
                    </div>
                    <p className="loading-text" >Nalaganje ...</p>
                </div>
                ) : (
                <form className="box addLiftBox">
                    <div>
                        <label htmlFor="name">Ime naprave:</label>
                        <input 
                            type="text" 
                            name="name"
                            onChange={e => handleNameChange(e)}
                            placeholder='Ime naprave'></input>
                    </div>
                    <div>
                        <label htmlFor="type">Id proge:</label>
                        <input 
                            type="text" 
                            name="id"
                            onChange={e => handleIdChange(e)}
                            placeholder='Id proge'></input>
                    </div>
                    <div>
                        <label htmlFor="type">Tip naprave:</label>
                        <input 
                            type="text" 
                            name="type"
                            onChange={e => handleTypeChange(e)}
                            placeholder='Tip naprave'></input>
                    </div>
                    <div>
                        <label htmlFor="capacity">Kapaciteta enote naprave: </label>
                        <input 
                            type="number" 
                            name="capacity"
                            onChange={e => handleCapacityChange(e)}
                            placeholder='Kapaciteta enote naprave'></input>  
                    </div>
                    <button disabled={!name || !type || !capacity} className='saveChanges' onClick={e => handleUpdate(e, liftName.liftName)}>Uredi napravo</button>
                    <Link to='/operating/lifts'><button className='back'>Nazaj na naprave</button></Link>
                </form>
            )}
        </div>
    )
}

export default EditLift;