// Total Qty of Morning Qty + Evening Qty in Stock Entry Items Table
frappe.ui.form.on('Sales Invoice Item', {
	custom_morning_qty: function(frm, cdt, cdn)
	{
	    get_total_qty(frm, cdt, cdn)
	},
	custom_evening_qty: function(frm, cdt, cdn)
	{
	   get_total_qty(frm, cdt, cdn)
	}
	
});

function get_total_qty(frm, cdt, cdn)
{
    var child_data = locals[cdt][cdn];
    var total_qty = child_data.custom_morning_qty + child_data.custom_evening_qty
    
    frappe.model.set_value(cdt, cdn, "qty", total_qty)
    
}
