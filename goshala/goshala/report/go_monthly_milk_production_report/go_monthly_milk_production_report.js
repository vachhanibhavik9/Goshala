// Copyright (c) 2024, goshala and contributors
// For license information, please see license.txt

frappe.query_reports["Go Monthly Milk Production Report"] = {
	"filters": [
		{
			"fieldname":"from_date",
			"label":"From Date",
			"fieldtype":"Date"
		},
	
		{
			"fieldname":"to_date",
			"label":"To Date",
			"fieldtype":"Date"
		}
	]
};
