// Copyright (c) 2024, goshala and contributors
// For license information, please see license.txt

frappe.query_reports["Customer Milk Sales Report"] = {
	"filters": [
		{
			"label":"From Date",
			"fieldname":"from_date",
			"fieldtype":"Date"
		},

		{
			"label":"To Date",
			"fieldname":"to_date",
			"fieldtype":"Date"
		},

		{
			"label":"Customer Name",
			"fieldname":"customer_name",
			"fieldtype":"Link",
			"options":"Customer"
		}
	]
};
