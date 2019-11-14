import React from 'react';
import './CategoryPage.css';


function ServiceButton({text, img, link}){
	var img_txt = "fal fa-" + img + " fa-3x"
	return(
		<a className="service-button" href={link}>
			<div className="service-button-main">
				<p><i className={img_txt} /></p>
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
											<ServiceButton text={"Family Services"} img={"child"} link="./childandfamilies" />
											<ServiceButton text={"Education"} img={"school"} link="./education" />
											<ServiceButton text={"Finance"} img={"money-bill-alt"} link="./financials" />
											<ServiceButton text={"Health and Wellness"} img={"briefcase-medical"} link="./healthandwellness" />
											<ServiceButton text={"Jobs"} img={"address-card"} link="./job" />
											<ServiceButton text={"Legal Services"} img={"balance-scale"} link="./legal" />
											<ServiceButton text={"Crisis Services"} img={"thunderstorm"} link="./crisisevents" />
											<ServiceButton text={"Transportation"} img={"bus-alt"} link="./transportation" />
											<ServiceButton text={"Basic Needs"} img={"handshake"} link="./basicneeds" />
										</div>
             </main>
            </div>
        )

    

    
}
export default CategoryPage;
