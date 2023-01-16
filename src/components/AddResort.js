import { useState, useMemo } from "react";
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useAuth0 } from '@auth0/auth0-react';

function AddResort(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState('');
    const options = useMemo(() => countryList().getData(), [])
    const { getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState(null);
    
    const { resort, user } = props;

    const handleCountryChange = e => {
        setCountry(e);
    }

    const postResort = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const token = await getAccessTokenSilently({
                audience: 'resorts'
            });
            setToken(token)
            const res = await fetch(`https://api.jpdum.com/${resort}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "user": user,
                    "name": resort,
                    "country": country.label
                })
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
    }
    if(data?.success) {
        return (
            <section>
                <div className='subheader'>
                    <h2>Smučišče {data.added} ustvarjeno!</h2>
                </div>
                <Link to='/operating/home'><button className='back'>Nazaj na obratovanje</button></Link>
            </section>
        )
    }

    return (
        <div className="margin-top">
            <form className="box">
                <div>
                    <p>Izberi država v kateri je smučišče locirano:</p>
                    <Select options={options} value={country} onChange={handleCountryChange} />
                </div>
            </form>
            <button className='saveChanges'
                disabled={ country === '' } 
                onClick={e => postResort(e)}>Ustvari smučišče {resort}</button>
        </div>
    )
}
export default AddResort;