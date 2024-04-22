
// Total Qty of Morning Qty + Evening Qty in Stock Entry Items Table
frappe.ui.form.on('Stock Entry Detail', {
    custom_morning_qty: function (frm, cdt, cdn) {
        get_total_qty(frm, cdt, cdn)
    },
    custom_evening_qty: function (frm, cdt, cdn) {
        get_total_qty(frm, cdt, cdn)
    }

});

function get_total_qty(frm, cdt, cdn) {
    var child_data = locals[cdt][cdn];
    var total_qty = parseFloat(child_data.custom_morning_qty) + parseFloat(child_data.custom_evening_qty)

    frappe.model.set_value(cdt, cdn, "qty", total_qty)

}

// Set Morning Total Qty, Evening Qty and Total Qty
frappe.ui.form.on('Stock Entry', {
    before_save: function (frm) {
        setTotalMilk(frm.doc);
        setTotalMorningMilk(frm.doc);
        setTotalEveningMilk(frm.doc);

    }
});

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




// Get Go from Go Master where current type is dujani
frappe.ui.form.on('Stock Entry', {
    stock_entry_type(frm) {
        if (frm.doc.stock_entry_type === 'Milk Production') {
            frm.add_custom_button(__('Get Go'), function () {
                fetchGoMasterList(frm);
                fetchGoMasterListForFiltering(frm);
            });
        }
    }
});

function fetchGoMasterList(frm) {
    // Make an AJAX call to fetch data from the Go Master doctype
    frappe.call({
        method: 'goshala.goshala.doctype.go_master.go_master.fetch_go_master_list',
        callback: function (response) {
            if (response.message) {
                // Clear existing child table rows
                frm.clear_table('items');

                // Iterate through the fetched data and add it to the child table
                response.message.forEach(function (go) {
                    var row = frappe.model.add_child(frm.doc, 'Stock Entry Detail', 'items');
                    row.custom_go_name = go;
                    // Set other fields as needed
                });

                // Refresh the form to reflect the changes
                frm.refresh_field('items');
            }
        }
    });
}

// if user add row and add Go so only show that Go where current type is dujani
function fetchGoMasterListForFiltering(frm) {
    frappe.call({
        method: 'goshala.goshala.doctype.go_master.go_master.fetch_go_master_list',
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

frappe.ui.form.on('Stock Entry', {
    stock_entry_type(frm) {
        if (frm.doc.stock_entry_type === 'Milk Sales') {
            frm.add_custom_button(__('Get Customer'), function () {
                fetch_customer_list(frm);
            });
        }
    }
});

function fetch_customer_list(frm) {
    // Make an AJAX call to fetch data from the Go Master doctype
    frappe.call({
        method: 'goshala.goshala.doctype.go_master.go_master.fetch_customer_list',
        callback: function (response) {
            if (response.message) {
                // Clear existing child table rows
                frm.clear_table('items');

                // Iterate through the fetched data and add it to the child table
                response.message.forEach(function (cus) {
                    var row = frappe.model.add_child(frm.doc, 'Stock Entry Detail', 'items');
                    row.custom_customer_name = cus.name;
                    row.custom_pickup = cus.pick_up;
                    row.custom_delivery_man = cus.delivery_man;
                    row.custom_pickup_counter = cus.pickup_counter;
                    row.custom_morning_qty = cus.morning_qty;
                    row.custom_evening_qty = cus.evening_qty;
                    row.qty = row.custom_morning_qty + row.custom_evening_qty;
                });

                // Refresh the form to reflect the changes
                frm.refresh_field('items');
            }
        }
    });
}


frappe.ui.form.on('Stock Entry', {
    stock_entry_type(frm) {
        get_fields(frm);
    },
    after_save(frm) {
        get_fields(frm);
    },
    on_submit(frm) {
        get_fields(frm);
    }

});

function get_fields(frm) {
    if (frm.doc.stock_entry_type === 'Milk Sales') {
        fields = {
            'Stock Entry Detail':
                [
                    { fieldname: 'custom_customer_name', columns: 2 },
                    { fieldname: 's_warehouse', columns: 2 },
                    { fieldname: 'item_code', columns: 1 },
                    { fieldname: 'custom_pickup', columns: 2 },
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
                    { fieldname: 'custom_go_name', columns: 3 },
                    { fieldname: 't_warehouse', columns: 2 },
                    { fieldname: 'item_code', columns: 2 },
                    { fieldname: 'custom_morning_qty', columns: 1 },
                    { fieldname: 'custom_evening_qty', columns: 1 },
                    { fieldname: 'qty', columns: 1 }
                ]
        }
        frappe.model.user_settings.save(frm.doctype, "GridView", fields).then((r) => {
            frappe.model.user_settings[frm.doctype] = r.message || r;
            frm.fields_dict.items.grid.reset_grid();
        });
    } else {
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