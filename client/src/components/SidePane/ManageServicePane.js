import React, { useState } from 'react';

import { CreateService, UpdateService, DeleteService } from '../../util/Services'

import SearchableList from '../SearchableList/SearchableList'

import './CategoryButton.css'

async function commit_changes(new_service, in_progress_set, commit_callback, create_new){
	in_progress_set(true)
	if(create_new){
		await CreateService(new_service)
	}else{
		await UpdateService(new_service)
	}
	in_progress_set(false)

	commit_callback()
}

async function do_delete(service, done_callback){
	await DeleteService(service)
	done_callback()
}

/* A single text-entry field in the Create Category Pane table
 */
function SCPEntry({name, fref, placeholder, info_text}){
	return (
		<tr>
			<td>
				<h2>{name}</h2>
			</td>
			<td>
				<input type="text" ref={fref} placeholder={placeholder} />
			</td>
			<td>
				<i className="fal fa-info-circle" title={info_text} />
			</td>
		</tr>
	)
}



/* A div to hold parent-category information
 */
function CatButton({name, _id, on_click_callback}){
	return (
		<div className="cat-button" onClick={() => on_click_callback(_id)}><i className="fal fa-times-circle" /> {name}</div>
	)
}

/* A side-pane content element to allow an administrator to create a new service
 */
