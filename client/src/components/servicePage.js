import React from 'react';
import {GetAllServices} from '../util/Services'
import './servicePage.css';


function FindAddress({service}){

  const numOfAddresses=Object.keys(service.addresses).length
  var addresses=[]
  if(numOfAddresses===0){
    return(
      <div>
        There is no address listed for this service.
      </div>

    )
  }
  else{

    for(var i=0;i<numOfAddresses;i++){
      var address=""

      var addL1= service.addresses[i].line_1
      var addL2=""
      if(!service.addresses[i].line_2){

      }
      else{
        if(Object.keys(service.addresses[i].line_2).length>0){
          addL2 =service.addresses[i].line_2
        }
      }

      var city= service.addresses[i].city
      var state= service.addresses[i].state
      var zip= service.addresses[i].zip
      address=address.concat(addL1,' ', addL2,' ', city,', ', state,' ', zip,'. ')
      addresses.push(address)
    }
    console.log('addresses: ',addresses)
    return(
      <div>
        { addresses.map((address, index)=>(
          <div key={index} >
            {address}
          </div>
        )) }
      </div>
    )

  }
}

function FindEmails({service}){

  const numOfEmails=Object.keys(service.emails).length
  var emails=[]
  if(numOfEmails===0){
    return(
      <div>
        There are no emails listed for this service.
      </div>

    )
  }
  else{

    var email
    for(var i=0; i<numOfEmails; i++){
      email=service.emails[i]
      emails.push(email)

    }
    console.log('emails: ',emails)

    return(
      <div>
        { emails.map((email, index)=>(
          <div key={index} >
            {email}
          </div>
        )) }
      </div>
    )

  }
}

function FindCost({service}){

  if(service.cost_info){
    console.log('cost info: ',service.cost_info)
    return(
      <div>
        {service.cost_info}
      </div>

    )
  }

  return(
    <div>
      No cost info
    </div>
  )
}

function FindWebsite({service}){

  const numOfWebsites=Object.keys(service.website).length
  var websites=[]
  if(numOfWebsites===0){
    return(
      <div>
        There is no website listed for this service.
      </div>

    )
  }
  else{

    var website
    for(var i=0; i<numOfWebsites; i++){
      website=service.website[i]
      websites.push(website)

    }
    console.log('websites: ',websites)

    return(
      <div>
        { websites.map((website, index)=>(
          <div key={index}><a href={website} target="_blank" rel="noopener noreferrer">{website}</a></div>
        )) }
      </div>
    )
  }
}

function FindBusRoutes({service}){

  const numOfBusRoutes=Object.keys(service.bus_routes).length
  var busRoutes=[]
  if(numOfBusRoutes===0){
    return(
      <div>
        There are no bus routes listed for this service.
      </div>

    )
  }
  else{

    var route
    for(var i=0; i<numOfBusRoutes; i++){
      route=service.bus_routes[i]
      busRoutes.push(route)

    }
    console.log('bus routes: ',busRoutes)

    return(
      <div>
        { busRoutes.map((route, index)=>(
          <div key={index}>{route}</div>
        )) }
      </div>
    )

  }

}


function FindHours({service}){

  const numOfDaysOpen=Object.keys(service.hours).length
  var hours=[]
  if(numOfDaysOpen===0){
    return(
      <div>
        There are no hours listed for this service.
      </div>

    )
  }
  else{

    var day
    for(var i=0; i<numOfDaysOpen; i++){
      day=service.hours[i]
      hours.push(day)

    }
    console.log('hours: ',hours)

    return(
      <div>
        { hours.map((day, index)=>(
          <div key={index}>{day}</div>
        )) }
      </div>
    )
  }
}

function FindPhoneNumber({service}){

  const numOfPhoneNums=Object.keys(service.phone_numbers).length
  var numbers=[]
  if(numOfPhoneNums===0){

    return(
      <div>
        There is no phone number listed for this service.
      </div>

    )
  }
  else{

    var num
    for(var i=0; i<numOfPhoneNums; i++){
      num=service.phone_numbers[i].number
      if(service.phone_numbers[i].contact){
        num.concat(': ',service.phone_numbers[i].contact)
      }
      numbers.push(num)

    }
    console.log('phone numbers: ',numbers)

    return(
      <div>
        { numbers.map((number, index)=>(
          <div key={index}>{number}</div>
        )) }
      </div>
    )
  }

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
  console.log('name: ',service.name)
  return(
    <div className="text-center">
      <h2 className="text-center">{service.name}</h2>
      <li>Address:
        <FindAddress
          service={service}
        />
      </li>
      <li>Phone Number:
        <FindPhoneNumber
          service={service}
        />
      </li>
      <li>Hours:
        <FindHours
          service={service}
        />
      </li>
      <li>Emails:
        <FindEmails
          service={service}
        />
      </li>
      <li>Bus Routes:
        <FindBusRoutes
          service={service}
        />
      </li>
      <li>Websites:
        <FindWebsite
          service={service}
        />
      </li>
      <li>Cost Info:
        <FindCost
          service={service}
        />
      </li>
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
          <div className='container-fluid'>
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
