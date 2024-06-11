// Copyright (c) 2024, goshala and contributors
// For license information, please see license.txt

frappe.ui.form.on('Go Master', {
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

frappe.ui.form.on('Go Master', {
    onload: function (frm) {
        // Filter for Staff field to show only active employees
        frm.set_query('staff', function () {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });

        // Filter for Doctor field to show only active doctors
        frm.set_query('doctor', function () {
            return {
                filters: {
                    status: 'Active'
                }
            };
        });
    }
});

// Fetch go details in transfer donate go and death register go doctypes

frappe.ui.form.on('Go Master', {
    refresh: function (frm) {
        // Adding the first custom button
        frm.add_custom_button(__('Transfer / Donate'), function () {
            // Fetch data for the specific document from the Go Master doctype
            frappe.call({
                method: 'goshala.goshala.doctype.api.fetch_go_master_field_list',
                args: {
                    doc_id: frm.docname // Pass the document's ID to the server-side method
                },
                callback: function (r) {
                    if (r.message && r.message.length > 0) {

                        // Iterate through the fetched data
                        r.message.forEach(function (data) {
                            // Create a new document in the Transfer or Donate Go doctype
                            frappe.model.with_doctype('Transfer or Donate Go', function () {
                                var new_doc = frappe.model.get_new_doc('Transfer or Donate Go');
                                // Set values from the fetched data to the new document
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'from_goshala', data.goshala_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'go_master_id', data.id);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'go_name', data.go_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'gender', data.gender);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'type', data.type);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'weight', data.weight);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'staff', data.staff);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'colour', data.colour);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'seva', data.seva);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'reason', data.reason);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'remarks_seva', data.remarks);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'tag_number', data.tag_number);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'current_type', data.current_type);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'nandi_type', data.nandi_type);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'birth_date_time', data.birth_date_time);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'doctor', data.doctor);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'mother_name', data.mother_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'father_name', data.father_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'photo', data.photo);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'full_name', data.full_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'mobile_no', data.mobile_no);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'purchase__donation_address', data.address);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'purchase_date', data.purchase_date);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'donation_date', data.donation_date);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'city', data.city);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'pincode', data.pincode);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'price', data.price);

                                // Redirect to the new document
                                frappe.set_route('Form', 'Transfer or Donate Go', new_doc.name);
                            });
                        });
                    }
                }
            });
        }, __('Go To'));


        frm.add_custom_button(__('Death'), function () {
            // Fetch data for the specific document from the Go Master doctype
            frappe.call({
                method: 'goshala.goshala.doctype.api.fetch_go_master_field_list',
                args: {
                    doc_id: frm.docname // Pass the document's ID to the server-side method
                },
                callback: function (r) {
                    if (r.message && r.message.length > 0) {

                        // Iterate through the fetched data
                        r.message.forEach(function (data) {
                            // Create a new document in the Transfer or Donate Go doctype
                            frappe.model.with_doctype('Death Go Register', function () {
                                var new_doc = frappe.model.get_new_doc('Death Go Register');
                                // Set values from the fetched data to the new document
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'goshala_name', data.goshala_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'go_master_id', data.id);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'go_name', data.go_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'gender', data.gender);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'type', data.type);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'weight', data.weight);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'staff', data.staff);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'colour', data.colour);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'seva', data.seva);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'reason_seva', data.reason);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'remarks_seva', data.remarks);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'tag_number', data.tag_number);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'current_type', data.current_type);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'nandi_type', data.nandi_type);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'birth_date_time', data.birth_date_time);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'doctor', data.doctor);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'mother_name', data.mother_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'father_name', data.father_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'photo', data.photo);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'full_name', data.full_name);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'mobile_no', data.mobile_no);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'purchase__donation_address', data.address);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'purchase_date', data.purchase_date);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'donation_date', data.donation_date);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'city', data.city);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'pincode', data.pincode);
                                frappe.model.set_value(new_doc.doctype, new_doc.name, 'price', data.price);

                                // Redirect to the new document
                                frappe.set_route('Form', 'Death Go Register', new_doc.name);
                            });
                        });
                    }
                }
            });
        }, __('Go To'));
    }
});

// Fetch go master in mother name field where current type is hodaki or parkh

frappe.ui.form.on('Go Master', {
    refresh: function (frm) {
        frm.fields_dict['mother_name'].get_query = function (doc) {
            return {
                filters: [
                    ['Go Master', 'goshala_name', '=', doc.goshala_name],
                    ['Go Master', 'current_type', 'in', ['Hodaki', 'Parkh']]
                ]
            };
        };
    }
});

// Fetch go master in father name field where nandi type is our nandi

frappe.ui.form.on('Go Master', {
    refresh: function (frm) {
        frm.fields_dict['father_name'].get_query = function (doc) {
            return {
                filters: [
                    ['Go Master', 'nandi_type', 'in', ['Our Nandi']]
                ]
            };
        };
    }
});

// Auto set current type male & female value when type is birth

frappe.ui.form.on('Go Master', {
    type: function (frm) {
        set_current_type(frm);
    },
    gender: function (frm) {
        set_current_type(frm);
    }
});

function set_current_type(frm) {
    if (frm.doc.type === 'Birth') {
        if (frm.doc.gender === 'Male') {
            frm.set_value('current_type', 'Vachhardo');
        } 
        else if (frm.doc.gender === 'Female') {
            frm.set_value('current_type', 'Vachhardi');
        } 
        else {
            frm.set_value('current_type', '');
        }
    } 
    else {
        frm.set_value('current_type', '');
    }
}
