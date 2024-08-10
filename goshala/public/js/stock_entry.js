// Total Qty of Morning Qty + Evening Qty in Stock Entry Items Table
frappe.ui.form.on('Stock Entry Detail', {
    custom_morning_qty: function (frm, cdt, cdn) {
        get_total_qty(frm, cdt, cdn)
    },
    custom_evening_qty: function (frm, cdt, cdn) {
        get_total_qty(frm, cdt, cdn)
    }

});


// Set Morning Total Qty, Evening Qty and Total Qty
frappe.ui.form.on('Stock Entry', {
    before_save: function (frm) {
        setTotalMilk(frm.doc);
        setTotalMorningMilk(frm.doc);
        setTotalEveningMilk(frm.doc);

    },

    stock_entry_type(frm) {
        if (frm.doc.stock_entry_type === 'Milk Production') {
            frm.clear_custom_buttons();
            // Set the default target warehouse for Milk Production
            frm.set_value('to_warehouse', 'Milk Production - SVG');
            frm.add_custom_button(__('Get Go'), function () {
                fetchGoMasterListByBranch(frm);
                fetchGoMasterListForFiltering(frm);
            });
        }

        if (frm.doc.stock_entry_type === 'Milk Sales') {
            frm.clear_custom_buttons();
            // Set the default source warehouse for Milk Sales
            frm.set_value('from_warehouse', 'Milk Production - SVG');
            frm.add_custom_button(__('Get Customer'), function () {
                fetch_customer_list(frm);
            });
        }

        get_fields(frm);
    },

    after_save(frm) {
        get_fields(frm);
    },

    before_submit(frm) {
        get_fields(frm);
    },

    on_submit(frm) {
        get_fields(frm);
    },

    refresh(frm) {
        get_fields(frm);
    },

    setup(frm) {
        default_fields(frm);
    },

});


function get_total_qty(frm, cdt, cdn) {
    var child_data = locals[cdt][cdn];
    var total_qty = parseFloat(child_data.custom_morning_qty) + parseFloat(child_data.custom_evening_qty)

    frappe.model.set_value(cdt, cdn, "qty", total_qty)

}

function setTotalMilk(doc) {
    var totalMilk = 0;

    for (var i = 0; i < doc.items.length; i++) {
        totalMilk += doc.items[i].qty;
    }

    doc.custom_total_milk = totalMilk;
}

function setTotalMorningMilk(doc) {
    var totalMorningMilk = 0;

    for (var i = 0; i < doc.items.length; i++) {
        totalMorningMilk += doc.items[i].custom_morning_qty;
    }

    doc.custom_total_morning_milk = totalMorningMilk;
}

function setTotalEveningMilk(doc) {
    var totalEveningMilk = 0;

    for (var i = 0; i < doc.items.length; i++) {
        totalEveningMilk += doc.items[i].custom_evening_qty;
    }

    doc.custom_total_evening_milk = totalEveningMilk;
}

// Trigger the popup and fetch go data where current type is dujani based on the selected branch

function fetchGoMasterListByBranch(frm) {
    // Show a dialog to select the branch
    let dialog = new frappe.ui.Dialog({
        title: 'Select Goshala',
        fields: [
            {
                label: 'Goshala Name',
                fieldname: 'goshala',
                fieldtype: 'Link',
                options: 'Branch', // Assuming there's a Branch doctype or similar
                default: 'Shree Vallabh Goshala - Vadla',
                reqd: 1
            }
        ],
        primary_action_label: 'Fetch Go',
        primary_action(values) {

            frm.set_value('custom_goshala_name', values.goshala);
            
            // Fetch data based on selected branch
            frappe.call({
                method: 'goshala.goshala.doctype.api.fetch_go_master_list',
                args: {
                    goshala_name: values.goshala
                },
                callback: function (response) {
                    if (response.message && response.message.length > 0) {
                        // Clear existing child table rows
                        frm.clear_table('items');
                        
                        // Iterate through the fetched data and add it to the child table
                        response.message.forEach(function (go) {
                            var row = frappe.model.add_child(frm.doc, 'Stock Entry Detail', 'items');
                            row.custom_go_name = go.go_name;
                            row.custom_tag_number = go.tag_number;
                            row.t_warehouse = "Milk Production - SVG";
                            row.item_code = "Milk";
                            row.uom = "Litre";
                        });
                        
                        // Refresh the form to reflect the changes
                        frm.refresh_field('items');
                    } else {
                        // Show a message if no Go is fetched, replacing 'goshala' with the selected goshala name
                        frappe.msgprint(`There is no Dujani cow in ${values.goshala}`);
                    }
                }
            });
            dialog.hide();
        }
    });
    dialog.show();
}


