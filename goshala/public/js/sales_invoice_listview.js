frappe.listview_settings["Sales Invoice"] = {
    onload: function (list_view) {
        list_view.page.add_button("Create Sales Invoice", function () {
            frappe.prompt(
                [
                    {
                        label: 'Month',
                        fieldname: 'month',
                        fieldtype: 'Select',
                        reqd: true,
                        options: [ 
                            { label: 'January', value: 1 },
                            { label: 'February', value: 2 },
                            { label: 'March', value: 3 },
                            { label: 'April', value: 4 },
                            { label: 'May', value: 5 },
                            { label: 'June', value: 6 },
                            { label: 'July', value: 7 },
                            { label: 'August', value: 8 },
                            { label: 'September', value: 9 },
                            { label: 'October', value: 10 },
                            { label: 'November', value: 11 },
                            { label: 'December', value: 12 }
                        ],
                        default: new Date().getMonth() + 1, // Default to the current month (1-12)
                        description: 'Select the month'
                    },
                    {
                        label: 'Year',
                        fieldname: 'year',
                        fieldtype: 'Int',
                        reqd: true,
                        default: new Date().getFullYear(), // Default to the current year
                        description: 'Enter the year'
                    },
                    {
                        label: 'Customer',
                        fieldname: 'customer',
                        fieldtype: 'Link',
                        options: 'Customer',
                        description: 'Select the Customer'
                    }
                ],
                function (values) {
                    // Call fetch_stock_entry_data method with the user-entered month, year, and customer
                    fetch_stock_entry_data(values.month, values.year, values.customer);
        
                },
                'Select Month, Year, and Customer'
            );
        });
    },
};


function fetch_stock_entry_data(month, year, customer) {
    // Use frappe.confirm to show a confirmation popup
    frappe.confirm(
        'Are you sure you want to create sales invoices for the specified month, year, and customer?',
        function () {
            // If the user clicks "Yes" on the confirmation dialog
            frappe.call({
                method: 'goshala.goshala.doctype.api.fetch_stock_entry_data',
                args: {
                    month: month,
                    year: year,
                    customer: customer
                },
                freeze: true,
                freeze_message: __("Creating Sales Invoices")
            });
        },
        function () {
            // If the user clicks "No" on the confirmation dialog
            frappe.msgprint('Operation cancelled by the user.');
        }
    );
}





// function create_sales_invoice(data) {
//     frappe.model.with_doctype('Sales Invoice', function () {
//         let new_si = frappe.model.get_new_doc('Sales Invoice');

//         // Set values for the Sales Invoice
//         new_si.customer = data.custom_customer_name;
//         new_si.posting_date = frappe.datetime.get_today(); // Set current date as the posting date

//         // Format due_date to 'YYYY-MM-DD'
//         // const due_date = frappe.datetime.add_days(frappe.datetime.get_today(), 30); // Set due date 30 days from today
//         // new_si.due_date = due_date; // Set formatted due_date

//         // Add items to the Sales Invoice
//         let item = frappe.model.add_child(new_si, 'items');
//         item.item_code = 'Milk';
//         item.item_name = 'Milk';
//         item.custom_month = data.month_year;
//         item.custom_morning_qty = data.total_morning_qty;
//         item.custom_evening_qty = data.total_evening_qty;
//         item.qty = data.total_morning_qty + data.total_evening_qty;

//         // Save the Sales Invoice
//         frappe.db.insert(new_si).then(function (doc) {
//             // frappe.model.sync(doc);
//             // frappe.set_route('Form', 'Sales Invoice', doc.name);
//         });
//     });
// }

