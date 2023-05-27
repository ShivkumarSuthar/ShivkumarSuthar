import React from 'react'
import { Container, Row } from 'react-bootstrap'

function Footer() {
    return (
        < Container fluid className='footer-main' >
            <footer className='footer'>
                <Row className="fdata">
                    <p className='copy'>copyright <i className="fa-solid fa-copyright"></i> 2023 and all right reserved by shivkumar suthar...</p>
                    {/* <p className='boss'>Made By <span className='color'>Mr.Suthar</span></p> */}
                </Row>
            </footer>
        </Container >
    )
}

export default Footer