// if user add row and add Go so only show that Go where current type is dujani
function fetchGoMasterListForFiltering(frm) {
    frappe.call({
        method: 'goshala.goshala.doctype.api.fetch_go_master_list',
        callback: function (r) {
            if (r.message && r.message.length > 0) {

                res = r.message

                // Set options for custom_go_name field
                frm.set_query("custom_go_name", "items", function () {
                    return {
                        filters: {
                            'name': ['in', res]
                        }
                    };
                });
            }
        }
    });
}

// Get Customer from Customer where Customer is enabled

function fetch_customer_list(frm) {
    
    // Make an AJAX call to fetch data from the Go Master doctype
    frappe.call({
        method: 'goshala.goshala.doctype.api.fetch_customer_list',
        callback: function (response) {
            if (response.message) {
                // Clear existing child table rows
                frm.clear_table('items');

                // Iterate through the fetched data and add it to the child table
                response.message.forEach(function (cus) {
                    var row = frappe.model.add_child(frm.doc, 'Stock Entry Detail', 'items');
                    row.custom_customer_name = cus.name;
                    row.custom_gujarati_name = cus.custom_gujarati_name;
                    row.s_warehouse = "Milk Production - SVG";
                    row.item_code = "Milk";
                    row.uom = "Litre";
                    row.custom_pickup = cus.pick_up;
                    row.custom_delivery_man = cus.delivery_man;
                    row.custom_shift = cus.custom_shift;
                    row.custom_pickup_counter = cus.pickup_counter;
                    
                    var morning_qty_float = parseFloat(cus.morning_qty);
                    row.custom_morning_qty = morning_qty_float;  
                    // row.custom_morning_qty = cus.morning_qty;
                    row.custom_evening_qty = cus.evening_qty;
                    row.qty = row.custom_morning_qty + row.custom_evening_qty;
                });

                // Refresh the form to reflect the changes
                frm.refresh_field('items');
            }
        }
    });
}

// Set Field in Stock Entry Child Table list view when Different Stock entry Type 

function get_fields(frm) {
    if (frm.doc.stock_entry_type === 'Milk Sales') {
        fields = {
            'Stock Entry Detail':
                [
                    { fieldname: 'custom_customer_name', columns: 2 },
                    { fieldname: 'custom_gujarati_name', columns: 2 },
                    { fieldname: 'custom_pickup_counter', columns: 1 },
                    { fieldname: 'custom_delivery_man', columns: 1 },
                    { fieldname: 'custom_shift', columns: 1 },
                    { fieldname: 'custom_morning_qty', columns: 1 },
                    { fieldname: 'custom_evening_qty', columns: 1 },
                    { fieldname: 'qty', columns: 1 },
                ]
        }
        frappe.model.user_settings.save(frm.doctype, "GridView", fields).then((r) => {
            frappe.model.user_settings[frm.doctype] = r.message || r;
            frm.fields_dict.items.grid.reset_grid();
        });
    }

    else if (frm.doc.stock_entry_type === 'Milk Production') {
        fields = {
            'Stock Entry Detail':
                [
                    { fieldname: 'custom_go_name', columns: 2 },
                    { fieldname: 'custom_tag_number', columns: 2 },
                    { fieldname: 'custom_morning_qty', columns: 2 },
                    { fieldname: 'custom_evening_qty', columns: 2 },
                    { fieldname: 'qty', columns: 2 }
                ]
        }
        frappe.model.user_settings.save(frm.doctype, "GridView", fields).then((r) => {
            frappe.model.user_settings[frm.doctype] = r.message || r;
            frm.fields_dict.items.grid.reset_grid();
        });
    }

    else if (frm.doc.stock_entry_type === 'In-House Consumption') {
        fields = {
            'Stock Entry Detail':
                [
                    { fieldname: 'item_code', columns: 2 },
                    // { fieldname: 's_warehouse', columns: 2 },
                    { fieldname: 'custom_in_house_consumption', columns: 2 },
                    { fieldname: 'custom_use_milk', columns: 3 },
                    { fieldname: 'custom_haveli', columns: 2 },
                    { fieldname: 'qty', columns: 1 },
                ]
        }
        frappe.model.user_settings.save(frm.doctype, "GridView", fields).then((r) => {
            frappe.model.user_settings[frm.doctype] = r.message || r;
            frm.fields_dict.items.grid.reset_grid();
        });

    }

    else if (frm.doc.stock_entry_type === 'Manufacture') {
        fields = {
            'Stock Entry Detail':
                [
                    { fieldname: 'item_code', columns: 2 },
                    { fieldname: 's_warehouse', columns: 2 },
                    { fieldname: 't_warehouse', columns: 2 },
                    { fieldname: 'qty', columns: 2 },
                    { fieldname: 'is_finished_item', columns: 2 }
                ]
        }
        frappe.model.user_settings.save(frm.doctype, "GridView", fields).then((r) => {
            frappe.model.user_settings[frm.doctype] = r.message || r;
            frm.fields_dict.items.grid.reset_grid();
        });

    }

    else {
        fields = {
            'Stock Entry Detail':
                [
                    { fieldname: 's_warehouse', columns: 2 },
                    { fieldname: 't_warehouse', columns: 2 },
                    { fieldname: 'item_code', columns: 2 },
                    { fieldname: 'qty', columns: 2 },
                    { fieldname: 'basic_amount', columns: 2 },
                ]
        }
        frappe.model.user_settings.save(frm.doctype, "GridView", fields).then((r) => {
            frappe.model.user_settings[frm.doctype] = r.message || r;
            frm.fields_dict.items.grid.reset_grid();
        });

    }
}

