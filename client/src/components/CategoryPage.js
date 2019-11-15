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
											<ServiceButton text={"Education"} img={"book"} link="./cat/education" />
											<ServiceButton text={"Finance"} img={"money-check-edit"} link="./cat/financials" />
											<ServiceButton text={"Health Services"} img={"briefcase-medical"} link="./cat/healthandwellness" />
											<ServiceButton text={"Jobs"} img={"clipboard"} link="./cat/job" />
											<ServiceButton text={"Legal Services"} img={"landmark"} link="./cat/legal" />
											<ServiceButton text={"Crisis Services"} img={"shield"} link="./cat/crisisevents" />
											<ServiceButton text={"Transport"} img={"bus-alt"} link="./cat/transportation" />
											<ServiceButton text={"Basic Needs"} img={"utensils-alt"} link="./cat/basicneeds" />
											<ServiceButton text={"Other"} img={"ellipsis-v"} link="./cat/other" />
										</div>
             </main>
            </div>
        )

    

    
}
export default CategoryPage;
