import React from 'react';
import {GetAllServices} from '../util/Services'
import './servicePage.css';



function FindAddress({service}){
  const numOfAddresses=Object.keys(service.addresses).length




  if(numOfAddresses===0){
    return(
      <div>
        There is no address listed for this service.
      </div>

    )
  }
  else{
      const addL1= service.addresses[0].line_1
      var addL2=""
      if(Object.keys(service.addresses[0].line_2).length>0){
        addL2 =service.addresses[0].line_2
      }


      const city= service.addresses[0].city
      const state= service.addresses[0].state
      const zip= service.addresses[0].zip

    return(
      <div>
      {addL1} {addL2} {city}, {state} {zip}
      </div>
    )

  }

/*  const addL1= service.addresses[0].line_1
  const addL2= service.addresses[0].line_2
  const city= service.addresses[0].city
  const state= service.addresses[0].state
  const zip= service.addresses[0].zip*/
  /*if (addL1===null){
    return(
      <div>
        This service has no address
      </div>
    )
  }
  else{

    return(
      <div>
        <p>


        </p>

      </div>
    )
  }*/
  return(
    <div>default return
    {numOfAddresses}
    </div>
  )

}


function FindService({data, name, loading_done}){

  if(!loading_done){
		return(
			<ul className="service-list service-list-loading">
				<li>Loading...</li>
			</ul>
		)
	}
  if(data.length === 0){
		return(
			<ul className="service-list service-list-not-found">
				<li>Service not found!</li>
			</ul>
		)
	}

  const service=data.find(service=> service.name===name);

  return(
    <div>
      <h2 className="text-center">{service.name}</h2>
      <li>{service.services_freeform}</li>

      <li>{service.phone_numbers[0].number}</li>
      <li>{service.eligibility_criteria_freeform}</li>
      <li>Hours:{service.hours[0]}</li>
      <FindAddress
        service={service}
      />
    </div>
  )


}



class ServicePage extends React.Component{

  constructor(props) {
		super(props)
		this.state = {
			services: [],
			loading_done: false
		}

		GetAllServices()
			.then((services) => this.data_load_complete(services))
			.catch((e) => console.error(e))
	}

	data_load_complete(services){
		this.setState({
			services: services,
			loading_done: true
		})
	}

    render(){
        return (
          <div>
                <FindService
                  data={this.state.services}
                  name={this.props.name}
                  loading_done={this.state.loading_done}
                />

          </div>
        )
    }
}

export default ServicePage;
