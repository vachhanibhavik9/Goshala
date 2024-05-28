// Copyright (c) 2024, goshala and contributors
// For license information, please see license.txt

frappe.query_reports["Go Milk Production Report"] = {
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
			"label":"Tag No",
			"fieldname":"tag_no",
			"fieldtype":"Float"
		}
	]
};
