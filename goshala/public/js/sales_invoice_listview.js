// Custom Sales Invoice List View Script

frappe.listview_settings["Sales Invoice"] = {
    add_fields: [
        "customer",
        "customer_name",
        "base_grand_total",
        "outstanding_amount",
        "due_date",
        "company",
        "currency",
        "is_return",
    ],
    get_indicator: function (doc) {
        const status_colors = {
            Draft: "grey",
            Unpaid: "orange",
            Paid: "green",
            Return: "gray",
            "Credit Note Issued": "gray",
            "Unpaid and Discounted": "orange",
            "Partly Paid and Discounted": "yellow",
            "Overdue and Discounted": "red",
            Overdue: "red",
            "Partly Paid": "yellow",
            "Internal Transfer": "darkgrey",
        };
        return [__(doc.status), status_colors[doc.status], "status,=," + doc.status];
    },
    right_column: "grand_total",

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

        // Default ERPNext actions
        list_view.page.add_action_item(__("Delivery Note"), () => {
            erpnext.bulk_transaction_processing.create(list_view, "Sales Invoice", "Delivery Note");
        });

        list_view.page.add_action_item(__("Payment"), () => {
            erpnext.bulk_transaction_processing.create(list_view, "Sales Invoice", "Payment Entry");
        });
    }
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