function default_fields(frm) {
    fields = {
        'Stock Entry Detail':
            [
                { fieldname: 's_warehouse', columns: 2 },
                { fieldname: 't_warehouse', columns: 2 },
                { fieldname: 'item_code', columns: 2 },
                { fieldname: 'qty', columns: 2 },
                { fieldname: 'basic_amount', columns: 2 },
            ]
    }
    frappe.model.user_settings.save(frm.doctype, "GridView", fields).then((r) => {
        frappe.model.user_settings[frm.doctype] = r.message || r;
        frm.fields_dict.items.grid.reset_grid();
    });
}

// Set total qty field read only when stock entry type is milk production or milk sales

frappe.ui.form.on('Stock Entry', {
    refresh: function(frm) {
        set_qty_read_only(frm);
    },
    stock_entry_type: function(frm) {
        set_qty_read_only(frm);
    }
});

frappe.ui.form.on('Stock Entry Detail', {
    qty: function(frm, cdt, cdn) {
        set_qty_read_only(frm);
    }
});

function set_qty_read_only(frm) {
    let is_read_only = (frm.doc.stock_entry_type === 'Milk Production' || frm.doc.stock_entry_type === 'Milk Sales');
    frm.fields_dict['items'].grid.update_docfield_property('qty', 'read_only', is_read_only);
    frm.fields_dict['items'].grid.refresh();
}

// Auto set source warehouse as per item code

frappe.ui.form.on('Stock Entry', {
    stock_entry_type: function(frm) {
        // Refresh the child table when stock entry type is changed
        frm.fields_dict.items.grid.grid_rows.forEach(function(row) {
            row.doc.s_warehouse = '';
            row.refresh_field('s_warehouse');
            row.doc.s_warehouse = '';
            row.refresh_field('t_warehouse');
        });
    }
});

frappe.ui.form.on('Stock Entry Detail', {
    item_code: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if (frm.doc.stock_entry_type === 'In-House Consumption') {
            if (row.item_code === 'Milk') {
                frappe.model.set_value(cdt, cdn, 's_warehouse', 'Milk Production - SVG');
            } 
            else if (row.item_code === 'ButterMilk') {
                frappe.model.set_value(cdt, cdn, 's_warehouse', 'ButterMilk - SVG');
            } 
            else if (row.item_code === 'Ghee') {
                frappe.model.set_value(cdt, cdn, 's_warehouse', 'Ghee - SVG');
            }
        }
        else if (frm.doc.stock_entry_type === 'Manufacture') {
            if (row.item_code === 'Milk') {
                frappe.model.set_value(cdt, cdn, 's_warehouse', 'Milk Production - SVG');
            } 
            // else if (row.item_code === 'ButterMilk') {
            //     frappe.model.set_value(cdt, cdn, 't_warehouse', 'ButterMilk - SVG');
            // } 
            else if (row.item_code === 'Ghee') {
                frappe.model.set_value(cdt, cdn, 't_warehouse', 'Ghee - SVG');
            }
        }
    }
});

// Delete row where morning and evening qty is zero

frappe.ui.form.on('Stock Entry', {
    before_save: function(frm) {
        // Iterate over each item in the child table
        let items_to_keep = [];
        frm.doc.items.forEach(function(item) {
            if(item.custom_morning_qty != 0 || item.custom_evening_qty != 0) {
                items_to_keep.push(item);
            }
        });
        frm.doc.items = items_to_keep;
    }
});