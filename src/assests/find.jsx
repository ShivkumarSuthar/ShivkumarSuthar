import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Header from './Header'

function find() {
    return (
        <Container fluid className="find">
            <Header />
            <Row className='content'>
                <Col className="Cdata">
                    <div className='top'>
                        <h5 className='tittle'>Contact Me</h5>
                        <h1 className='text'>Let's Work<br /> together</h1>
                    </div>
                    <form>
                        <input type='text' placeholder='Name' className='name' />
                        <br />
                        <input type='email' placeholder='Email' className='email' />
                        <br />
                        <input type='text' placeholder='Subject' className='subject' />
                        <br />
                        <input type='text' placeholder='Message' className='message' />
                        <br />
                        <button className='submit'>Submit</button>
                    </form>
                </Col>
            </Row>
        </Container>
    )
}

export default find