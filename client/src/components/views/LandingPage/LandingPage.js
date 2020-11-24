import React, {useEffect} from 'react'
import axios from 'axios';

function LandingPage() {

    useEffect(() => {
        axios.get('/api/hi')
        .then(res => {console.log(res)})
    }, [])
    
    return (
        <div>
            LandingPage
        </div>
    )
}

export default LandingPage
