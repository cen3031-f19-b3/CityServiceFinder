import React, { useState, useEffect } from 'react';
import { GetService } from "../../util/Services";

import './ServicePage.css';

export default ({ service_id }) => {
    const [service, setService] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        GetService(service_id).then((data) => {
            setService(data);
            setLoading(false);
        });
    }, [service_id]);


    if (loading) {
        return (
            <div className="text-center">Loading...</div>
        )
    }

    console.dir(service)
    return (
        <div className="container-fluid">
            <div className="text-center text">
                <div className="service-title">
                    <h2 className="text-center">{service.name}</h2>
                </div>
                <div className="service-info">
                    <h3>Address:</h3>
                    {service.addresses.map((address, index) => {
                        return (
                            <div key={index}>
                                {address.line_1 || ""}
                                <></>
                                {address.line_2 || ""}
                                <></>
                                {address.city || ""}
                                <></>
                                {address.state || ""}
                                <></>
                                {address.zip || ""}
                                <></>
                            </div>
                        )
                    })}
                </div>
                <div className="service-info">
                    <h3>Phone Number: </h3>
                    {service.phone_numbers.map((phone, index) => {
                        return (
                            <div key={index}>
                                {phone.contact ? phone.contact + ": " : ""}
                                <></>
                                {phone.number}
                            </div>
                        );
                    })}
                </div>
                <div className="service-info">
                    <h3>Hours:</h3>
                    {service.hours.map((hour, index) => {
                        return (
                            <div key={index}>{hour}</div>
                        )
                    })}
                </div>
                <div className="service-info">
                    <h3>Emails:</h3>
                    <div>
                        {service.emails.map((email, index) => (
                            <div key={index}>
                                <a className="clickable-link" href={"mailto:" + email}>
                                    {email}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="service-info">
                    <h3>Bus Routes:</h3>
                    <div>
                        {service.bus_routes.map((route, index) => (
                            <div key={index}>{route}</div>
                        ))}
                    </div>
                </div>
                <div className="service-info">
                    <h3>Websites:</h3>
                    {service.website.map((site, index) => (
                        <div key={index}>
                            <a
                                className="clickable-link"
                                href={site}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {site}
                            </a>
                        </div>
                    ))}
                </div>
                <div className="service-info">
                    <h3>Cost Info:</h3>
                    {service.cost_info || "No cost info."}
                </div>
                <div className="service-info">
                    <h3>Other Info:</h3>
                    {service.services_freeform ?
                        <div>
                            {service.services_freeform}
                        </div> :
                        "No more info available."
                    }
                    <br />
                    {service.eligibility_criteria_freeform ?
                        <div>
                            {service.eligibility_criteria_freeform}
                        </div> :
                        "No more info available."
                    }
                </div>
            </div>
        </div>
    );
};
