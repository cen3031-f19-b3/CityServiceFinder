import React from 'react';
import Card from 'react-bootstrap/Card';
import moneybillalt from '../assets/money-bill-alt.png';
import balancescale from '../assets/balance-scale.png';
import addresscard from '../assets/address-card.png';
import briefcasemedical from '../assets/briefcase-medical.png';
import school from '../assets/school.png';
import child from '../assets/child.png';
import thunderstorm from '../assets/thunderstorm-light.png';
import bus from '../assets/bus-alt.png';
import meetingroom from '../assets/meeting-room.png';
import './CategoryPage.css';


function ServiceButton({text, img, link}){
	return(
		<a className="service-button" href={link}>
			<div className="service-button-main">
				<img src={img} alt={text} />
				<p>{text}</p>
			</div>
		</a>
	)
}

function CategoryPage()
{

        return(

            <div>
                <main>
                    <p>
                        What do you need help with?
                    </p>
										<div className="d-flex flex-wrap">
											<ServiceButton text={"Family Services"} img={child} link="./childandfamilies" />
											<ServiceButton text={"Education"} img={school} link="./education" />
											<ServiceButton text={"Finance"} img={moneybillalt} link="./financials" />
											<ServiceButton text={"Health and Wellness"} img={briefcasemedical} link="./healthandwellness" />
											<ServiceButton text={"Jobs"} img={addresscard} link="./job" />
											<ServiceButton text={"Legal Services"} img={balancescale} link="./legal" />
											<ServiceButton text={"Crisis Services"} img={thunderstorm} link="./crisisevents" />
											<ServiceButton text={"Transportation"} img={bus} link="./transportation" />
											<ServiceButton text={"Basic Needs"} img={meetingroom} link="./basicneeds" />
										</div>
             </main>
            </div>
        )

    

    
}
export default CategoryPage;
