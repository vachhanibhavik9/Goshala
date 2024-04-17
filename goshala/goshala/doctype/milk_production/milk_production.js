// Copyright (c) 2024, goshala and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Milk Production", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Milk Production Table', {
	morning: function(frm, cdt, cdn)
	{
	   get_total_qty(frm, cdt, cdn)
	},
	evening: function(frm, cdt, cdn)
	{
	   get_total_qty(frm, cdt, cdn)
	}
	
});

function get_total_qty(frm, cdt, cdn)
{
    var child_data = locals[cdt][cdn];
    var total_qty = child_data.morning + child_data.evening
    
    frappe.model.set_value(cdt, cdn, "total", total_qty)
    
}  