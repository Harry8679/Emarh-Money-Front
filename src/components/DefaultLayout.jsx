import React from 'react'

const DefaultLayout = (props) => {
  return (
    <div className='layout'>
        <div className="header">
            <div>
                <h1 className="logo">EMARH MONEY</h1>
            </div>
        </div>
        <div className="content">
            {props.children}
        </div>
    </div>

  )
}

export default DefaultLayout;