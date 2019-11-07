import React from 'react';
import heart from '../../assets/heart.jpg';
import './Home.css';
import Button from 'react-bootstrap/Button';

function Home() {
    return (
        <div className="App">
          <div className="container-fluid">
            <div className="landing-page">
              <div className="body-page">

                    <img src={heart} className="heart" alt="HelpingHand" />

                <div className="body-text">
                    <p>Life can get tough sometimes.
                        We get it. We're here to help.
                        Find free resources here.
                    </p>
                </div>

                <div className="upper-buttons">
                  <div className="btn-group-vertical btn-block" >

                    <Button href="NotFound" className="btn btn-default btn-large rounded-0 border-dark" >Find a resource now. </Button>


                    <Button href="NotFound" className="btn btn-default btn-large rounded-0 border-dark" >What can I qualify for? </Button>

                    </div>
                  </div>
                <div className="lower-buttons">
                  <div className="btn-group btn-block btn-group-lg">

                    <Button href="NotFound" className="btn-default btn-outline-primary btn-secondary rounded-0 border-dark" >Safe Places</Button>

                    <Button href="NotFound" className="btn-default btn-outline-primary btn-secondary rounded-0 border-dark" >Hotlines</Button>

                  </div>
                </div>


</div>
            </div>

          </div>
        </div>
    );
}

export default Home;
