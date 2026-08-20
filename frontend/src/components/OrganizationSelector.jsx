import { useEffect, useRef, useState } from "react";

const organizations = [
    {
        id: 1,
        name: "CA Practice",
        subtitle: "Management",
        shortName: "CA",
    },
    {
        id: 2,
        name: "ABC & Associates",
        subtitle: "Chartered Accountants",
        shortName: "AB",
    },
    {
        id: 3,
        name: "XYZ Chartered",
        subtitle: "Accountants",
        shortName: "XY",
    },
];

export default function OrganizationSelector() {

    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    const [selectedOrganization, setSelectedOrganization] =
        useState(() => {

            const saved =
                localStorage.getItem(
                    "selectedOrganization"
                );

            return saved
                ? JSON.parse(saved)
                : organizations[0];
        });


    /* =========================
       CLOSE WHEN CLICKING OUTSIDE
    ========================== */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    /* =========================
       SELECT ORGANIZATION
    ========================== */

    const selectOrganization = (organization) => {

        setSelectedOrganization(organization);

        localStorage.setItem(
            "selectedOrganization",
            JSON.stringify(organization)
        );

        setOpen(false);

        window.dispatchEvent(
            new Event("organizationChanged")
        );
    };


    return (

        <div
            className="organization-selector"
            ref={dropdownRef}
        >

            {/* =========================
                CURRENT ORGANIZATION
            ========================== */}

            <button
                className="organization-current"
                onClick={() =>
                    setOpen(!open)
                }
            >

                <div className="organization-logo">
                    {selectedOrganization.shortName}
                </div>


                <div className="organization-details">

                    <div className="organization-name">
                        {selectedOrganization.name}
                    </div>

                    <div className="organization-subtitle">
                        {selectedOrganization.subtitle}
                    </div>

                </div>


                <span className="organization-chevron">
                    {open ? "⌃" : "⌄"}
                </span>

            </button>


            {/* =========================
                DROPDOWN
            ========================== */}

            {open && (

                <div className="organization-dropdown">

                    <div className="organization-dropdown-header">
                        Select Organization
                    </div>


                    {organizations.map(
                        (organization) => (

                            <button
                                key={organization.id}

                                className={`organization-option ${
                                    selectedOrganization.id ===
                                    organization.id
                                        ? "selected"
                                        : ""
                                }`}

                                onClick={() =>
                                    selectOrganization(
                                        organization
                                    )
                                }
                            >

                                <div className="organization-option-logo">
                                    {organization.shortName}
                                </div>


                                <div className="organization-option-content">

                                    <div className="organization-option-name">
                                        {organization.name}
                                    </div>

                                    <div className="organization-option-subtitle">
                                        {organization.subtitle}
                                    </div>

                                </div>


                                {selectedOrganization.id ===
                                    organization.id && (

                                    <span className="organization-check">
                                        ✓
                                    </span>

                                )}

                            </button>

                        )
                    )}

                </div>

            )}

        </div>

    );
}