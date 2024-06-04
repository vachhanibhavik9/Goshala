// Copyright (c) 2024, goshala and contributors
// For license information, please see license.txt

frappe.ui.form.on('Transfer or Donate Go', {
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

frappe.ui.form.on('Transfer or Donate Go', {
    onload: function (frm) {
        // Filter for Transfer Staff field to show only active employees
        frm.set_query('transfer_staff', function () {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });

        // Filter for Donate Staff field to show only active doctors
        frm.set_query('donate_staff', function () {
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

frappe.ui.form.on("Transfer or Donate Go", {
    after_save: function (frm) {
        // Check if the value of transfer_donate is "Transfer"
        if (frm.doc.transfer__donate === "Donate") {
            // Call the server-side method to disable the Go Master document
            frappe.call({
                method: "goshala.goshala.doctype.api.disable_go_master_by_id",
                args: {
                    doc_id: frm.doc.go_master_id // Pass the Go Master ID to be disabled
                },
                callback: function (r) {
                    if (r.message && r.message.status === "success") {
                        frappe.msgprint(__("Go Master document has been disabled successfully."));
                    } else if (r.message && r.message.status === "error") {
                        frappe.msgprint(__("Error: " + r.message.message));
                    }
                }
            });
        }
    }
});

// Update goshala name when transfer__donate is Transfer

frappe.ui.form.on("Transfer or Donate Go", {
    after_save: function (frm) {
        // Check if the value of transfer_donate is "Transfer"
        if (frm.doc.transfer__donate === "Transfer") {
            // Call the server-side method to update the Goshala Name in Go Master
            frappe.call({
                method: "goshala.goshala.doctype.api.update_goshala_name",
                args: {
                    doc_id: frm.doc.go_master_id, // Pass the Go Master ID
                    goshala_name: frm.doc.to_goshala // Pass the Goshala Name to be updated
                },
                callback: function (r) {
                    if (r.message && r.message.status === "success") {
                        frappe.msgprint(__("Goshala Name in Go Master has been updated successfully."));
                    } else if (r.message && r.message.status === "error") {
                        frappe.msgprint(__("Error: " + r.message.message));
                    }
                }
            });
        }
    }
});


// To goshala field not show from goshala value

frappe.ui.form.on('Transfer or Donate Go', {
    from_goshala: function (frm) {
        frm.set_query('to_goshala', function () {
            return {
                filters: [
                    ['name', '!=', frm.doc.from_goshala]
                ]
            };
        });
    }
});
