import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Typewriter from 'typewriter-effect';
import Header from './Header';

function Blog() {
    const options = {
        strings: ['<span className="fText">Coming Soon....</p>'],
        autoStart: true,
        loop: true,
    };
    return (
        <>

            <Header />
            <Container fluid className='blog'>
                <Row className="content">
                    <h3 className='tittle'>My <span className="color">Blog</span></h3>
                    <h5 className='subheading'>my latest blog <span className='color'>posts...</span></h5>
                    <Col className="data">
                        <Typewriter options={options} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Blog