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
    onload: function(frm) {
        // Filter for Transfer Staff field to show only active employees
        frm.set_query('transfer_staff', function() {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });

        // Filter for Donate Staff field to show only active doctors
        frm.set_query('donate_staff', function() {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });

        // Filter for Staff (Born) field to show only active employees
        frm.set_query('staff', function() {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });

        // Filter for Doctor (Born) field to show only active doctors
        frm.set_query('doctor', function() {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });
    }
});