// frappe.ui.form.on('Sales Invoice', {
//     refresh(frm) {
//         // Add custom button to trigger fetch_stock_entry_data method
//         frm.add_custom_button(__('Create Sales Invoice'), function() {
//             // Show dialog to get month and year from the user
//             frappe.prompt(
//                 [
//                     {
//                         label: 'Month',
//                         fieldname: 'month',
//                         fieldtype: 'Int',
//                         reqd: true,
//                         default: new Date().getMonth() + 1, // Default to the current month
//                         description: 'Enter the month (1-12)'
//                     },
//                     {
//                         label: 'Year',
//                         fieldname: 'year',
//                         fieldtype: 'Int',
//                         reqd: true,
//                         default: new Date().getFullYear(), // Default to the current year
//                         description: 'Enter the year'
//                     }
//                 ],
//                 function(values) {
//                     // Call fetch_stock_entry_data method with the user-entered month and year
//                     fetch_stock_entry_data(frm, values.month, values.year);
//                 },
//                 'Select Month and Year'
//             );
//         });
//     }
// });

// function fetch_stock_entry_data(frm, month, year) {
//     frappe.call({
//         method: 'goshala.goshala.doctype.go_master.go_master.fetch_stock_entry_data',
//         args: {
//             month: month,
//             year: year
//         },
//         callback: function(r) {
//             if (r.message) {
//                 // console.log(r.message);
                
//                 // Iterate through the fetched data and create Sales Invoices
//                 r.message.forEach(function(data) {
//                     create_sales_invoice(frm, data);
//                 });

//                 // Show a message
//                 // frappe.msgprint('Sales Invoices Created Successfully!');
//             }
//         }
//     });
// }

// function create_sales_invoice(frm, data) {
//     frappe.model.with_doctype('Sales Invoice', function() {
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
//         frappe.db.insert(new_si).then(function(doc) {
//             frappe.model.sync(doc);
//             frappe.set_route('Form', 'Sales Invoice', doc.name);
//         });
//     });
// }

