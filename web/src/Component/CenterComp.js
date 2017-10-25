import React from 'react'
import WebFont from 'webfontloader';
import 'bootstrap/dist/css/bootstrap.css'


WebFont.load({
  google: {
    families: ['Roboto', 'Droid Serif']
  }
})



const CenterComp = () =>{
  return(
    <div>
    <h1 className='col-md-8 offset-md-4 center title'>We Are One</h1>
    <h2 className='col-md-4  center subtitle' >Powered by impossible</h2>
  </div>
  )
}
export default CenterComp