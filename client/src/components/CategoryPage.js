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

            <div className="cat-page">
                <main>
                    <p>
                        Select a category to find available services.
                    </p>
										<div className="d-flex flex-wrap">
											<ServiceButton text={"Family Services"} img={"child"} link="./cat/childandfamilies" />
											<ServiceButton text={"Education"} img={"school"} link="./cat/education" />
											<ServiceButton text={"Finance"} img={"money-bill-alt"} link="./cat/financials" />
											<ServiceButton text={"Health and Wellness"} img={"briefcase-medical"} link="./cat/healthandwellness" />
											<ServiceButton text={"Jobs"} img={"address-card"} link="./cat/job" />
											<ServiceButton text={"Legal Services"} img={"balance-scale"} link="./cat/legal" />
											<ServiceButton text={"Crisis Services"} img={"thunderstorm"} link="./cat/crisisevents" />
											<ServiceButton text={"Transportation"} img={"bus-alt"} link="./cat/transportation" />
											<ServiceButton text={"Basic Needs"} img={"handshake"} link="./cat/basicneeds" />
											<ServiceButton text={"Other"} img={"ellipsis-v"} link="./cat/other" />
										</div>
             </main>
            </div>
        )

    

    
}
export default CategoryPage;
