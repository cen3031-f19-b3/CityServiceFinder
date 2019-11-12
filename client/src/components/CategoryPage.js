import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import moneybillalt from '../assets/money-bill-alt.png';
import balancescale from '../assets/balance-scale.png';
import addresscard from '../assets/address-card.png';
import briefcasemedical from '../assets/briefcase-medical.png';
import school from '../assets/school.png';
import child from '../assets/child.png';
import thunderstorm from '../assets/thunderstorm-light.png';
import bus from '../assets/bus-alt.png';
import meetingroom from '../assets/meeting-room.png';
import question from '../assets/question.png';

function CategoryPage()
{
        return(
            <div>
                <main>
                    <p>
                        What do you need help with?
                    </p>
                    <CardGroup>
                        <Card>
                            <Card.Body>
                                <Card.Title>Child and Families</Card.Title>
                                <Card.Link href="./childandfamilies">
                                    <Card.Img variant="top" src={child} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title>Education</Card.Title>
                                <Card.Link href="./education">
                                    <Card.Img variant="top" src={school} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title>Financials</Card.Title>
                                <Card.Link href="./finanacials">
                                    <Card.Img variant="top" src={moneybillalt} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                    <CardGroup>
                        <Card>
                            <Card.Body>
                                <Card.Title>Health and Wellness</Card.Title>
                                <Card.Link href="./healthandwellness">
                                    <Card.Img variant="top" src={briefcasemedical} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title>Job</Card.Title>
                                <Card.Link href="./job">
                                    <Card.Img variant="top" src={addresscard} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title>Legal</Card.Title>
                                <Card.Link href="./legal">
                                    <Card.Img variant="top" src={balancescale} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                    <CardGroup>
                        <Card>
                            <Card.Body>
                                <Card.Title>Crisis Events</Card.Title>
                                <Card.Link href="./crisisevents">
                                    <Card.Img variant="top" src={thunderstorm} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title>Transportation</Card.Title>
                                <Card.Link href="./transportation">
                                    <Card.Img variant="top" src={bus} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title>Basic Needs</Card.Title>
                                <Card.Link href="./basicneeds">
                                    <Card.Img variant="top" src={meetingroom} />
                                </Card.Link>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                        <Card>
                            <Card.Body>
                                <Card.Title>Other</Card.Title>
                                <Card.Link href="./other">
                                    Card Link
                                </Card.Link>
                            </Card.Body>
                        </Card>
             </main>
            </div>
        )
    
}
export default CategoryPage;
