import React, {useState,useEffect} from 'react'

function Contact() {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    useEffect(() => {
        window.addEventListener("resize",handleResize);
      }, []);

     const handleResize = (e) => {
        setWindowHeight(window.innerHeight);
    };
    return (
        <div className="MainDiv" style={{backgroundColor:"green"}}>
        <h1>צור קשר</h1>
    </div>
    )
}

export default (Contact)
