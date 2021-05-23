import React from 'react'
import { connect } from 'react-redux'
import {Route,Redirect} from 'react-router-dom'
 const UserRoute = (props) => {
     if (props.user) {
         return <Route {...props} />
     }
     else{
        return <Redirect to="/" />
     }
}

const mapStateToProps = (state) => ({
    
})
    // "build": "react-scripts build",
    // "test": "react-scripts test",
    // "eject": "react-scripts eject"
    // "start": "node server/server.js",
//"start": "react-scripts start",
//"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install npm && run build",

const mapDispatchToProps = {
    
}

export default connect(
    ({ user }) => ({ user })
)(UserRoute)
