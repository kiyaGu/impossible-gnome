import React from 'react'
import FacebookLogin from 'react-facebook-login';

class Facebook extends React.Component {
    responseFacebook(response) {
        console.log(response);
      }


    render(){
    return(
        <FacebookLogin
        appId="1566616563395626"
        autoLoad={true}
        fields="name,email"
        callback={this.responseFacebook}
        cssClass='btn blue center'
         />
    )
}
}
export default Facebook