function ManageServicePane({commit_callback, this_service, check_auth, all_categories}) {
	const [commit_in_progress, set_commit_in_progress] = useState(false)
	const [cat_parents, set_cat_parents] = useState([])

	const [sn, set_sn] = useState(null)
	const [sal1, set_sal1] = useState(null)
	const [sal2, set_sal2] = useState(null)
	const [sac, set_sac] = useState(null)
	const [sas, set_sas] = useState(null)
	const [saz, set_saz] = useState(null)
	const [spc, set_spc] = useState(null)
	const [spn, set_spn] = useState(null)
	const [ssf, set_ssf] = useState(null)
	const [sec, set_sec] = useState(null)
	const [sem, set_sem] = useState(null)
	const [sbr, set_sbr] = useState(null)
	const [sws, set_sws] = useState(null)
	const [swi, set_swi] = useState(null)
	const [ssh, set_ssh] = useState(null)
	const [sapar, set_sapar] = useState(null)
	const [sapap, set_sapap] = useState(null)
	const [sapaw, set_sapaw] = useState(null)
	const [sapae, set_sapae] = useState(null)
	const [sapao, set_sapao] = useState(null)
	const [ssa, set_ssa] = useState(null)
	const [saplir, set_saplir] = useState(null)
	const [saplol, set_saplol] = useState(null)
	const [saplip, set_saplip] = useState(null)
	const [saplph, set_saplph] = useState(null)
	const [saplws, set_saplws] = useState(null)
	const [saplem, set_saplem] = useState(null)
	const [saplot, set_saplot] = useState(null)
	const [sci, set_sci] = useState(null)
	const [sta, set_sta] = useState(null)
	const [suw, set_suw] = useState(null)
	const [sai, set_sai] = useState(null)

	const maps = [
		["Service Name", set_sn, "The name for this service."],
		["Address Line 1", set_sal1, "Line 1 of the service's primary address."],
		["Address Line 2", set_sal2, "Line 2 of the service's primary address."],
		["Address City", set_sac, "City for the service's primary address."],
		["State", set_sas, "State for the service's primary address."],
		["Zip", set_saz, "Zip-code for the service's primary address."],
		["Phone Contact", set_spc, "Contact name for the service's primary phone number."],
		["Phone Number", set_spn, "The service's primary phone number."],
		["Services Freeform", set_ssf, "A general description of the services offered."],
		["Eligibility Criteria", set_sec, "Information on what is required to be eligible for the service."],
		["E-mail", set_sem, "The service's primary e-mail address."],
		["Bus Routes", set_sbr, "Bus routes available for this service."],
		["Website", set_sws, "Website for the service."],
		["Walk-Ins", set_swi, "Are walk-ins allowed for this service?"],
		["Hours", set_ssh, "The times and dates when this service is offered."],
		["Appt. Required?", set_sapar, "Is an appointment required for this service?"],
		["Appt. Phone", set_sapap, "Phone number to use for appointments."],
		["Appt. Website", set_sapaw, "Website to use for appointments."],
		["Appt. E-Mail", set_sapae, "E-mail address to use for appointments."],
		["Appt. Other", set_sapao, "Other information about appointments for this service."],
		["Service Area", set_ssa, "Where is this service available?"],
		["Appl. Required?", set_saplir, "Is an application required for this service?"],
		["Appl. Online?", set_saplol, "Should applications be submitted online?"],
		["Appl. In Person?", set_saplip, "Should applications be submitted in person?"],
		["Appl. Phone", set_saplph, "Phone number to use for applications."],
		["Appl. Website", set_saplws, "Website to use for applications."],
		["Appl. E-Mail", set_saplem, "E-mail address to use for applications."],
		["Appl. Other", set_saplot, "Other information to use for applications."],
		["Cost Info", set_sci, "Information on how much this service costs, any discounts available, etc."],
		["Translation?", set_sta, "Can translation services be provided?"],
		["United Way Approval?", set_suw, "Does this service have United Way approval?"],
		["Additional Information", set_sai, "Additional information about this service."]
	]

	let ctr = 0
	const scpentries = maps.map((itm) => {
		ctr = ctr + 1
		return <SCPEntry
			key={ctr}
			name={itm[0]}
			fref={itm[1]}
			placeholder={itm[0]}
			info_text={itm[2]}
		/>
	})

	let btn_class = "button"
	if(commit_in_progress) {btn_class += " button-disabled"}

	const list_items = all_categories.filter((cat) => {
		let is_parent = false
		cat_parents.forEach((parent_cat) => {
			if(parent_cat._id === cat._id){
				is_parent = true
			}
		})
		return !is_parent
	}).map((cat) => {
		return {
			contents: <span>{cat.name}</span>,
			search_on: cat.name + cat._id,
			_id: cat._id
		}
	})

	const cat_buttons = cat_parents.map((cat) => {
		return <CatButton name={cat.name} _id={cat._id} on_click_callback={(_id) => {
			set_cat_parents(cat_parents.filter((pcat) => {return pcat._id !== _id}))
		}} />
	})

	const button_mode = (!this_service) 
		? <span><i className="fal fa-plus-circle" /> Create</span>
		: <span><i className="fal fa-upload" /> Commit Changes</span>

	const del_btn = 
		<div className="button danger-button" onClick={() => do_delete(this_service, commit_callback)}>
			<i className="fal fa-minus-circle" /> DELETE
		</div>

	return(
		<div className="service-edit-pane">
			<h1>{this_service ? `Edit ${this_service.name}` : "Create New Service"}</h1>
			<table>
				<tbody>
					{scpentries}
				</tbody>
			</table>
			<h2>Categories <i className="fal fa-info-circle" title="What categories should this service be displayed under?" /></h2>
			<div className="cat-button-deck d-flex flex-wrap">
				{cat_buttons}
			</div>
			<div style={{height: "15em", "margin-bottom": "0.5em"}}>
				<SearchableList 
					objects={list_items}
					click_callback={(obj) => {
						all_categories.forEach((cat) => {
							if(cat._id === obj._id){
								set_cat_parents(cat_parents.concat(cat))
							}
						});
					}}
					selectable={false}
					multi_select={false}
				/>
			</div>
			<div className={btn_class} onClick={() => commit_changes(
				{
					_id: this_service ? this_service._id : null,
					name: sn.value, 
					addresses: [{
						line_1: sal1.value, 
						line_2: sal2.value, 
						city: sac.value, 
						state: sas.value,
						zip: saz.value
					}],
					phone_numbers: [{
						contact: spc.value,
						number: spn.value
					}],
					services_freeform: ssf.value,
					eligibility_criteria: sec.value,
					emails: sem.value.split(','),
					bus_routes: sbr.value.split(','),
					website: sws.value.split(','),
					walk_ins: swi.value,
					hours: ssh.value.split(','),
					appointment: {
						is_required: sapar.value && sapar.value.toLowerCase() === "yes",
						phone: sapap.value,
						website: sapaw.value,
						email: sapae.value,
						other_info: sapao.value
					},
					service_area: ssa.value,
					application: {
						is_required: saplir.value && saplir.value.toLowerCase() === "yes",
						apply_online: saplol.value && saplol.value.toLowerCase() === "yes",
						apply_in_person: saplip.value && saplip.value.toLowerCase() === "yes",
						phone: saplph.value,
						website: saplws.value,
						email: saplem.value,
						other_info: saplot.value
					},
					cost_info: sci.value,
					translation_available: sta.value,
					united_way_approval: suw.value && suw.value.toLowerCase() === "yes",
					additional_information: sai.value,
					categories: cat_parents.map((cat) => cat._id)
				},
				set_commit_in_progress,
				commit_callback,
				!this_service
			)}>{button_mode}</div>

			{this_service && check_auth("delete", `/services/${this_service._id}`) ? del_btn : null}
			
		</div>
	)
}

export default ManageServicePane