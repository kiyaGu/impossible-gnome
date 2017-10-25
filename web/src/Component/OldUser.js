import React from 'react'
import {Row} from 'reactstrap'


class OldUser extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            input:null
        }
    }




    render(){
    return(
        <Row className='oldUser center .col-md-3 .offset-md-3'>
            <p>Already have an account?</p>
            <p><a href=''>sign in</a></p>
        </Row>
    )
}
}

export default OldUser