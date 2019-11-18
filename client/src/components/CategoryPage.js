import React, { useState } from 'react';
import { GetAllCategories } from '../util/Categories'

import './CategoryPage.css';

function ServiceButton({ text, img, link }) {
	var img_txt = "fal fa-" + img + " fa-3x"
	return (
		<a className="service-button" href={link}>
			<div className="service-button-main">
				<p><i className={img_txt} /></p>
				<p>{text}</p>
			</div>
		</a>
	)
}

function CategoryPage() {
	const [data, set_data] = useState([])
	const [load_done, set_load_done] = useState(false)

	if (!load_done) {
		GetAllCategories()
			.then((categories) => {
				set_data(categories)
				set_load_done(true)
			})
			.catch((e) => console.error(e))

		return (
			<div className="cat-page">
				<main>
					<h1>Loading...</h1>
				</main>
			</div>
		)
	}

	const categories_list = data
		.filter(category => {
			return category["subcategory_of"].length === 0
		})
		.map(category => {
			return (
				<ServiceButton
					text={category.name}
					img={category.img}
					link={"./cat/" + category.link}
				/>
			)
		})

	return (
		
		<div className="cat-page">

			<main>

				<div className="d-flex flex-wrap">
					{categories_list}
				</div>
				
				<i className="heart fal fa-hand-holding-heart fa-7x" />

                <div className="body-text">
                    <p>Life can get tough sometimes.
                        We get it. We're here to help.
                        Find free resources here.
                    </p>
                </div>

			</main>


		</div>
	)
}

export default CategoryPage;
