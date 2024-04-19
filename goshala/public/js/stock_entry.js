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
            frm.add_custom_button(__('Get Customer'), function() {
                fetch_customer_list(frm);
            });
        }
    }
});

function fetch_customer_list(frm) {
    // Make an AJAX call to fetch data from the Go Master doctype
    frappe.call({
        method: 'goshala.goshala.doctype.go_master.go_master.fetch_customer_list',
        callback: function(response) {
            if (response.message) {
                // Clear existing child table rows
                frm.clear_table('items');

                // Iterate through the fetched data and add it to the child table
                response.message.forEach(function(cus) {
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

