import React, { useState, useEffect } from 'react';
import { GetService, ReportService } from "../../util/Services";

import './ServicePage.css';
import { GetAllCategories } from '../../util/Categories';
import ManageServicePane from '../../components/SidePane/ManageServicePane'

export default ({ service_id, check_auth, side_pane_open_callback }) => {
    const [service, setService] = useState({});
    const [loading, setLoading] = useState(true);
    const [reportMsg, setReportMsg] = useState('');
    const [showReport, setShowReport] = useState(false);

    const [allCats, setAllCats] = useState(null);


    useEffect(() => {
        GetService(service_id).then((data) => {
            setService(data);
            setLoading(false);
        });

        GetAllCategories().then((data) => {
            setAllCats(data);
        });
    }, [service_id]);

    const submitReport = (e) => {
        e.preventDefault();
        ReportService(service_id, reportMsg);
        setReportMsg('');
        setShowReport(false);
    }


    if (loading) {
        return (
            <div className="text-center">Loading...</div>
        )
    }

    const edit_button = service && check_auth("edit", `/services/${service_id}`)
        ? <div style={{
            float: "right",
            margin: "1em",
            cursor: "pointer"
        }} onClick={() => {
            side_pane_open_callback(<ManageServicePane 
                commit_callback={() => side_pane_open_callback(null)}
                this_service={service}
                check_auth={check_auth}
                all_categories={allCats}
            />)
        }}><i className="fal fa-wrench fa-5x" /></div>
        : null

    return (
        <div className="container-fluid">
            {edit_button}
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
                <br/>
                <button onClick={e => setShowReport(!showReport)}>Report a Problem</button>
                {showReport ?
                <div>
                    <form onSubmit={submitReport}>
                        <label>
                            Description of Problem:
                            <input type="textarea" name="descr" value={reportMsg} onChange={e => setReportMsg(e.target.value)}/>
                        </label>
                        <input type="submit" value="submit"/>
                    </form>
                </div> : ""}
            </div>
        </div>
    );
};
