// Copyright (c) 2024, goshala and contributors
// For license information, please see license.txt

frappe.ui.form.on('Death Go Register', {
    gender: function (frm) {
        var selectedGender = frm.doc.gender;

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Go Type",
                filters: {
                    gender: selectedGender
                },
                fields: ["name"]
            },
            callback: function (response) {
                if (response.message) {
                    var types = response.message.map(type => type.name);
                    cur_frm.set_query("current_type", function () {
                        return {
                            "filters": {
                                "name": ['in', types]
                            }
                        };
                    });
                }
            }
        });
    },
    current_type: function (frm) {
        var selectedGender = frm.doc.gender;

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Go Type",
                filters: {
                    gender: selectedGender
                },
                fields: ["name"]
            },
            callback: function (response) {
                if (response.message) {
                    var types = response.message.map(type => type.name);
                    cur_frm.set_query("current_type", function () {
                        return {
                            "filters": {
                                "name": ['in', types]
                            }
                        };
                    });
                }
            }
        });
    }
});

// set filter only active employees and doctors show

frappe.ui.form.on('Death Go Register', {
    onload: function (frm) {
        // Filter for Doctore (Death) field to show only active employees
        frm.set_query('doctor_death', function () {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });

        // Filter for Staff(Death) field to show only active doctors
        frm.set_query('staff_death', function () {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });

        // Filter for Staff (Born) field to show only active employees
        frm.set_query('staff', function () {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });

        // Filter for Doctor (Born) field to show only active doctors
        frm.set_query('doctor', function () {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });
    }
});

// Disabled go master entry when click on save button

frappe.ui.form.on("Death Go Register", {
    after_save: function(frm) {
        // Call the server-side method to disable the Go Master document
        frappe.call({
            method: "goshala.goshala.doctype.api.disable_go_master_by_id",
            args: {
                doc_id: frm.doc.go_master_id // Pass the Go Master ID to be disabled
            },
            callback: function(r) {
                if (r.message && r.message.status === "success") {
                    frappe.msgprint(__("Go Master document has been disabled successfully."));
                } else if (r.message && r.message.status === "error") {
                    frappe.msgprint(__("Error: " + r.message.message));
                }
            }
        });
    }
});
